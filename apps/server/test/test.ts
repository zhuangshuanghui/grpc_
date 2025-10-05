
import { PlayerMove } from "../gen/game_pb";
import { ProtoUtils } from "./ProtoUtils";
// let  playerMove=new PlayerMove()
// playerMove.x=100
// playerMove.y=100
// let unit8=PlayerMove.encode(playerMove).finish()
// console.log(PlayerMove.encode(playerMove).finish());
// console.log(PlayerMove.decode(unit8));



// 1. 创建符合类型的数据
// const playerData: playerMessage.IPlayerData = {
//     name: "Archer",
//     level: 12,
//     health: 100
// };


let playerMove = new PlayerMove({ 
    x: 100, 
    y: 200 
});
// playerMove=

// 2. 序列化（自动类型检查）
const buffer = ProtoUtils.serialize(PlayerMove, playerMove);
console.log(PlayerMove); // 有完整的类型提示

// 3. 反序列化（自动推断返回类型）
const player = ProtoUtils.deserialize(PlayerMove, buffer);
console.log(player); // 有完整的类型提示


