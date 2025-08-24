import State from "../../core/fsm/State";
import StateMachine from "../../core/fsm/StateMachine";

export default class SquatState extends State{
    constructor(fsm:StateMachine){
            super(fsm)
        }
    animationCallback() {
    }
}