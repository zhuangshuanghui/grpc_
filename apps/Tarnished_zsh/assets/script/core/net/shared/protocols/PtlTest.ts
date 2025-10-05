// 请求 xian
export interface ReqTest {
    username: string,
    password: string
}
// 响应
export interface ResTest {
    user: {
        id: number,
        nickname: string
    }
}