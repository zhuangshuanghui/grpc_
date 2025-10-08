// proto-helper.ts
import * as game_pb from './game_pb.js';
import * as test_pb from './test_pb.js';


/* 
proto结构全部在这取
其他地方使用
import { game } from './proto-helper';
const move = game.PlayerMove.create({ x: 100, y: 200 });  
*/
export const game_proto: typeof game_pb.game = game_pb.default.game ;
export const test_proto: typeof test_pb.test = test_pb.default.test ;
