import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export interface IItem {
    id: number
}
@ccclass('Item')
export class Item extends Component {
    @property(Label)
    lbl: Label = null;

    setData(p: IItem) {
        this.lbl.string = `${p.id}`
    }
}


