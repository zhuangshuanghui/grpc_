import { PARAMS_NAME_ENUM } from "../../core/Define";
import State from "../../core/fsm/State";
import StateMachine from "../../core/fsm/StateMachine";

export default class DeathState extends State{

    name="死亡"
    constructor(fsm:StateMachine){
        super(fsm)
    }

    animationCallback() {
        this.fsm.setParams(PARAMS_NAME_ENUM.IDLE,true)
        
    }

}