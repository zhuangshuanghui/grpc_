import { SingtonClass } from "../../util/SingtonClass";
import { ManagerCenter } from "../center/ManagerCenter";
import { SocketManager } from "./SocketManager";

/** Proxy基类：监听、处理协议或事件*/
export class ProxyBase extends SingtonClass {
    socket=ManagerCenter.socketManager.socket_one
    /** 添加事件或协议监听 */
    public init() {
        
    }

    /** 移除监听的事件或协议 */
    public destroy() {
        // GOffAllCaller(this);
    }

    /**
     * 发送API请求
     * @apiname 协议api名
     * @request 请求内容
     * @responsehandler 请求回调
     * @listenerobj 作用域
     * @showLoadingMask 是否显示等待遮罩
     */
    // public sendApi<T extends string & keyof ServiceType['api']>(apiname: T, request: ServiceType['api'][T]["req"], responsehandler: any, listenerobj?: any, showLoadingMask?: boolean): void {
    //     ManagerCenter.netMgr.Call(apiname, request, responsehandler, listenerobj, showLoadingMask);
    // }

    /**
     * 接收Msg数据
     * @msgprotocl 协议msg名
     * @handlermsg 请求回调
     * @listenerobj 请求域
     */
    // public receiveMsg(msgprotocl: any, handlermsg: any, listenerobj: any): void {
    //     ManagerCenter.netMgr.BindProtolMsg(msgprotocl, handlermsg, listenerobj);
    // }

    
    /**请求返回结果 */
    // public resResult(msg: any): boolean {
    //     if (msg.result != 0) { 
    //         ManagerCenter.i18nMgr.showErrorCode(msg.result);
    //         return false;
    //     }
    //     return true;
    // }
}
