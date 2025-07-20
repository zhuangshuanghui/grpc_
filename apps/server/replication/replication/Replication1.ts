import { Scene } from "../../scene/base/Scene";

// 副本的id由父进程创建时传递
const id = Number(process.argv[2]);

export class Replication1 extends Scene {
  id = id;
}

new Replication1().init();
