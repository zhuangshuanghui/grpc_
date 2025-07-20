import { _decorator, Component, Label } from "cc";
import { IActor } from "../common";
import { EventEnum } from "../enum";
import EventManager from "../global/EventManager";
const { ccclass, property } = _decorator;

@ccclass("ActorListItemManager")
export class ActorListItemManager extends Component {
  data: Pick<IActor, "nickname" | "id">;
  nicknameLabel: Label;

  async init(data: Pick<IActor, "nickname" | "id">) {
    this.data = data;
    this.nicknameLabel = this.node.getComponentInChildren(Label);
    this.nicknameLabel.string = this.data.nickname;
  }

  selectActor() {
    EventManager.Instance.emit(EventEnum.ActorSelect, this.data.id);
  }
}
