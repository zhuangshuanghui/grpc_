import { _decorator, Component, Label, Event } from "cc";
import { EventEnum } from "../../enum";
import EventManager from "../../global/EventManager";

const { ccclass, property } = _decorator;

@ccclass("SceneTeleport")
export class SceneTeleport extends Component {
  async handleClick(_: Event, sceneId: number) {
    EventManager.Instance.emit(EventEnum.ChangeScene, sceneId);
  }
}
