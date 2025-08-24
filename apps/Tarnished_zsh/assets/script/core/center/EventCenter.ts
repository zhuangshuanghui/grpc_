/**
 * 事件消息处理
 */
export class EventCenter {
    /** 监听数组 */
    private listeners = {};

    /** 
     * 注册事件
     * @param name 事件名称
     * @param callback 回调函数
     * @param listenerObj 侦听函数所属对象
     */
    public on(name: string, callback: Function, listenerObj: any) {
        let observers: Observer[] = this.listeners[name];
        if (!observers) {
            observers = [];
            this.listeners[name] = observers;
        }
        let observer = observers.find((item: Observer) => (item.listenerObj == listenerObj && item.callback == callback));
        if(observer == null) {
            observers.push(new Observer(callback, listenerObj));
        }
    }

    /**
     * 发送事件
     * @param name 事件名称
     */
    public emit(name: string, ...args: any[]) {
        let observers: Observer[] = this.listeners[name];[{}]
        if (!observers) return;
        let temp = observers.concat();
        let length = temp.length;
        for (let i = 0; i < length; i++) {
            let observer = temp[i];
            observer.notify(...args);
        }
    }
 
    /**
     * 移除事件
     * @param name 事件名称
     * @param listenerObj 侦听函数所属对象
     */
    public off(name: string, listenerObj: any) {
        let observers: Observer[] = this.listeners[name];
        if (!observers) return;
        let length = observers.length;
        for (let i: number = observers.length - 1; i >= 0; i--) {
            let observer = observers[i];
            if (observer.compar(listenerObj)) {
                observers.splice(i, 1);
                //break;
            }
        }
        if (observers.length == 0) {
            delete this.listeners[name];
        }
    }

    /**
     * 移除某一对象的所有监听
     * @param listenerObj 侦听函数所属对象
     */
    public offAllCaller(listenerObj: any) {
        for (let n in this.listeners) {
            let observers: Observer[] = this.listeners[n]
            if (observers != null) {
                for (let i: number = observers.length - 1; i >= 0; i--) {
                    let observer = observers[i];
                    if (observer.compar(listenerObj)) {
                        observers.splice(i, 1)
                        //break
                    }
                }
                if (observers.length == 0)
                    delete this.listeners[n]
            }
        }
    }
}
 




/**
 * 观察者
 */
class Observer {
    /** 回调函数 */
    public callback: Function = null;
    /** 侦听函数所属对象 */
    public listenerObj: any = null;
 
    constructor(callback: Function, listenerObj: any) {
        let self = this;
        self.callback = callback;
        self.listenerObj = listenerObj;
    }
 
    /**
     * 发送通知
     * @param args 不定参数
     */
    notify(...args: any[]): void {
        let self = this;
        self.callback.call(self.listenerObj, ...args);
    }
 
    /**
     * 侦听函数所属对象比较
     * @param listenerObj 侦听函数所属对象
     */
    compar(listenerObj: any): boolean {
        return listenerObj == this.listenerObj;
    }
}