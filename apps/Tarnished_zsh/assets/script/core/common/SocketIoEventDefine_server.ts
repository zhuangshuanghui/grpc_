import { PlayerInfo, PlayerMove } from "../3rd/gen/game_pb";

// 定义自定义事件类型
export interface ServerToClientEvents {
    "chat message": (msg: string) => void;
    "player joined": (playerId: string) => void;
    // "ping": () => void;
    // "pong": () => void;
    "message": (data: any) => void;
    "zsh_test":(data:string)=>void
    // 添加其他事件...
}