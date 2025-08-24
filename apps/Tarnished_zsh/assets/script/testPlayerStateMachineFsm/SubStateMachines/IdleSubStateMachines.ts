import { PARAMS_NAME_ENUM } from "../../core/Define";
import StateMachine from "../../core/fsm/StateMachine";
import IdleState from "../State/IdleState";

export default class IdleSubStateMachines {
    fsm: StateMachine;
    constructor(fsm:StateMachine) {
        this.fsm=fsm
        
    }


    returnState(){
        if (this.fsm.params.get(PARAMS_NAME_ENUM.JUMP).value) {
            console.log("单跳");
            this.fsm.currentState = this.fsm.stateMachines.get(PARAMS_NAME_ENUM.JUMP)
        }
    }
}