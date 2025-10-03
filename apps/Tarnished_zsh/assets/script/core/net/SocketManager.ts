// import { io, Socket } from "../../../libs/socket.io.js";

// const { io, Socket } = require("socket.io-client");
export class SocketManager {
    private socket: Socket;

    constructor() {
        // 连接到服务器（替换为你的服务器地址）
        this.socket = io("http://localhost:3000", {
            transports: ["websocket"], // 强制使用 WebSocket（避免长轮询）
            reconnection: true,       // 启用自动重连
            reconnectionAttempts: 5,  // 最大重试次数
            reconnectionDelay: 1000,  // 重连延迟（毫秒）
        });
        
        this.setupEventListeners();
    }

    private setupEventListeners() {
        // 监听基础事件
        this.socket.on("connect", () => {
            console.log("Connected to server, Socket ID:", this.socket.id);
        });
        // 断开连接事件
        this.socket.on("disconnect", (reason) => {
            console.log("Disconnected:", reason);
        });
        // 错误处理
        this.socket.on("connect_error", (error) => {
            console.error("Connection error:", error);
        });

        this.socket.on("ping", () => {
            console.log("ping包");
        });
        this.socket.emit("zsh_test","传")

        this.socket.on("ask_question", () => {
            this.socket.emit("zsh_test","传")
        });
    }
}

