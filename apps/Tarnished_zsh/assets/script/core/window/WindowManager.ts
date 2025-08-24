import { BlockInputEvents, Layers, Node, NodePool, Prefab, Sprite, UITransform, color, instantiate, resources } from "cc";
import { SingtonClass } from "../../util/SingtonClass";
import { ManagerCenter } from "../center/ManagerCenter";
import { isValid } from "cc";
import { CloseMode, LayerType, ViewState } from "../Define";
import { WindowCtrl } from "./WindowCtrl";
import { ArrayUtil } from "../../util/ArrayUtil";
import { TimeUtil } from "../../util/TimeUtil";
import { GUtil } from "../../util/GUtil";
import Util from "../../util/Util";
import ModuleReg from "./config/ModuleReg";
import { NotifyConst } from "../NotifyConst";

/** 窗口管理器 */
export class WindowManager extends SingtonClass {

    /**缓存时间(单位：秒) */
    readonly cacheTime: number = 1;

    /**当前已打开显示的窗口列表 */
    private openWinList: WindowCtrl<any>[] = [];

    /**当前正在打开的窗口列表 */
    private openingWinList: WindowCtrl<any>[] = [];

    /**缓存窗口列表(key为窗口名，value为关闭时间) */
    private cacheWinList: WindowCtrl<any>[] = [];

    /**记录需要关闭的正在打开的窗口名 */
    public delayCloseWinNameList: string[] = [];

    private maskBgPool: NodePool;

    /**转圈圈UI */
    // private m_loadingMask: LoadingMask = null;
    private m_loadingMaskTags: string[] = [];

    /**按钮cd列表 */
    private m_btnCdList = [];

    constructor() {
        super();
        if (!this.maskBgPool) {
            this.maskBgPool = new NodePool();
        }
        ManagerCenter.eventCenter.on(NotifyConst.GAME_CLOSE_ALLWIN, this.closeAllWin, this);
        ManagerCenter.eventCenter.on(NotifyConst.GAME_DESTROY_ALLWIN, this.destroyAllWin, this);
        GUtil.GSchedule(this.cacheTime, 0, -1, this.checkDelayDestroy, this);
    }

    /**
     * 打开界面
     * @param winName 界面名 ModuleReg.xxxWindow
     * @param data 传递数据
     * @param index 
     * @returns 
     */
    openWindow(winName: string, data?: any, index?: number): WindowCtrl<any> {
        // if (isOpenModule(winName))//功能是否开启
        //     return
        ArrayUtil.remove(this.delayCloseWinNameList, winName);
        let win = this.getWin(winName, true);
        if (!win) return

        if (win.state == ViewState.loaded) {
            ArrayUtil.add(this.openWinList, win);
            win.show(data, index);
        }
        else if (win.state == ViewState.init) {
            this.openingWinList.push(win);
            win.show(data, index);
        }
        return win
    }

    /**
     * 关闭界面
     * @param winName 界面名
     * @returns 
     */
    closeWindow(winName: string) {
        let win = this.getWin(winName);
        if (!win) return
        if (win.state != ViewState.loaded) {
            ArrayUtil.add(this.delayCloseWinNameList, winName);
            return
        }
        win.close();
        ManagerCenter.eventCenter.emit(NotifyConst.GAME_WIN_CLOSE, winName);
    }

    /**
     * 关闭所有界面
     * @param excludeWinNames 不关闭的界面列表
     */
    closeAllWin(excludeWinNames?: string[]) {
        excludeWinNames = excludeWinNames ? excludeWinNames : []
        for (let i = this.openWinList.length - 1; i >= 0; i--) {
            if (this.openWinList[i] == null) continue
            if (excludeWinNames.indexOf(this.openWinList[i].winName) == -1)
                this.openWinList[i].close();
        }

        this.delayCloseWinNameList = []
        for (let i = this.openingWinList.length - 1; i >= 0; i--) {
            if (excludeWinNames.indexOf(this.openingWinList[i].winName) == -1)
                this.delayCloseWinNameList.push(this.openingWinList[i].winName);
        }
    }

    /**销毁所有界面 */
    destroyAllWin() {
        for (let i = this.openWinList.length - 1; i >= 0; i--) {
            this.openWinList[i].destroy();
        }
        this.openWinList.length = 0;
        this.cacheWinList.length = 0;

        this.delayCloseWinNameList = [];
        for (let i = this.openingWinList.length - 1; i >= 0; i--) {
            this.delayCloseWinNameList.push(this.openingWinList[i].winName);
        }

        this.destroy();
    }

    /**
     * 更新打开的界面
     * @param winName 界面名
     */
    updateOpeningWin(winName: string) {
        let win = ArrayUtil.getValue(this.openingWinList, "winName", winName, true);
        this.openWinList.push(win);
        //GUtil.GEmit(NotifyConst.GAME_WIN_OPEN, winName);
        // ManagerCenter.audioMgr.Pause()
        GUtil.GScheduleOnce(this.cacheTime, () => {
            if (ArrayUtil.remove(this.delayCloseWinNameList, winName)) {
                this.closeWindow(winName);
            }
        }, this);
    }

    /**关闭层级所有窗口 */
    closeLayerAllWin(layerType: LayerType = LayerType.PopUp) {
        for (let i = this.openWinList.length - 1; i >= 0; i--) {
            if (this.openWinList[i].layerType == layerType) {
                this.openWinList[i].close();
            }
        }
        this.m_btnCdList = [];
    }

    /**
     * 获取界面控制类
     * @param winName 界面名
     * @param isCreate 是否创建
     * @returns 
     */
    private getWin(winName: string, isCreate: boolean = false): WindowCtrl<any> {
        let win = ArrayUtil.getValue(this.openWinList, "winName", winName);
        if (!win) {
            win = ArrayUtil.getValue(this.openingWinList, "winName", winName);
        }
        if (!win) {
            win = ArrayUtil.getValue(this.cacheWinList, "winName", winName, true);
        }

        if (win == null && isCreate) {
            let winCtrlClass = ModuleReg.getClass(winName);
            if (winCtrlClass == null) {
                console.error("未找到窗体类定义:" + winName);
                return
            }
            win = winCtrlClass;
        }
        return win;
    }


    //每隔1秒检测一次缓存的窗口是否需要销毁
    private checkDelayDestroy() {
        let nowTimer = TimeUtil.nowSeconds;
        for (let i = this.cacheWinList.length - 1; i >= 0; i--) {
            let win = this.cacheWinList[i]
            // GLog("每隔1秒检测一次缓存的窗口是否需要销毁   == ", nowTimer, "   +   ", win.closeTime) 
            if (win.closeMode == CloseMode.Delay && nowTimer >= win.closeTime) {
                win.destroy();
            }
        }
    }

    /**
     * 移除window
     * @param win对象 
     * @param isCache 是否缓存
     */
    removeWin(win: WindowCtrl<any>, isCache: boolean) {
        ArrayUtil.remove(this.openWinList, win);
        if (isCache) {
            ArrayUtil.add(this.cacheWinList, win)
        }
    }

    /**
     * 销毁winodw
     * @param win对象
     */
    destroyWin(win: WindowCtrl<any>) {
        ManagerCenter.eventCenter.emit(NotifyConst.GAME_WIN_CLOSE, win.winName);
        ArrayUtil.remove(this.openWinList, win);
        ArrayUtil.remove(this.cacheWinList, win);
    }


    /**
     * 界面是否打开
     * @param winName 
     * @returns boolean
     */
    isShowWin(winName: string) {
        let win = this.getWin(winName)
        if (win && win.isShow())
            return true
        return false
    }

    //显示遮罩
    public showMaskBg(win: WindowCtrl<any>) {
        if (win.view == null || win.maskBg)
            return
        win.maskBg = this.popMaskBg();
        let alpha = win.alpha;
        let spr: Sprite = win.maskBg.getComponent(Sprite);
        GUtil.GSetAtlas(spr, "commonAtlas", "com_black");
        win.maskBg.getComponent(Sprite).color = color(255, 255, 255, alpha)
        win.node.insertChild(win.maskBg, 0);
        if (win.bClickMask) {
            Util.GAddClick(win.maskBg, win.close, win);
        }
    }

    //关闭遮罩
    public hideMaskBg(win: WindowCtrl<any>) {
        if (win.maskBg) {
            GUtil.GRemoveClick(win.maskBg, win.close, win)
            // win.maskBg.off(NodeEventType.MOUSE_UP, win.close, win);
            win.maskBg.removeFromParent()
            this.pushMaskBg(win.maskBg);
            win.maskBg = null
        }
    }

    //放入对象池
    public pushMaskBg(maskBg: Node) {
        this.maskBgPool.put(maskBg);
    }

    //从对象池拿出遮罩
    private popMaskBg(): Node {
        let maskBg: Node = this.maskBgPool.get()
        if (maskBg == null) {
            maskBg = new Node();
            maskBg.layer = Layers.Enum.UI_2D;

            maskBg.addComponent(Sprite);
            let spr: Sprite = maskBg.getComponent(Sprite);
            if (spr) {
                spr.type = Sprite.Type.SLICED;
                spr.sizeMode = Sprite.SizeMode.CUSTOM;
                GUtil.GSetAtlas(spr, "commonAtlas", "com_black", () => {
                    let tfm: UITransform = maskBg.getComponent(UITransform);
                    tfm.setContentSize(30000, 30000);
                    maskBg.name = "maskBg";
                })

            }
            maskBg.addComponent(BlockInputEvents);
        }
        return maskBg;
    }

    destroy() {
        if (!this.maskBgPool) {
            this.maskBgPool.clear();
        }
    }

    /**
     * 显示loading遮挡
     * @param tag 标识字符串，确保和show和hide一致
     * @param circleDelay 
     */
    // showLoadingMask(tag: string, circleDelay: number = 0) {
    //     // GLog("showLoadingMask," + tag, this.m_loadingMaskTags);
    //     ArrayUtil.add(this.m_loadingMaskTags, tag);
    //     if (this.m_loadingMask == null) {
    //         resources.load("prefab/ui/loadingmask", Prefab, (err, prefab) => {
    //             if (this.m_loadingMask == null) {
    //                 var newNode = instantiate(prefab);
    //                 ManagerCenter.layerMgr.addChild(LayerType.Tips, newNode);
    //                 this.m_loadingMask = newNode.getComponent(LoadingMask);
    //             }
    //             if (this.m_loadingMaskTags.length > 0) {
    //                 this.m_loadingMask.show(circleDelay);
    //             } else {
    //                 this.m_loadingMask.hide();
    //             }
    //         });
    //     } else {
    //         this.m_loadingMask.show(circleDelay);
    //     }
    // }

    /**
     * 隐藏loading遮挡
     * @param tag 标识字符串，确保和show和hide一致
     */
    // hideLoadingMask(tag: string) {
    //     // GLog("hideLoadingMask," + tag);/
    //     ArrayUtil.remove(this.m_loadingMaskTags, tag);
    //     if (this.m_loadingMaskTags.length <= 0) {
    //         if (this.m_loadingMask != null) {
    //             this.m_loadingMask.hide();
    //         }
    //     }
    // }

    /**
     * 按钮是否冷却中
     * @param node 按钮node
     * @returns 
     */
    isBtnInCd(node: Node, func, thisObject) {
        let btn = this.m_btnCdList.find((item) => (item.node == node && item.func == func && item.thisObject == thisObject));
        if (btn) {
            let inCd = TimeUtil.now - btn.time < 200;
            if (inCd) {
                // GUtil.GLog("button in cd," + node.name);
            }
            return inCd;
        }

        return false;
    }

    /**
     * 按钮进入cd
     * @param node 按钮node
     */
    setBtnInCd(node: Node, func, thisObject) {
        let btn = this.m_btnCdList.find((item) => (item.node == node && item.func == func && item.thisObject == thisObject));
        if (btn) {
            btn.time = TimeUtil.now;
        } else {
            this.m_btnCdList.push({
                node: node,
                func : func,
                thisObject : thisObject,
                time: TimeUtil.now
            });
        }

        //移除已销毁的按钮
        for (let i = this.m_btnCdList.length - 1; i >= 0; i--) {
            let item = this.m_btnCdList[i];
            if (!isValid(item.node)) {
                this.m_btnCdList.splice(i, 1);
            }
        }     
    }
}