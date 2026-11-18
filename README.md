# Learning Lab · 学习实验室

**Learn Smarter. Grow Further.** · 学得更聪明，成长得更远。

一个融合学习科学、认知心理学、记忆科学、阅读方法、深度思考、知识管理与终身学习的综合知识平台。不是技巧博客，而是具备系统知识库、专业专题、研究解读、实用工具与交互图解的知识产品。

## 本地运行

要求 Node.js 18.18+（推荐 20 LTS 或 22）。

```bash
npm install
cp .env.example .env.local   # 可选：配置站点 URL 与订阅端点
npm run dev
```

打开 <http://localhost:3000>。

```bash
npm run typecheck   # TypeScript 检查
npm run lint        # ESLint
npm run build       # 静态导出到 out/
npx serve out       # 本地预览静态产物
```

## 环境变量

| 变量 | 说明 |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 站点公开地址，用于 canonical、sitemap、RSS 与结构化数据。默认 `http://localhost:3000`。 |
| `NEXT_PUBLIC_BASE_PATH` | 部署到子路径时设置，例如 GitHub Pages 的 `/learning-lab`。本地开发留空。 |
| `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` | 可选。订阅表单的 POST 端点；未配置时页面明确提示“尚未接入邮件服务”，不会假装订阅成功。 |

## GitHub Pages 自动部署

站点使用 Next.js 静态导出（`output: 'export'`），可直接托管在 GitHub Pages。

1. 在 GitHub 仓库中进入 **Settings → Pages → Build and deployment**，将 **Source** 设为 **GitHub Actions**。
2. 推送到 `main` 或 `master` 分支即可触发 `.github/workflows/deploy.yml`：安装依赖 → 静态构建 → 上传 `out/` → 部署 Pages。
3. 工作流会自动根据仓库名设置 `NEXT_PUBLIC_BASE_PATH`（如 `/learning-lab`）与 `NEXT_PUBLIC_SITE_URL`（如 `https://<owner>.github.io/learning-lab`），无需手动修改配置。
4. `public/.nojekyll` 会随构建输出，确保 `_next/` 目录不被 Jekyll 忽略。

也可手动触发：Actions 页面选择 **Deploy to GitHub Pages** → **Run workflow**。

## 技术栈

- Next.js 15（App Router）+ TypeScript + Tailwind CSS
- shadcn/ui 风格组件（Radix UI + CVA）+ Lucide Icons
- MDX（next-mdx-remote/rsc）+ gray-matter 内容系统
- ECharts（按需注册模块）+ 原创 SVG 科学图解
- React Hook Form + Zod 表单校验
- next-themes 明暗主题 + localStorage 本地数据
- ESLint + Prettier

## 目录结构

```
src/
  app/                 页面与路由（含 sitemap / robots / RSS）
  components/
    ui/                基础组件（shadcn/ui 风格）
    layout/            导航、页脚、搜索、主题
    home/              首页模块
    articles/          MDX 渲染与文章卡片
    diagrams/          12 张原创 SVG 图解
    charts/            ECharts 图表组件
    tools/             9 个交互工具
    pages/             通用页面模板
  content/
    articles/          MDX 文章（内容与 UI 分离）
    data/              书籍、资源、方法、路径结构化数据
  hooks/               本地存储 Hook
  lib/                 类型、站点配置、内容加载、搜索、工具函数
```

## 内容体系

- 8 个核心知识分类：学习科学、记忆、注意力、学习方法、阅读、思维、知识管理、终身学习
- 59 篇基于证据的科普文章（含证据等级、适用范围与局限说明）
- 15 种学习方法专题
- 17 本精选书籍、21 个全球专业资源
- 5 条系统化学习路径
- 12 张原创 SVG 科学图解、8 类 ECharts 数据可视化

## 工具与隐私

工具包括：学习仪表盘、学习记录器、间隔重复计划器、主动回忆练习、阅读记录器、学习目标规划器、知识卡片、专注计时器、每周学习复盘。

所有用户数据默认保存在浏览器 `localStorage`，不会自动上传。每个工具提供 JSON（部分支持 CSV）导出。仪表盘的 Demo Data 仅用于图表预览，明确标注且不写入本地存储。

## 科学严谨性

内容优先参考同行评审论文、系统综述、权威大学与研究机构资料。文章区分“证据较充分”“证据仍在发展”“存在争议”三类结论，不编造论文、DOI、统计数据或链接。详见 `/editorial-policy` 与 `/sources`。
