# Plum Blossom 后端项目 - 数据库迁移工具使用手册

## 📖 大白话解释：什么是数据库迁移工具？

### 比喻：盖房子的施工图纸

想象一下你要盖房子：

- **以前的做法**：每次想改房子结构（比如加个窗户），就直接拿锤子砸墙改（这就是 `sync({ alter: true })`）
- **危险**：可能把承重墙砸坏了，房子塌了（数据丢失）
- **现在的做法**：先画施工图纸，审批通过后再施工（这就是迁移工具）
- **安全**：有图纸记录，错了还能按图纸恢复

### 迁移工具的核心思想

1. **记录变更**：每次改数据库结构都生成一个"变更记录文件"
2. **版本控制**：每个变更都有编号，知道谁在什么时候改了啥
3. **安全回滚**：改错了可以一键恢复到之前的状态
4. **团队协作**：变更记录可以分享给队友，大家数据库结构一致

## 🚀 快速开始

### 第一步：检查当前数据库状态

```bash
# 进入 backend 目录
cd backend

# 运行检查脚本（最常用的命令）
node scripts/check-db-state.js
```

**这个命令会告诉你：**

- ✅ 数据库能不能连上
- 📊 有哪些表，每表有多少数据
- 🔧 表结构是否正确
- 📝 有没有迁移记录

### 第二步：启动服务器（自动运行迁移）

```bash
# 正常启动服务器（会自动运行迁移）
node src/main.js

# 或者用 yarn（在项目根目录）
yarn be:dev
```

**启动时会自动：**

1. 检查有没有新的数据库变更需要执行
2. 安全地应用变更
3. 启动服务器

## 📝 常用操作场景

### 场景1：我改了模型文件，想让数据库也跟着改

**以前的做法（危险！）：**
代码会自动改数据库，可能把数据搞丢。

**现在的做法（安全）：**

```bash
# 1. 先检查当前状态
node scripts/check-db-state.js

# 2. 生成迁移文件（给变更起个名字）
npx sequelize-cli migration:generate --name add-email-to-user

# 3. 编辑生成的迁移文件
#    文件在：database/migrations/20250122000000-add-email-to-user.js
#    在里面写清楚要加什么字段

# 4. 运行迁移
npx sequelize-cli db:migrate

# 5. 验证变更
node scripts/check-db-state.js
```

### 场景2：我想看看数据库里到底有啥

```bash
# 运行检查脚本（最常用！）
node scripts/check-db-state.js

# 输出示例：
# 🔍 开始检查数据库状态...
# 📊 数据库: plum_blossom@127.0.0.1
# ✅ 数据库连接成功
# 📊 数据库中有 4 个表:
# 📋 表: d_case (23 列) - 27 条数据
# 📋 表: user (3 列) - 2 条数据
# ...等等
```

### 场景3：我改错了，想回退到之前的状态

```bash
# 查看迁移历史
npx sequelize-cli db:migrate:status

# 回退一步
npx sequelize-cli db:migrate:undo

# 回退到特定迁移
npx sequelize-cli db:migrate:undo --name 20250122000000-add-email-to-user.js

# 回退所有迁移（小心！）
npx sequelize-cli db:migrate:undo:all
```

### 场景4：团队协作 - 队友改了数据库，我怎么同步？

```bash
# 1. 拉取最新代码（包含迁移文件）
git pull

# 2. 运行迁移（自动应用队友的变更）
npx sequelize-cli db:migrate

# 3. 检查状态
node scripts/check-db-state.js
```

## 🔧 命令大全（收藏这个！）

### 日常开发命令

| 命令                                               | 作用                         | 使用频率   |
| -------------------------------------------------- | ---------------------------- | ---------- |
| `node scripts/check-db-state.js`                   | **检查数据库状态**（最常用） | ⭐⭐⭐⭐⭐ |
| `npx sequelize-cli db:migrate`                     | 运行所有待处理的迁移         | ⭐⭐⭐⭐   |
| `npx sequelize-cli db:migrate:status`              | 查看迁移状态                 | ⭐⭐⭐     |
| `npx sequelize-cli migration:generate --name 描述` | 生成新的迁移文件             | ⭐⭐       |

### 高级命令

| 命令                                  | 作用                 | 什么时候用     |
| ------------------------------------- | -------------------- | -------------- |
| `npx sequelize-cli db:migrate:undo`   | 回退一步             | 改错了的时候   |
| `npx sequelize-cli db:seed:all`       | 添加测试数据         | 初始化测试环境 |
| `node scripts/generate-migrations.js` | 从现有数据库生成迁移 | 第一次设置迁移 |

### 项目根目录的快捷命令

```bash
# 在项目根目录（plum-app/）运行这些：

# 检查数据库
yarn db:check

# 运行迁移
yarn db:migrate

# 查看状态
yarn db:migrate:status

# 启动后端
yarn be:dev
```

## 🗂️ 文件结构说明

```
backend/
├── database/
│   ├── migrations/          # 迁移文件存放处（重要！）
│   │   ├── 20250122000000-create-tables.js
│   │   └── 20250122000001-add-column.js
│   └── seeders/            # 测试数据
├── scripts/                # 工具脚本
│   ├── check-db-state.js   # 检查数据库（常用）
│   ├── migrate-on-start.js # 启动时自动迁移
│   └── generate-migrations.js
├── src/models/             # 模型定义
│   ├── case.js            # 案例表结构
│   ├── user.js            # 用户表结构
│   └── index.js           # 模型配置（已修复）
└── config/
    ├── database.js        # 数据库配置
    └── config.json        # 迁移工具配置
```

## ⚠️ 重要注意事项

### 1. 不要手动修改数据库表结构！

**错误做法**：直接用 MySQL 工具改表结构
**正确做法**：通过迁移工具改

### 2. 迁移文件要提交到 Git！

迁移文件在 `database/migrations/` 目录下，这些文件**必须**提交到 Git，这样团队才能同步数据库结构。

### 3. 生产环境特别小心！

```bash
# 生产环境运行迁移
NODE_ENV=production npx sequelize-cli db:migrate

# 生产环境一定要先备份！
mysqldump -u root -p你的密码 plum_blossom > backup_生产环境_$(date +%Y%m%d).sql
```

## 🔍 故障排除

### 问题1：数据库连不上

```bash
# 运行检查脚本看具体错误
node scripts/check-db-state.js

# 常见原因和解决：
# 1. MySQL 没启动：sudo systemctl start mysql
# 2. 密码错了：检查 config/config.json
# 3. 数据库不存在：创建数据库
```

### 问题2：迁移失败

```bash
# 查看具体错误
npx sequelize-cli db:migrate

# 如果卡住了，按 Ctrl+C 中断，然后：
npx sequelize-cli db:migrate:status

# 回退到之前的状态
npx sequelize-cli db:migrate:undo
```

### 问题3：表结构不匹配

```bash
# 检查模型定义和实际表的差异
node scripts/check-db-state.js

# 如果发现不一致：
# 1. 生成迁移文件修复
# 2. 或者联系队友同步
```

## 📚 迁移文件示例

打开一个迁移文件看看结构：

```javascript
// database/migrations/20250122000000-create-tables.js
module.exports = {
  async up(queryInterface, Sequelize) {
    // 这是"前进"操作：创建表或添加字段
    await queryInterface.createTable("users", {
      id: { type: Sequelize.INTEGER, primaryKey: true },
      name: { type: Sequelize.STRING },
    });
  },

  async down(queryInterface, Sequelize) {
    // 这是"回退"操作：删除表或删除字段
    await queryInterface.dropTable("users");
  },
};
```

**简单理解：**

- `up`：执行变更（比如创建表）
- `down`：撤销变更（比如删除表）

## 🎯 总结：你只需要记住这些

### 每天用的命令（记在脑子里）

1. **`node scripts/check-db-state.js`** - 看看数据库咋样了
2. **`npx sequelize-cli db:migrate`** - 应用数据库变更
3. **启动服务器** - 会自动运行迁移

### 改数据库时的流程（保存这个！）

```
改模型文件 → 生成迁移文件 → 编辑迁移文件 → 运行迁移 → 检查状态
      ↓            ↓            ↓            ↓          ↓
   src/models/  npx sequelize-cli   database/   npx sequelize   node scripts/
                migration:generate  migrations/  db:migrate     check-db-state.js
```

### 最重要的原则

- ✅ **安全第一**：迁移工具比直接改数据库安全
- ✅ **有记录**：每次变更都有文件记录
- ✅ **可回退**：改错了能恢复
- ✅ **团队同步**：大家数据库结构一致

## 📞 遇到问题怎么办？

1. **先运行检查脚本**：`node scripts/check-db-state.js`
2. **看错误信息**：通常错误信息会告诉你哪里出问题了
3. **检查配置文件**：`config/config.json` 里的数据库配置
4. **回退到之前的状态**：`npx sequelize-cli db:migrate:undo`

记住：迁移工具是为了让你更安全、更方便地管理数据库，不是增加麻烦。用习惯了会发现比原来直接改数据库更靠谱！

---

_最后更新：2026年1月22日_
_如果你完全看不懂，就记住这一条：启动服务器前先运行 `node scripts/check-db-state.js` 检查一下，没问题再启动。_
