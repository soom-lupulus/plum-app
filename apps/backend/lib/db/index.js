const { Sequelize } = require("sequelize");
const {
  DB_NAME,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
} = require("../../config/default.config");

// 创建全局连接实例
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const connect = async () => {
  // 连接数据库
  try {
    await sequelize.authenticate();
    console.log("✅ 数据库连接成功");
    return sequelize;
  } catch (error) {
    console.error("❌ 数据库连接失败:", error.message);
    throw error;
  }
};

const close = async () => {
  try {
    await sequelize.close();
    console.log("🔒 数据库连接已关闭");
  } catch (error) {
    console.error("关闭数据库连接时出错:", error.message);
  }
};

// 导出连接实例和函数
module.exports = {
  sequelize, // 导出现有的连接实例
  connect, // 连接函数
  close, // 关闭函数
  // 初始化函数，确保连接已建立
  initialize: async () => {
    try {
      await connect();
      return sequelize;
    } catch (error) {
      console.error("数据库初始化失败:", error.message);
      throw error;
    }
  },
};
