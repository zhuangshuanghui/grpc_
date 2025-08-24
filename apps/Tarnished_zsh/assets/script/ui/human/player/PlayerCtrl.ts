import { _decorator, Component, Node } from 'cc';
import PlayerStateMachine from '../../../testPlayerStateMachineFsm/PlayerStateMachine';
const { ccclass, property } = _decorator;

@ccclass('PlayerCtrl')
export class PlayerCtrl extends Component {

    fsm: PlayerStateMachine


    protected onLoad(): void {
        this.fsm = this.addComponent(PlayerStateMachine)
        this.fsm.init()
        
        
        // this.fsm.setParams(PARAMS_NAME_ENUM.ISAIRING, PARAMS_NAME_ISAIR_ENUM.AIR)
        // this.fsm.setParams(PARAMS_NAME_ENUM.ISAIRING, PARAMS_NAME_ISAIR_ENUM.FLOOR)
    }
    start() {

    }

    update(deltaTime: number) {

    }
}


