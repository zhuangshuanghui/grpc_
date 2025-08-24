import { _decorator, Component, Node } from 'cc';
import { WindowCtrl } from '../../core/window/WindowCtrl';
import ModuleReg from '../../core/window/config/ModuleReg';
import Util from '../../util/Util';
import { ButtonEx } from '../common/ButtonEx';
import { MainGameWindow } from './MainGameWindow';
const { ccclass, property } = _decorator;

@ccclass('MainGameWindowCtrl')
export class MainGameWindowCtrl extends WindowCtrl<MainGameWindow> {

    constructor() {
        super(ModuleReg.MainGameWindow);
    }
    start() {

    }
    onInit(): void {
        super.onInit();
        console.log("MainGameWindowCtrl");


    }
    onBtnClick() {
        console.log("点击进入游戏");
        
    }
    /**展示界面信息，每次打开界面都会执行一次 */
    onShow(): void {
        super.onShow();
        console.log("MainGameWindowCtrl");
    }
    destroy(): void {
        super.destroy()
    }
}


