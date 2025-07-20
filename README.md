# 项目启动

1. 因为是 monorepo，需要全局安装 yarn

```
npm i yarn -g
```

2. 安装依赖

```
yarn
```

3. 安装 mysql（自行安装）

4. 修改数据库连接配置 （apps/server/common/db 目录）

```
 const connection = mysql.createConnection({
   host: "localhost",
   user: "root",
   password: "123456",
   database: "mmodb",
 });
```

5. 根据 mmo.sql 创建 user 表和 actor 表

6. yarn start 启动所有服务

7. 部署（同时执行 IDL 编译+TSC 编译+PM2 进程守护）

```
yarn deploy
```
