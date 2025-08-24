import { _decorator, Component, Node } from 'cc';
import { WindowCtrl } from '../../core/window/WindowCtrl';
import { LoginWindow } from './LoginWindow';
import ModuleReg from '../../core/window/config/ModuleReg';
import Util from '../../util/Util';
import { ButtonEx } from '../common/ButtonEx';
const { ccclass, property } = _decorator;

@ccclass('LoginWindowCtrl')
export class LoginWindowCtrl extends WindowCtrl<LoginWindow> {

    constructor() {
        super(ModuleReg.LoginWindow);
    }
    start() {

    }
    onInit(): void {
        super.onInit();
        console.log("LoginWindowInit");
        Util.GAddClick(this.view.btn1, this.onBtnClick, this);


    }
    onBtnClick() {
        console.log("点击进入游戏");
        
    }
    /**展示界面信息，每次打开界面都会执行一次 */
    onShow(): void {
        super.onShow();
        console.log("loginWindowCtrl");
    }
    destroy(): void {
        super.destroy()
    }
}


