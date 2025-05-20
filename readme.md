

# Plum App

## 项目简介

Plum App 是一个 全栈 Web 应用程序，用于梅花易数占卜案例记录分析工具，包含策轨数、纳甲（六爻），适合有一定专业技术的易友使用。它使用 **Vue3, Koa2, Mysql** 构建，旨在 提供一个简洁易用的界面，帮助研究梅花易数的易友们高效地分析和记录他们的案例。

## 启动使用

### 前置条件

*   Node.js (>= 18), Yarn
*   Mysql 数据库

### 步骤

1.  **克隆仓库：**

    ```bash
    git clone https://github.com/soom-lupulus/plum-app.git
    cd plum-app
    ```

2.  **安装依赖：**

    使用 Yarn：

    ```bash
    yarn install
    ```

3.  **配置环境变量：**

    创建 `.env` 文件，并配置以下环境变量：

    ```
    # 创建数据库环境变量
    touch backend/.env
    
    # 将下列环境变量写入.env
    APP_PORT=8887
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_NAME=plum_blossom
    DB_USER=root
    DB_PASSWORD=123456

    ```

4.  **启动后端服务：**

    ```bash
    yarn workspace backend start
    ```

    或者：

    ```bash
    yarn be:dev
    ```

5.  **启动前端应用：**

    ```bash
    yarn workspace frontend dev
    ```

    或者：

    ```bash
    yarn fe:dev
    ```

6.  **访问应用：**

    打开浏览器，访问 `http://localhost:5173` (或者前端应用运行的地址)。

### 其他命令


*   **构建生产版本：**

    ```bash
    yarn fe:build
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