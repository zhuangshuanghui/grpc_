import { _decorator, Component, Node, instantiate, Prefab, SpriteFrame, Scene, director } from "cc";
import { RpcFunc, ReplicationEnum, ServerIdEnum } from "../common";
import { ActorManager } from "../entity/actor/ActorManager";
import { EventEnum, PrefabPathEnum, TexturePathEnum } from "../enum";
import DataManager from "../global/DataManager";
import EventManager from "../global/EventManager";
import NetworkManager from "../global/NetworkManager";
import { ResourceManager } from "../global/ResourceManager";
import { JoyStickManager } from "../ui/JoyStickManager";
const { ccclass, property } = _decorator;

@ccclass("BattleManager")
export class BattleManager extends Component {
  stage: Node;
  ui: Node;

  isInit = false;
  loadingScene = false;

  async loadRes() {
    const list = [];
    for (const type in PrefabPathEnum) {
      const p = ResourceManager.Instance.loadRes(PrefabPathEnum[type], Prefab).then((prefab) => {
        DataManager.Instance.prefabMap.set(type, prefab);
      });
      list.push(p);
    }
    for (const type in TexturePathEnum) {
      const p = ResourceManager.Instance.loadDir(TexturePathEnum[type], SpriteFrame).then((spriteFrames) => {
        DataManager.Instance.textureMap.set(type, spriteFrames);
      });
      list.push(p);
    }
    await Promise.all(list);
  }

  async start() {
    this.stage = DataManager.Instance.stage = this.node.getChildByName("Stage");
    this.ui = this.node.getChildByName("UI");
    await this.loadRes();
    this.initScene();
    this.isInit = true;
  }

  clearScene() {
    EventManager.Instance.off(EventEnum.ClientSync, this.handleClientSync, this);
    EventManager.Instance.off(EventEnum.CreateReplication, this.handleCreateReplication, this);
    EventManager.Instance.off(EventEnum.ChangeScene, this.handleChangeScene, this);
    EventManager.Instance.off(EventEnum.LeaveReplication, this.handleLeaveReplication, this);
    NetworkManager.Instance.unListen(RpcFunc.stateFromServer, this.handleStateFromServer, this);

    DataManager.Instance.reset();
    this.loadingScene = false;
  }

  async initScene() {
    this.initJoyStick();
    EventManager.Instance.on(EventEnum.ClientSync, this.handleClientSync, this);
    EventManager.Instance.on(EventEnum.CreateReplication, this.handleCreateReplication, this);
    EventManager.Instance.on(EventEnum.ChangeScene, this.handleChangeScene, this);
    EventManager.Instance.on(EventEnum.LeaveReplication, this.handleLeaveReplication, this);
    NetworkManager.Instance.listen(RpcFunc.stateFromServer, this.handleStateFromServer, this);
  }

  initJoyStick() {
    const prefab = DataManager.Instance.prefabMap.get("JoyStick");
    const joyStick = instantiate(prefab);
    joyStick.setParent(this.ui);
    DataManager.Instance.jm = joyStick.getComponent(JoyStickManager);
    DataManager.Instance.jm.init();
  }

  update(dt: number) {
    if (!this.isInit) {
      return;
    }
    this.render();
    this.tick(dt);
  }

  tick(dt: number) {
    this.tickPlayer(dt);
  }

  tickPlayer(dt: number) {
    for (const p of DataManager.Instance.state.actors) {
      const actorManager = DataManager.Instance.actorMap.get(p.id);
      if (!actorManager) {
        return;
      }
      actorManager.tick(dt);
    }
  }

  render() {
    this.renderPlayer();
  }

  renderPlayer() {
    // 删除已经不存在的角色
    for (const [id, manager] of DataManager.Instance.actorMap) {
      if (DataManager.Instance.state.actors.every((e) => e.id !== id)) {
        this.stage.removeChild(manager.node);
        DataManager.Instance.actorMap.delete(id);
      }
    }

    for (const item of DataManager.Instance.state.actors) {
      let actorManager = DataManager.Instance.actorMap.get(item.id);
      if (!actorManager) {
        const actorPrefab = DataManager.Instance.prefabMap.get("Actor");
        const actor = instantiate(actorPrefab);
        actor.setParent(this.stage);
        actorManager = actor.addComponent(ActorManager);
        DataManager.Instance.actorMap.set(item.id, actorManager);
        actorManager.init(item);
      } else {
        actorManager.render(item);
      }
    }
  }

  handleClientSync(data) {
    // 同步操作给服务端
    // console.log("handleClientSync", data);
    NetworkManager.Instance.send(RpcFunc.inputFromClient, data);
    // 预测
    DataManager.Instance.applyInput(data, false);
  }

  async handleStateFromServer(data) {
    // console.log("handleStateFromServer", data);
    DataManager.Instance.applyState(data.state);

    for (const input of data.input) {
      DataManager.Instance.applyInput(input);
    }
  }

  async handleChangeScene(sceneId: number) {
    if (this.loadingScene) {
      return;
    }
    this.loadingScene = true;

    const { error } = await NetworkManager.Instance.call(RpcFunc.changeScene, {
      sceneId,
    });

    if (error) {
      this.loadingScene = false;
      console.log(error);
      return;
    }

    director.loadScene(ServerIdEnum[sceneId]);
    this.clearScene();
    this.loadingScene = false;
  }

  async handleCreateReplication(replicationType: ReplicationEnum) {
    if (this.loadingScene) {
      return;
    }
    this.loadingScene = true;
    const { data, error } = await NetworkManager.Instance.call(RpcFunc.createReplication, {
      replicationType: replicationType,
    });

    if (error) {
      console.log(error);
      this.loadingScene = false;
      return;
    }

    director.loadScene(`Replication${replicationType}`);
    this.clearScene();
    this.loadingScene = false;
  }

  async handleLeaveReplication() {
    if (this.loadingScene) {
      return;
    }
    this.loadingScene = true;
    const { data, error } = await NetworkManager.Instance.call(RpcFunc.leaveReplication, {});
    if (error) {
      console.log(error);
      this.loadingScene = false;
      return;
    }

    const { error: error2 } = await NetworkManager.Instance.call(RpcFunc.enterScene, {});
    if (error2) {
      console.log("handleLeaveReplication", error2);
      this.loadingScene = false;
      return;
    }

    director.loadScene(ServerIdEnum[data.sceneId]);
    this.clearScene();
    this.loadingScene = false;
  }
}
