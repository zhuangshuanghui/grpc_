import { Node, NodeEventType, Sprite, instantiate, isValid, sys } from 'cc';
export default class Util {
    /**
         * 添加点击事件（点击抬起触发）
         * @param component 组件对象
         * @param func 回调事件
         * @param thisObject 作用域对象
         */
    static GAddClick(component: any, func: Function, thisObject: any) {
        if (component == null) {
            console.error("添加的组件对象为空")
            return;
        }
        let node: Node = component.node;
        if (!node) {
            node = component;
        }
        node.on(NodeEventType.TOUCH_END, (event) => {
            // if(ManagerCenter.windowMgr.isBtnInCd(node, func, thisObject)) {
            //     return;
            // }
            // ManagerCenter.windowMgr.setBtnInCd(node, func, thisObject);

            func.call(thisObject, event);
            // if (event && event.target && event.target.getComponent(ButtonEx)) {//点击按钮
            //     GPlayeAudio(AudioConst.AUDIO_20001);
            // }

        }, thisObject);

        node.on(NodeEventType.TOUCH_CANCEL, (event) => {
            // if (event && event.target && event.target.getComponent(ButtonEx)) {//点击按钮
            //     GPlayeAudio(AudioConst.AUDIO_20001);
            // }
        }, thisObject);
    }
}