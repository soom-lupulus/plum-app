#!/usr/bin/env node

const { exec } = require("child_process");
const util = require("util");
const path = require("path");
const execPromise = util.promisify(exec);

async function runMigrations() {
  const env = process.env.NODE_ENV || "development";

  console.log(`🚀 开始运行数据库迁移 (环境: ${env})...`);
  console.log(`📁 工作目录: ${process.cwd()}`);

  try {
    // 检查 sequelize-cli 是否可用
    try {
      await execPromise("npx sequelize-cli --version");
    } catch (error) {
      console.log("📦 sequelize-cli 未找到，尝试安装...");
      await execPromise("yarn add -D sequelize-cli");
    }

    // 运行迁移命令
    console.log(`🔧 执行: npx sequelize-cli db:migrate --env ${env}`);

    const { stdout, stderr } = await execPromise(
      `npx sequelize-cli db:migrate --env ${env}`,
      {
        cwd: path.resolve(__dirname, ".."),
        env: { ...process.env, NODE_ENV: env },
      },
    );

    if (stdout) {
      const lines = stdout.split("\n").filter((line) => line.trim());
      lines.forEach((line) => {
        if (line.includes("ERROR") || line.includes("error")) {
          console.error(`❌ ${line}`);
        } else if (line.includes("WARNING") || line.includes("warning")) {
          console.warn(`⚠️  ${line}`);
        } else if (line.includes("Executing") || line.includes("migrated")) {
          console.log(`✅ ${line}`);
        } else {
          console.log(`📋 ${line}`);
        }
      });
    }

    if (stderr && stderr.trim()) {
      console.warn("⚠️  迁移警告输出:", stderr);
    }

    console.log("✅ 数据库迁移完成");
    return true;
  } catch (error) {
    console.error("❌ 迁移失败:");
    console.error(`   错误信息: ${error.message}`);

    if (error.stderr) {
      const errorLines = error.stderr.split("\n").filter((line) => line.trim());
      errorLines.forEach((line) => console.error(`   ${line}`));
    }

    if (error.stdout) {
      console.error("   标准输出:", error.stdout);
    }

    // 提供调试建议
    console.log("\n🔧 调试建议:");
    console.log("1. 检查数据库连接配置:");
    console.log("   cat backend/config/database.js");
    console.log("2. 检查数据库是否运行:");
    console.log('   mysql -u root -p123456 -e "SHOW DATABASES;"');
    console.log("3. 手动运行迁移:");
    console.log(
      "   cd backend && npx sequelize-cli db:migrate --env development",
    );

    return false;
  }
}

// 导出函数供其他模块使用
module.exports = runMigrations;

// 如果直接运行此脚本，则执行迁移
if (require.main === module) {
  runMigrations()
    .then((success) => {
      if (success) {
        console.log("🎉 迁移脚本执行成功");
        process.exit(0);
      } else {
        console.error("💥 迁移脚本执行失败");
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("💥 未预期的错误:", error.message);
      console.error(error.stack);
      process.exit(1);
    });
}
