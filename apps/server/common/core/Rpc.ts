import net, { Socket, NetConnectOpts } from "net";
import { Pipe } from "./Pipe";
import { Logger } from "./Logger";
import { EventEmitter } from "events";

let callId = 1;
const getCallId = () => {
  // 防止callId过大
  if (callId >= 2 ** 30) {
    callId = 1;
  }

  return callId++;
};

enum RpcTypeEnum {
  Req,
  Res,
  Msg,
}

export interface IRpcReq {
  name: string;
  params: any[];
  meta: {
    id: number;
    type: RpcTypeEnum.Req;
  };
}

export interface IRpcRes {
  data: any;
  error?: string;
  meta: {
    id: number;
    type: RpcTypeEnum.Res;
  };
}

export interface IRpcMsg {
  name: string;
  params: any[];
  meta: {
    type: RpcTypeEnum.Msg;
  };
}

type IRpcClientOptions =
  | {
      netOptions: NetConnectOpts;
      implement: any;
      logger: Logger;
      id: number;
    }
  | {
      socket: Socket;
      implement: any;
      logger: Logger;
      id: number;
    };

interface IRpcServerOptions {
  port: number;
  implement: any;
  logger: Logger;
}

/***
 * Rpc服务端
 */
export class RpcServer extends EventEmitter {
  clients: Map<number, RpcClient> = new Map();

  get logger(): Logger {
    return this.options.logger;
  }

  static async Create(options: IRpcServerOptions) {
    const server = new RpcServer(options);
    await server.init();
    return server;
  }

  constructor(private options: IRpcServerOptions) {
    super();
  }

  private init() {
    return new Promise<void>((resolve) => {
      const server = net.createServer();

      server.listen(this.options.port, "localhost", () => {
        resolve();
      });

      server.on("error", (e) => {
        this.options.logger.error(e);
      });

      server.on("connection", async (socket) => {
        // 给implement身上加注册和心跳检测方法
        this.options.implement.register = this.register.bind(this);
        this.options.implement.heartbeat = this.heartbeat.bind(this);
        await RpcClient.Create({
          socket,
          implement: this.options.implement,
          logger: this.options.logger,
          id: -1,
        });
      });
    });
  }

  register(client: RpcClient, id: number) {
    client.id = id;
    this.clients.set(id, client);

    client.on("close", () => {
      this.clients.delete(id);
    });
    this.emit("register", client);
  }

  heartbeat() {}
}

/***
 * 通过RpcClient封装主动和被动连接产生的socket对象
 */
export class RpcClient extends EventEmitter {
  private socket: Socket;
  private calling: Map<number, (value: Pick<IRpcRes, "data" | "error">) => void> = new Map();
  private pipe = new Pipe();
  private timeout: number = 5000;
  private heartbeatTimer: any;

  get id() {
    return this.options.id;
  }

  set id(id: number) {
    this.options.id = id;
  }

  get logger(): Logger {
    return this.options.logger;
  }

  get implement(): any {
    return this.options.implement;
  }

  /***
   * 工厂方法，封装初始化操作
   */
  static async Create(options: IRpcClientOptions) {
    const client = new RpcClient(options);
    await client.init();
    return client;
  }

  private constructor(private options: IRpcClientOptions) {
    super();
  }

  private clear() {
    // 如果存在socket就关闭
    this.socket?.destroy();
    // 存在调用中的函数
    this.calling.clear();
    // 清空pipe
    this.pipe = new Pipe();
    // 存在心跳包
    if (this.heartbeatTimer) {
      clearTimeout(this.heartbeatTimer);
    }
  }

  /***
   * 确定socket对象
   */
  private init() {
    return new Promise<void>(async (resolve, reject) => {
      const options = this.options as any;
      if (options.socket) {
        this.socket = options.socket;
        // 监听
        this.bind();
        // 完成
        resolve();
      } else if (options.netOptions) {
        // 创建新socket
        this.socket = net.createConnection(options.netOptions, async () => {
          // 注册
          await this.register();
          // 心跳检测
          this.heartbeat();
          // 完成
          resolve();
          this.logger.info("RPC Client初始化完成");
        });
        // 监听
        this.bind();
      } else {
        this.logger.fatal("初始化异常");
        reject("初始化异常");
      }
    });
  }

  /***
   * 监听事件
   */
  private bind() {
    this.socket.on("data", (buffer) => {
      this.pipe.push(buffer);
    });

    this.socket.on("close", () => {
      this.handleClose();
    });

    // error事件后必定触发close
    this.socket.on("error", (...args) => {
      this.logger.fatal("Socket", ...args);
    });

    this.pipe.removeAllListeners();
    this.pipe.on("data", (buffer: Buffer) => {
      const data = JSON.parse(buffer.toString());
      this.logger.info("接收:", JSON.stringify(data));
      const { type } = data.meta;
      switch (type) {
        case RpcTypeEnum.Req:
          this.handleReq(data as IRpcReq);
          break;
        case RpcTypeEnum.Res:
          this.handleRes(data as IRpcRes);
          break;
        case RpcTypeEnum.Msg:
          this.handleMsg(data as IRpcMsg);
          break;
        default:
          break;
      }
    });
  }

  private async register() {
    const { error } = await this.call("register", [this.options.id]);

    if (error) {
      this.logger.fatal("register error", error);
      return Promise.reject(error);
    }
  }

  /***
   * 递归发送心跳包，发送失败重新初始化客户端
   */
  private async heartbeat() {
    const { error } = await this.call("heartbeat", [this.id]);
    // this.logger.info("heartbeat!!");
    if (error) {
      this.logger.fatal("heartbeat error", error);
      // 心跳检测失败则重连
      this.socket.destroy();
      return;
    }

    this.heartbeatTimer = setTimeout(() => {
      this.heartbeat();
    }, this.timeout);
  }

  /***
   * socket错误或关闭的回调
   */
  handleClose() {
    // socket，清空rpc client状态
    this.clear();
    // 通过事件告知外面
    this.emit("close");
    this.logger.fatal("Socket Close");
    // 三秒后重新初始化
    setTimeout(() => {
      this.init();
    }, 10000);
  }

  /***
   * 装包并发送
   */
  private write(data: any) {
    const buffer = this.pipe.pack(data);
    this.logger.info("发送:", JSON.stringify(data));
    this.socket.write(buffer);
  }

  /***
   * RPC调用
   */
  call(name: IRpcReq["name"], params: IRpcReq["params"]) {
    return new Promise<Pick<IRpcRes, "data" | "error">>((resolve) => {
      const id = getCallId();
      const data: IRpcReq = {
        name,
        params,
        meta: { id, type: RpcTypeEnum.Req },
      };

      let timer = setTimeout(() => {
        this.calling.delete(id);
        resolve({ error: "time out", data: null });
      }, this.timeout);

      this.write(data);
      this.calling.set(id, (e: any) => {
        clearTimeout(timer);
        this.calling.delete(id);
        resolve(e);
      });
    });
  }

  /***
   * RPC消息
   */
  send(name: IRpcMsg["name"], params: IRpcMsg["params"]) {
    const data = {
      name,
      params,
      meta: { type: RpcTypeEnum.Msg },
    };
    this.write(data);
  }

  /***
   * Rpc被调用方处理调用指定函数并返回结果
   */
  private async handleReq(req: IRpcReq) {
    const {
      name,
      params,
      meta: { id },
    } = req;

    try {
      const func = this.implement[name];
      if (func) {
        if (name === "register") {
          params.unshift(this);
        }

        const data = await func.apply(this.implement, params);
        const res: IRpcRes = {
          data,
          meta: { id, type: RpcTypeEnum.Res },
        };
        this.write(res);
      } else {
        throw new Error(`func not exist: ${name}`);
      }
    } catch (e) {
      this.logger.error("handleReq", e);
      const res: IRpcRes = {
        data: null,
        error: (e as Error).message,
        meta: { id, type: RpcTypeEnum.Res },
      };
      this.write(res);
    }
  }

  /***
   * Rpc调用方通过promise把结果resolve出去
   */
  private handleRes(res: IRpcRes) {
    const {
      data,
      error,
      meta: { id },
    } = res;
    const cb = this.calling.get(id);
    if (cb) {
      cb({ data, error });
    } else {
      this.logger.error("handleRes calling not exist:", JSON.stringify(res));
    }
  }

  private async handleMsg(msg: IRpcMsg) {
    const { name, params } = msg;
    const func = this.implement[name];

    try {
      if (func) {
        await func.apply(this.implement, params);
      } else {
        throw new Error(`handleMsg func not exist: ${name}`);
      }
    } catch (e) {
      this.logger.error(`handleMsg error:`, e);
    }
  }
}
