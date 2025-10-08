import { _decorator, Component, Node } from 'cc';
import CCCExtension from './CCCExtension';
import RecycleScroll from './RecycleScroll';
import { Item } from './Item';

const { ccclass, property } = _decorator;

@ccclass('Launc')
export class Launc extends Component {
    @property(RecycleScroll)
    itemScroll: RecycleScroll = null;

    onLoad(): void {
        CCCExtension.init()
        this.itemScroll.onItemRender = this.onItemRender.bind(this);
    }

    start() {
        this.itemScroll.numItems = 15;
    }

    onItemRender(index: number, node: Node) {
        node.getComponent(Item).setData({ id: index })
    }

    click() {
        if (this.itemScroll.numItems == 15) {
            this.itemScroll.numItems = 1000
        } else {
            this.itemScroll.numItems = 15
        }
    }
}


