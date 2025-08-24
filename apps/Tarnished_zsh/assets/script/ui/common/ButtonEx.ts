import { _decorator, Component, Node,Button } from 'cc';
import { LabelEx } from './LabelEx';
const { ccclass, property } = _decorator;

@ccclass('ButtonEx')
export class ButtonEx extends Button {
    
    @property({ type: LabelEx, visible: false })
    private labelTxt: LabelEx = null;
    
    // start() {

    // }

    // update(deltaTime: number) {
        
    // }
}


