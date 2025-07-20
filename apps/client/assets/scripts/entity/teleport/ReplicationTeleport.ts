import { _decorator, Component, Label } from "cc";
import { EventEnum } from "../../enum";
import EventManager from "../../global/EventManager";

const { ccclass, property } = _decorator;

@ccclass("ReplicationTeleport")
export class ReplicationTeleport extends Component {
  async handleCreate(_: Event, replicationType: number) {
    EventManager.Instance.emit(EventEnum.CreateReplication, replicationType);
  }

  async handleLeave() {
    EventManager.Instance.emit(EventEnum.LeaveReplication);
  }
}
