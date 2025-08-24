import { animation, AnimationClip, Component, Sprite, SpriteFrame ,Animation} from 'cc'
// import { ResourceManager } from '../Runtime/ResourceManager'
// import { sortSpriteFrame } from '../Utils'
import StateMachine from './StateMachine'
import { ManagerCenter } from '../center/ManagerCenter'

/***
 * unit:milisecond  播放动画 根据传入的参数
 */
export const ANIMATION_SPEED = 1 / 8

/***
 * 状态（每组动画的承载容器，持有SpriteAnimation组件执行播放）
 */
export default abstract class State {
    //用于标识当前状态名字
    maskId:string
    private animationClip: AnimationClip
    public name: String = null
    fsm: StateMachine
    _animaitonCom:Animation
    _animationClipName:string


    constructor(fsm: StateMachine) {
        this.fsm = fsm
        this._animaitonCom=this.fsm._animationCom
        this.init()
    }

    init() {
        this._animaitonCom.on(Animation.EventType.FINISHED, this.animationCallback, this)
    }

    abstract animationCallback(): void

    playAnim(){
        this._animaitonCom.play(this._animationClipName)
    }


    run() {
        this.playAnim()








        // if (this.fsm.animationComponent.defaultClip?.name === this.animationClip.name) {
        //   return
        // }

        // this.fsm.animationComponent.defaultClip = this.animationClip
        // this.fsm.animationComponent.play()

        
        // ManagerCenter.timeMgr.scheduleOnce(2, () => {
        //     this.fsm.resetTrigger()
        //     this.animationCallback()
        //     console.log("动画结束回调，并且消除状态");
        // });
    }
}
