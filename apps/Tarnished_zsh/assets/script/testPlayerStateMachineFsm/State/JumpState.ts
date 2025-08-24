import State from "../../core/fsm/State";
import StateMachine from "../../core/fsm/StateMachine";

export default class JumpState extends State{

    name="跳跃"
    constructor(fsm:StateMachine){
        super(fsm)
    }

    animationCallback() {
    }
}