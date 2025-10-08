// import { PlayerInfo, PlayerMove } from "../3rd/gen/game_pb";

/*  定义自定义事件类型 */
export interface ServerToClientEvents {
    "chat message": (msg: Uint8Array) => void;
    "player joined": (playerId: Uint8Array) => void;
    // "ping": () => void;
    // "pong": () => void;
    "message": (data: Uint8Array) => void;
    "zsh_test":(data:Uint8Array)=>void
    // 添加其他事件...
}