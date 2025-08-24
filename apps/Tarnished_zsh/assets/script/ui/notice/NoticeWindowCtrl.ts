import { ManagerCenter } from "../../core/center/ManagerCenter";
import { WindowCtrl } from "../../core/window/WindowCtrl";
import ModuleReg from "../../core/window/config/ModuleReg";
import Util from "../../util/Util";
import { NoticeWindow } from "./NoticeWindow";


/**冒险界面 */
export class NoticeWindowCtrl extends WindowCtrl<NoticeWindow> {

    constructor() {
        super(ModuleReg.NoticeWindow);
    }

    //初始化数据,只会在创建的时候执行一次
    onInit(): void {
        super.onInit();
        Util.GAddClick(this.view.ButtonEx1, this.onBtnClick, this);
        console.log("NoticeWindowCtrlonInit");

    }

    /**展示界面信息，每次打开界面都会执行一次 */
    onShow(): void {
        super.onShow();
        console.log("NoticeWindowCtrlonShow");
    }

    /**回调更新 */
    updateSelect(index): void {
    }

    onBtnClick() {
        ManagerCenter.windowMgr.closeWindow(ModuleReg.NoticeWindow)
        console.log("关闭界面");
        
    }

    destroy(): void {
        super.destroy()
    }
}




