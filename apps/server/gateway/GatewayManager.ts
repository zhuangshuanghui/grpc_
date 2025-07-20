import * as grpc from "@grpc/grpc-js";
import {
  AuthClient,
  CheckTokenReq,
  CheckTokenRes,
  RpcFunc,
  RpcClient,
  ServerIdEnum,
  getProtoPathByRpcFunc,
  Logger,
  ServerPort,
  Inject,
} from "../common";
import { WebSocketServer, WebSocket } from "ws";
import { Singleton } from "../common/common/base";
// @ts-ignore
import protoRoot from "../common/idl/auto-gen-ws";

/***
 * 网关服务器
 */
export class GatewayManager extends Singleton {
  static get Instance() {
    return super.GetInstance<GatewayManager>();
  }

  @Inject
  logger: Logger;

  // Game服务器的玩家id和Gateway服务器的ws对象的双向映射
  idWsMap: Map<string, WebSocket> = new Map();
  wsIdMap: Map<WebSocket, string> = new Map();

  // game服务引用
  game: RpcClient;
  
  async init() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await this.initAsClient();
    await this.initAsServer();
    this.logger.info(`Gateway服务启动！`);
  }

  /***
   * 作为一个客户端连接Game服务器
   */
  private async initAsClient() {
    this.game = await RpcClient.Create({
      netOptions: {
        port: ServerPort.Game,  //tack
        host: "localhost",
      },
      implement: this,
      logger: this.logger,
      id: ServerIdEnum.Gateway,
    });

    this.game.on("close", () => {
      this.clear();
    });
  }

  clear() {
    for (const [_, ws] of this.idWsMap) {
      ws.close();
    }
    this.idWsMap = new Map();
    this.wsIdMap = new Map();
  }

  /***
   * 作为一个ws服务器为游戏客户端提供服务
   */
  private async initAsServer() {
    return new Promise<void>((resolve) => {
      const wss = new WebSocketServer({ port: ServerPort.Gateway });

      wss.on("error", (e) => {
        this.logger.fatal(`服务错误：${e}`);
      });

      wss.on("close", () => {
        this.logger.fatal(`服务关闭!`);
      });

      wss.on("listening", async () => {
        resolve();

        wss.on("connection", (ws) => {
          this.logger.info(`玩家连接！`);

          ws.on("message", async (buffer: Buffer) => {
            this.handleMessage(ws, buffer);
          });

          ws.on("close", () => {
            this.handleClose(ws);
          });
        });
      });
    });
  }

  /***
   * 处理连接断开
   */
  async handleClose(ws: WebSocket) {
    const id = this.wsIdMap.get(ws);
    this.wsIdMap.delete(ws);
    if (id) {
      this.idWsMap.delete(id);
      await this.game.call("leaveGame", [id]);
    }

    this.logger.info(`连接断开！，${id}`);
  }

  /***
   * 主动断开跟客户端的连接，如某个场景服务挂了、玩家作弊了（会触发onclose的handleClose回调）
   */
  async disconnect(target: string | string[]) {
    const temp = Array.isArray(target) ? target : [target];
    for (const item of temp) {
      try {
        const ws = this.idWsMap.get(item);
        if (!ws) {
          throw new Error(`ws不存在`);
        }
        ws.close();
      } catch (e) {
        this.logger.error("disconnect", e);
      }
    }
  }

  /***
   * 处理客户端传递过来的消息
   */
  private async handleMessage(ws: WebSocket, buffer: Buffer) {
    try {
      // 根据name拿到path，根据path解析二进制数据生成data
      const name = buffer.readUInt8(0) as RpcFunc;
      const path = getProtoPathByRpcFunc(name, "req");
      const coder = protoRoot.lookup(path);
      const data = coder.decode(buffer.slice(1));

      // 申请进入游戏
      if (name === RpcFunc.enterGame) {
        // 通过Grpc向鉴权服务查看token是否有效
        let { error, data: { account } = {} } = await this.checkToken(data);
        // token校验成功，但是已登录
        if (!error && account && this.idWsMap.has(account)) {
          error = "已登录";
        }
        // 鉴权成功，在Game服务器通过account注册一个Player
        this.logger.info("account", account);
        if (error) {
          this.logger.error(error);
        } else if (account) {
          await this.enterGame(ws, account);
        }
        // 成功或失败都返回结果给客户端
        this.sendMessage(ws, name, {
          data: {
            account,
          },
          error,
        });
        //其他通信逻辑
      } else {
        // 鉴权成功并成功向game服务注册玩家，才能跟Game服务通信
        const id = this.wsIdMap.get(ws);
        if (id) {
          // 小于gap是api，否则是msg
          if (name < RpcFunc.gap) {
            const result = await this.game.call(RpcFunc[name], [id, data]);
            this.sendMessage(ws, name, result);
          } else {
            this.game.send(RpcFunc[name], [id, data]);
          }
        } else {
          throw new Error("鉴权或注册失败");
        }
      }
    } catch (e: any) {
      ws.close();
      this.logger.error(`handleMessage Error: ${e}`);
    }
  }

  /***
   * 发送信息给客户端
   */
  sendMessage(target: string | WebSocket | string[] | WebSocket[], name: RpcFunc, result: any) {
    const temp = Array.isArray(target) ? target : [target];
    for (const item of temp) {
      try {
        const ws = item instanceof WebSocket ? item : this.idWsMap.get(item);
        if (!ws) {
          throw new Error(`sendMessage 失败: ws不存在,${name},${JSON.stringify(result)}`);
        }

        const nameBuffer = Buffer.alloc(1);
        nameBuffer.writeUint8(name);

        const path = getProtoPathByRpcFunc(name, "res");
        const coder = protoRoot.lookup(path);
        const dataBuffer = coder.encode(result).finish();

        const buffer = Buffer.concat([nameBuffer, dataBuffer]);
        ws.send(buffer);
      } catch (e) {
        this.logger.error("sendMessage", e);
      }
    }
  }

  /***
   * 鉴权相关
   */
  private checkToken({ token }: { token: string }) {
    return new Promise<CheckTokenRes.AsObject>((resolve) => {
      const client = new AuthClient(`localhost:${ServerPort.AuthRpc}`, grpc.credentials.createInsecure());
      const req = new CheckTokenReq();
      req.setToken(token);
      client.checkToken(req, (err, res) => {
        if (err) {
          resolve({
            error: err.message,
            data: { account: "" },
          });
          return;
        }

        resolve(res.toObject());
      });
    });
  }

  /***
   * 鉴权完成时，Game服务器创建玩家
   */
  private async enterGame(ws: WebSocket, account: string) {
    const { error } = await this.game.call("enterGame", [account]);
    if (error) {
      throw new Error(error);
    }

    // 建立双向映射
    this.idWsMap.set(account, ws);
    this.wsIdMap.set(ws, account);
  }
}
