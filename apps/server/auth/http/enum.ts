export enum CodeEnum {
  LoginSuccess = 0,
  RegistrySuccess = 1,
  ParamsError = 10000,
  SqlError,
  AccountExist,
  UsernameOrPasswordError,
}

export const CodeText: Record<CodeEnum, string> = {
  [CodeEnum.RegistrySuccess]: "注册成功",
  [CodeEnum.LoginSuccess]: "登录成功",
  [CodeEnum.ParamsError]: "参数异常",
  [CodeEnum.SqlError]: "数据库异常",
  [CodeEnum.AccountExist]: "账号已存在",
  [CodeEnum.UsernameOrPasswordError]: "账号或者密码错误",
};
