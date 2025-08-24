import { PARAMS_NAME_ENUM, PARAMS_NAME_ISAIR_ENUM, SUB_SATEMACHINE } from "../../core/Define";
import StateMachine, { getInitParamsTrigger } from "../../core/fsm/StateMachine";
import SubStateMachine from "../../core/fsm/SubStateMachine";
import AirDeathState from "../State/AirDeathState";
import DeathState from "../State/DeathState";

export default class DeathSubStateMachines extends SubStateMachine {
    fsm: StateMachine;
    constructor(fsm: StateMachine) {
        super(fsm)
        this.fsm = fsm

        this.stateMachines.set(PARAMS_NAME_ENUM.AIRDEATH, new AirDeathState(this.fsm))
        this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new DeathState(this.fsm))
    }

    animationCallback(){
        
    }
    
    run(): void {
        const { value: isAirState } = this.fsm.params.get(PARAMS_NAME_ENUM.ISAIRING);
        if (isAirState === PARAMS_NAME_ISAIR_ENUM.AIR) {
            this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.AIRDEATH);
        } else if (isAirState === PARAMS_NAME_ISAIR_ENUM.FLOOR) {
            this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.DEATH);
        }
    }
}