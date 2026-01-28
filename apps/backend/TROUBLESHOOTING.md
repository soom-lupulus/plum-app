# 迁移工具故障排除指南

## 🚨 紧急情况：数据库连不上了！

### 症状

- 启动服务器报错：`数据库连接失败`
- 运行 `node scripts/check-db-state.js` 报错
- 迁移命令失败

### 第一步：快速诊断

```bash
cd backend
node scripts/check-db-state.js
```

看错误信息：

#### 情况1：`Access denied for user 'root'@'localhost'`

**原因**：密码错了或用户没权限
**解决**：

```bash
# 1. 检查配置文件
cat config/config.json

# 2. 测试MySQL连接
mysql -u root -p123456 -e "SHOW DATABASES;"

# 3. 如果连接失败，检查MySQL服务
sudo systemctl status mysql
sudo systemctl start mysql  # 如果没启动
```

#### 情况2：`Unknown database 'plum_blossom'`

**原因**：数据库不存在
**解决**：

```bash
# 创建数据库
mysql -u root -p123456 -e "CREATE DATABASE plum_blossom;"

# 或者修改配置使用其他数据库
# 编辑 config/config.json 和 config/database.js
```

#### 情况3：`Can't connect to MySQL server`

**原因**：MySQL服务没运行或端口不对
**解决**：

```bash
# 检查MySQL服务
sudo systemctl status mysql

# 启动MySQL
sudo systemctl start mysql

# 检查端口
netstat -tlnp | grep 3306
```

### 第二步：检查配置文件

```bash
# 查看当前配置
echo "=== config/config.json ==="
cat config/config.json | grep -A5 "development"

echo "=== .env 文件 ==="
cat .env

echo "=== 检查数据库是否存在 ==="
mysql -u root -p123456 -e "SHOW DATABASES;" | grep plum_blossom
```

## 🚨 紧急情况：迁移执行失败了！

### 症状

- `npx sequelize-cli db:migrate` 报错
- 迁移卡住了
- 表结构乱了

### 第一步：查看错误详情

```bash
# 运行迁移看具体错误
npx sequelize-cli db:migrate 2>&1 | tail -20

# 或者查看迁移状态
npx sequelize-cli db:migrate:status
```

### 第二步：根据错误类型解决

#### 错误1：`Table already exists`

**原因**：表已经存在，但迁移文件又要创建
**解决**：

```bash
# 1. 查看哪些表已存在
node scripts/check-db-state.js

# 2. 如果确实不需要创建，修改迁移文件
#    把 createTable 改成其他操作，或者跳过

# 3. 或者删除已存在的表（小心！）
#    mysql -u root -p123456 -e "DROP TABLE 表名;"
```

#### 错误2：`Unknown column`

**原因**：字段不存在，但迁移文件要修改它
**解决**：

```bash
# 1. 查看表结构
mysql -u root -p123456 plum_blossom -e "DESCRIBE 表名;"

# 2. 修改迁移文件，使用正确的字段名

# 3. 或者手动添加字段
#    mysql -u root -p123456 plum_blossom -e "ALTER TABLE 表名 ADD COLUMN 字段名 类型;"
```

#### 错误3：迁移文件语法错误

**原因**：迁移文件写错了
**解决**：

```bash
# 1. 检查迁移文件语法
node -c database/migrations/有问题的文件.js

# 2. 修复语法错误
# 3. 重新运行迁移
```

### 第三步：紧急回滚

```bash
# 回退到上一步
npx sequelize-cli db:migrate:undo

# 查看可以回退到哪个版本
npx sequelize-cli db:migrate:status

# 回退到特定版本
npx sequelize-cli db:migrate:undo --name 迁移文件名
```

### 第四步：手动修复迁移表

如果迁移完全乱了：

```bash
# 1. 连接到MySQL
mysql -u root -p123456 plum_blossom

# 2. 查看迁移记录
SELECT * FROM SequelizeMeta;

# 3. 删除有问题的记录
DELETE FROM SequelizeMeta WHERE name = '有问题的迁移文件';

# 4. 退出MySQL
exit

# 5. 重新运行迁移
npx sequelize-cli db:migrate
```

## 🚨 紧急情况：数据丢了！

### 第一步：不要慌，先检查

```bash
# 检查还有哪些数据
node scripts/check-db-state.js

# 查看具体表的数据量
mysql -u root -p123456 plum_blossom -e "SELECT COUNT(*) FROM d_case;"
mysql -u root -p123456 plum_blossom -e "SELECT COUNT(*) FROM user;"
```

### 第二步：如果有备份，恢复

```bash
# 恢复最近备份
mysql -u root -p123456 plum_blossom < backup_最新日期.sql

# 如果没有备份，尝试从迁移回滚
npx sequelize-cli db:migrate:undo:all
```

### 第三步：预防措施

```bash
# 立即创建备份
mysqldump -u root -p123456 plum_blossom > emergency_backup_$(date +%Y%m%d_%H%M%S).sql

# 查看备份文件大小，确认有数据
ls -lh emergency_backup_*.sql
```

## 🔧 常见问题解决

### 问题1：`sequelize-cli` 命令找不到

```bash
# 安装 sequelize-cli
npm install -g sequelize-cli

# 或者在项目内使用 npx
npx sequelize-cli --version

# 或者在 backend 目录安装
cd backend
npm install --save-dev sequelize-cli
```

### 问题2：迁移命令卡住了

```bash
# 按 Ctrl+C 中断

# 检查MySQL进程
mysql -u root -p123456 -e "SHOW PROCESSLIST;"

# 如果有长时间运行的查询，可能需要终止
# mysql -u root -p123456 -e "KILL 进程ID;"

# 然后重新运行迁移
npx sequelize-cli db:migrate
```

### 问题3：迁移文件太多，不知道哪个是哪个

```bash
# 查看所有迁移文件
ls -la database/migrations/

# 查看迁移状态（哪些已执行）
npx sequelize-cli db:migrate:status

# 查看文件内容
cat database/migrations/文件名.js | head -20
```

### 问题4：我想从头开始

```bash
# 警告：这会删除所有数据！
# 1. 先备份
mysqldump -u root -p123456 plum_blossom > 备份.sql

# 2. 删除所有表
mysql -u root -p123456 plum_blossom -e "DROP DATABASE plum_blossom; CREATE DATABASE plum_blossom;"

# 3. 清空迁移记录
mysql -u root -p123456 plum_blossom -e "DROP TABLE IF EXISTS SequelizeMeta;"

# 4. 重新运行所有迁移
npx sequelize-cli db:migrate
```

## 📊 健康检查清单

遇到问题时，按顺序检查：

### 第1级：基础检查

```bash
# 1. MySQL服务运行了吗？
sudo systemctl status mysql

# 2. 能连接吗？
mysql -u root -p123456 -e "SELECT 1;"

# 3. 数据库存在吗？
mysql -u root -p123456 -e "SHOW DATABASES;" | grep plum_blossom
```

### 第2级：配置检查

```bash
# 1. 配置文件对吗？
cat config/config.json | grep -A3 "development"

# 2. 环境变量对吗？
cat .env

# 3. 模型文件能加载吗？
node -e "require('./src/models/index.js'); console.log('✅ 模型加载成功');"
```

### 第3级：数据检查

```bash
# 1. 运行检查脚本
node scripts/check-db-state.js

# 2. 查看关键表
mysql -u root -p123456 plum_blossom -e "SELECT COUNT(*) FROM d_case; SELECT COUNT(*) FROM user;"

# 3. 查看迁移状态
npx sequelize-cli db:migrate:status
```

### 第4级：迁移检查

```bash
# 1. 迁移目录存在吗？
ls -la database/migrations/

# 2. 迁移文件语法正确吗？
for file in database/migrations/*.js; do node -c "$file" && echo "✅ $file"; done

# 3. 能手动执行迁移吗？
cd database/migrations && node 某个迁移文件.js
```

## 🆘 终极解决方案

如果所有方法都失败了：

### 方案A：重置开发环境

```bash
# 1. 备份数据（如果有）
mysqldump -u root -p123456 plum_blossom > last_chance_backup.sql

# 2. 删除数据库重建
mysql -u root -p123456 -e "DROP DATABASE plum_blossom; CREATE DATABASE plum_blossom;"

# 3. 删除迁移记录
rm -rf database/migrations/*
rm -rf database/seeders/*

# 4. 重新初始化
npx sequelize-cli init

# 5. 从模型生成迁移
node scripts/generate-migrations.js

# 6. 运行迁移
npx sequelize-cli db:migrate
```

### 方案B：寻求帮助

把以下信息发给能帮你的人：

```bash
# 1. 错误信息
node scripts/check-db-state.js 2>&1

# 2. 配置文件
cat config/config.json

# 3. 迁移状态
npx sequelize-cli db:migrate:status 2>&1

# 4. 数据库结构
mysql -u root -p123456 plum_blossom -e "SHOW TABLES; DESCRIBE d_case;" 2>&1
```

## 🎯 记住这个万能命令

**无论遇到什么问题，先运行：**

```bash
cd backend
node scripts/check-db-state.js
```

这个命令会告诉你：

- ✅ 数据库能不能连
- 📊 表结构对不对
- 🔢 数据有没有丢
- 🚦 迁移状态如何

## 📞 求助时需要提供的信息

如果你需要别人帮忙，请提供：

1. **错误信息**：完整的错误输出
2. **你做了什么**：执行了哪些命令
3. **期望结果**：你希望达到什么效果
4. **实际结果**：实际发生了什么
5. **相关文件**：改了哪些文件

示例：

```
问题：迁移失败
操作：npx sequelize-cli db:migrate
错误：ERROR: Table 'users' already exists
相关文件：database/migrations/20250122000000-create-users.js
```

## 💡 预防措施

### 每天工作前

```bash
# 检查数据库状态
node scripts/check-db-state.js

# 查看迁移状态
npx sequelize-cli db:migrate:status
```

### 修改数据库前

```bash
# 1. 备份
mysqldump -u root -p123456 plum_blossom > 修改前备份_$(date +%Y%m%d).sql

# 2. 在测试环境先试
NODE_ENV=test npx sequelize-cli db:migrate

# 3. 小步快跑，一次只改一点
```

### 下班前

```bash
# 确保一切正常
node scripts/check-db-state.js

# 提交迁移文件到Git
git add database/migrations/
git commit -m "数据库变更：描述"
```

---

_记住：迁移工具是为了让你更安全，不是更麻烦。遇到问题不要硬扛，按这个指南一步步排查，大多数问题都能解决。_
