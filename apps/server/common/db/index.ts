import mysql from "mysql";

export const createDBConnection = () => {
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "mmodb",
  });
  connection.connect();
  return connection;
};
