import { _decorator, animation,Button, TiledMap, Component, RigidBody2D, EventKeyboard, input, Input, instantiate, KeyCode, log, Node, BoxCollider2D, Size, Vec2, ERigidBody2DType, director, PhysicsSystem2D, EPhysics2DDrawFlags, TiledTile, Vec3, TiledLayer } from 'cc';
import { ButtonEx } from './ui/common/ButtonEx';
import Util from './util/Util';
import { Log } from './util/Log';
import { ManagerCenter } from './core/center/ManagerCenter';
import { ResLoad } from './core/loader/ResLoad';
import { EventCenter } from './core/center/EventCenter';
import PlayerStateMachine from './testPlayerStateMachineFsm/PlayerStateMachine';
import { PARAMS_NAME_ENUM, PARAMS_NAME_ISAIR_ENUM } from './core/Define';
import { collisionCom } from './core/CollisionSystem/collisionCom';
import { DataBinder } from './core/DataBinder';
import { GenerateCollision } from './core/CollisionSystem/GenerateCollision';
import { wuliTest } from './core/CollisionSystem/wuliTest';
const { ccclass, property } = _decorator;

@ccclass('test')
export class test extends Component {
    @property({ type: ButtonEx })
    btn1: ButtonEx = null!
    @property({ type: Node })
    testNode: Node = null!


    @property({ type: TiledMap })
    tiledMap: TiledMap = null!

    asd:animation.AnimationController

    _testNumber:number
    onLoad() {
        // 启用键盘输入
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);

        ResLoad.init();
        Util.GAddClick(this.btn1, this.onBtnClick, this);
        ManagerCenter.eventCenter.on("xian", this.xianxina, this)
        
        this.init()
        DataBinder.getInstance().dataBind("_testNumber",this,"testNumberUI")
        
    }

    
    public set testNumber(v : number) {
        this._testNumber = v;
        DataBinder.getInstance().update("_testNumber",v)
    }

    public set testNumberUI(v : number) {
        console.log("更新了ui");
    }
    
    async init() {
        //预加载 游戏配置  数据
        await ManagerCenter.configMgr.preload();
        ManagerCenter.i18nMgr.init()
        console.log("18   ", ManagerCenter.i18nMgr.i18Dic());
        // console.log("18   ",ManagerCenter.configMgr.getConfigData("i18nCode"));
        new GenerateCollision(this.tiledMap)
        // await this.generateCollision()
    }

    start() {

    }
    xianxina() {
        console.log("你好");

    }
    onBtnClick() {
        ManagerCenter.bundleMgr.loadPrefab("testAb", "test", this.add.bind(this))
        Log.LogInfo("hggg")
    }

    add(node1) {
        let node2 = instantiate(node1)
        console.log("this.testNode", this.testNode);

        this.testNode.addChild(node2)
    }

    update(deltaTime: number) {
        ManagerCenter.timeMgr.update(deltaTime)
        this.debugPhysics()
        

    }

    debugPhysics(){
        PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
        EPhysics2DDrawFlags.Pair |
        EPhysics2DDrawFlags.CenterOfMass |
        EPhysics2DDrawFlags.Joint |
        EPhysics2DDrawFlags.Shape;
    }

    private onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            // case KeyCode.KEY_W:
            //     this.fsm.setParams(PARAMS_NAME_ENUM.DEATH, true)
            //     break;
            // case KeyCode.KEY_A:
            //     break;
            case KeyCode.KEY_S:
                // this.fsm.resetTrigger() //清楚触发器
                // ManagerCenter.windowMgr.openWindow("LoginWindow")
                this.testNumber++
                break;
            case KeyCode.KEY_D:
                this.testNumber--
                break;
            case KeyCode.SPACE:
                // console.log("KeyCode",this.fsm.getParams(PARAMS_NAME_ENUM.ISAIRING));
                break;
            default:
                // console.log("没有对应按钮");

        }
    }

    private onKeyUp(event: EventKeyboard) {
    }







}


