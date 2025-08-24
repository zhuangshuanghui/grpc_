import { PARAMS_NAME_ENUM } from "../../core/Define";
import StateMachine, { getInitParamsTrigger } from "../../core/fsm/StateMachine";
import DoubelJump from "../State/DoubelJump";

export default class JumpSubStateMachines {
    fsm: StateMachine;
    constructor(fsm: StateMachine) {
        this.fsm = fsm


        this.fsm.params.set(PARAMS_NAME_ENUM.DOBELJUMP, getInitParamsTrigger())

        this.fsm.stateMachines.set(PARAMS_NAME_ENUM.DOBELJUMP, new DoubelJump(this.fsm))
    }


    returnState() {
        if (this.fsm.params.get(PARAMS_NAME_ENUM.DOBELJUMP).value) {
            console.log("双连跳");
            this.fsm.currentState = this.fsm.stateMachines.get(PARAMS_NAME_ENUM.DOBELJUMP)
        }

    }
}