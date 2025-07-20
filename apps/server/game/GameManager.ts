import { RpcServer, ServerIdEnum, RpcFunc, Logger, ServerPort, RpcClient, Inject, createDBConnection } from "../common";
import { PlayerManager } from "./PlayerManager";
import { Connection } from "mysql";
import { Actor } from "./Actor";
import dayjs from "dayjs";
import { Singleton } from "../common/common/base";

/***
 * Game服务器
 */
export class GameManager extends Singleton {
  static get Instance() {
    return super.GetInstance<GameManager>();
  }

  server: RpcServer;

  //日志
  @Inject
  logger: Logger;

  // 数据库连接
  connection: Connection = createDBConnection();

  async init() {
    this.server = await RpcServer.Create({
      port: ServerPort.Game,
      logger: this.logger,
      implement: this,
    });

    this.server.on("register", this.handleRegister.bind(this));
    this.logger.info("Game服务器启动！");
  }

  handleRegister(client: RpcClient) {
    this.logger.info("register", client.id);
    // gateway网关服务断开时，清空所有玩家（如果把网关服务做成集群，只需要清空部分玩家）
    switch (client.id) {
      case ServerIdEnum.Gateway:
        client.on("close", () => {
          this.clear();
        });
        break;
      case ServerIdEnum.Scene1:
      case ServerIdEnum.Scene2:
        client.on("close", () => {
          const accounts = PlayerManager.Instance.getPlayers()
            .filter((e) => e.getActor().curSceneId === client.id)
            .map((e) => e.account);
          this.getClient(ServerIdEnum.Gateway).send("disconnect", [accounts]);
        });
      default:
        break;
    }
  }

  clear() {
    const accounts = PlayerManager.Instance.getPlayers().map((e) => e.account);
    for (const account of accounts) {
      this.leaveGame(account);
    }
  }

  getClient(type: number) {
    const client = this.server.clients.get(type);
    if (client) {
      return client;
    } else {
      throw new Error("getClient error no client");
    }
  }

  /***
   * 进入游戏，创建Player
   */
  enterGame(account: string) {
    return new Promise<void>((resolve, reject) => {
      this.connection.query(`select id, scene_id, nickname from actor where account = ?`, [account], (err, result) => {
        if (err) {
          reject(err.message);
        }

        const actors = result.map((e: any) => new Actor(e.id, account, e.nickname, e.scene_id));
        PlayerManager.Instance.createPlayer(account, actors);
        resolve();
      });
    });
  }

  /***
   * 离开游戏，移除Player和场景的Actor
   */
  async leaveGame(account: string) {
    // 删除场景里的Actor
    await this.leaveScene(account).catch((e) => {
      this.logger.error(e);
    });
    // 删除副本里的Actor
    await this.leaveReplication(account).catch((e) => {
      this.logger.error(e);
    });
    // 删除Player实例
    PlayerManager.Instance.removePlayer(account);
  }

  async createActor(account: string, data: any) {
    return new Promise<void>((resolve, reject) => {
      if (!data.nickname) {
        reject("no nickname");
        return;
      }

      this.connection.query(
        `insert into actor (account, scene_id, created_time, nickname) VALUES (?, ?, ?, ?)`,
        [account, ServerIdEnum.Scene1, dayjs().format("YYYY-MM-DD HH:mm:ss"), data.nickname],
        async (err, result) => {
          if (err) {
            reject(err.message);
          }

          this.connection.query(
            `select id, scene_id, nickname from actor where account = ?`,
            [account],
            (err, result) => {
              if (err) {
                reject(err.message);
              }

              const player = PlayerManager.Instance.getPlayer(account);
              const actors = result.map((e: any) => new Actor(e.id, account, e.nickname, e.scene_id));
              player.actors = actors;
              resolve();
            }
          );
        }
      );
    });
  }

  async listActor(account: string) {
    return new Promise<any>((resolve, reject) => {
      this.connection.query(`select id, nickname from actor where account = ?`, [account], (err, result) => {
        if (err) {
          reject(err.message);
        }

        const actors =
          result?.map((e: any) => ({
            id: e.id,
            nickname: e.nickname,
          })) || [];
        resolve({
          actors,
        });
      });
    });
  }

  /***
   *  通知场景服务器玩家进入了
   * 首次进入场景时，客户端传递选择的角色id
   */
  async enterScene(account: string, data?: any) {
    const player = PlayerManager.Instance.getPlayer(account);
    if (data?.actorId !== undefined) {
      player.curActorId = data.actorId;
    }
    const actor = player.getActor();
    await this.getClient(actor.curSceneId).call("enterActor", [actor.id]);

    return {
      sceneId: actor.curSceneId,
    };
  }

  /***
   *   // 通知场景服务器，玩家离开了
   */
  async leaveScene(account: string) {
    const player = PlayerManager.Instance.getPlayer(account);
    const actor = player.getActor();
    return await this.getClient(actor.curSceneId).call("leaveActor", [actor.id]);
  }

  async changeScene(account: string, data: any) {
    return new Promise<void>(async (resolve, reject) => {
      const player = PlayerManager.Instance.getPlayer(account);
      const actor = player.getActor();
      const sceneId = data.sceneId;
      await this.leaveScene(account);
      // 修改db数据
      this.connection.query(
        `update actor set scene_id = ? where account = ? and id = ?`,
        [sceneId, account, actor.id],
        async (err, result) => {
          if (err) {
            reject(err.message);
            return;
          }
          // 修改内存数据
          actor.curSceneId = sceneId;
          await this.enterScene(account);

          resolve();
        }
      );
    });
  }

  async createReplication(account: string, data: any) {
    const player = PlayerManager.Instance.getPlayer(account);
    const actor = player.getActor();
    const replicationType = data.replicationType;
    // 创建副本
    const { data: replicationId } = await this.getClient(ServerIdEnum.ReplicationManager).call("createReplication", [
      replicationType,
    ]);

    // 离开场景
    await this.leaveScene(account);

    // 修改内存信息
    actor.curReplicationId = replicationId;
    // 进入副本
    await this.getClient(replicationId).call("enterActor", [actor.id]);
  }

  async leaveReplication(account: string) {
    const player = PlayerManager.Instance.getPlayer(account);
    const actor = player.getActor();

    if (actor.curReplicationId !== undefined) {
      try {
        // 通知副本服务离开了
        await this.getClient(actor.curReplicationId).call("leaveActor", [actor.id]);
      } catch (e) {
        this.logger.error(e);
      }

      // 修改内存信息
      actor.curReplicationId = undefined;
    }

    // 告诉客户端回到哪个场景
    return {
      sceneId: actor.curSceneId,
    };
  }

  async inputFromClient(account: string, data: any) {
    const player = PlayerManager.Instance.getPlayer(account);
    const actor = player.getActor();
    const id = actor.curReplicationId ?? actor.curSceneId;
    this.getClient(id).send("inputFromClient", [actor.id, data]);
  }

  stateFromServer(players: string[], data: any) {
    this.getClient(ServerIdEnum.Gateway).send("sendMessage", [players, RpcFunc.stateFromServer, data]);
  }
}
