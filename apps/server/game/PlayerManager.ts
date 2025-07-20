import { Singleton } from "../common/common/base";
import { Actor } from "./Actor";
import { Player } from "./Player";

export class PlayerManager extends Singleton {
  static get Instance() {
    return super.GetInstance<PlayerManager>();
  }

  accountPlayerMap: Map<string, Player> = new Map();

  createPlayer(account: string, actors: Actor[]) {
    const player = new Player(account, actors);
    this.accountPlayerMap.set(player.account, player);
    return player;
  }

  removePlayer(account: string) {
    this.accountPlayerMap.delete(account);
  }

  getPlayer(account: string) {
    const player = this.accountPlayerMap.get(account);
    if (player) {
      return player;
    } else {
      throw new Error("no player");
    }
  }

  getPlayers() {
    const players = [...this.accountPlayerMap.values()];
    return players;
  }
}
