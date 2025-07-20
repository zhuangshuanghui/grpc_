import { Request, Response, NextFunction } from "express";
import { PrivateKey } from "../../common";
// @ts-ignore
import JSCrypto from "node-jsencrypt";
import { CodeEnum } from "./enum";
import { createRes } from "./utils";

const crypt = new JSCrypto();
crypt.setKey(PrivateKey);

/***
 * 中间件
 * 解析和校验用户名和密码
 */
export const verifyAndParse = (req: Request, res: Response, next: NextFunction) => {
  let { account, password } = req.body;
  if (!account || !password) {
    res.json(createRes(CodeEnum.ParamsError));
    return;
  }
  // 使用私钥解密用户名和密码
  account = crypt.decrypt(account);
  password = crypt.decrypt(password);

  // 数据正常则替换
  req.body = {
    account,
    password,
  };

  next();
};
