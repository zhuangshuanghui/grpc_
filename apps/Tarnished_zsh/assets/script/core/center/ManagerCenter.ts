import { TimeManager } from "../../util/TimerManager";
import { BundleManager } from "../loader/BundleManager";
import { ConfigManager } from "../manager/ConfigManager";
import { I18nManager } from "../manager/I18nManager";
import { ProxyManager } from "../net/ProxyManager";
import { SocketManager } from "../net/SocketManager";
import { LayerManager } from "../window/LayerManager";
import { WindowManager } from "../window/WindowManager";
import { DataCenter } from "./DataCenter";
import { EventCenter } from "./EventCenter";

/**
 * Manager管理中心,负责提供统一的框架访问接口
 */
export class ManagerCenter {
    /** 界面层级管理 */
    static layerMgr: LayerManager;

    static eventCenter = new EventCenter()


    static get bundleMgr(): BundleManager {
        return BundleManager.getInstance()
    }

    /** 窗口管理器 */
    static get windowMgr(): WindowManager {
        return WindowManager.getInstance();
    }


    static get eventMgr(): EventCenter {
        return ManagerCenter.eventCenter
    }

    /** 计时管理器 */
    static get timeMgr(): TimeManager {
        return TimeManager.getInstance();
    }

    /** 配置管理器 */
    static get configMgr(): ConfigManager {
        return ConfigManager.getInstance();
    }

    /** 语言文本管理器 */
    static get i18nMgr(): I18nManager {
        return I18nManager.getInstance();
    };

    /** socket管理器 */
    static get socketManager(): SocketManager {
        return SocketManager.getInstance();
    };
    /**通用协议管理类*/
    static get proxyManager(): ProxyManager {
        return ProxyManager.getInstance();
    };

    // static get dataCenter(): DataCenter {
    //     return DataCenter.getInstance();
    // };
}