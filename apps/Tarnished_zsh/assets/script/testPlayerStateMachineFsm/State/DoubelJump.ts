import State from "../../core/fsm/State";
import StateMachine from "../../core/fsm/StateMachine";

export default class DoubelJump extends State{
    name="双连跳"
    constructor(fsm:StateMachine){
        super(fsm)
    }

    animationCallback() {}
    
}