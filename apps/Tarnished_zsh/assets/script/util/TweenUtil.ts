import { Node, Sprite, UIOpacity, Vec3, color, tween } from "cc";
import { Tween } from "cc";
import { VectorUtil } from "./VectorUtil";

export class TweenUtil {

    /**贝塞尔曲线移动 */
    static bezierCurveMove(node, middlePos, endPos, duration, endCb?) {
        let startPos = node.position;
        tween(node.position)
            .to(duration, endPos, {
                onUpdate: (target: Vec3, ratio: number) => {
                    node.position = VectorUtil.bezierPos(ratio, startPos, middlePos, endPos);
                }
            })
            .call(() => {
                if (endCb) {
                    endCb();
                }
            })
            .start();
    }

    /**直线运动 */
    static moveTween(node, endPos: Vec3, duration: number, delay = 0, easingType?, endCb?, listenerObj?: any) {
        tween(node)
            .delay(delay)
            .to(duration, { position: endPos, easing: (easingType || "linear") })
            .call(() => {
                if (listenerObj) {
                    if (endCb) {
                        endCb.call(listenerObj);
                    }
                } else {
                    if (endCb) {
                        endCb();
                    }
                }
            })
            .start();
    }

    /**旋转 */
    static rotateTween(node, endAngle: Vec3, duration, endCb?, listenerObj?: any) {
        let angle = node.eulerAngles;
        tween(node)
            .to(duration, { eulerAngles: new Vec3(angle.x + endAngle.x, angle.y + endAngle.y, angle.z + endAngle.z) })
            .call(() => {
                if (listenerObj) {
                    if (endCb) {
                        endCb.call(listenerObj);
                    }
                } else {
                    if (endCb) {
                        endCb();
                    }
                }
            })
            .start()
    }

    /**缩放 */
    static scaleTween(node, startScale, endScale, duration, delay = 0, endCb?) {
        if (startScale) {
            node.scale = startScale;
        }
        tween(node)
            .to(duration, { scale: endScale })
            .call(endCb)
            .delay(delay)
            .start()
    }

    /**透明度缓动 */
    static alphaTween(node, targetAlpha, duration, delay = 0, endCb?, listenerObj?: any) {
        let uIOpacity = node.getComponent(UIOpacity);
        tween(uIOpacity)
            .delay(delay)
            .to(duration, { opacity: targetAlpha })
            .call(endCb.call(listenerObj)).start();
    }

    /**上浮缓动 */
    static floatingTween(node, offsetY, duration, delay = 0, endCb?, listenerObj?: any) {
        let startPos = node.position;
        let targetPos = new Vec3(startPos.x, startPos.y + offsetY, startPos.z);
        tween(node)
            .delay(delay)
            .to(duration, { position: targetPos })
            .call(endCb.call(listenerObj)).start();
    }

    /**
     * 闪烁（透明度反复渐变）
     * @param node 节点
     * @param duration 出现持续时间 
     * @param duration1 消失持续时间
     * @param endCb 回调
     * @param listenerObj 作用域
     */
    static flickerTween(node: Node, duration = 0.5, duration1 = 0.5, delay = 0, endCb?, listenerObj?: any) {
        let uIOpacity = node.getComponent(UIOpacity);
        tween(uIOpacity).delay(delay).to(duration, { opacity: 0 }).to(duration1, { opacity: 255 }).union().repeatForever()
            .call(() => {
                if (listenerObj) {
                    if (endCb) {
                        endCb.call(listenerObj);
                    }
                } else {
                    if (endCb) {
                        endCb();
                    }
                }
            })
            .start()
    }

    /**
     * 渐隐
     * @param node 节点
     * @param param param = { delay: 0, targetPos: new Vec3(0, 0, 0), duration: 1 }; 
     * @param param1 param = { delay: 0, opacity: 0, duration: 1 }; 
     * @param endCb 回调
     * @param listenerObj 作用域
     */
    static gradualHideTween(node: Node, param, param1, endCb?, listenerObj?: any) {
        let uIOpacity = node.getComponent(UIOpacity);
        uIOpacity.opacity = 255;

        tween(node)
            .delay(param.delay)
            .to(param.duration, { position: param.targetPos })
            .start();
        tween(uIOpacity)
            .delay(param1.delay)
            .to(param1.duration, { opacity: param1.opacity })
            .call(endCb.call(listenerObj)).start();
    }

    /**
     * 渐显
     * @param node 节点
     * @param param param = { delay: 0, targetPos: new Vec3(0, 0, 0), duration: 1 }; 
     * @param param1 param = { delay: 0, opacity: 255, duration: 1 }; 
     * @param endCb 回调
     * @param listenerObj 作用域
     */
    static gradualShowTween(node: Node, param, param1, endCb?, listenerObj?: any) {
        let uIOpacity = node.getComponent(UIOpacity);
        uIOpacity.opacity = 0;

        tween(node)
            .delay(param.delay)
            .to(param.duration, { position: param.targetPos })
            .start();
        tween(uIOpacity)
            .delay(param1.delay)
            .to(param1.duration, { opacity: param1.opacity })
            .call(endCb.call(listenerObj)).start();
    }






















    /** 透明动画*/
    static alphaNodeAnim(node: Node) {
        let ui: UIOpacity = node.getComponent(UIOpacity)
        // let time: number = GGetConfigData("funcTween", 4).time1;
        let time=4000
        ui.opacity = 0
        tween(ui).to(time, { opacity: 255 }).start()
    }

    /** 翻页动画 */
    static flipNodeAnim(node: Node) {
        let allChild: Node[] = node.children
        // let time: number = GGetConfigData("funcTween", 3).time1
        
        let time=4000
        node.scale = new Vec3(0.4, 1, 1)
        tween(node).to(time, { scale: new Vec3(1, 1, 1) }).start()
    }

    /** 打开界面缩放动画 */
    static scaleNodeAnim(node: Node) {
        node.setScale(0.6, 0.6, 0.6)
        // let time: number = GGetConfigData("funcTween", 2).time1
        
        let time=4000
        tween(node).to(time, { scale: new Vec3(1, 1, 1) }).start()
    }

    /** 停止所有指定对象的缓动*/
    static stopTween(node) {
        Tween.stopAllByTarget(node);
    }
}