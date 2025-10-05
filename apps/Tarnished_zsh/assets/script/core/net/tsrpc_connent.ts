import { HttpClient, WsClient } from 'tsrpc-browser';
import { ResLogin } from './shared/protocols/PtlLogin';
import { serviceProto } from './shared/protocols/serviceProto';



export default class tsrpc_connent {
    client= null

    constructor(uil = 'http://127.0.0.1:3000') {
        // this.client = new WebSocket(serviceProto, {
        //     server: uil,
        //     // json: true    切换到二进制传输
        //     logger: console //将把请求和响应日志打印在控制台上
        // });

        // 初始化 WebSocket 客户端
        this.client = new WsClient(serviceProto, {
            //server: `ws://` + ManagerCenter.httpMgr.serverIp,
            logger: undefined,
        });
        this.client.options.server = uil
        this.client.connect();
        this.init()
    }

    async init() {
        // await this.client.connect();

        let ret = await this.client.callApi('Test', {
            username: '13',
            password: '123'
        })
        console.log(ret);
        if (!ret.isSucc) {
            console.log('登录失败', ret.err.message);
            return;
        }

        console.log('登录成功', ret.res.user);
    }



}