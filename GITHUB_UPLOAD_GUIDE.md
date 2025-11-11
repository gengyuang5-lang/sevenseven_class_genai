# GitHub 上传指南

本文档将指导您如何将整个 Next.js 项目上传到 GitHub。

## 项目结构说明

本项目结构如下：
```
project-bolt-sb1-ftprqqgk/          # 项目根目录
├── project/                         # 主要的 Next.js 应用代码
│   ├── app/                         # Next.js App Router 页面
│   ├── components/                  # React 组件
│   ├── lib/                         # 工具函数和 API
│   ├── supabase/                    # Supabase 数据库迁移文件
│   ├── package.json                 # 项目依赖配置
│   └── ...                          # 其他配置文件
├── .gitignore                       # Git 忽略文件配置（需要在根目录创建）
├── GITHUB_UPLOAD_GUIDE.md          # 本指南文档
└── README.md                        # 项目说明文档（建议创建）
```

**重要**：本指南将从项目根目录（`project-bolt-sb1-ftprqqgk`）初始化 Git 仓库，上传整个项目结构。

## 前置要求

1. 已安装 Git（如果未安装，请访问 https://git-scm.com/downloads 下载）
2. 拥有 GitHub 账户（如果还没有，请访问 https://github.com 注册）
3. 确保项目可以正常运行（已完成 `npm install`）

## 步骤 1: 检查 Git 安装

打开终端（PowerShell 或 Command Prompt），运行以下命令检查 Git 是否已安装：

```bash
git --version
```

如果显示版本号，说明 Git 已安装。如果未安装，请先安装 Git。

## 步骤 2: 初始化 Git 仓库

在项目根目录（`project-bolt-sb1-ftprqqgk` 文件夹）下，运行以下命令：

```bash
cd D:\desktop\project-bolt-sb1-ftprqqgk
git init
```

这将在项目根目录中创建一个新的 Git 仓库，包含整个项目结构（包括 `project` 文件夹及其所有内容）。

## 步骤 3: 配置 Git 用户信息（如果尚未配置）

如果是第一次使用 Git，需要配置您的用户名和邮箱：

```bash
git config --global user.name "您的用户名"
git config --global user.email "您的邮箱@example.com"
```

如果已经配置过，可以跳过此步骤。

## 步骤 4: 检查或创建 .gitignore 文件

项目在 `project` 文件夹中已经包含了 `.gitignore` 文件。为了确保整个项目结构都能正确忽略不需要的文件，建议在项目根目录也创建一个 `.gitignore` 文件。

**选项 A：使用项目现有的 .gitignore（推荐）**
如果您想保持项目结构，可以将 `project/.gitignore` 的内容复制到根目录，或者直接使用现有的配置。

**选项 B：在根目录创建新的 .gitignore**
在项目根目录创建 `.gitignore` 文件，内容如下：

```gitignore
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
node_modules/
.pnp
.pnp.js

# testing
/coverage

# next.js
.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
Thumbs.db
```

`.gitignore` 文件会自动排除以下文件/文件夹：
- `node_modules/` - 依赖包（不需要上传）
- `.next/` - Next.js 构建文件
- `.env` - 环境变量文件（重要：包含敏感信息）
- 其他临时文件和构建产物

**重要提示**：确保您的 `.env` 文件不会被上传，因为它可能包含敏感信息（如数据库密码、API 密钥等）。

## 步骤 5: 添加文件到 Git

在项目根目录下，运行以下命令将所有文件添加到 Git 暂存区：

```bash
git add .
```

这个命令会添加整个项目结构，包括：
- `project/` 文件夹及其所有内容
- 根目录下的 `.gitignore` 和其他配置文件
- 其他项目文件

如果只想添加特定文件或文件夹，可以使用：
```bash
git add 文件名
# 或
git add project/
```

## 步骤 6: 提交文件

在项目根目录下，运行以下命令提交文件：

```bash
git commit -m "Initial commit: Next.js project with Supabase"
```

`-m` 后面的内容是提交信息，您可以根据需要修改。

**提示**：提交前可以使用 `git status` 查看将要提交的文件列表，确保没有意外包含敏感文件。

## 步骤 7: 在 GitHub 上创建新仓库

1. 登录 GitHub 账户
2. 点击右上角的 "+" 号，选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: 输入仓库名称（例如：`my-nextjs-project`）
   - **Description**: 可选，输入项目描述
   - **Visibility**: 选择 Public（公开）或 Private（私有）
   - **不要**勾选 "Initialize this repository with a README"（因为我们已经有代码了）
4. 点击 "Create repository" 创建仓库

## 步骤 8: 连接远程仓库

创建仓库后，GitHub 会显示仓库的 URL。在项目根目录下，复制 HTTPS 或 SSH URL，然后运行以下命令：

**使用 HTTPS（推荐初学者）：**
```bash
git remote add origin https://github.com/您的用户名/仓库名.git
```

**或使用 SSH（如果已配置 SSH 密钥）：**
```bash
git remote add origin git@github.com:您的用户名/仓库名.git
```

将 `您的用户名` 和 `仓库名` 替换为您实际的 GitHub 用户名和仓库名称。

**验证远程仓库连接：**
```bash
git remote -v
```

这会显示已配置的远程仓库地址。

## 步骤 9: 推送到 GitHub

在项目根目录下，运行以下命令将代码推送到 GitHub：

```bash
git branch -M main
git push -u origin main
```

如果您的默认分支是 `master` 而不是 `main`，可以使用：
```bash
git branch -M master
git push -u origin master
```

**注意**：第一次推送可能需要一些时间，特别是如果项目文件较大。请耐心等待。

## 步骤 10: 验证上传

1. 刷新 GitHub 仓库页面
2. 您应该能看到整个项目结构已经上传成功，包括：
   - `project/` 文件夹及其所有内容
   - 根目录的配置文件（如 `.gitignore`）
   - 其他项目文件

3. 检查文件结构：在 GitHub 上，您应该能看到类似这样的目录结构：
   ```
   project-bolt-sb1-ftprqqgk/
   ├── project/
   │   ├── app/
   │   ├── components/
   │   ├── lib/
   │   ├── package.json
   │   └── ...
   ├── .gitignore
   ├── GITHUB_UPLOAD_GUIDE.md
   └── README.md (如果已创建)
   ```

## 后续更新代码

如果之后修改了代码并想更新到 GitHub，在项目根目录下使用以下命令：

```bash
# 1. 查看修改的文件
git status

# 2. 添加修改的文件
git add .

# 3. 提交修改
git commit -m "描述您的修改内容"

# 4. 推送到 GitHub
git push
```

**提示**：每次推送前，建议先运行 `git status` 检查修改的文件，确保没有意外包含不应该提交的文件。

## 常见问题

### 问题 1: 推送时要求输入用户名和密码
- 如果使用 HTTPS，GitHub 现在要求使用 Personal Access Token 而不是密码
- 生成 Token：GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
- 使用 Token 作为密码

### 问题 2: 忘记添加 .env 文件到 .gitignore
如果已经将 `.env` 文件提交了，需要：
```bash
# 从 Git 中删除（但保留本地文件）
# 如果在 project 文件夹中
git rm --cached project/.env

# 如果在根目录
git rm --cached .env

# 提交更改
git commit -m "Remove .env file from repository"

# 推送到 GitHub
git push
```

### 问题 2.1: 上传了整个 node_modules 文件夹
如果意外上传了 `node_modules` 文件夹：
```bash
# 从 Git 中删除 node_modules（但保留本地文件）
git rm -r --cached project/node_modules

# 提交更改
git commit -m "Remove node_modules from repository"

# 推送到 GitHub
git push
```

### 问题 3: 想要更改远程仓库地址
```bash
# 查看当前远程仓库
git remote -v

# 更改远程仓库地址
git remote set-url origin 新的仓库URL
```

### 问题 4: 撤销上一次提交（但保留文件修改）
```bash
git reset --soft HEAD~1
```

## 安全提示

1. **永远不要**将包含敏感信息的 `.env` 文件提交到 GitHub
2. 如果意外提交了敏感信息，立即在 GitHub 上删除该文件，并考虑重置相关密钥
3. 使用环境变量来管理敏感配置
4. 考虑使用 GitHub Secrets 来存储 CI/CD 所需的敏感信息

## 额外建议

1. **创建 README.md**：在项目根目录创建 README.md 文件，描述项目功能、安装步骤和使用方法
   - 可以在 `project` 文件夹中创建，也可以在根目录创建
   - 建议在根目录创建，方便 GitHub 自动显示
   
2. **添加 LICENSE**：如果项目是开源的，在根目录添加合适的开源许可证文件

3. **项目结构说明**：在 README.md 中说明项目结构，特别是 `project` 文件夹的作用

4. **使用分支**：对于大型项目，建议使用 Git 分支进行开发
   ```bash
   git checkout -b develop  # 创建并切换到新分支
   git push -u origin develop  # 推送新分支到 GitHub
   ```

5. **提交规范**：保持提交信息的清晰和一致性
   - 使用有意义的提交信息
   - 遵循常见的提交信息格式（如：feat: 添加新功能、fix: 修复 bug）

6. **项目结构**：确保上传后，其他开发者能够理解项目结构：
   - 明确 `project` 文件夹是主要的应用代码
   - 说明如何安装依赖和启动项目（需要在 `project` 目录下运行 `npm install` 和 `npm run dev`）
   - 提供环境变量配置说明（使用 `.env.example` 文件）

## 快速参考命令

如果您熟悉 Git，以下是快速上手的命令序列：

```bash
# 1. 进入项目根目录
cd D:\desktop\project-bolt-sb1-ftprqqgk

# 2. 初始化 Git 仓库
git init

# 3. 创建根目录 .gitignore（如果需要）
# （参考步骤 4）

# 4. 添加所有文件
git add .

# 5. 提交
git commit -m "Initial commit: Next.js project with Supabase"

# 6. 添加远程仓库
git remote add origin https://github.com/您的用户名/仓库名.git

# 7. 推送到 GitHub
git branch -M main
git push -u origin main
```

## 完成！

现在您的项目已经成功上传到 GitHub 了！您可以在 GitHub 上查看、分享和协作开发这个项目。

### 上传后的下一步

1. **检查 GitHub 仓库**：确认所有文件都已正确上传
2. **创建 README.md**：在根目录添加项目说明文档
3. **设置分支保护**（可选）：在 GitHub 仓库设置中保护主分支
4. **配置 CI/CD**（可选）：设置自动化部署流程
5. **邀请协作者**（如果需要）：在仓库设置中添加团队成员

如果需要帮助，请参考：
- [Git 官方文档](https://git-scm.com/doc)
- [GitHub 帮助文档](https://docs.github.com/)
- [Next.js 文档](https://nextjs.org/docs)
- [Supabase 文档](https://supabase.com/docs)

