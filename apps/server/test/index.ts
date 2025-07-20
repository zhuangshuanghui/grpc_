import axios from "axios";
import { PublicKey, RpcFunc, ServerPort } from "../common";
// @ts-ignore
import JSCrypto from "node-jsencrypt";
import NetworkManager from "./NetworkManager";

const crypt = new JSCrypto();
crypt.setKey(PublicKey);

const password = crypt.encrypt("123456");

const start = async (account: string) => {
  // 加密账号
  account = crypt.encrypt(account);

  // 创建networkManager
  const networkManager = new NetworkManager();

  // 注册
  const { data: dataRegister } = await axios.post(`http://localhost:${ServerPort.AuthHttp}/register`, {
    account,
    password,
  });
  console.log("register", dataRegister);

  // 登录
  const { data: dataLogin } = await axios.post(`http://localhost:${ServerPort.AuthHttp}/login`, {
    account,
    password,
  });
  console.log("login", dataLogin);
  const token = dataLogin.data.token;

  // 连接服务
  await networkManager.connect().catch(console.error);

  // 进入游戏
  const enterGameRes = await networkManager.call(RpcFunc.enterGame, {
    token,
  });
  console.log("enterGameRes", enterGameRes);
  const id = enterGameRes.data.account;
  const nickname = `角色1${id}`;

  // 获取角色
  const { data: data1, error: error1 } = await networkManager.call(RpcFunc.listActor, {});
  if (error1) {
    console.log("listActor", error1);
    return;
  }
  console.log("listActor", data1);

  let actorId = data1.actors?.[0]?.id;
  if (!actorId) {
    // 创建角色
    await networkManager.call(RpcFunc.createActor, { nickname });

    // 重新获取
    const { data: data1, error: error1 } = await networkManager.call(RpcFunc.listActor, {});
    if (error1) {
      console.log("listActor", error1);
      return;
    }
    console.log("listActor", data1);

    actorId = data1.actors[0].id;
  }

  // 进入场景
  await networkManager.call(RpcFunc.enterScene, { actorId });

  // 监听状态
  networkManager.listen(RpcFunc.stateFromServer, (data) => {}, null);

  let index = 0;

  // 递归发送操作，请自行调整发送频率
  const input = async () => {
    await new Promise((rs) => setTimeout(rs, 200));
    let directionX = 0;
    let directionY = 0;
    switch (index % 4) {
      case 0:
        directionX = 1;
        directionY = 0;
        break;
      case 1:
        directionX = 0;
        directionY = 1;
        break;
      case 2:
        directionX = -1;
        directionY = 0;
        break;
      case 3:
        directionX = 0;
        directionY = -1;
        break;
      default:
        break;
    }
    networkManager.send(RpcFunc.inputFromClient, {
      id,
      directionX,
      directionY,
      dt: 0.5,
    });
    index++;
    input();
  };

  input();
};

// 模拟200个用户
const len = 200;
for (let i = 0; i < len; i++) {
  setTimeout(() => {
    start(`a${i}`);
  }, 1000 / len);
}
