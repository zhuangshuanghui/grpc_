import { CodeEnum, CodeText } from "./enum";
import crypto from "crypto";

/***
 * md5加密
 */
export const md5 = (value: string) => {
  return crypto.createHash("md5").update(value).digest("hex");
};

/***
 * 创建response
 */
export const createRes = (code: CodeEnum, data?: any) => ({
  code,
  data,
  message: CodeText[code],
});
