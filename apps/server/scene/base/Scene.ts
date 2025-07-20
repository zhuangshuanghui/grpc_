import {
  ACTOR_SPEED,
  createDBConnection,
  deepClone,
  Inject,
  IState,
  Logger,
  RpcClient,
  ServerIdEnum,
  ServerPort,
  SyncInterval,
} from "../../common";
import { Connection } from "mysql";

export const CHILD_PROCESS_READY = "CHILD_PROCESS_READY";

export abstract class Scene {
  abstract id: ServerIdEnum;

  game: RpcClient;

  @Inject
  logger: Logger;

  connection: Connection = createDBConnection();

  state: IState = {
    actors: [],
  };
  prevState: IState = deepClone(this.state);
  pendingInput: any[] = [];

  /***
   * 作为一个客户端连接Game服务器
   */
  async init() {
    const sceneName = `Scene${this.id}`;

    
    this.logger.info("xianxian");
    this.game = await RpcClient.Create({
      netOptions: {
        port: ServerPort.Game,
        host: "localhost",
      },
      implement: this,
      logger: this.logger,
      id: this.id,
    });

    this.game.on("close", () => {
      this.clear();
    });


    //定时同步状态
    setInterval(() => {
      this.stateFromServer();
    }, SyncInterval);

    // @ts-ignore
    // ipc通信，通知父进程初始化完成
    process.send(CHILD_PROCESS_READY);

    this.logger.info(`${sceneName}scene服务启动！`);
  }

  clear() {
    this.state = {
      actors: [],
    };
    this.prevState = deepClone(this.state);
    this.pendingInput = [];
  }

  //玩家进入游戏场景 
  enterActor(actorId: number) {
    return new Promise<void>((resolve, reject) => {
      this.connection.query(
        `select id, scene_id, account, nickname from actor where id = ? `,
        [actorId],
        (err, result) => {
          if (err) {
            reject(err.message);
            return;
          }

          const target = result?.[0];
          if (!target) {
            reject("no actor");
            return;
          }

          const actor = {
            id: target.id,
            account: target.account,
            nickname: target.nickname,
            posX: 0,
            posY: 0,
            sceneId: target.scene_id,
          };
          this.state.actors.push(actor);
          resolve();
        }
      );
    });
  }

  leaveActor(actorId: number) {
    const index = this.state.actors.findIndex((e) => e.id === actorId);
    if (index > -1) {
      this.state.actors.splice(index, 1);
    }
  }

  inputFromClient(actorId: number, data: any) {
    this.pendingInput.push(data);
    const actor = this.state.actors.find((e) => e.id === actorId);
    if (!actor) {
      return;
    }
    const { directionX, directionY, dt } = data;
    actor.posX += directionX * ACTOR_SPEED * dt;
    actor.posY += directionY * ACTOR_SPEED * dt;
  }

  stateFromServer() {
    // 旧状态
    const state = this.prevState;
    // 旧状态和新创建之间的input
    const input = this.pendingInput;

    // 让旧状态追上新状态
    this.prevState = deepClone(this.state);
    this.pendingInput = [];

    const accounts = this.state.actors.map((e) => e.account);
    // 没有角色在场景里的话就不用发消息了
    if (!accounts.length) {
      return;
    }

    this.game.send("stateFromServer", [
      accounts,
      {
        state,
        input,
      },
    ]);
  }
}
