export class Actor {
  constructor(
    public id: number,
    public account: string,
    public nickname: string,
    public curSceneId: number,
    public curReplicationId?: number
  ) {}
}
