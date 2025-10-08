
// 客户端传服务端事件   1.客户端保存解码器  2.服务端发送解码器
export interface ClientToServerEvents  {
    "chat message": (msg: string) => void;
    "player joined": (playerId: string) => void;
    // "ping":() => void;
    // "pong":() => void;
    "message": (data: any) => void;
    "zsh_test":(data:Uint8Array,Function) =>void
    // 添加其他事件...test_proto
    "zsh_test2":(data:Uint8Array,Function) =>void
  }

