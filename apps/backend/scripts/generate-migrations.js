#!/usr/bin/env node

const { Sequelize } = require("sequelize");
const path = require("path");
const fs = require("fs");

// Workspace 环境下正确引用配置文件
const config = require(
  path.resolve(__dirname, "../config/database.js"),
).development;

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    port: config.port || 3306,
    logging: false,
  },
);

async function generateMigrations() {
  try {
    console.log("🚀 开始生成迁移文件...");
    console.log(`📊 数据库: ${config.database}@${config.host}`);
    console.log(`📁 模型路径: ${path.resolve(__dirname, "../src/models")}`);

    // 检查 models 目录
    const modelsDir = path.resolve(__dirname, "../src/models");
    if (!fs.existsSync(modelsDir)) {
      throw new Error(`模型目录不存在: ${modelsDir}`);
    }

    // 读取模型文件
    const modelFiles = fs
      .readdirSync(modelsDir)
      .filter((file) => file.endsWith(".js") && file !== "index.js");

    console.log(`📋 找到 ${modelFiles.length} 个模型文件:`);
    modelFiles.forEach((file) => console.log(`   - ${file}`));

    // 创建迁移目录
    const migrationsDir = path.resolve(__dirname, "../database/migrations");
    if (!fs.existsSync(migrationsDir)) {
      fs.mkdirSync(migrationsDir, { recursive: true });
      console.log(`📁 创建迁移目录: ${migrationsDir}`);
    }

    // 生成简单的迁移文件（简化版，实际应该使用 sequelize-auto-migrations）
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:.]/g, "")
      .slice(0, 14);
    const migrationName = `initial-migration-${timestamp}`;
    const migrationFile = path.join(
      migrationsDir,
      `${timestamp}-${migrationName}.js`,
    );

    const migrationContent = `'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('🚀 运行初始迁移');
    
    // 这里应该根据你的模型生成具体的表创建语句
    // 由于这是一个简化版本，我们只创建迁移记录
    
    // 示例：创建 SequelizeMeta 表（如果不存在）
    await queryInterface.sequelize.query(\`
      CREATE TABLE IF NOT EXISTS SequelizeMeta (
        name VARCHAR(255) NOT NULL,
        PRIMARY KEY (name),
        UNIQUE KEY name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
    \`);
    
    console.log('✅ 迁移完成');
  },

  async down(queryInterface, Sequelize) {
    console.log('↩️  回滚迁移');
    // 回滚逻辑
  }
};
`;

    fs.writeFileSync(migrationFile, migrationContent);
    console.log(`✅ 生成迁移文件: ${path.basename(migrationFile)}`);
    console.log(`📁 文件位置: ${migrationFile}`);

    // 提供后续步骤
    console.log("\n📝 后续步骤:");
    console.log("1. 安装 sequelize-auto-migrations 生成完整迁移:");
    console.log("   yarn workspace backend add sequelize-auto-migrations");
    console.log("2. 运行迁移:");
    console.log("   yarn db:migrate");
    console.log("3. 检查迁移状态:");
    console.log("   yarn db:migrate:status");
  } catch (error) {
    console.error("❌ 生成失败:", error.message);
    console.error("详细错误:", error.stack);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// 如果直接运行此脚本，则执行生成
if (require.main === module) {
  generateMigrations()
    .then(() => {
      console.log("🎉 脚本执行完成");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 脚本执行失败:", error.message);
      process.exit(1);
    });
}

module.exports = generateMigrations;
