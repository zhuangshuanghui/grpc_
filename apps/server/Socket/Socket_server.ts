import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { readFileSync } from "fs";
import protobuf from "protobufjs";

// --------------- 1. 初始化 HTTP 和 Socket.IO 服务器 ---------------
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*", // 允许所有跨域请求（生产环境需指定具体域名）
  },
});

// --------------- 2. 定义 Protobuf 协议（示例） ---------------
// 创建协议文件（如 `protocols/game.proto`）
const protoDefinition = `
syntax = "proto3";

message PlayerMove {
  float x = 1;
  float y = 2;
}

message PlayerAttack {
  int32 skill_id = 1;
  int32 target_id = 2;
}
`;

// 加载 Protobuf 协议
const root = protobuf.parse(protoDefinition).root;
const PlayerMove = root.lookupType("PlayerMove");
const PlayerAttack = root.lookupType("PlayerAttack");

// --------------- 3. 核心逻辑：处理客户端连接 ---------------
io.on("connection", (socket: Socket) => {
  console.log(`[连接] 客户端已连接: ${socket.id}`);

  // --------------- 3.1 基础事件监听 ---------------
  // 心跳检测（客户端需定时发送 `ping` 事件）
  socket.on("ping", () => {
    socket.emit("pong", Date.now());
  });

  // 接收普通 JSON 消息
  socket.on("chat", (message: string) => {
    console.log(`[聊天] ${socket.id}: ${message}`);
    io.emit("chat", { sender: socket.id, message }); // 广播给所有人
  });

  // --------------- 3.2 房间管理 ---------------
  // 加入房间
  socket.on("joinRoom", (roomId: string) => {
    socket.join(roomId);
    console.log(`[房间] ${socket.id} 加入房间 ${roomId}`);
    io.to(roomId).emit("roomMessage", `${socket.id} 进入了房间`);
  });

  // 离开房间
  socket.on("leaveRoom", (roomId: string) => {
    socket.leave(roomId);
    console.log(`[房间] ${socket.id} 离开房间 ${roomId}`);
  });

  socket.on("zsh_test", (message:string) => {
    console.log(`zsh_test: ${message}`);

    socket.emit("ask_question", "What's your name?", (answer:string) => {
      console.log (`客户端回复: ${answer}`);
    });
  });
  // --------------- 3.3 二进制消息（Protobuf）处理 ---------------
  // 接收 Protobuf 编码的玩家移动数据
  // socket.on("playerMoveBinary", (buffer: Buffer) => {
  //   try {
  //     const decoded = PlayerMove.decode(buffer);
  //     console.log(`[移动] ${socket.id}: x=${decoded.x}, y=${decoded.y}`);

  //     // 广播给同房间的其他玩家
  //     socket.broadcast.emit("playerMoved", {
  //       playerId: socket.id,
  //       x: decoded.x,
  //       y: decoded.y,
  //     });
  //   } catch (err) {
  //     console.error("解码失败:", err);
  //   }
  // });

  // --------------- 3.4 断开连接处理 ---------------
  socket.on("disconnect", () => {
    console.log(`[断开] 客户端断开: ${socket.id}`);
    // 清理玩家数据（如从房间移除）
  });
});

// --------------- 4. 启动服务器 ---------------
const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO 服务器运行在 http://localhost:${PORT}`);
});