import { PARAMS_NAME_ENUM } from "../../../core/Define"
import State from "../../../core/fsm/State"
import StateMachine from "../../../core/fsm/StateMachine"


/**
 *  
 */
export default class COMBOATTACK_3State extends State {
    fsm: StateMachine
    constructor(fsm: StateMachine) {
        super(fsm)
        this.fsm = fsm
        this.maskId = 'comboattack_3'
        this._animationClipName = 'attack1'
    }

    animationCallback() {
        console.log(this._animationClipName + "   动画播放结束");
        console.log("结束状态    "+this.maskId);

        // this.fsm.setParams(PARAMS_NAME_ENUM.IDLE, true)

        let count = this.fsm.params.get(PARAMS_NAME_ENUM.COMBOATTACK_COUNT)
        count.value
        if (count.value as number > 3) {
            this.fsm.setParams(PARAMS_NAME_ENUM.COMBOATTACK_4, true)
        } else {
            this.fsm.setParams(PARAMS_NAME_ENUM.IDLE, true)
        }
        // this.fsm.resetTrigger()
    }


}