import { PARAMS_NAME_ENUM } from "../../core/Define";
import State from "../../core/fsm/State";
import StateMachine from "../../core/fsm/StateMachine";

export default class RunState extends State{
    fsm:StateMachine
    constructor(fsm:StateMachine){
        super(fsm)
        this.fsm=fsm
        
        this.maskId='run'
        this._animationClipName='run'
    }

    animationCallback() {
        console.log(this._animationClipName+"动画播放结束");
        this.fsm.setParams(PARAMS_NAME_ENUM.IDLE, true)
        // this.fsm.resetTrigger()
    }
    
    
}