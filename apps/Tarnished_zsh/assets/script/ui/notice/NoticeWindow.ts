import { _decorator, Component, Node } from 'cc';
import { ButtonEx } from '../common/ButtonEx';
import { LabelEx } from '../common/LabelEx';
const { ccclass, property } = _decorator;

/**冒险界面 */
@ccclass('NoticeWindow')
export class NoticeWindow extends Component {
    @property({ type: ButtonEx })
    public ButtonEx1: ButtonEx = null;
    @property({ type: ButtonEx })
    public ButtonEx2: ButtonEx = null;
    @property({ type: LabelEx })
    public LabelEx1: LabelEx = null;
}


