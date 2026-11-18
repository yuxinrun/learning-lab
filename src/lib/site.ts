import type { Category, CategorySlug, NavItem } from "./types";

export const siteConfig = {
  name: "Learning Lab",
  chineseName: "学习实验室",
  tagline: "Learn Smarter. Grow Further.",
  chineseTagline: "学得更聪明，成长得更远。",
  description:
    "探索学习科学、记忆、认知与思维的奥秘，用更科学的方法构建自己的知识体系。基于证据的学习方法、交互工具与系统学习路径。",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  locale: "zh-CN",
};

export const categories: Category[] = [
  {
    slug: "learning-science",
    title: "学习科学",
    englishTitle: "Learning Science",
    short: "学习科学",
    description: "从认知科学与教育研究出发，理解人类如何学习，以及证据如何转化为有效学习系统。",
    icon: "brain",
    tone: "sage",
    keywords: ["学习科学", "认知过程", "学习迁移", "元认知", "认知负荷"],
  },
  {
    slug: "memory",
    title: "记忆科学",
    englishTitle: "Memory & Recall",
    short: "记忆",
    description: "感觉记忆、工作记忆与长期记忆的机制，编码、巩固与提取，以及遗忘为何是学习的一部分。",
    icon: "layers",
    tone: "mist",
    keywords: ["记忆", "遗忘曲线", "工作记忆", "记忆巩固", "睡眠"],
  },
  {
    slug: "attention",
    title: "注意力与专注",
    englishTitle: "Attention & Focus",
    short: "专注",
    description: "注意力的选择、维持与切换机制，分心的代价，以及如何设计更需要深度专注的学习环境。",
    icon: "target",
    tone: "olive",
    keywords: ["注意力", "专注", "多任务", "深度工作", "分心"],
  },
  {
    slug: "learning-methods",
    title: "学习方法",
    englishTitle: "Learning Methods",
    short: "学习方法",
    description: "主动回忆、间隔重复、交错练习等有研究依据的方法：原理、步骤、适用场景与局限。",
    icon: "flask",
    tone: "sand",
    keywords: ["主动回忆", "间隔重复", "交错练习", "费曼技巧", "双重编码"],
  },
  {
    slug: "reading",
    title: "阅读与理解",
    englishTitle: "Reading & Comprehension",
    short: "阅读",
    description: "从有效阅读到批判性阅读与主题阅读，建立自己的阅读体系与阅读后的知识整理流程。",
    icon: "book",
    tone: "sage",
    keywords: ["阅读", "理解", "阅读笔记", "主题阅读", "速读"],
  },
  {
    slug: "thinking",
    title: "思维与推理",
    englishTitle: "Thinking & Reasoning",
    short: "思维",
    description: "批判性思维、逻辑与概率推理、认知偏差、系统思考与更好的决策。",
    icon: "compass",
    tone: "mist",
    keywords: ["批判性思维", "认知偏差", "第一性原理", "系统思考", "决策"],
  },
  {
    slug: "knowledge-management",
    title: "知识管理",
    englishTitle: "Knowledge Management",
    short: "知识管理",
    description: "第二大脑、卡片盒笔记法、PARA 与知识图谱，把信息转化为可以生长的个人知识体系。",
    icon: "network",
    tone: "olive",
    keywords: ["知识管理", "第二大脑", "Zettelkasten", "PARA", "知识卡片"],
  },
  {
    slug: "lifelong-learning",
    title: "终身学习",
    englishTitle: "Lifelong Learning",
    short: "终身学习",
    description: "成人学习、自主学习、习惯养成与长期成长系统，让学习成为可持续的生活方式。",
    icon: "sprout",
    tone: "sand",
    keywords: ["终身学习", "成人学习", "学习习惯", "目标", "成长"],
  },
];

export const categoryMap = Object.fromEntries(categories.map((c) => [c.slug, c])) as Record<
  CategorySlug,
  Category
>;

export const mainNav: NavItem[] = [
  { label: "首页", href: "/" },
  { label: "学习科学", href: "/learning-science", description: "理解学习的科学基础" },
  { label: "记忆科学", href: "/memory", description: "记忆的形成、巩固与提取" },
  { label: "学习方法", href: "/learning-methods", description: "有证据支持的学习方法" },
  { label: "阅读理解", href: "/reading", description: "有效阅读与理解" },
  { label: "思维推理", href: "/thinking", description: "推理、偏差与决策" },
  { label: "知识管理", href: "/knowledge-management", description: "构建个人知识体系" },
  { label: "资源导航", href: "/resources", description: "全球专业资源导航" },
  { label: "学习工具", href: "/tools", description: "可操作的个人学习工具" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Explore",
    items: [
      { label: "Learning Paths", href: "/learning-paths" },
      { label: "Books", href: "/books" },
      { label: "Resources", href: "/resources" },
      { label: "Visualizations", href: "/visualizations" },
      { label: "Search", href: "/search" },
    ],
  },
  {
    title: "About",
    items: [
      { label: "About", href: "/about" },
      { label: "Editorial Policy", href: "/editorial-policy" },
      { label: "Sources", href: "/sources" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/privacy#terms" },
      { label: "Sitemap", href: "/sitemap.xml" },
      { label: "RSS", href: "/feed.xml" },
    ],
  },
];

export const toolsList: NavItem[] = [
  { label: "Learning Dashboard", href: "/tools", description: "学习数据总览" },
  { label: "Study Tracker", href: "/tools/study-tracker", description: "记录每次学习" },
  { label: "Spaced Repetition", href: "/tools/spaced-repetition", description: "复习计划规划" },
  { label: "Active Recall", href: "/tools/active-recall", description: "主动回忆练习" },
  { label: "Reading Tracker", href: "/tools/reading-tracker", description: "阅读进度与笔记" },
  { label: "Learning Goals", href: "/tools/learning-goals", description: "目标拆解与追踪" },
  { label: "Knowledge Cards", href: "/tools/knowledge-cards", description: "卡片笔记" },
  { label: "Focus Timer", href: "/tools/focus-timer", description: "专注计时" },
  { label: "Weekly Review", href: "/tools/weekly-review", description: "每周学习复盘" },
];
