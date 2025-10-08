/* 存放该模块下交互的数据 */
export class Modules1Data {
    private _playerPotion //获取玩家位置


    public constructor() {
        this.reset();
    }

    //数据重置
    reset() {
        // this._lotteryFunDic = null;
        // this.lotteryLogList = null;
    }

    //数据清理
    clear() {
        // this._lotteryFunDic = null;
        // this.lotteryLogList = null;
    }

    
    public get playerPotion() : any {
        return  this._playerPotion
    }
    public set playerPotion(v : any) {
        this._playerPotion = v;
    }
    
    

}