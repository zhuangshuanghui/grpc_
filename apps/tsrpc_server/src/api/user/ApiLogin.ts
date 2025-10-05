import { ApiCall } from "tsrpc";
import { ReqLogin, ResLogin } from "../../shared/protocols/user/PtlLogin";

export async function ApiLogin(call: ApiCall<ReqLogin, ResLogin>) {
    // 错误
    if(!(call.req.username === 'admin' && call.req.password === 'admin')){
      call.error('用户名或密码错误');
      return;
    }
    // 成功
    call.succ({
        user: {
          id: 123,
          nickname: 'Test'
        }
    })
}