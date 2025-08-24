import { Camera, Layers, Node, UITransform, Vec3, Widget } from "cc";
import { v3 } from "cc";
import { LayerType, UIConst } from "../Define";
import { SDKPaltformInfo } from "../SDKPaltformInfo";

//游戏UI层级管理，主要控制不同层级的ui界面显示，分为 主游戏层 全屏窗口层 二级窗口层 提示层 新手引导层 最高层
//通过ManagerCenter.layerMgr.addChild(this.layerType, this.node, this._index);来添加ui节点
/** 游戏层级管理类 */
export class LayerManager {
    /** 界面根节点 */
    uiCanvas!: Node;
    /** 界面摄像机 */
    camera!: Camera;
    /** 主游戏层 */
    game!: Node;
    /** 全屏窗口层 */
    window!: Node;
    /** 二级界面层 */
    popUp!: Node;
    /** Tips窗口层 */
    tips!: Node;
    /** 新手引导层 */
    guide!: Node;
    /** 最高层级 */
    top!: Node;

    /**
     * 构造函数
     * @param uiCanvas  界面根节点
     */
    constructor(uiCanvas: Node) {
        this.uiCanvas = uiCanvas;
        this.camera = this.uiCanvas.getComponentInChildren(Camera)!;

        this.game = this.createNode(LayerType.Game);
        this.window = this.createNode(LayerType.Window);
        this.popUp = this.createNode(LayerType.PopUp);
        this.tips = this.createNode(LayerType.Tips);
        this.guide = this.createNode(LayerType.Guide);
        this.top = this.createNode(LayerType.Top);

        uiCanvas.addChild(this.game);
        uiCanvas.addChild(this.window);
        uiCanvas.addChild(this.popUp);
        uiCanvas.addChild(this.tips);
        uiCanvas.addChild(this.guide);
        uiCanvas.addChild(this.top);
    }

    private createNode(name: LayerType) {
        var node = new Node(name);
        node.layer = Layers.Enum.UI_2D;
        var w: Widget = node.addComponent(Widget);
        w.isAlignLeft = w.isAlignRight = w.isAlignTop = w.isAlignBottom = true;
        w.left = w.right = w.top = w.bottom = 0;
        w.alignMode = 2;
        w.enabled = true;
        return node;
    }

    /**
     * 添加对象到节点
     * @param layerType 层级
     * @param child 对象
     * @param index 
     */
    addChild(layerType: LayerType, child: any, index?: number) {
        let node = this.GetLayer(layerType);
        
        if (index != null) {
            node.insertChild(child, index)

        }
        else {
            node.addChild(child);
        }

    }

    private GetLayer(layerType: LayerType): Node {
        let node: Node;
        switch (layerType) {
            case LayerType.Game:
                node = this.game;
                break;
            case LayerType.Window:
                node = this.window;
                break;
            case LayerType.PopUp:
                node = this.popUp;
                break;
            case LayerType.Tips:
                node = this.tips;
                break;
            case LayerType.Guide:
                node = this.guide;
                break;
            case LayerType.Top:
                node = this.top;
                break;
        }
        return node;
    }

    /**
     * 通过具体点击坐标，调整UI节点世界坐标不超出屏幕
     * @param x x坐标
     * @param y y坐标
     * @param width 展示对象宽度 
     * @param height 展示对象高度
     * @returns v3坐标
     */
    public adjustWorldPosInPos(pos: Vec3, width?, height?) {
        let vec3 = this.camera.screenToWorld(pos)
        return this.adjustWorldPosInScreen(vec3, width, height);
    }

    /**
     * 通过node节点，调整UI节点世界坐标不超出屏幕
     * @param node node节点
     * @param width 展示对象宽度
     * @param height 展示对象高度
     * @returns v3坐标
     */
    public adjustWorldPosInNode(node: Node, width?, height?) {
        let pos = node.worldPosition;
        return this.adjustWorldPosInScreen(pos, width, height);
    }

    /**调整UI节点世界坐标不超出屏幕 */
    private adjustWorldPosInScreen(posIn: Vec3, width?, height?) {
        let pos = posIn.clone();
        pos = this.uiCanvas.getComponent(UITransform).convertToNodeSpaceAR(pos);
        if (width && height) {
            let borderW = SDKPaltformInfo.advW / 2;//宽度边界
            let borderH = UIConst.Height / 2;//高度度边界
            let x = 0;
            if (pos.x >= 0) {//屏幕右侧范围
                if (borderW - pos.x - 30 > width) {//右侧可以放得下对象
                    x = pos.x + width / 2;
                } else {//右侧放不下
                    x = pos.x - width / 2;
                }
            } else {//屏幕左侧范围
                x = pos.x + width / 2;
            }

            let y = 0;
            if (borderH + pos.y > height) {//下侧可以放得下对象
                y = pos.y - height / 2;
            } else {//下侧放不下
                y = pos.y + height / 2;
            }
            pos = v3(x, y)
        }

        return pos;
    }
}