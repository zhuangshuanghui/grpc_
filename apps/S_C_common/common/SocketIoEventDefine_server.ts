// 定义自定义事件类型
export interface ServerToClientEvents {
    "chat message": (msg: string) => void;
    "player joined": (playerId: string) => void;
    "ping": () => void;
    "pong": () => void;
    "message": (data: any) => void;
    // 添加其他事件...
}