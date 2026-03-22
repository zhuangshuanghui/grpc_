import express from "express";
import { v4 as uuid } from "uuid";
import cors from "cors";
import { verifyAndParse } from "./middleware";
import { CodeEnum } from "./enum";
import { createRes, md5 } from "./utils";
import { ServerPort, createDBConnection, Logger } from "../../common";
import dayjs from "dayjs";

export const cache = new Map<string, string>();

/**
 * Express框架的用户登录，注册api实现，登录成功返回token
 * 使用缓存存储账户和token的映射关系
 */
export const httpStart = async () => {
  const connection = createDBConnection();

  const logger = new Logger();

  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  app.post("/register", verifyAndParse, function (req, res) {
    const { account, password } = req.body;

    connection.query(
      `insert into user (account, password, created_time) VALUES (?, ?, ?)`,
      [account, md5(password), dayjs().format("YYYY-MM-DD HH:mm:ss")],
      (err) => {
        if (err) {
          if (err.errno === 1062) {
            res.json(createRes(CodeEnum.AccountExist));  //res.json  express提供的api  将对象转为json并发送
            return;
          }
          res.json(createRes(CodeEnum.SqlError));
          return;
        }

        res.json(createRes(CodeEnum.RegistrySuccess));
      }
    );
  });

  app.post("/login", verifyAndParse, function (req, res) {
    const { account, password } = req.body;

    connection.query(`select password from user where account = ?`, [account], (err, result) => {
      if (err) {
        res.json(createRes(CodeEnum.SqlError));
        return;
      }

      const user = result[0];
      if (!user || md5(password) !== user.password) {
        res.json(createRes(CodeEnum.UsernameOrPasswordError));
        return;
      }

      const token = uuid();
      cache.set(token, account);

      res.json(
        createRes(CodeEnum.LoginSuccess, {
          token,
        })
      );
    });
  });

  app.post("/xianxian",function (req,res) {
    logger.info('收到请求体:', req.body); // 应该能打印 { abc: "123" }
    res.json({ success: true }); // 返回一个 JSON 响应

    // console.log("req",req);
    // let item={name:"成功"}
    // res.json(item)
    
    
  })

  //监听端口3000
  app.listen(ServerPort.AuthHttp, () => {
    logger.info("Auth HTTP服务启动");
  });
};
