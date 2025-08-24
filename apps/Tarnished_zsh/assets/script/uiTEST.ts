import { _decorator, Component, Node } from 'cc';
import Util from './util/Util';
import { ButtonEx } from './ui/common/ButtonEx';
import { LabelEx } from './ui/common/LabelEx';
const { ccclass, property } = _decorator;

@ccclass('NewComponent')
export class NewComponent extends Component {
    @property({ type: ButtonEx })
    btn1: ButtonEx = null!
    
    @property({ type: LabelEx })
    lab1: LabelEx = null!


    onLoad(): void {
        Util.GAddClick(this.btn1, this.onBtnClick, this);
    }

    async onBtnClick() {
        let params={abc:"123"}
        const res = await fetch("http://localhost:7456/register", {
            method: "POST",
            body: JSON.stringify(params),
            headers: {
              "Content-Type": "application/json",
            },
          }).then((res) => res.json()); //fetch提供的方法 将响应体从JSON字符串解析为JavaScript对象
          console.log("注册结果", res);
        throw new Error('Method not implemented.');
    }
    start() {

    }

    update(deltaTime: number) {
        
    }
}


