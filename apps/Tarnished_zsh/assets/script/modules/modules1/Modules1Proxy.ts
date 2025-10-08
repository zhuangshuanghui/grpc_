import { game_proto } from "../../core/3rd/gen/proto_helper";
import { DataCenter } from "../../core/center/DataCenter";
import { ProxyBase } from "../../core/net/ProxyBase";
import { ProtoUtils } from "../../util/ProtoUtils";
/* 
    模块1与服务器之间的数据传输类 
*/
export class Modules1Proxy extends ProxyBase {
    public init(): void {
        //写数据返回时，触发的函数
        this.socket.on("chat message", (data) => {
            const proto_jm = game_proto.PlayerMove
            let res = ProtoUtils.deserialize(proto_jm, data)
        })
    }


    //-----------------------------------------------------------------------------------------封装该模块下发送数据的函数
    /* 1.数据 2.回调 3.作用域 
        注意 获取到的数据由保持至数据中心统一管理
    */
    public sendData_call(data: any, callback?: (response: any) => void, thisArg?: any) {
        const proto_jm = game_proto.PlayerMove
        const binaryData = ProtoUtils.serialize(proto_jm, data);
        const wrappedCallback = (response: any) => {
            if (callback) {
                try {
                    // 绑定到传入的作用域
                    callback.call(thisArg, response);
                } catch (error) {
                    console.error("Callback error:", error);
                }
            }
        };

        this.socket.emit("zsh_test", binaryData, (response: any) => {
            let res = ProtoUtils.deserialize(proto_jm, response)
            console.log("🚀 ~ modules1Proxy ~ sendData_call ~ res:", res)
            //将数据保存 数据中心 略
            DataCenter.modules1Data.playerPotion=res
            wrappedCallback(response)
        });
    }
}