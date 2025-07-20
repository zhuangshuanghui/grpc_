import { Prefab, SpriteFrame, Node } from "cc";
import { Singleton } from "../common/base";
import { ACTOR_SPEED, IState } from "../common/state";
import { ActorManager } from "../entity/actor/ActorManager";
import { JoyStickManager } from "../ui/JoyStickManager";

export default class DataManager extends Singleton {
  static get Instance() {
    return super.GetInstance<DataManager>();
  }
  prefabMap: Map<string, Prefab> = new Map();
  textureMap: Map<string, SpriteFrame[]> = new Map();

  actorMap: Map<number, ActorManager> = new Map();
  state: IState = {
    actors: [],
  };

  stage: Node;
  jm: JoyStickManager;
  account: string;

  applyState(state: IState) {
    const oldMe = this.state.actors.find((e) => e.account === this.account);
    const newMe = state.actors.find((e) => e.account === this.account);

    this.state = state;
    // 自身状态不回滚
    if (newMe && oldMe) {
      newMe.posX = oldMe.posX;
      newMe.posY = oldMe.posY;
    }
    // TODO 通过对比服务器状态和本地状态的误差决定是否调整自身状态（防止自身抖动）
    // 目前就简单处理，相信本地位置是对的
  }

  applyInput(data: any, fromServer = true) {
    const actor = this.state.actors.find((e) => e.id === data.id);
    if (!actor) {
      return;
    }
    // 来自服务端的自身输入不执行
    if (actor.account === this.account && fromServer) {
      return;
    }
    const { directionX, directionY, dt } = data;

    actor.posX += directionX * ACTOR_SPEED * dt;
    actor.posY += directionY * ACTOR_SPEED * dt;
  }

  reset() {
    this.state = {
      actors: [],
    };
    this.actorMap = new Map();
  }
}
