import { Component, EventHandler, Layers, Node, Prefab, UITransform, instantiate } from "cc";
import { ManagerCenter } from "../center/ManagerCenter";
import { NotifyConst } from "../NotifyConst";

/** 预制体对象实例化控制类 */
export class ComponentCtrl<T extends Component> {
    private node: Node;// node节点
    private component: T;//脚本对象
    private content;
    private bundleName;
    private prefabName;
    private bLoaded = false;//资源是否已加载
    private loadState = 0 // 0 刚初始化,1已加载,2已销毁
    private preloadedCount = 0 //预加载数量
    
    private _param = [];//参数列表
    private eventList: EventHandler[] = []
    private ctrlParam = [];


    private _name: string;
    private _itemX: number;
    private _itemY: number;
    private _width: number;
    private _height: number;
    private _scaleX: number;
    private _scaleY: number;
    private _active = true;
    private _layer: Layers.Enum;

    /**
     * 构造方法
     * @param content 父物体
     * @param bundleName bundle名字
     * @param prefabName 预制体名
     * @param ctrlParam 
     * @returns 
     */
    constructor(content: Node, bundleName: string, prefabName: string, ...ctrlParam) {
        this.loadState = 0;
        this.content = content;
        this.bundleName = bundleName;
        this.prefabName = prefabName;
        this.ctrlParam = ctrlParam;
        if (!bundleName || !prefabName) {
            console.error("预制不能为空");
            return;
        }

        this.bLoaded = true;//ManagerCenter.bundleMgr.
        if (this.bLoaded) {
            ManagerCenter.bundleMgr.loadUIPrefab(bundleName, prefabName, (prefabAsset: Prefab) => {
                if (prefabAsset) {
                    this.node = instantiate(prefabAsset);//实例化节点对象
                    this.component = <T>this.node.getComponent(prefabName);
                    if (this.component == null) {
                        console.error(prefabName + "代码没找到,请核对绑定的代码");
                        return
                    }
                    this.onLoaded();    
                }
            });
        }
    }

    //预加载
    private onPreloaded() {
        this.preloadedCount += 1;
    }

    private onLoaded() {
        this.loadState = 1;
        if (this.content) {
            this.content.addChild(this.node);
        }
        this.active = this._active;
        if (this._name) this.name = this._name
        if (this._itemX != null) {
            this.setPosition(this._itemX, this._itemY);
        }
        if (this._height != null) {
            this.setContentSize(this._width, this._height)
        }
        if (this._scaleX != null) {
            this.setScale(this._scaleX, this._scaleY);
        }
        if (this._layer != null) {
            this.setLayer(this._layer);
        }

        if (this.component["ctor"]) {
            this.component["ctor"].call(this.component, ...this.ctrlParam);
        }

        if (this.component["buildShowItem"]) {
            this.component["buildShowItem"].call(this.component);
        }

        if (this.bLoaded) {
            this.setData(...this._param);
        }
    }

    setData(...param) {
        this._param = param;
        if (this.loadState == 1 && this.component["setData"]) {
            this.component["setData"].call(this.component, ...param);
        }
        ManagerCenter.eventCenter.emit(NotifyConst.COMPT_VIEW_SHOW, this.prefabName);
    }

    /**
     * 是否隐藏
     */
    public set active(bool: boolean) {
        this._active = bool;
        if (this.loadState == 1) {
            this.node.active = bool;
        }
    }

    public get active() {
        if (this.loadState == 1) {
            return this.node.active;
        }
        else {
            return this._active;
        }

    }

    /**
     * 节点名
     */
    public set name(v: string) {
        this._name = v;
        if (this.loadState == 1) {
            this.node.name = v
        }
    }

    /**
     * 设置坐标
     * @param x x坐标
     * @param y y坐标
     */
    setPosition(x: number, y: number) {
        this._itemX = x;
        this._itemY = y;
        if (this.loadState == 1) {
            this.node.setPosition(x, y, 0);
        }
    }
    /**
     * 设置节点 UI Transform 的原始大小，不受该节点是否被缩放或者旋转的影响。
     * @param width 
     * @param height 
     */
    setContentSize(width: number, height: number) {
        this._width = width;
        this._height = height;
        if (this.loadState == 1) {
            let component: UITransform = this.node.getComponent("cc.UITransform") as UITransform;
            if (component) {
                component.setContentSize(width, height)
            }
        }
    }

    /**
     * 设置本地缩放
     * @param scaleX 
     * @param scaleY 
     */
    setScale(scaleX: number, scaleY: number) {
        this._scaleX = scaleX;
        this._scaleY = scaleY;
        if (this.loadState == 1) {
            this.node.setScale(scaleX, scaleY, 1);
        }
    }

    /**
     * 设置层
     * @param layer 
     */
    setLayer(layer: Layers.Enum) {
        this._layer = layer;
        if (this.loadState == 1) {
            this.node.layer = layer;
        }
    }

    /**
     * 资源加载完成回调
     */
    public set loadHandler(v: EventHandler) {

    }

    destroy() {
        this.loadState = 2;        
        ManagerCenter.eventCenter.offAllCaller(this)
        ManagerCenter.eventCenter.offAllCaller(this.component)
        this._param = null;
        this.content = null;
        this.eventList = null;
        this.node = null;
        this.component = null;
        if (this.ctrlParam) {
            for (const key in this.ctrlParam) {
                this.ctrlParam[key] = null
            }
        }
        if (this._param) {
            for (const key in this._param) {
                this._param[key] = null
            }
        }
    }
}