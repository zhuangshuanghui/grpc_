import { Component, Node, UIOpacity, UITransform, find } from 'cc';
import { TweenUtil } from '../../util/TweenUtil';
import { ManagerCenter } from '../center/ManagerCenter';
import { ViewCtrl } from './ViewCtrl';
import { CloseMode, LayerType, ViewState } from '../Define';
import { LabelEx } from '../../ui/common/LabelEx';
import { ModuleConfig } from './config/ModuleConfig';
import Util from '../../util/Util';
import { TimeUtil } from '../../util/TimeUtil';
import { GUtil } from '../../util/GUtil';
import { NotifyConst } from '../NotifyConst';

/** 窗口面板(Window)的基类 */
export class WindowCtrl<T extends Component> extends ViewCtrl<T> {
    /** 层级类型 */
    public layerType: LayerType = LayerType.Window;
    /** 关闭模式 */
    public closeMode: CloseMode = CloseMode.Destroy;
    /** 记录窗口延时关闭时间，用于延迟销毁检测 */
    public closeTime: number = 1;
    /** 是否显示遮罩 */
    protected showMask: boolean;
    /**是否可以点击遮罩 */
    public bClickMask: boolean;
    /**是否播放音效 */
    public bPlaySound = true;
    public openSound = "WinOpen";//开启音效
    public closeSound = "WinClose"//关闭音效

    private _index //层级索引

    public title: LabelEx;//图标
    public maskBg: Node;//遮罩
    public alpha: number;//透明度值
    public helpId: number;//funcHelp_功能说明 id
    public helpBtn: Node;//帮助按钮
    private _isHelpClick: boolean;

    public constructor(winName) {
        super(winName)
        let type = ModuleConfig.getModuleLayerType(this.winName);
        this.layerType = type != null ? type : this.layerType;
        let mode = ModuleConfig.getModuleCloseMode(this.winName);
        this.closeMode = mode != null ? mode : this.closeMode;
        this.showMask = ModuleConfig.getModuleShowMask(this.winName);
        this.alpha = ModuleConfig.getModuleAlpha(this.winName);
        this.bClickMask = ModuleConfig.getModuleClickMask(this.winName);
        this.helpId = ModuleConfig.getModulHelpId(this.winName);
    }

    show(data?: any, index?: number) {
        this._index = index
        //预设已经加载
        if (this.state == ViewState.loaded) {
            
            ManagerCenter.layerMgr.addChild(this.layerType, this.node, index);
        }
        super.show(data);
        //GLog("windowCtrl........show",this.winName)
    }


    onLoaded(): void {
        ManagerCenter.layerMgr.addChild(this.layerType, this.node, this._index);
        // Log.LogInfo("windowCtrl........onLoaded", this.node)
        ManagerCenter.windowMgr.updateOpeningWin(this.winName);
        super.onLoaded();
    }

    protected onInit() {
        super.onInit();
        // this.node.addComponent(UIOpacity)
        // let title: any = find("ReturnItem/closeBtn/title", this.node);
        // if (!title) {
        //     title = find("title", this.node);
        // }
        // if (title && ModuleConfig.hasModule(this.winName)) {
        //     this.title = title.getComponent(LabelEx);
        //     this.title.string = ModuleConfig.getTitle(this.winName);
        // }
        // let closeBtn = find("ReturnItem/closeBtn", this.node);
        // if (!closeBtn) {
        //     closeBtn = find("closeBtn", this.node);
        // }
        // if (closeBtn) {
        //     Util.GAddClick(closeBtn, this.close, this)
        // }
        // let winBg = find("winBg", this.node);
        // if (winBg) {
        //     Util.GAddClick(winBg, this.onWinBgClick, this)
        // }
        // this.helpBtn = find("ReturnItem/helpBtn", this.node);
        // if (this.helpId && this.helpBtn) {
        //     this.helpBtn.active = true;
        //     // Util.GAddClick(this.helpBtn, this.oHelpBtnClick, this)
        // }

        // if (this.showMask) {
        //     ManagerCenter.windowMgr.showMaskBg(this);//显示遮罩  
        // }
    }

    protected onShow() {
        super.onShow();
        // ManagerCenter.eventCenter.emit(NotifyConst.GAME_WIN_OPEN, this.winName);

        let layer: LayerType = ModuleConfig.getModuleLayerType(this.winName)
        if(layer === this.layerType)
        if (layer === LayerType.Tips) {
            // TweenUtil.flipNodeAnim(this.node)
        } else if (layer === LayerType.PopUp) {
            // TweenUtil.scaleNodeAnim(this.node)
        } else if (layer === LayerType.Window) {
            // let cfg = ModuleConfig.getModuleInfo(this.winName)
            // if (!cfg.anim) {
            //     TweenUtil.alphaNodeAnim(this.node)
            // }
            // if(cfg.audio){
            //     // GPlayeAudio(cfg.audio)
            // }else{
            //     // GPlayeAudio(AudioConst.AUDIO_10001)
            // }
        }
    }

    protected onClose() {
        super.onClose()
        let layer: LayerType = ModuleConfig.getModuleLayerType(this.winName)
        if(layer === LayerType.Window){
            // GPlayeAudio(AudioConst.AUDIO_10001)
        }
    }

    close() {
        if (this.state != ViewState.loaded)
            return
        switch (this.closeMode) {
            case CloseMode.Close:
                this.node.active = false;
                super.close();
                break
            case CloseMode.Delay:
                super.close();
                ManagerCenter.windowMgr.removeWin(this, true);
                this.closeTime = TimeUtil.nowSeconds + ManagerCenter.windowMgr.cacheTime;
                break
            case CloseMode.Destroy:
                super.close();
                this.destroy();
                break
        }
    }

    destroy() {
        if (this.state == ViewState.destroy)
            return
        if (this.isShow()) {
            this.onClose();
        }
        super.destroy();
        ManagerCenter.windowMgr.destroyWin(this);
        ManagerCenter.windowMgr.hideMaskBg(this);
    }

    protected onWinBgClick() {

    }
    /**
     * 设置帮助按钮事件
     * @param bClick 是否可点击
     */
    // public setHelpClick(bClick: boolean) {
    //     if (this._isHelpClick != bClick) {
    //         if (bClick) {
    //             Util.GAddClick(this.helpBtn, this.oHelpBtnClick, this);
    //         }
    //         else {
    //             GUtil.GRemoveClick(this.helpBtn, this.oHelpBtnClick, this);
    //         }
    //     }
    //     this._isHelpClick = bClick;
    //     this.helpBtn.active = bClick;
    // }

    //帮助
    // protected oHelpBtnClick() {
    //     GOpenWindow(ModuleReg.FuncHelpWindow, this.helpId);
    // }

    /**
     * 设置遮罩大小
     * @param width 款
     * @param height 高
     */
    setMaskSize(width: number, height: number) {
        if (this.maskBg) {
            let tfm: UITransform = this.maskBg.getComponent(UITransform);
            tfm.width = width;
            tfm.height = height;
        }
    }

    /**
     * 设置货币
     * @param arr 货币列表
     */
    // updateMoney(arr: MoneyType[]) {
    //     let panel = find("MoneyPanel", this.node);
    //     let component = panel.getComponent(MoneyPanel);
    //     if (component) {
    //         component.updateShowList(arr);
    //     }
    // }

    protected onDestroy() {
        super.onDestroy()
    }
}