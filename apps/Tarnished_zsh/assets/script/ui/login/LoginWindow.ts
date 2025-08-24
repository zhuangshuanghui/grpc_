import { _decorator, Component, Node } from 'cc';
import { ButtonEx } from '../common/ButtonEx';
const { ccclass, property } = _decorator;

@ccclass('LoginWindow')
export class LoginWindow extends Component {

    @property({ type: ButtonEx })
    btn1: ButtonEx =null
    start() {

    }

    update(deltaTime: number) {
        
    }
}


