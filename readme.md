

# Plum App

## 为什么是 Plum APP？

梅花易数是一个简单的占卜预测模型，但在使用中发现，《皇极梅花》的策轨数也属于梅花体系。另外，六爻纳甲与梅花易数、策轨数模型并不冲突，并且在实践中展示的信息也是屡屡应验。

因此，我们需要一个更多信息量和思考方式的梅花易数排盘和案例记录工具，这就是Plum APP。

## 项目简介

Plum App 是一个 全栈 渐进式 Web 应用程序，用于梅花易数占卜，案例记录分析，包含以下

- 梅花排盘
- 爻辞
- 爻辞白话解释
- 策轨数
- 纳甲（六爻）
- 神煞（大六壬）

适合有一定专业技术的易友使用。

它使用 **Vue3, Koa2, Mysql** 构建，使用pnpm workspace管理项目依赖。旨在 提供一个简洁易用的界面，帮助研究梅花易数的易友们高效地分析和记录他们的案例。

该应用只适配移动端，请在手机浏览器中安装使用。

## 启动使用

### 前置条件

*   Node.js (>= 18)
*   pnpm
*   Mysql 5.7
*   Chrome 100+

### 步骤

1.  **克隆仓库：**

    ```bash
    git clone https://github.com/soom-lupulus/plum-app.git
    cd plum-app
    ```

2.  **安装依赖：**

    使用 pnpm:

    ```bash
    pnpm install
    ```

3.  **配置环境变量：**

    创建 `.env` 文件，并配置以下环境变量：

    ```
    # 创建数据库环境变量
    touch apps/backend/.env
    
    # 将下列环境变量写入.env
    APP_PORT=8887
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_NAME=plum_blossom
    DB_USER=root
    DB_PASSWORD=123456

    ```

4.  **启动前、后端服务：**

    ```bash
    pnpm dev
    ```

5.  **访问应用：**

    打开浏览器，访问 `http://localhost:5173` (或者前端应用运行的地址)。

### 其他命令


*   **构建生产版本：**

    ```bash
    pnpm build
    ```

## 贡献

欢迎参与 Plum App 的开发！如果你想贡献代码，请按照以下步骤：

1.  Fork 仓库
2.  创建新的分支 (`git checkout -b feature/your-feature`)
3.  提交你的修改 (`git commit -m 'Add some feature'`)
4.  推送分支 (`git push origin feature/your-feature`)
5.  创建 Pull Request

## 许可证

MIT License