import { _decorator, Component, Node, EditBox, director } from "cc";
import NetworkManager from "../global/NetworkManager";
const { ccclass, property } = _decorator;
import JSCrypto from "jsencrypt";
import { RpcFunc, PublicKey } from "../common";
import DataManager from "../global/DataManager";

const crypt = new JSCrypto();
crypt.setKey(PublicKey);

@ccclass("LoginManager")
export class LoginManager extends Component {
  accountEditBox: EditBox;
  passwordEditBox: EditBox;

  onLoad() {
    this.accountEditBox = this.node.getChildByName("Username").getComponent(EditBox);
    this.passwordEditBox = this.node.getChildByName("Password").getComponent(EditBox);
  }

  async register() {
    if (!this.accountEditBox.string || !this.passwordEditBox.string) {
      console.log("请输入用户名密码");
      return;
    }

    const account = crypt.encrypt(this.accountEditBox.string);
    const password = crypt.encrypt(this.passwordEditBox.string);

    if (!account || !password) {
      console.log("用户名密码加密失败");
      return;
    }

    const params = {
      account,
      password,
    };

    const res = await fetch("http://localhost:3000/register", {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
    console.log("注册结果", res);
  }

  async login() {
    if (!this.accountEditBox.string || !this.passwordEditBox.string) {
      console.log("请输入用户名密码");
      return;
    }

    const account = crypt.encrypt(this.accountEditBox.string);
    const password = crypt.encrypt(this.passwordEditBox.string);

    if (!account || !password) {
      console.log("用户名密码加密失败");
      return;
    }

    const params = {
      account,
      password,
    };

    const { code, data, message } = await fetch("http://localhost:3000/login", {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    console.log("code", code, data, message);

    if (code === 0) {
      // 登录成功，连接游戏服务器
      console.log(data.token);
      await this.connect(data.token);
    } else {
      console.log(message);
    }
  }

  async connect(token: string) {
    await NetworkManager.Instance.connect();
    const { data, error } = await NetworkManager.Instance.call(RpcFunc.enterGame, {
      token,
    });

    if (error) {
      console.log(error);
      NetworkManager.Instance.close();
      return;
    }

    DataManager.Instance.account = data.account;
    director.loadScene("ActorList");
  }
}
