import { PARAMS_NAME_ENUM } from "../../../core/Define"
import State from "../../../core/fsm/State"
import StateMachine, { FSM_PARAM_TYPE_ENUM } from "../../../core/fsm/StateMachine"


/**
 *  
 */
export default class COMBOATTACK_4State extends State {
    fsm: StateMachine
    constructor(fsm: StateMachine) {
        super(fsm)
        this.fsm = fsm
        this.maskId = 'comboattack_4'
        this._animationClipName = 'attack1'
    }

    animationCallback() {
        console.log(this._animationClipName + "   动画播放结束");
        console.log("结束状态    "+this.maskId);

        this.fsm.setParams(PARAMS_NAME_ENUM.IDLE, true)
        this.fsm.params.set(PARAMS_NAME_ENUM.COMBOATTACK_COUNT,{
            type: FSM_PARAM_TYPE_ENUM.NUMBER,
            value: 0,
          })
        // let count = this.fsm.params.get(PARAMS_NAME_ENUM.COMBOATTACK_COUNT)
        // count.value
        // if (count.value as number > 1) {
        //     this.fsm.setParams(PARAMS_NAME_ENUM.COMBOATTACK_2, true)
        // } else {
        //     this.fsm.setParams(PARAMS_NAME_ENUM.IDLE, true)
        // }
        // this.fsm.resetTrigger()
    }


}