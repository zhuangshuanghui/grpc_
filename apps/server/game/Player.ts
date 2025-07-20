import { Actor } from "./Actor";

export class Player {
  // 初次进入场景时为curActorId赋值
  curActorId: number;
  constructor(public account: string, public actors: Actor[]) {}

  getActor(actorId: number = this.curActorId) {
    const actor = this.actors.find((e) => e.id === actorId);

    if (actor) {
      return actor;
    } else {
      throw new Error("no actor");
    }
  }
}
