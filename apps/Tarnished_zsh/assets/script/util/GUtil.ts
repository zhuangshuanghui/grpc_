import { Node, NodeEventType, Sprite, instantiate, isValid, sys } from 'cc';
import { ManagerCenter } from '../core/center/ManagerCenter';
export class GUtil {
    static init() {
        window["GOpenWindow"] = this.GOpenWindow
    }

    /**
    * 打开界面
    * @param winName window名字 ModuleReg.xxxWindow
    * @param data 传递数据
    * @returns 
    */
    static GOpenWindow(winName: string, data?: any) {
        return ManagerCenter.windowMgr.openWindow(winName, data);
    }


    /**
 * 移除所有点击事件
 * @param component 组件对象
 * @param thisObject 作用域对象
 */
    static GRemoveAllClick(component: any, thisObject: any) {
        if (component == null) {
            console.error("添加的组件对象为空")
            return;
        }
        let node: Node = component.node;
        if (!node) {
            node = component;
        }
        node.targetOff(thisObject);
    }


    /**
* 移除点击事件
* @param component 组件对象
* @param func 回调事件
* @param thisObject 作用域对象
*/
    static GRemoveClick(component: any, func: Function, thisObject: any) {
        let node: Node = component.node;
        if (!node) {
            node = component;
        }
        node.off(NodeEventType.TOUCH_END, func, thisObject);
    }


    /**
     * 开始一个计时器
     * @param interval 间隔
     * @param startdelay 延迟
     * @param repeat 重复次数（-1，无限重复，0，执行一次，n = n+1次）
     * @param func 回调
     * @param listenerObj 作用域
     * @returns timer对象
    */
    static GSchedule(interval: number, startdelay: number, repeat: number, func: any, listenerObj?: any, ...param: any[]) {
        return ManagerCenter.timeMgr.schedule(interval, startdelay, repeat, func, listenerObj, param);
    }

    /**
     * 开始一个只执行一次的计时器
     * @param delay 延迟时间
     * @param func 回调函数
     * @param func 作用域
     * @returns timer对象
     */
    static GScheduleOnce(delay: number, func: any, listenerObj?: any) {
        return ManagerCenter.timeMgr.scheduleOnce(delay, func, listenerObj);
    }



    /**
 * 设置图集资源
 * @param atlasname 图集名 
 * @param spritename 图标名
 */
    static GSetAtlas(obj: Sprite, atlasname: string, spritename: string, func?: Function, listenerObj?: any) {
        ManagerCenter.bundleMgr.loadSprite(atlasname, spritename, (sprite) => {
            if (isValid(obj) && isValid(obj.node)) {
                obj.spriteFrame = sprite;
                if (func) {
                    if (listenerObj) {
                        func.call(listenerObj);
                    } else {
                        func();
                    }
                }
            }
        });
    }





}