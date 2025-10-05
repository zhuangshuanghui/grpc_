// 请求 xian
export interface ReqLogin {
    username: string,
    password: string
}

// 响应
export interface ResLogin {
    user: {
        id: number,
        nickname: string
    }
}