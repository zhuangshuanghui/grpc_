import { _decorator, Component, Node, EditBox, director, Prefab, instantiate } from "cc";
import NetworkManager from "../global/NetworkManager";
const { ccclass, property } = _decorator;
import JSCrypto from "jsencrypt";
import { RpcFunc, PublicKey, ServerIdEnum } from "../common";
import { EventEnum } from "../enum";
import { ActorListItemManager } from "../ui/ActorListItemManager";
import EventManager from "../global/EventManager";

const crypt = new JSCrypto();
crypt.setKey(PublicKey);

@ccclass("ActorListManager")
export class ActorListManager extends Component {
  @property(Prefab)
  actorListItemPrefab: Prefab;

  @property(Node)
  actorListContainer: Node;

  @property(EditBox)
  nicknameEditBox: EditBox;

  onLoad() {
    EventManager.Instance.on(EventEnum.ActorSelect, this.handleActorSelect, this);
  }

  async start() {
    await this.listActor();
  }

  async listActor() {
    const { data, error } = await NetworkManager.Instance.call(RpcFunc.listActor, {});
    if (error) {
      console.log("listActor", error);
      return;
    }

    this.actorListContainer.destroyAllChildren();
    for (const actor of data.actors) {
      const node = instantiate(this.actorListItemPrefab);
      const actorListItemManager = node.getComponent(ActorListItemManager);
      actorListItemManager.init(actor);
      node.setParent(this.actorListContainer);
    }
  }

  async createActor() {
    const nickname = this.nicknameEditBox.string;
    console.log("nickname", nickname);
    if (!nickname) {
      return;
    }

    const { data, error } = await NetworkManager.Instance.call(RpcFunc.createActor, { nickname });
    if (error) {
      console.log("createActor", error);
      return;
    }

    await this.listActor();
  }

  async handleActorSelect(actorId: NumberConstructor) {
    const { data, error } = await NetworkManager.Instance.call(RpcFunc.enterScene, { actorId });
    if (error) {
      console.log("enterScene", error);
      return;
    }

    director.loadScene(ServerIdEnum[data.sceneId]);
  }
}
