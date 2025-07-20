/***
 * 鉴权服务器
 */
import * as grpc from "@grpc/grpc-js";
import { AuthService, CheckTokenRes, CheckTokenResData, Logger, ServerPort } from "../../common";
import { cache } from "../http";

const logger = new Logger();
/**
 * 基于gprc的鉴权服务，通过这个rpc服务验证客户端的有效性，返回账户信息
 */
export const rpcStart = () => {
  const server = new grpc.Server();
  server.addService(AuthService, {
    checkToken(call: any, callback: any) {
      const token = call.request.getToken();
      const res = new CheckTokenRes();
      if (cache.has(token)) {
        const data = new CheckTokenResData();
        data.setAccount(cache.get(token)!);
        res.setData(data);
      } else {
        res.setError("token验证失败");
      }
      callback(null, res);
    },
  });

  server.bindAsync(`localhost:${ServerPort.AuthRpc}`, grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    logger.info("Auth RPC服务启动");
  });
};
