const { APP_PORT } = require("../config/default.config");
const app = require("./app/index");
const runMigrations = require("../scripts/migrate-on-start");

async function startServer() {
  try {
    console.log("🚀 启动 Plum Blossom 后端服务...");
    console.log(`📊 环境: ${process.env.NODE_ENV || "development"}`);
    console.log(`🔧 端口: ${APP_PORT}`);

    // 运行数据库迁移
    console.log("\n🔧 检查数据库迁移...");
    const migrationSuccess = await runMigrations();

    if (!migrationSuccess) {
      console.error("❌ 数据库迁移失败，服务器启动中止");
      process.exit(1);
    }

    console.log("✅ 数据库迁移完成");

    // 启动服务器
    app.listen(APP_PORT, () => {
      console.log(`\n🎉 服务器启动成功！`);
      console.log(`🌐 本地访问: http://localhost:${APP_PORT}`);
      console.log(`📊 健康检查: http://localhost:${APP_PORT}/health`);
      console.log(`⏰ 启动时间: ${new Date().toLocaleString()}`);
    });

    // 处理优雅关闭
    process.on("SIGINT", () => {
      console.log("\n🔻 收到 SIGINT 信号，正在关闭服务器...");
      process.exit(0);
    });

    process.on("SIGTERM", () => {
      console.log("\n🔻 收到 SIGTERM 信号，正在关闭服务器...");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ 服务器启动失败:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// 处理未捕获的异常
process.on("uncaughtException", (error) => {
  console.error("⚠️  未捕获的异常:", error.message);
  console.error(error.stack);
  // 不要立即退出，记录错误后继续运行
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("⚠️  未处理的 Promise 拒绝:", reason);
});

// 启动服务器
startServer();
