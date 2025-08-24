import { _decorator, animation, Animation, Component, SpriteFrame } from 'cc'
import State from './State'
import SubStateMachine from './SubStateMachine'
import { ManagerCenter } from '../center/ManagerCenter'
const { ccclass } = _decorator


/***
 * 有限状态机参数类型枚举
 */
export enum FSM_PARAM_TYPE_ENUM {
  NUMBER = 'NUMBER',    //数值类型
  STRING = 'STRING',     //字符串类型
  TRIGGER = 'TRIGGER',  //触发器类型
}


type ParamsValueType = boolean | number | string

export interface IParamsValue {
  type: FSM_PARAM_TYPE_ENUM
  value: ParamsValueType
}

export const getInitParamsTrigger = () => {
  return {
    type: FSM_PARAM_TYPE_ENUM.TRIGGER,
    value: false,
  }
}

export const getInitParamsNumber = () => {
  return {
    type: FSM_PARAM_TYPE_ENUM.NUMBER,
    value: 0,
  }
}

export const getInitParamsString = () => {
  return {
    type: FSM_PARAM_TYPE_ENUM.STRING,
    value: '',
  }
}

/***
 * 流动图
 * 1.entity的state或者direction改变触发setter
 * 2.setter里触发fsm的setParams方法
 * 3.setParams执行run方法（run方法由子类重写）
 * 4.run方法会更改currentState，然后触发currentState的setter
 * 5-1.如果currentState是子状态机，继续执行他的run方法，run方法又会设置子状态机的currentState，触发子状态run方法
 * 5-2.如果是子状态，run方法就是播放动画
 */

/***
 * 有限状态机基类
 */
@ccclass('StateMachine')
export default abstract class StateMachine extends Component {
  private _currentState: State | SubStateMachine = null
  params: Map<string, IParamsValue> = new Map()
  stateMachines: Map<string, SubStateMachine | State> = new Map()
  waitingList: Array<Promise<SpriteFrame[]>> = []
  _animationCom: Animation

  getParams(paramName: string) {
    if (this.params.has(paramName)) {
      return this.params.get(paramName).value
    }
  }

  setParams(paramName: string, value: ParamsValueType) {
    if (this.params.has(paramName)) {
      this.params.get(paramName).value = value
      this.run()
      // if (this.currentState.maskId === "idle") {
      //   return
      // }
      this.resetTrigger()  //动画分为 瞬发 和有一整个连续动作的   瞬发 随时取消触发器   连续动画需要动画回调里去取消触发器
    }
  }


  /***
   * 由子类重写，方法目标是根据当前状态和参数修改currentState
   */
  abstract init(): void
  abstract run(): void

  /***
   * 清空所有trigger   重置触发器，避免状态重复触发，如跳跃后为false
   */
  resetTrigger() {
    for (const [, value] of this.params) {
      if (value.type === FSM_PARAM_TYPE_ENUM.TRIGGER) {
        value.value = false
      }
    }

    this.run()
  }

  get currentState() {
    return this._currentState
  }

  set currentState(newState) {
    if (!newState) {
      return
    }
    this._currentState = newState
    console.log("currentState", this.currentState);

    this._currentState.run()
  }
}
