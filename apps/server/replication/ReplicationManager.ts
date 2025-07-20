import path from "path";
import { Inject, Logger, ReplicationEnum, RpcClient, ServerIdEnum, ServerPort } from "../common";
import { forkSync } from "./utils";
import { Singleton } from "../common/common/base";

export class ReplicationManager extends Singleton {
  static get Instance() {
    return super.GetInstance<ReplicationManager>();
  }

  game: RpcClient;

  @Inject
  logger: Logger;

  nextReplicationId = ServerIdEnum.ReplicationInstance;

  async init() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.game = await RpcClient.Create({
      netOptions: {
        port: ServerPort.Game,
        host: "localhost",
      },
      implement: this,
      logger: this.logger,
      id: ServerIdEnum.ReplicationManager,
    });

    this.game.on("close", () => {
      this.clear();
    });

    this.logger.info(`ReplicationManager服务启动！`);
  }

  clear() {}

  async createReplication(replicationType: ReplicationEnum) {
    if (this.nextReplicationId >= 2 ** 30) {
      this.nextReplicationId = ServerIdEnum.ReplicationInstance;
    }
    const id = this.nextReplicationId++;
    switch (replicationType) {
      case ReplicationEnum.Replication1:
        await forkSync(path.resolve(__dirname, "./replication/Replication1"), [String(id)]);
        break;
      default:
        break;
    }
    return id;
  }
}
