import State from "../../core/fsm/State";
import StateMachine from "../../core/fsm/StateMachine";

export default class IdleState extends State {
    constructor(fsm: StateMachine) {
        super(fsm)
        this.maskId = 'idle'
        this._animationClipName = 'idle'

    }

    run() {
        // const { value: newDirection } = this.fsm.params.get(PARAMS_NAME_ENUM.DIRECTION);
        // this.currentState = this.stateMachines.get(DIRECTION_ORDER_ENUM[newDirection as number]);
      }

    animationCallback() {
        console.log();
    }
}