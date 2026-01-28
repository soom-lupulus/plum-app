const { sequelize } = require("../../lib/db/index");

const CaseType = require("./case");
const TrigramType = require("./trigram");
const EightTrigramType = require("./eightTrigram");
const UserType = require("./user");

const Case = sequelize.define("Case", CaseType, {
  // 这是其他模型参数
  tableName: "d_case",
});

const Trigram = sequelize.define("Trigram", TrigramType, {
  tableName: "trigram",
  timestamps: false,
  freezeTableName: true  // 顺便锁定表名，防止 Sequelize 把它变成复数 Trigrams
});

const EightTrigram = sequelize.define("EightTrigram", EightTrigramType, {
  tableName: "eight_trigram",
  timestamps: false,
});

const User = sequelize.define("User", UserType, {
  tableName: "user",
  timestamps: false,
});

// 重要：不再使用 sync() 自动同步表结构
// 改为使用迁移工具管理数据库变更
// 迁移工具提供版本控制、安全回滚和团队协作

// 只在开发环境且明确需要时进行安全同步
const initModels = async () => {
  const env = process.env.NODE_ENV || "development";

  if (env === "development" && process.env.FORCE_SYNC === "true") {
    console.warn("⚠️  警告：使用 force: true 同步，这将删除所有数据！");
    await sequelize.sync({ force: true });
    console.log("✅ 开发数据库已重置");
  } else if (env === "development" && process.env.ALTER_SYNC === "true") {
    console.warn("⚠️  警告：使用 alter: true 同步，这可能修改表结构");
    await sequelize.sync({ alter: true });
    console.log("✅ 开发数据库表结构已更新");
  } else {
    // 生产环境和默认开发环境：不自动同步
    // 使用迁移工具管理数据库变更
    console.log("📊 模型已定义，使用迁移工具管理数据库变更");
  }
};

// 可选：在应用启动时初始化
if (process.env.AUTO_INIT_MODELS === "true") {
  initModels().catch((err) => {
    console.error("❌ 模型初始化失败:", err.message);
  });
}

module.exports = {
  sequelize, // 导出连接实例供迁移脚本使用
  Case,
  Trigram,
  EightTrigram,
  User,
  initModels, // 导出初始化函数
};
