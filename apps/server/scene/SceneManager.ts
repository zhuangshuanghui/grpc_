import path from "path";
import { Singleton } from "../common/common/base";
import { forkSync } from "./utils";
import { Scene1 } from "./scene/Scene1";
import { Scene2 } from "./scene/Scene2";

export class SceneManager extends Singleton {
  static get Instance() {
    return super.GetInstance<SceneManager>();
  }

  async init() {
    await new Promise((rs) => setTimeout(rs, 1000));
    new Scene1().init();
    new Scene2().init();
    // forkSync(path.resolve(__dirname, "./scene/Scene1.ts"));
    // forkSync(path.resolve(__dirname, "./scene/Scene2.ts"));
  }
}