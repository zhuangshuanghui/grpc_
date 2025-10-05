// 客户端传服务端事件
export interface ClientToServerEvents  {
    "chat message": (msg: string) => void;
    "player joined": (playerId: string) => void;
    "ping":() => void;
    "pong":() => void;
    "message": (data: any) => void;
    // 添加其他事件...
  }

