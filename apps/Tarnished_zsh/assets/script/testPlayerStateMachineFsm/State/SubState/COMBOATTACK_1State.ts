import { DataCenter } from "../../../core/center/DataCenter"
import { ManagerCenter } from "../../../core/center/ManagerCenter"
import { PARAMS_NAME_ENUM } from "../../../core/Define"
import State from "../../../core/fsm/State"
import StateMachine from "../../../core/fsm/StateMachine"


/**
 *  
 */
export default class COMBOATTACK_1State extends State {
    fsm: StateMachine
    constructor(fsm: StateMachine) {
        super(fsm)
        this.fsm = fsm
        this.maskId = 'comboattack_1'
        this._animationClipName = 'attack1'
    }

    animationCallback() {
        console.log(this._animationClipName + "   动画播放结束");
        console.log("结束状态    "+this.maskId);


        // this.fsm.setParams(PARAMS_NAME_ENUM.IDLE, true)
        // let count = this.fsm.params.get(PARAMS_NAME_ENUM.COMBOATTACK_COUNT)
        // count.value
        if (ManagerCenter.dataCenter.comboCount > 1) {
            this.fsm.setParams(PARAMS_NAME_ENUM.COMBOATTACK_2, true)
        } else {
            this.fsm.setParams(PARAMS_NAME_ENUM.IDLE, true)
        }
        // this.fsm.resetTrigger()
    }


}