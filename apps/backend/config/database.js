// config/database.js
module.exports = {
  development: {
    username: "root",
    password: "123456",
    database: "plum_blossom", // 使用实际的数据库名
    host: "127.0.0.1",
    dialect: "mysql",
    port: 3306,
  },
  test: {
    username: "root",
    password: "123456",
    database: "plum_blossom_test",
    host: "127.0.0.1",
    dialect: "mysql",
    port: 3306,
  },
  production: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "123456",
    database: process.env.DB_NAME || "plum_blossom",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
    port: process.env.DB_PORT || 3306,
  },
};
