import { ManagerCenter } from "../../core/center/ManagerCenter";
import { PARAMS_NAME_ENUM } from "../../core/Define";
import StateMachine, { FSM_PARAM_TYPE_ENUM, IParamsValue } from "../../core/fsm/StateMachine";
import SubStateMachine from "../../core/fsm/SubStateMachine";
import IdleState from "../State/IdleState";
import COMBOATTACK_1State from "../State/SubState/COMBOATTACK_1State";
import COMBOATTACK_2State from "../State/SubState/COMBOATTACK_2State";
import COMBOATTACK_3State from "../State/SubState/COMBOATTACK_3State";
import COMBOATTACK_4State from "../State/SubState/COMBOATTACK_4State";

/**
 *  普通攻击，一共4段
 */
export default class AttackSubStateMachines extends SubStateMachine {
    private attack_id = ['comboattack_1', 'comboattack_2', 'comboattack_3', 'comboattack_4']
    constructor(fsm: StateMachine) {
        super(fsm)
        this.fsm.stateMachines.set(PARAMS_NAME_ENUM.COMBOATTACK_1, new COMBOATTACK_1State(fsm))
        this.fsm.stateMachines.set(PARAMS_NAME_ENUM.COMBOATTACK_2, new COMBOATTACK_2State(fsm))
        this.fsm.stateMachines.set(PARAMS_NAME_ENUM.COMBOATTACK_3, new COMBOATTACK_3State(fsm))
        this.fsm.stateMachines.set(PARAMS_NAME_ENUM.COMBOATTACK_4, new COMBOATTACK_4State(fsm))
    }

    animationCallback() {

    }

    //判断状态
    run() {


        switch (this.fsm.currentState) {
            case this.fsm.stateMachines.get(PARAMS_NAME_ENUM.COMBOATTACK_1):
                if (this.fsm.params.get(PARAMS_NAME_ENUM.IDLE).value) {
                    this.fsm.currentState = this.fsm.stateMachines.get(PARAMS_NAME_ENUM.IDLE);
                } else if (this.fsm.params.get(PARAMS_NAME_ENUM.COMBOATTACK_2).value) {
                    this.fsm.currentState = this.fsm.stateMachines.get(PARAMS_NAME_ENUM.COMBOATTACK_2);
                }
                break;

            case this.fsm.stateMachines.get(PARAMS_NAME_ENUM.COMBOATTACK_2):
                if (this.fsm.params.get(PARAMS_NAME_ENUM.IDLE).value) {
                    this.fsm.currentState = this.fsm.stateMachines.get(PARAMS_NAME_ENUM.IDLE);
                } else if (this.fsm.params.get(PARAMS_NAME_ENUM.COMBOATTACK_3).value) {
                    this.fsm.currentState = this.fsm.stateMachines.get(PARAMS_NAME_ENUM.COMBOATTACK_3);
                }
                break;

            case this.fsm.stateMachines.get(PARAMS_NAME_ENUM.COMBOATTACK_3):
                if (this.fsm.params.get(PARAMS_NAME_ENUM.IDLE).value) {
                    this.fsm.currentState = this.fsm.stateMachines.get(PARAMS_NAME_ENUM.IDLE);
                } else if (this.fsm.params.get(PARAMS_NAME_ENUM.COMBOATTACK_4).value) {
                    this.fsm.currentState = this.fsm.stateMachines.get(PARAMS_NAME_ENUM.COMBOATTACK_4);
                }
                break;

            case this.fsm.stateMachines.get(PARAMS_NAME_ENUM.COMBOATTACK_4):
                if (this.fsm.params.get(PARAMS_NAME_ENUM.IDLE).value) {
                    this.fsm.currentState = this.fsm.stateMachines.get(PARAMS_NAME_ENUM.IDLE);
                }
                break;
            default:
                this.fsm.currentState = this.fsm.stateMachines.get(PARAMS_NAME_ENUM.COMBOATTACK_1);
        }
        //如果当前处于普通攻击状态就不能打断了
        // this.fsm.currentState = this.fsm.stateMachines.get(PARAMS_NAME_ENUM.COMBOATTACK_1);

        // if (this.attack_id.some(item => item !== this.fsm.currentState.maskId)) {
        // }
        // let count=0
        // if (this.fsm.fsm.currentState.maskId = this.fsm.stateMachines.get(PARAMS_NAME_ENUM.COMBOATTACK_1).maskId) {
        //     count=2
        // }else if(this.fsm.fsm.currentState.maskId = this.fsm.stateMachines.get(PARAMS_NAME_ENUM.COMBOATTACK_2).maskId){
        //     count=3
        // }else if(this.fsm.fsm.currentState.maskId = this.fsm.stateMachines.get(PARAMS_NAME_ENUM.COMBOATTACK_3).maskId){
        //     count=4
        // }else if(this.fsm.fsm.currentState.maskId = this.fsm.stateMachines.get(PARAMS_NAME_ENUM.COMBOATTACK_4).maskId){
        //     count=0
        // }else{
        //     count=1
        //     this.fsm.fsm.currentState = this.fsm.stateMachines.get(PARAMS_NAME_ENUM.COMBOATTACK_1)
        // }

        // this.fsm.fsm.params.set(PARAMS_NAME_ENUM.COMBOATTACK_COUNT,{
        //     type: FSM_PARAM_TYPE_ENUM.NUMBER,
        //     value: count,
        //   })
        // this.fsm.setParams
        // ManagerCenter.dataCenter.comboCount=count

        // if (this.fsm.currentState.maskId != this.fsm.stateMachines.get(PARAMS_NAME_ENUM.ATTACK).maskId) {
        //     this.fsm.currentState = this.fsm.stateMachines.get(PARAMS_NAME_ENUM.ATTACK)
        // }

        // const { value: newDirection } = this.fsm.fsm.params.get(PARAMS_NAME_ENUM.DIRECTION);
        // this.fsm.currentState = this.fsm.stateMachines.get(DIRECTION_ORDER_ENUM[newDirection as number]);
        // this.fsm.currentState = this.fsm.stateMachines.get(PARAMS_NAME_ENUM.IDLE);
        // let count = this.fsm.fsm.params.get(PARAMS_NAME_ENUM.COMBOATTACK_COUNT).value as number
        //     this.fsm.currentState = this.fsm.stateMachines.get(PARAMS_NAME_ENUM.COMBOATTACK_1);
        // 不能这里写 多次点击会打断状态 要在动画回调里面触发
        // if(count>3){
        //     this.fsm.currentState = this.fsm.stateMachines.get(PARAMS_NAME_ENUM.COMBOATTACK_4);
        // }else if(count>2){
        //     this.fsm.currentState = this.fsm.stateMachines.get(PARAMS_NAME_ENUM.COMBOATTACK_3);
        // }else if(count>1){
        //     this.fsm.currentState = this.fsm.stateMachines.get(PARAMS_NAME_ENUM.COMBOATTACK_2);
        // }else{
        //     this.fsm.currentState = this.fsm.stateMachines.get(PARAMS_NAME_ENUM.COMBOATTACK_1);
        // }
    }
}