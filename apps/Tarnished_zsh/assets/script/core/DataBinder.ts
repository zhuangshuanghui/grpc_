import { SingtonClass } from "../util/SingtonClass";

//双向数据绑定-----主要用于ui的更新
// 使用示例
export class DataBinder extends SingtonClass {

    private _bindings: Map<string, { target: any, propertry: string }[]> = new Map()


    /**
     * 绑定数据
     * @param sourceKey 数据源key
     * @param target 目标对象
     * @param property 目标属性
     */
    //注册需绑定的数据   注册到Map表
    public dataBind(sourceKey:string,target:any,propertry:string) {
        if(!this._bindings.has(sourceKey)){
            this._bindings.set(sourceKey,[])
        }
        this._bindings.get(sourceKey).push({target,propertry})
    }

    //更新数据  问题---频率高的话会导致游戏卡顿
    update(sourceKey:string,value:any) {
        const items=this._bindings.get(sourceKey)
        if(items){
            items.forEach(item=>{
                item.target[item.propertry] =value
            })
        }
    }


    //清空绑定的数据
    clear() {
        this._bindings.clear()
    }


    //清空特定的数据
    clearOne(params) {
        if (this._bindings.has(params)) {  // 先检查key是否存在
            this._bindings.delete(params);  // 删除指定key的键值对
        } else {
            console.log("删除的元素不存在",params);
        }
    }

    
    // 绑定
    // DataBinder.instance.bind('playerHp', this, 'hpText');

    // // HP文本更新
    // public set hpText(value: number) {
    //     if (this.hpLabel) {
    //         this.hpLabel.string = `HP: ${value}`;
    //     }
    // }


    // 更新
    // public set hp(value: number) {
    //     this._hp = value;
    //     DataBinder.instance.update('playerHp', value);
    // }

}