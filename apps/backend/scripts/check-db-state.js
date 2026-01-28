#!/usr/bin/env node

const { Sequelize } = require("sequelize");
const path = require("path");

// Workspace 环境下正确引用配置文件
const config = require(
  path.resolve(__dirname, "../config/database.js"),
).development;

async function checkDatabaseState() {
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

  try {
    console.log("🔍 开始检查数据库状态...");
    console.log(`📊 数据库: ${config.database}@${config.host}`);
    console.log(`👤 用户: ${config.username}`);

    // 测试连接
    await sequelize.authenticate();
    console.log("✅ 数据库连接成功");

    // 检查数据库是否存在
    const [databases] = await sequelize.query("SHOW DATABASES");
    const dbExists = databases.some(
      (db) =>
        Object.values(db)[0].toLowerCase() === config.database.toLowerCase(),
    );

    if (!dbExists) {
      console.log(`❌ 数据库 "${config.database}" 不存在`);
      console.log("📋 可用数据库:");
      databases.forEach((db) => console.log(`   - ${Object.values(db)[0]}`));
      return;
    }

    console.log(`✅ 数据库 "${config.database}" 存在`);

    // 切换到目标数据库
    await sequelize.query(`USE ${config.database}`);

    // 检查表
    const [tables] = await sequelize.query("SHOW TABLES");
    console.log(`\n📊 数据库中有 ${tables.length} 个表:`);

    if (tables.length === 0) {
      console.log("   (空数据库)");
    } else {
      for (const table of tables) {
        const tableName = Object.values(table)[0];
        const [columns] = await sequelize.query(`DESCRIBE ${tableName}`);
        console.log(`\n📋 表: ${tableName} (${columns.length} 列)`);

        // 显示列信息
        columns.slice(0, 8).forEach((col) => {
          const constraints = [];
          if (col.Key === "PRI") constraints.push("PRIMARY");
          if (col.Key === "UNI") constraints.push("UNIQUE");
          if (col.Key === "MUL") constraints.push("INDEX");
          if (col.Null === "NO") constraints.push("NOT NULL");

          const constraintStr =
            constraints.length > 0 ? ` [${constraints.join(", ")}]` : "";
          console.log(`   ${col.Field}: ${col.Type}${constraintStr}`);
        });

        if (columns.length > 8) {
          console.log(`   ... 还有 ${columns.length - 8} 列`);
        }

        // 检查行数
        const [[rowCount]] = await sequelize.query(
          `SELECT COUNT(*) as count FROM ${tableName}`,
        );
        console.log(`   📈 行数: ${rowCount.count}`);
      }
    }

    // 检查迁移表
    try {
      const [migrations] = await sequelize.query(
        "SELECT * FROM SequelizeMeta ORDER BY name DESC LIMIT 10",
      );

      console.log(`\n🔄 迁移记录 (最近10个): ${migrations.length} 个`);
      if (migrations.length === 0) {
        console.log("   (无迁移记录)");
      } else {
        migrations.forEach((m, i) => {
          console.log(`   ${i + 1}. ${m.name}`);
        });
      }
    } catch (error) {
      console.log("📝 迁移表不存在 (SequelizeMeta)");
    }

    // 检查模型对应的表是否存在
    console.log("\n🔧 模型检查:");
    const expectedTables = ["d_case", "trigram", "eight_trigram", "user"];
    for (const tableName of expectedTables) {
      const tableExists = tables.some(
        (t) => Object.values(t)[0].toLowerCase() === tableName.toLowerCase(),
      );
      console.log(`   ${tableExists ? "✅" : "❌"} ${tableName}`);
    }

    console.log("\n🎉 数据库状态检查完成");
  } catch (error) {
    console.error("❌ 检查失败:", error.message);

    // 提供具体的错误诊断
    if (error.message.includes("Access denied")) {
      console.log("\n🔧 权限问题诊断:");
      console.log("1. 检查数据库用户密码是否正确");
      console.log("2. 检查用户是否有权限访问数据库");
      console.log("3. 尝试连接MySQL:");
      console.log(
        `   mysql -u ${config.username} -p${config.password} -h ${config.host}`,
      );
    } else if (error.message.includes("Unknown database")) {
      console.log("\n🔧 数据库不存在:");
      console.log(`   数据库 "${config.database}" 不存在`);
      console.log("   创建数据库:");
      console.log(
        `   mysql -u ${config.username} -p${config.password} -e "CREATE DATABASE ${config.database};"`,
      );
    } else if (error.message.includes("connect")) {
      console.log("\n🔧 连接问题诊断:");
      console.log("1. 检查MySQL服务是否运行:");
      console.log("   sudo systemctl status mysql");
      console.log("2. 检查端口是否开放:");
      console.log(`   nc -z ${config.host} ${config.port || 3306}`);
      console.log("3. 检查防火墙设置");
    }
  } finally {
    await sequelize.close();
    console.log("\n🔒 数据库连接已关闭");
  }
}

// 如果直接运行此脚本，则执行检查
if (require.main === module) {
  checkDatabaseState()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 脚本执行失败:", error.message);
      process.exit(1);
    });
}

module.exports = checkDatabaseState;
