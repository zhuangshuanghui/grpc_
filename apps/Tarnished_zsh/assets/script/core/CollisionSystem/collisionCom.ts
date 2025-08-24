import { _decorator, Component, Input, input, KeyCode, Vec2, RigidBody2D, PhysicsSystem2D, ERigidBody2DType, EventKeyboard, BoxCollider2D, Collider2D, Contact2DType } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('collisionCom')
export class collisionCom extends Component {

    protected start(): void {
        
        // 注册单个碰撞体的回调函数
        let collider = this.getComponent(BoxCollider2D);
        if(collider){
            // console.log("has BoxCollider2D");

            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
            
        }
    }
    onEndContact(END_CONTACT: string, onEndContact: any, arg2: this) {
        // throw new Error('Method not implemented.');
        // console.log("wall out collision");
        
    }
    onBeginContact(BEGIN_CONTACT: string, onBeginContact: any, arg2: this) {
        // console.log("wall collision");
    }



}
