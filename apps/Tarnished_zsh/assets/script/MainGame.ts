import { _decorator, Component, Node, director, Director, Input, input, EventKeyboard, KeyCode } from 'cc';
import { ManagerCenter } from './core/center/ManagerCenter';
import { LayerManager } from './core/window/LayerManager';
import { ButtonEx } from './ui/common/ButtonEx';
import Util from './util/Util';
import ModuleReg from './core/window/config/ModuleReg';
import { ResLoad } from './core/loader/ResLoad';
import { LabelEx } from './ui/common/LabelEx';
import { GUtil } from './util/GUtil';
import { SocketManager } from './core/net/SocketManager';
// import { io } from "socket.io-client";
// import { SocketManager } from './core/net/SocketManager';
const { ccclass, property } = _decorator;

@ccclass('MainGame')
export class MainGame extends Component {

    @property({ type: Node, tooltip: "游戏层" })
    game: Node = null!

    @property({ type: Node, tooltip: "界面层" })
    uiCanvas: Node = null!

    @property({ type: ButtonEx })
    ButtonEx1: ButtonEx = null!

    //游戏开始字体
    @property({ type: LabelEx })
    lab1: LabelEx = null!
    /** 持久根节点 */
    persistRoot: Node = null!
    protected onLoad(): void {
    }

    protected start(): void {
        new SocketManager()
        this.init()
        this.scheduleOnce(() => {
            this.lab1.string = "按下s开始游戏......"
        },2)
    }

    async init() {
        // new SocketManager()
        //框架初始化
        // console.log("zsh",typeof io); // 应该输出 "function"
        // console.log(typeof fs); // 应该输出 "undefined"
        this.persistRoot = new Node("persistRoot");
        director.addPersistRootNode(this.persistRoot);
        ManagerCenter.layerMgr = new LayerManager(this.uiCanvas);
        // ManagerCenter.audioMgr.init();
        // await ChannelConfig.init();
        // ManagerCenter.sdk.init();
        // ManagerCenter.netMgr.Init();   
        GUtil.init()
        Util.GAddClick(this.ButtonEx1, this.onBtnClick, this);
        //注册类  ui窗口类
        ModuleReg.init();
        //dd
        ResLoad.init()
        //预加载 游戏配置  数据
        await this.preloadRes();
        //进入游戏
        this.startGame();
        
        //输出游戏节点
        this.tiaosho()
        // 启用键盘输入
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    async preloadRes() {
        //输出配置表
        await ManagerCenter.configMgr.preload();
    }

    startGame() {
        //进入主界面接口
    }
    update(deltaTime: number) {
        ManagerCenter.timeMgr.update(deltaTime);
    }

    onBtnClick() {
        GOpenWindow(ModuleReg.NoticeWindow)
        // ManagerCenter.windowMgr.openWindow(ModuleReg.NoticeWindow)
        //输出节点树，查看layer生效
        this.printNodeTree(this.game);
    }




    private onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            // case KeyCode.KEY_W:
            //     break;
            case KeyCode.KEY_A:
                break;
            case KeyCode.KEY_S:
                // this.fsm.resetTrigger() //清楚触发器
                ManagerCenter.windowMgr.openWindow(ModuleReg.MainGameWindow)
                break;
            case KeyCode.KEY_D:
                break;
            case KeyCode.SPACE:
                // console.log("KeyCode",this.fsm.getParams(PARAMS_NAME_ENUM.ISAIRING));

                break;
            default:
                console.log("没有对应按钮");
        }
    }

    private onKeyUp(event: EventKeyboard) {
    }



































    tiaosho() {
        // 在场景加载后调用
        director.once(Director.EVENT_AFTER_SCENE_LAUNCH, () => {
            const rootNode = director.getScene().children[0];
            this.printNodeTree(rootNode);
        });
    }


    // 在游戏代码中打印节点树
    printNodeTree(node: Node, indent: string = "") {
        console.log(`${indent}${node.name} (${node.position})`);
        node.children.forEach(child => {
            this.printNodeTree(child, indent + "  ");
        });
    }



}


