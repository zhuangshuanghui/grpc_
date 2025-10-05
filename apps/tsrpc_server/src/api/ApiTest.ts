import { ApiCall } from "tsrpc";
import { server } from "..";
import { ReqSend, ResSend } from "../shared/protocols/PtlSend";
import { ReqTest, ResTest } from "../shared/protocols/PtlTest";

// This is a demo code file
// Feel free to delete it

export default async function (call: ApiCall<ReqTest, ResTest>) {
    // Error
    // if (call.req.content.length === 0) {
    //     call.error('Content is empty')
    //     return;
    // }

    // Success
    let time = new Date();
    call.succ({
        user: {
            id: 123,
            nickname: "string"
        }
    });

    // Broadcast
//     server.broadcastMsg('Chat', {
//         content: call.req.content,
//         time: time
//     })
}