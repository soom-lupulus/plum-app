# 迁移工具实战场景示例

## 🎯 场景1：我要给用户表加个邮箱字段

### 当前情况

用户表只有：id、用户名、密码
我想加：邮箱字段（email）

### 操作步骤

#### 第1步：先看看现在啥样

```bash
cd backend
node scripts/check-db-state.js
```

输出会显示 user 表有3个字段，没有 email 字段。

#### 第2步：修改模型文件

打开 `src/models/user.js`，在最后添加：

```javascript
email: {
    type: DataTypes.STRING,
    allowNull: true  // 允许为空，因为老用户没有邮箱
}
```

#### 第3步：生成迁移文件

```bash
npx sequelize-cli migration:generate --name add-email-to-user
```

这会生成一个文件：`database/migrations/20250122000000-add-email-to-user.js`

#### 第4步：编辑迁移文件

打开刚生成的文件，修改 `up` 函数：

```javascript
async up(queryInterface, Sequelize) {
    // 给 users 表添加 email 字段
    await queryInterface.addColumn('users', 'email', {
        type: Sequelize.STRING,
        allowNull: true
    });
},
```

#### 第5步：运行迁移

```bash
npx sequelize-cli db:migrate
```

输出：`Migrated: 20250122000000-add-email-to-user.js`

#### 第6步：验证

```bash
node scripts/check-db-state.js
```

现在 user 表应该有4个字段了！

## 🎯 场景2：我加了个新表（比如评论表）

### 第1步：创建模型文件

创建 `src/models/comment.js`：

```javascript
const { DataTypes } = require("sequelize");
module.exports = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  content: { type: DataTypes.TEXT, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
};
```

### 第2步：在 index.js 中注册

修改 `src/models/index.js`，添加：

```javascript
const CommentType = require("./comment");
const Comment = sequelize.define("Comment", CommentType, {
  tableName: "comments",
  timestamps: false,
});
```

### 第3步：生成迁移文件

```bash
npx sequelize-cli migration:generate --name create-comments-table
```

### 第4步：编辑迁移文件

打开文件，修改 `up` 函数：

```javascript
async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comments', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        content: { type: Sequelize.TEXT, allowNull: false },
        user_id: { type: Sequelize.INTEGER, allowNull: false },
        created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });

    // 添加外键索引（可选）
    await queryInterface.addIndex('comments', ['user_id']);
},
```

### 第5步：运行迁移

```bash
npx sequelize-cli db:migrate
```

## 🎯 场景3：我改错了，想撤销

### 情况：刚才加的 email 字段不想要了

### 第1步：查看迁移状态

```bash
npx sequelize-cli db:migrate:status
```

输出会显示哪些迁移已执行。

### 第2步：撤销迁移

```bash
# 撤销最近一次迁移
npx sequelize-cli db:migrate:undo

# 或者撤销特定的迁移
npx sequelize-cli db:migrate:undo --name 20250122000000-add-email-to-user.js
```

### 第3步：验证

```bash
node scripts/check-db-state.js
```

email 字段应该不见了。

## 🎯 场景4：队友改了数据库，我要同步

### 情况：队友提交了新的迁移文件

### 第1步：拉取代码

```bash
git pull
```

### 第2步：查看有哪些新迁移

```bash
# 查看 database/migrations/ 目录
ls -la database/migrations/

# 查看迁移状态（哪些已执行，哪些未执行）
npx sequelize-cli db:migrate:status
```

### 第3步：运行新迁移

```bash
npx sequelize-cli db:migrate
```

### 第4步：验证

```bash
node scripts/check-db-state.js
```

## 🎯 场景5：我要改字段类型

### 情况：把用户的密码字段从 VARCHAR(255) 改成 TEXT

### 第1步：生成迁移文件

```bash
npx sequelize-cli migration:generate --name change-password-to-text
```

### 第2步：编辑迁移文件

```javascript
async up(queryInterface, Sequelize) {
    // 修改字段类型
    await queryInterface.changeColumn('users', 'pazz_word', {
        type: Sequelize.TEXT,
        allowNull: false
    });
},

async down(queryInterface, Sequelize) {
    // 回退：改回原来的类型
    await queryInterface.changeColumn('users', 'pazz_word', {
        type: Sequelize.STRING(255),
        allowNull: false
    });
}
```

### 第3步：运行迁移

```bash
npx sequelize-cli db:migrate
```

## 🎯 场景6：我要删除一个字段

### 情况：删除用户表的某个测试字段

### 第1步：生成迁移文件

```bash
npx sequelize-cli migration:generate --name remove-test-field
```

### 第2步：编辑迁移文件

```javascript
async up(queryInterface, Sequelize) {
    // 删除字段
    await queryInterface.removeColumn('users', 'test_field');
},

async down(queryInterface, Sequelize) {
    // 回退：重新添加字段
    await queryInterface.addColumn('users', 'test_field', {
        type: Sequelize.STRING,
        allowNull: true
    });
}
```

## 🎯 场景7：我要重命名表

### 情况：把 trigram 表改名为卦象表（不推荐，但可能要做）

### 第1步：生成迁移文件

```bash
npx sequelize-cli migration:generate --name rename-trigram-table
```

### 第2步：编辑迁移文件

```javascript
async up(queryInterface, Sequelize) {
    // 重命名表
    await queryInterface.renameTable('trigram', '卦象表');
},

async down(queryInterface, Sequelize) {
    // 回退：改回原名
    await queryInterface.renameTable('卦象表', 'trigram');
}
```

## 🎯 场景8：我要添加索引

### 情况：给案例表的 user_id 加索引

### 第1步：生成迁移文件

```bash
npx sequelize-cli migration:generate --name add-index-to-case
```

### 第2步：编辑迁移文件

```javascript
async up(queryInterface, Sequelize) {
    // 添加索引
    await queryInterface.addIndex('d_case', ['user_id']);
},

async down(queryInterface, Sequelize) {
    // 删除索引
    await queryInterface.removeIndex('d_case', ['user_id']);
}
```

## 🔄 迁移工作流程总结

### 简单修改流程（90%的情况）

```
改模型 → 生成迁移 → 运行迁移 → 检查状态
```

### 复杂修改流程

```
1. 备份数据库（重要！）
2. 改模型文件
3. 生成迁移文件
4. 仔细检查迁移文件
5. 在测试环境运行迁移
6. 验证没问题
7. 在生产环境运行迁移
```

## ⏰ 迁移文件命名规范

好的命名：

- `add-email-to-user.js` ✅
- `create-comments-table.js` ✅
- `change-password-type.js` ✅

不好的命名：

- `migration.js` ❌（不知道改了什么）
- `fix-bug.js` ❌（太模糊）
- `update.js` ❌（不知道更新什么）

## 📝 迁移文件编写技巧

### 1. 总是写回退逻辑（down函数）

```javascript
async down(queryInterface, Sequelize) {
    // 一定要写！这样改错了能恢复
    await queryInterface.removeColumn('users', 'email');
}
```

### 2. 一次迁移只做一件事

❌ 不好：一个迁移文件里既加字段又改表名
✅ 好：一个迁移文件只加字段，另一个迁移文件改表名

### 3. 添加注释

```javascript
async up(queryInterface, Sequelize) {
    // 为什么加这个字段？
    // 因为用户需要邮箱接收通知
    await queryInterface.addColumn('users', 'email', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '用户邮箱，用于接收系统通知'
    });
}
```

## 🚨 危险操作警告

### 绝对不要在生产环境直接运行：

```bash
# 危险！会删除所有数据
npx sequelize-cli db:migrate:undo:all

# 危险！会删除表
ALTER TABLE ... DROP ...

# 危险！会修改大量数据
UPDATE ... SET ... WHERE ...
```

### 生产环境操作流程：

1. 备份数据库
2. 在测试环境验证迁移
3. 选择维护窗口（比如凌晨）
4. 执行迁移
5. 验证业务功能
6. 准备回滚方案

## 🆘 紧急情况处理

### 情况：迁移执行一半失败了

#### 步骤1：查看错误

```bash
npx sequelize-cli db:migrate
# 看错误信息
```

#### 步骤2：手动修复

```bash
# 1. 连接到MySQL
mysql -u root -p123456 plum_blossom

# 2. 查看迁移表
SELECT * FROM SequelizeMeta;

# 3. 删除失败的迁移记录
DELETE FROM SequelizeMeta WHERE name = '失败的迁移文件名';

# 4. 手动修复数据库
# 5. 重新运行迁移
```

#### 步骤3：寻求帮助

如果不会手动修复，找懂的人帮忙，或者：

```bash
# 恢复到备份
mysql -u root -p123456 plum_blossom < backup.sql
```

## 🎓 学习资源

### 常用命令备忘单

```bash
# 检查状态
node scripts/check-db-state.js

# 生成迁移
npx sequelize-cli migration:generate --name 描述

# 运行迁移
npx sequelize-cli db:migrate

# 查看历史
npx sequelize-cli db:migrate:status

# 回退一步
npx sequelize-cli db:migrate:undo
```

### 记住这个万能检查命令

**无论遇到什么问题，先运行：**

```bash
cd backend
node scripts/check-db-state.js
```

这个命令会告诉你：

- 数据库能不能连
- 表结构对不对
- 数据有没有问题
- 迁移状态如何

---

_实战经验：迁移工具就像数据库的"版本控制"，用习惯了会发现比直接改数据库更安全、更可靠。刚开始可能觉得麻烦，用几次就顺手了！_
