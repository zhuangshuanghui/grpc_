import { _decorator, Component, Input, input, KeyCode, Vec2, RigidBody2D, PhysicsSystem2D, ERigidBody2DType, EventKeyboard, BoxCollider2D, Color, debug, Graphics, Animation } from 'cc';
import PlayerStateMachine from '../../testPlayerStateMachineFsm/PlayerStateMachine';
import { PARAMS_NAME_ENUM } from '../Define';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property
    moveSpeed: number = 20;

    @property
    jumpForce: number = 400;

    @property
    groundCheckDistance: number = 0.2;

    @property
    // groundLayer: number = 1 << 0;
    groundLayer: number = 1 << 2;

    private _rigidBody: RigidBody2D;
    private _collider: BoxCollider2D;
    private _isGrounded: boolean = false;
    private _moveDirection: number = 0;
    private _worldCenter: Vec2 = new Vec2(); // 用于存储世界坐标中心点

    fsm: PlayerStateMachine
    _animationCom: Animation

    // 移动速度阈值(小于此值认为静止)
    private moveThreshold: number = 0.1;



    onLoad() {


        this._rigidBody = this.node.getComponent(RigidBody2D);
        this._collider = this.node.getComponent(BoxCollider2D);
        this._animationCom = this.node.getComponent(Animation)
        if (!this._rigidBody || !this._collider) {
            console.error('Missing required physics components!');
            return;
        }

        this._rigidBody.type = ERigidBody2DType.Dynamic;
        PhysicsSystem2D.instance.enable = true;

        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);

        this.fsm = this.node.getComponent(PlayerStateMachine)
    }

    update(deltaTime: number) {
        // 地面检测（使用碰撞器尺寸）
        const colliderSize = this._collider.size;
        const worldPos = this.node.worldPosition;
        const rayStart = new Vec2(
            worldPos.x,
            worldPos.y - colliderSize.height / 2
        );
        const rayEnd = new Vec2(rayStart.x, rayStart.y - this.groundCheckDistance);

        const results = PhysicsSystem2D.instance.raycast(rayStart, rayEnd);
        this._isGrounded = results.length > 0;
        if (this._isGrounded) {
            // console.log("在地面");
        }
        // 应用水平速度
        const velocity = this._rigidBody.linearVelocity;
        velocity.x = this._moveDirection * this.moveSpeed;
        this._rigidBody.linearVelocity = velocity;

        //检测主角是否移动
        // console.log(this.isMovingByVelocity());



    }


    // 判断是否正在移动(基于速度)
    isMovingByVelocity(): boolean {
        if (!this._rigidBody) return false;
        // 获取当前速度
        const velocity = this._rigidBody.linearVelocity;
        // 计算水平速度(忽略Y轴)
        const horizontalSpeed = Math.sqrt(velocity.x * velocity.x);
        return horizontalSpeed > this.moveThreshold;
    }

    private onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_A:
                this._moveDirection = -1;
                this.node.setScale(-1, 1)

                this.fsm.setParams(PARAMS_NAME_ENUM.RUN, true)
                break;
            case KeyCode.KEY_D:
                this._moveDirection = 1;
                this.node.setScale(1, 1)
                this.fsm.setParams(PARAMS_NAME_ENUM.RUN, true)
                break;
            case KeyCode.KEY_W:
                if (this._isGrounded) {
                    // 修正：传入预先创建的Vec2对象接收世界坐标
                    this._rigidBody.getWorldCenter(this._worldCenter);
                    this._rigidBody.applyLinearImpulse(
                        new Vec2(0, this.jumpForce),
                        this._worldCenter,
                        true
                    );
                }
                break;
            case KeyCode.KEY_J:
                this.fsm.setParams(PARAMS_NAME_ENUM.ATTACK, true)
                console.log("gj");
                break;
            case KeyCode.SPACE:
                console.log("当前状态  ",this.fsm.currentState);
                break;
        }
    }

    private onKeyUp(event: EventKeyboard) {


        if (event.keyCode === KeyCode.KEY_A || event.keyCode === KeyCode.KEY_D) {
            this._moveDirection = 0;
            //如果是在播放跑的动画则提前结束

            this.fsm.setParams(PARAMS_NAME_ENUM.IDLE, true)
            // this._animationCom.stop()
            // if (this._animationCom.getState("run").name === 'run') {
            //     let item=this._animationCom.getState("run")
            //     // item.onStop
            //     this._animationCom.stop()
            // }

        }
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }
}