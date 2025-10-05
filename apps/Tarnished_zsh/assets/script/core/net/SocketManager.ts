// import { io, Socket } from "socket.io-client";
// import { io, Socket } from "socket.io-client/dist/socket.io.esm.min.js";

import { ClientToServerEvents } from "../common/SocketIoEventDefine_client";
import { ServerToClientEvents } from "../common/SocketIoEventDefine_server";
import { ProtoUtils } from "../../util/ProtoUtils";
// import { PlayerMove } from "../3rd/gen/game_pb";
export class SocketManager {
    private socket: Socket<ServerToClientEvents, ClientToServerEvents>;
    private isManualDisconnect: boolean = false;
    private messageCallbacks: Map<string, (data: any) => void> = new Map(); // 消息回调映射表
    private reconnectAttempts: number = 0; // 当前重连尝试次数
    private readonly maxReconnectAttempts: number = 5; // 最大重连尝试次数

    constructor(url: string = "http://localhost:3000") {
        this.socket= io(url, {
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });
        this.setupEventListeners();
        
    }

    // ================= 基础事件监听 =================
    private setupEventListeners() {
        // 连接成功事件
        this.socket.on("connect", () => {
            this.reconnectAttempts = 0; // 重置重连计数器
            console.log("你的socketID:", this.socket.id);
            // this.emitEvent("connect"); // 触发自定义连接事件


            let playerMove2 = { 
                x: 100, 
                y: 200 
            }
            // let playerMove =PlayerMove.create(playerMove2);
            // { 
            //     x: 100, 
            //     y: 200 
            // }
            
            
            // const binaryData =  ProtoUtils.serialize(PlayerMove, playerMove);
            
            // this.socket.emit("zsh_test", binaryData, (response) => {
            //     console.log("服务器返回的数据:", response); // "这是服务器返回的数据"
            //   });

        });

        // 断开连接事件
        this.socket.on("disconnect", (reason) => {
            // if (this.isManualDisconnect) {
            //     console.log("Manual disconnection:", reason);
            // } else {
            //     console.warn("断开连接:", reason);
            //     this.tryAutoReconnect();
            // }
            // this.emitEvent("disconnect", reason); // 触发自定义断开事件
        });

        // 连接错误事件
        this.socket.on("connect_error", (error) => {
            console.error("Connection error:", error);
            this.emitEvent("error", error);
        });

        // 心跳检测（可选）
        this.socket.on("ping", () => {
            console.log("Received ping from server");
            this.socket.emit("pong"); // 自动响应
            // this.socket.emit("")
        });

        // 通用消息监听
        this.socket.on("message", (data: any) => {
            this.handleIncomingMessage(data);
        });

        


    }

    // ================= 消息收发核心方法 =================
    /**
     * 发送消息到服务器
     * @param event 事件名称
     * @param data 发送的数据
     * @param callback 可选的回调函数（用于需要响应的消息）
     */
    public send(event:any, data?: any, callback?: (response: any) => void): void {
        if (!this.socket.connected) {
            console.warn("Socket not connected, message not sent:", event);
            return;
        }
        if (callback) {
            // 如果需要回调，使用Socket.IO的acknowledgement机制
            this.socket.emit(event, data, callback);
        } else {
            this.socket.emit(event, data);
        }
    }

    /**
     * 注册消息回调
     * @param event 事件名称
     * @param callback 回调函数
     */
    public onMessage(event: string, callback: (data: any) => void): void {
        this.messageCallbacks.set(event, callback);
    }

    /**
     * 移除消息回调
     * @param event 事件名称
     */
    public offMessage(event: string): void {
        this.messageCallbacks.delete(event);
    }

    /**
     * 处理收到的消息
     * @param data 消息数据（建议格式：{ event: string, payload: any }）
     */
    // {
    //     "event": "消息类型",
    //     "payload": { /* 实际数据 */ }
    //   }
    private handleIncomingMessage(data: any): void {
        try {
            // 假设服务器发送的消息格式为 { event: 'xxx', payload: {...} }
            const event = data.event;
            const payload = data.payload;

            if (event && this.messageCallbacks.has(event)) {
                const callback = this.messageCallbacks.get(event)!;
                callback(payload);
            }
        } catch (error) {
            console.error("Message handling error:", error);
        }
    }

    // ================= 连接管理 =================
    public disconnect(reason?: string): void {
        if (this.socket && this.socket.connected) {
            this.isManualDisconnect = true;
            console.log(`Manual disconnecting... ${reason || ''}`.trim());
            this.socket.disconnect();
        }
    }

    public reconnect(force: boolean = false): boolean {
        if (this.socket && (force || this.socket.disconnected)) {
            if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                console.warn("Max reconnection attempts reached");
                return false;
            }

            this.isManualDisconnect = false;
            this.reconnectAttempts++;
            console.log(`Reconnecting (attempt ${this.reconnectAttempts})...`);

            this.socket.connect();
            return true;
        }
        return false;
    }

    private tryAutoReconnect(): void {
        if (!this.isManualDisconnect && this.socket.disconnected) {
            const delay = Math.min(3000 * this.reconnectAttempts, 15000); // 指数退避，最大15秒
            console.log(`Auto reconnecting in ${delay}ms...`);

            setTimeout(() => {
                if (!this.isManualDisconnect) {
                    this.reconnect();
                }
            }, delay);
        }
    }

    // ================= 状态检查 =================
    /**
     * 检查是否已连接
     */
    public isConnected(): boolean {
        return this.socket?.connected || false;
    }

    /**
     * 获取当前Socket ID
     */
    public getSocketId(): string | null {
        return this.socket?.id || null;
    }

    // ================= 资源管理 =================
    public destroy(): void {
        if (this.socket) {
            // 移除所有监听器
            this.socket.removeAllListeners();
            this.messageCallbacks.clear();

            if (this.socket.connected) {
                this.socket.disconnect();
            }

            this.socket = null as any;
            this.isManualDisconnect = false;
        }
    }

    // ================= 事件派发（内部使用） =================
    private eventListeners: Map<string, Function[]> = new Map();

    /**
     * 注册事件监听
     * @param event 事件名称（'connect' | 'disconnect' | 'error'）
     * @param listener 监听函数
     */
    public onEvent(event: string, listener: Function): void {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event)!.push(listener);
    }

    /**
     * 移除事件监听
     * @param event 事件名称
     * @param listener 要移除的监听函数（不传则移除所有）
     */
    public offEvent(event: string, listener?: Function): void {
        if (!this.eventListeners.has(event)) return;

        if (listener) {
            const listeners = this.eventListeners.get(event)!;
            const index = listeners.indexOf(listener);
            if (index > -1) listeners.splice(index, 1);
        } else {
            this.eventListeners.delete(event);
        }
    }

    /**
     * 触发事件（内部使用）
     */
    private emitEvent(event: string, ...args: any[]): void {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event)!.forEach(listener => {
                try {
                    listener(...args);
                } catch (error) {
                    console.error(`Event listener error (${event}):`, error);
                }
            });
        }
    }
}