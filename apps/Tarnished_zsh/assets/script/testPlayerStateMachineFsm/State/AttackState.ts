import { PARAMS_NAME_ENUM } from "../../core/Define";
import State from "../../core/fsm/State";
import StateMachine from "../../core/fsm/StateMachine";

/**
 *  普通攻击，一共4段
 */
export default class AttackState extends State{
    fsm:StateMachine
    constructor(fsm:StateMachine){
        super(fsm)
        this.fsm=fsm
        this.maskId='attack1'
        this._animationClipName='attack1'
    }

    animationCallback() {
        console.log(this._animationClipName+"   动画播放结束");
        
        this.fsm.setParams(PARAMS_NAME_ENUM.IDLE, true)
        // this.fsm.resetTrigger()
    }
    
    
}