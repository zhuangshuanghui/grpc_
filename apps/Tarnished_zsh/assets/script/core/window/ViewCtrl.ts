import { Component, Node, Prefab, Widget, instantiate, isValid } from 'cc';
import { ManagerCenter } from '../center/ManagerCenter';
import { TweenUtil } from '../../util/TweenUtil';
import { GUtil } from '../../util/GUtil';
import { LayerType, ViewState } from '../Define';
import { ModuleConfig } from './config/ModuleConfig';

//管理窗口的整个生命周期，  初始状态，加载中，加载完成，销毁状态。
export class ViewCtrl<T extends Component> {
    /** 窗口名字 */
    public winName: string;
    /** 窗口node */
    public node: Node;
    /** 窗口脚本对象 */
    public view: T;

    private _state: ViewState = ViewState.init;//窗口状态

    /** 窗口状态 */
    public get state(): ViewState {
        return this._state;
    }

    private _data: any; //窗口数据
    get data(): any {
        return this._data;
    }

    set data(dt: any) {
        this._data = dt;
        this.dataChange();
    }

    public constructor(winwinName) {
        this.winName = winwinName
    }

    show(data?) {
        this.data = data;
        if (this.state == ViewState.loaded) {
            this.node.active = true;
            this.onShow();
        } else if (this._state == ViewState.init) {
            this._state = ViewState.loading;
            this.loadView();
        }
    }

    //预加载
    onPreloaded() {
        this.loadView();
    }

    loadView() {
        let bundleName = ModuleConfig.getModuleBundle(this.winName);
        let prefabName = ModuleConfig.getModulePrefab(this.winName);
        if (!bundleName || !prefabName) {
            console.error(this.winName + "`s moduleConfig path has not config")
            return;
        }
        ManagerCenter.bundleMgr.loadUIPrefab(bundleName, prefabName, (prefabAsset: Prefab) => {

            if (prefabAsset) {

                this.node = instantiate(prefabAsset);//实例化节点对象

                console.log(prefabAsset, this.node, "this.node");
                let type = ModuleConfig.getModuleLayerType(this.winName);
                // ManagerCenter.layerMgr.addChild(type, this.node);
                if (!this.node.getComponent(Widget) && type != LayerType.Tips) {
                    this.node.addComponent(Widget);
                    let widget = this.node.getComponent(Widget);
                    widget.isAlignLeft = true;
                    widget.isAlignRight = true;
                    widget.isAlignTop = true;
                    widget.isAlignBottom = true;
                }

                this.node.name = this.winName;
                this.view = <T>this.node.getComponent(this.winName);
                if (this.view == null) {
                    console.error(this.winName + "代码没找到,请核对绑定的代码")
                    return
                }
                this.onLoaded();
            }
        });
    }

    onLoaded() {
        this._state = ViewState.loaded;
        this.onInit();
        this.onShow();
    }

    /** 初始化数据,只会在创建的时候执行一次 */
    protected onInit() {

    }

    /** 展示界面信息，每次打开界面都会执行一次 */
    protected onShow() {
    }

    /** 数据发生改变执行一次 */
    protected dataChange() {
    }

    close(isRemove: boolean = true) {
        this.onClose()
        if (this.node) {
            this.node.active = false;
            if (isRemove) {
                this.node.removeFromParent();
            }
            TweenUtil.stopTween(this.node);
        }
    }

    destroy() {
        if (this._state == ViewState.destroy)
            return
        this._state = ViewState.init;
        this.onDestroy()
        if (isValid(this.node)) {
            this.node.destroy()
            this.node = null;
        }
    }

    /** 关闭界面，不销毁 */
    protected onClose() {
    }

    /** 销毁界面 */
    protected onDestroy() {
        this._data = null
        ManagerCenter.eventCenter.offAllCaller(this)
        GUtil.GRemoveAllClick(this.node, this)
    }

    /** 是否显示 */
    public isShow(): boolean {
        return this._state == ViewState.loaded && this.node.parent && this.node.active;
        // return [this._state == ViewState.loaded,this.node.parent,this.node.active];
    }
}