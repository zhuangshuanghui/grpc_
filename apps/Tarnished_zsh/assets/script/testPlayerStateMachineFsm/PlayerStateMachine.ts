import { Animation } from "cc";
import { PARAMS_NAME_ENUM } from "../core/Define";
import StateMachine, { getInitParamsNumber, getInitParamsString, getInitParamsTrigger } from "../core/fsm/StateMachine";
import IdleStateMachines from "./State/IdleState";
import JumpStateMachines from "./State/JumpState";
import SquatStateMachines from "./State/SquatState";
import DeathSubStateMachines from "./SubStateMachines/DeathSubStateMachines";
import IdleSubStateMachines from "./SubStateMachines/IdleSubStateMachines";
import JumpSubStateMachines from "./SubStateMachines/JumpSubStateMachines";
import RunState from "./State/RunState";
import AttackSubStateMachines from "./SubStateMachines/AttackSubStateMachines";


//后续添加状态转化的日志记录
//添加状态变换的事件通知

export default class PlayerStateMachine extends StateMachine {
    /**
     * 初始化状态机
     * 1. 获取动画组件
     * 2. 初始化状态参数
     * 3. 初始化子状态机
     * 4. 注册动画事件回调
     * 5. 设置初始状态为IDLE
     */

    init() {
        this._animationCom = this.node.getComponent(Animation)
        this.initParams()
        this.initStateMachines()
        //注册动画事件
        this.registerAnim()
        this.setParams(PARAMS_NAME_ENUM.IDLE, true)
        // this.run()
    }

    /**
     * 注册动画事件回调
     * 监听动画播放完成事件，根据不同动画执行相应回调
     */
    registerAnim() {
        this._animationCom.on(Animation.EventType.FINISHED, (event: AnimationEvent) => {
            if (event.animationName === 'attack') {
                //动画播放结束回调函数
                let state=this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK)
                if(state){
                    state.animationCallback()
                }
            }

            if (event.animationName === 'run') {
                //动画播放结束回调函数
                let state=this.stateMachines.get(PARAMS_NAME_ENUM.RUN)
                if(state){
                    state.animationCallback()
                }
            }

            if (event.animationName === 'comboattack_1') {
                //动画播放结束回调函数
                let state=this.stateMachines.get(PARAMS_NAME_ENUM.COMBOATTACK_1)
                if(state){
                    state.animationCallback()
                }
            }
            if (event.animationName === 'comboattack_2') {
                //动画播放结束回调函数
                let state=this.stateMachines.get(PARAMS_NAME_ENUM.COMBOATTACK_2)
                if(state){
                    state.animationCallback()
                }
            }
            if (event.animationName === 'comboattack_3') {
                //动画播放结束回调函数
                let state=this.stateMachines.get(PARAMS_NAME_ENUM.COMBOATTACK_3)
                if(state){
                    state.animationCallback()
                }
            }
            if (event.animationName === 'comboattack_4') {
                //动画播放结束回调函数
                let state=this.stateMachines.get(PARAMS_NAME_ENUM.COMBOATTACK_4)
                if(state){
                    state.animationCallback()
                }
            }
        }, this);

    }

    /**
     * 初始化状态参数
     * 创建所有状态参数并存储到params映射表中
     * params参数字符串  和 状态机字符串 并不强关联
     */
    initParams() {
        // 初始化触发器类型参数：IDLE状态
        this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger());
        // 初始化触发器类型参数：攻击状态
        this.params.set(PARAMS_NAME_ENUM.ATTACK, getInitParamsTrigger());
        // 初始化触发器类型参数：跳跃状态
        this.params.set(PARAMS_NAME_ENUM.JUMP, getInitParamsTrigger());
        // 初始化触发器类型参数：下蹲状态
        this.params.set(PARAMS_NAME_ENUM.SQUAT, getInitParamsTrigger());
        // 初始化触发器类型参数：死亡状态
        this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsTrigger());
        // 初始化触发器类型参数：奔跑状态
        this.params.set(PARAMS_NAME_ENUM.RUN, getInitParamsTrigger());
        // 初始化字符串类型参数：空中状态标识
        this.params.set(PARAMS_NAME_ENUM.ISAIRING, getInitParamsString());

        //肯定还是根据这个来变换状态
        this.params.set(PARAMS_NAME_ENUM.COMBOATTACK_COUNT, getInitParamsNumber());
    }

    /**
     * 初始化子状态机
     * 创建各个状态对应的状态机实例并存储到stateMachines映射表
     */
        initStateMachines() {
        // 死亡子状态机
        this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new DeathSubStateMachines(this));
        // 空闲状态机
        this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleStateMachines(this));
        // 攻击状态机
        this.stateMachines.set(PARAMS_NAME_ENUM.ATTACK, new AttackSubStateMachines(this));
        // 跳跃状态机
        this.stateMachines.set(PARAMS_NAME_ENUM.JUMP, new JumpStateMachines(this));
        // 下蹲状态机
        this.stateMachines.set(PARAMS_NAME_ENUM.SQUAT, new SquatStateMachines(this));
        // 奔跑状态机（直接使用RunState而非子状态机）
        this.stateMachines.set(PARAMS_NAME_ENUM.RUN, new RunState(this));
    }

       /**
     * 状态机运行主逻辑
     * 根据当前状态和参数值决定状态切换
     * 注意：只在需要状态转换时执行逻辑
     * case缺少break语句，需要状态判断穿透 否则则添加break
     */  
    run(): void {
        switch (this.currentState) {
            case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
                if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
                }else if (this.params.get(PARAMS_NAME_ENUM.RUN).value) {
                    //避免多次点击重置动画
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.RUN)
                }else if (this.params.get(PARAMS_NAME_ENUM.ATTACK).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK)
                }else if (this.params.get(PARAMS_NAME_ENUM.DEATH).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.DEATH)
                }else{
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
                }
                break;
            case this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK):
                if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
                }
                break;
            case this.stateMachines.get(PARAMS_NAME_ENUM.JUMP):
            case this.stateMachines.get(PARAMS_NAME_ENUM.SQUAT):
            case this.stateMachines.get(PARAMS_NAME_ENUM.DEATH):
                //复活机制
                break;
            case this.stateMachines.get(PARAMS_NAME_ENUM.RUN):

                if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
                }
                break
            default:
                this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        }
    }
}

