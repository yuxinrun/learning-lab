import { cn } from "@/lib/utils";

export const diagramNames = [
  "memory-processing",
  "working-memory-model",
  "long-term-memory",
  "forgetting-retrieval",
  "spaced-repetition-timeline",
  "active-recall-flow",
  "strategy-comparison",
  "cognitive-load",
  "reading-comprehension",
  "knowledge-network",
  "metacognition-cycle",
  "feedback-loop",
] as const;

export type DiagramName = (typeof diagramNames)[number];

export const diagramMeta: Record<DiagramName, { title: string; description: string }> = {
  "memory-processing": {
    title: "记忆信息处理流程",
    description: "信息经过注意进入容量有限的工作记忆，再通过编码进入可长期保存的记忆系统。",
  },
  "working-memory-model": {
    title: "工作记忆模型",
    description: "中央执行系统协调语音环路、视觉空间模板与情景缓冲器，并与长期记忆交互。",
  },
  "long-term-memory": {
    title: "长期记忆的结构",
    description: "长期记忆常被区分为语义、情景与程序性知识，类别之间并非彼此隔离。",
  },
  "forgetting-retrieval": {
    title: "遗忘与提取",
    description: "保持量随时间下降；在适当时间点提取会暂时提升可及性并减缓后续遗忘。",
  },
  "spaced-repetition-timeline": {
    title: "间隔重复时间轴",
    description: "复习点随掌握程度逐渐拉开；这只是可调整的启发式安排，而非通用固定周期。",
  },
  "active-recall-flow": {
    title: "主动回忆流程",
    description: "学习后脱离材料尝试提取，核对并修正缺口，再安排下一次提取。",
  },
  "strategy-comparison": {
    title: "学习策略对比",
    description: "重读带来熟悉感，而提取与间隔通常带来更持久的保持，尽管过程更费力。",
  },
  "cognitive-load": {
    title: "认知负荷示意",
    description: "内在负荷取决于材料复杂度，外在负荷来自呈现方式，相关负荷指向图式建构。",
  },
  "reading-comprehension": {
    title: "阅读理解过程",
    description: "理解是解码、语言加工、情境整合与已有知识共同作用的结果。",
  },
  "knowledge-network": {
    title: "知识网络结构",
    description: "概念通过有意义的关系连接；连接越丰富，提取路径通常越多。",
  },
  "metacognition-cycle": {
    title: "元认知循环",
    description: "计划、监控、评估与调整构成持续循环的自我调节过程。",
  },
  "feedback-loop": {
    title: "学习反馈闭环",
    description: "目标、行动、反馈、比较与调整形成闭环，使下一次行动更接近目标。",
  },
};

const S = "hsl(var(--primary))";
const F = "hsl(var(--foreground))";
const M = "hsl(var(--muted-foreground))";
const B = "hsl(var(--border))";
const SURF = "hsl(var(--surface))";

function Frame({
  name,
  children,
  className,
}: {
  name: DiagramName;
  children: React.ReactNode;
  className?: string;
}) {
  const meta = diagramMeta[name];
  return (
    <svg
      viewBox="0 0 800 400"
      className={cn("h-auto w-full", className)}
      role="img"
      aria-labelledby={`dg-${name}-title dg-${name}-desc`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={`dg-${name}-title`}>{meta.title}</title>
      <desc id={`dg-${name}-desc`}>{meta.description}</desc>
      <defs>
        <marker id={`arrow-${name}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={S} />
        </marker>
      </defs>
      {children}
    </svg>
  );
}

function Node({
  x,
  y,
  w = 130,
  h = 54,
  label,
  sub,
  filled,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
  sub?: string;
  filled?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="6"
        fill={filled ? S : SURF}
        stroke={filled ? S : B}
        strokeWidth="1.4"
      />
      <text
        x={x + w / 2}
        y={sub ? y + h / 2 - 5 : y + h / 2 + 5}
        textAnchor="middle"
        fontSize="15"
        fontWeight="600"
        fill={filled ? "white" : F}
      >
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 15} textAnchor="middle" fontSize="11" fill={filled ? "rgba(255,255,255,0.82)" : M}>
          {sub}
        </text>
      )}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, name, label }: { x1: number; y1: number; x2: number; y2: number; name: DiagramName; label?: string }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={S} strokeWidth="1.8" markerEnd={`url(#arrow-${name})`} />
      {label && (
        <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 9} textAnchor="middle" fontSize="11" fill={M}>
          {label}
        </text>
      )}
    </g>
  );
}

function Caption({ x, y, children }: { x: number; y: number; children: React.ReactNode }) {
  return (
    <text x={x} y={y} textAnchor="middle" fontSize="12" fill={M}>
      {children}
    </text>
  );
}

const diagrams: Record<DiagramName, () => React.JSX.Element> = {
  "memory-processing": () => (
    <Frame name="memory-processing">
      <Node x={30} y={150} label="环境信息" sub="感官输入" />
      <Node x={205} y={150} label="感觉记忆" sub="极短暂存" />
      <Node x={380} y={150} label="工作记忆" sub="容量有限" filled />
      <Node x={555} y={150} label="长期记忆" sub="编码后保存" />
      <Arrow x1={160} y1={177} x2={200} y2={177} name="memory-processing" />
      <Arrow x1={335} y1={177} x2={375} y2={177} name="memory-processing" label="注意" />
      <Arrow x1={510} y1={177} x2={550} y2={177} name="memory-processing" label="编码" />
      <path d="M 620 150 C 620 80, 445 80, 445 150" fill="none" stroke={S} strokeWidth="1.6" strokeDasharray="5 4" markerEnd="url(#arrow-memory-processing)" />
      <Caption x={532} y={78}>提取回到工作记忆</Caption>
      <Caption x={400} y={260}>注意决定哪些信息进入有限的加工空间；编码质量影响日后能否提取。</Caption>
    </Frame>
  ),
  "working-memory-model": () => (
    <Frame name="working-memory-model">
      <Node x={315} y={30} w={170} label="中央执行系统" sub="注意控制与协调" filled />
      <Node x={60} y={190} w={180} label="语音环路" sub="语言与声音材料" />
      <Node x={310} y={190} w={180} label="视觉空间模板" sub="图像与空间关系" />
      <Node x={560} y={190} w={180} label="情景缓冲器" sub="整合多源信息" />
      <Node x={315} y={330} w={170} label="长期记忆" sub="知识与经验" />
      <Arrow x1={400} y1={84} x2={150} y2={185} name="working-memory-model" />
      <Arrow x1={400} y1={84} x2={400} y2={185} name="working-memory-model" />
      <Arrow x1={400} y1={84} x2={650} y2={185} name="working-memory-model" />
      <Arrow x1={400} y1={245} x2={400} y2={325} name="working-memory-model" label="写入 / 提取" />
    </Frame>
  ),
  "long-term-memory": () => (
    <Frame name="long-term-memory">
      <Node x={300} y={40} w={200} label="长期记忆" filled />
      <Node x={50} y={210} w={190} label="语义记忆" sub="事实与概念" />
      <Node x={305} y={210} w={190} label="情景记忆" sub="个人经历与情境" />
      <Node x={560} y={210} w={190} label="程序性记忆" sub="技能与习惯" />
      <Arrow x1={370} y1={94} x2={145} y2={205} name="long-term-memory" />
      <Arrow x1={400} y1={94} x2={400} y2={205} name="long-term-memory" />
      <Arrow x1={430} y1={94} x2={655} y2={205} name="long-term-memory" />
      <Caption x={400} y={320}>分类是理解记忆的便利框架，真实记忆系统之间存在复杂交互。</Caption>
    </Frame>
  ),
  "forgetting-retrieval": () => (
    <Frame name="forgetting-retrieval">
      <line x1={70} y1={320} x2={740} y2={320} stroke={B} strokeWidth="1.5" />
      <line x1={70} y1={320} x2={70} y2={50} stroke={B} strokeWidth="1.5" />
      <Caption x={400} y={356}>时间 →</Caption>
      <text x={40} y={70} fontSize="11" fill={M}>保持</text>
      <path d="M 75 80 C 200 190, 330 235, 720 285" fill="none" stroke={M} strokeWidth="2" strokeDasharray="6 5" />
      <path d="M 75 80 C 150 150, 205 165, 240 175 L 250 178 C 290 195, 340 205, 420 220 L 430 220 C 520 240, 620 260, 720 278" fill="none" stroke={S} strokeWidth="3" />
      <circle cx={245} cy={176} r="6" fill={S} />
      <circle cx={428} cy={220} r="6" fill={S} />
      <line x1={245} y1={176} x2={245} y2={320} stroke={B} strokeDasharray="3 4" />
      <line x1={428} y1={220} x2={428} y2={320} stroke={B} strokeDasharray="3 4" />
      <Caption x={245} y={345}>提取 1</Caption>
      <Caption x={428} y={345}>提取 2</Caption>
      <Caption x={180} y={115}>每次成功提取会提高之后的</Caption>
      <Caption x={180} y={133}>可及性，但曲线形状因人而异。</Caption>
    </Frame>
  ),
  "spaced-repetition-timeline": () => (
    <Frame name="spaced-repetition-timeline">
      <line x1={60} y1={200} x2={750} y2={200} stroke={B} strokeWidth="2" />
      {[
        { x: 100, t: "第 0 天", label: "学习", f: true },
        { x: 210, t: "第 1 天", label: "复习 1" },
        { x: 360, t: "第 3 天", label: "复习 2" },
        { x: 540, t: "第 8 天", label: "复习 3" },
        { x: 730, t: "第 20 天", label: "复习 4" },
      ].map((p) => (
        <g key={p.t}>
          <circle cx={p.x} cy={200} r="9" fill={p.f ? S : "white"} stroke={S} strokeWidth="2" />
          <text x={p.x} y={168} textAnchor="middle" fontSize="12" fontWeight="600" fill={F}>{p.label}</text>
          <text x={p.x} y={235} textAnchor="middle" fontSize="11" fill={M}>{p.t}</text>
        </g>
      ))}
      <path d="M 109 190 C 160 150, 180 150, 201 190" fill="none" stroke={S} strokeWidth="1.5" />
      <path d="M 219 190 C 280 140, 310 140, 351 190" fill="none" stroke={S} strokeWidth="1.5" />
      <path d="M 369 190 C 440 130, 470 130, 531 190" fill="none" stroke={S} strokeWidth="1.5" />
      <path d="M 549 190 C 630 120, 660 120, 721 190" fill="none" stroke={S} strokeWidth="1.5" />
      <Caption x={400} y={310}>应对答错的内容缩短间隔；间隔长不代表一定更好。</Caption>
      <Caption x={400} y={332}>这是可调整的学习辅助方案，不是所有人通用的科学固定周期。</Caption>
    </Frame>
  ),
  "active-recall-flow": () => (
    <Frame name="active-recall-flow">
      <Node x={35} y={150} w={120} label="学习" />
      <Node x={195} y={150} w={120} label="合上材料" />
      <Node x={355} y={150} w={120} label="尝试回忆" filled />
      <Node x={515} y={150} w={120} label="核对修正" />
      <Node x={675} y={150} w={90} label="再安排" />
      <Arrow x1={155} y1={177} x2={190} y2={177} name="active-recall-flow" />
      <Arrow x1={315} y1={177} x2={350} y2={177} name="active-recall-flow" />
      <Arrow x1={475} y1={177} x2={510} y2={177} name="active-recall-flow" />
      <Arrow x1={635} y1={177} x2={670} y2={177} name="active-recall-flow" />
      <path d="M 720 205 C 720 300, 415 300, 415 210" fill="none" stroke={S} strokeWidth="1.6" strokeDasharray="5 4" markerEnd="url(#arrow-active-recall-flow)" />
      <Caption x={400} y={290}>把“我认识”变成“我能想起来”</Caption>
    </Frame>
  ),
  "strategy-comparison": () => (
    <Frame name="strategy-comparison">
      <Caption x={150} y={50}>重复阅读</Caption>
      <Caption x={400} y={50}>提取练习</Caption>
      <Caption x={650} y={50}>提取 + 间隔</Caption>
      {[
        { x: 70, h: 90, c: M },
        { x: 320, h: 160, c: S },
        { x: 570, h: 225, c: S },
      ].map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={300 - b.h} width="160" height={b.h} rx="4" fill={b.c} opacity={i === 0 ? 0.45 : 0.85} />
          <text x={b.x + 80} y={318} textAnchor="middle" fontSize="12" fill={M}>
            {["即时熟悉感强", "过程更费力", "保持更持久"][i]}
          </text>
        </g>
      ))}
      <line x1={50} y1={300} x2={760} y2={300} stroke={B} />
      <Caption x={400} y={362}>示意性对比：实际效果取决于材料、目标与学习者，并非固定比例。</Caption>
    </Frame>
  ),
  "cognitive-load": () => (
    <Frame name="cognitive-load">
      <rect x={90} y={80} width="150" height="210" rx="4" fill={S} opacity="0.8" />
      <rect x={240} y={130} width="150" height="160" rx="4" fill="hsl(var(--sand))" />
      <rect x={390} y={195} width="150" height="95" rx="4" fill="hsl(var(--mist))" />
      <Caption x={165} y={60}>内在负荷</Caption>
      <Caption x={315} y={110}>外在负荷</Caption>
      <Caption x={465} y={175}>相关负荷</Caption>
      <Caption x={165} y={312}>材料本身的复杂度</Caption>
      <Caption x={315} y={312}>呈现方式造成的额外负担</Caption>
      <Caption x={465} y={312}>用于建构图式的努力</Caption>
      <Caption x={650} y={180}>好的设计：降低外在负荷，</Caption>
      <Caption x={650} y={200}>把资源留给理解与图式建构。</Caption>
    </Frame>
  ),
  "reading-comprehension": () => (
    <Frame name="reading-comprehension">
      <Node x={25} y={155} w={110} label="文本" />
      <Node x={170} y={155} w={110} label="解码" sub="字词识别" />
      <Node x={315} y={155} w={110} label="语义整合" />
      <Node x={460} y={155} w={110} label="情境模型" filled />
      <Node x={605} y={155} w={150} label="已有知识" sub="推断与解释" />
      <Arrow x1={135} y1={182} x2={165} y2={182} name="reading-comprehension" />
      <Arrow x1={280} y1={182} x2={310} y2={182} name="reading-comprehension" />
      <Arrow x1={425} y1={182} x2={455} y2={182} name="reading-comprehension" />
      <Arrow x1={605} y1={182} x2={575} y2={182} name="reading-comprehension" />
      <Caption x={400} y={280}>理解不是被动接收，而是把文本与已有知识主动整合的过程。</Caption>
    </Frame>
  ),
  "knowledge-network": () => (
    <Frame name="knowledge-network">
      {[
        { x: 400, y: 195, r: 30, t: "核心概念", f: true },
        { x: 220, y: 100, r: 22, t: "概念 A" },
        { x: 590, y: 105, r: 22, t: "概念 B" },
        { x: 165, y: 285, r: 22, t: "实例 1" },
        { x: 625, y: 285, r: 22, t: "实例 2" },
        { x: 400, y: 340, r: 22, t: "反例" },
        { x: 390, y: 60, r: 20, t: "问题" },
      ].map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={n.r} fill={n.f ? S : SURF} stroke={S} strokeWidth="2" />
          <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="11" fontWeight="600" fill={n.f ? "white" : F}>
            {n.t}
          </text>
        </g>
      ))}
      {[
        [400, 195, 220, 100],
        [400, 195, 590, 105],
        [400, 195, 165, 285],
        [400, 195, 625, 285],
        [400, 195, 400, 340],
        [400, 195, 390, 60],
        [220, 100, 390, 60],
        [590, 105, 625, 285],
      ].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={S} strokeWidth="1.4" opacity="0.55" />
      ))}
      <Caption x={400} y={392}>连接的质量比卡片数量更重要</Caption>
    </Frame>
  ),
  "metacognition-cycle": () => (
    <Frame name="metacognition-cycle">
      {[
        { x: 150, y: 110, t: "计划", s: "设定目标与策略" },
        { x: 470, y: 110, t: "监控", s: "过程中观察理解" },
        { x: 470, y: 270, t: "评估", s: "对照结果判断" },
        { x: 150, y: 270, t: "调整", s: "修改策略与节奏" },
      ].map((n) => (
        <Node key={n.t} x={n.x} y={n.y} w={180} h={62} label={n.t} sub={n.s} filled={n.t === "监控"} />
      ))}
      <Arrow x1={330} y1={141} x2={465} y2={141} name="metacognition-cycle" />
      <path d="M 560 172 L 560 265" stroke={S} strokeWidth="1.8" markerEnd="url(#arrow-metacognition-cycle)" />
      <path d="M 470 301 L 335 301" stroke={S} strokeWidth="1.8" markerEnd="url(#arrow-metacognition-cycle)" />
      <path d="M 240 265 L 240 178" stroke={S} strokeWidth="1.8" markerEnd="url(#arrow-metacognition-cycle)" />
    </Frame>
  ),
  "feedback-loop": () => (
    <Frame name="feedback-loop">
      <Node x={30} y={160} w={130} label="目标标准" />
      <Node x={200} y={160} w={130} label="采取行动" filled />
      <Node x={370} y={160} w={130} label="获得反馈" />
      <Node x={540} y={160} w={130} label="比较差距" />
      <Node x={690} y={160} w={80} label="调整" />
      <Arrow x1={160} y1={187} x2={195} y2={187} name="feedback-loop" />
      <Arrow x1={330} y1={187} x2={365} y2={187} name="feedback-loop" />
      <Arrow x1={500} y1={187} x2={535} y2={187} name="feedback-loop" />
      <Arrow x1={670} y1={187} x2={685} y2={187} name="feedback-loop" />
      <path d="M 730 215 C 730 320, 265 320, 265 215" fill="none" stroke={S} strokeWidth="1.7" strokeDasharray="5 4" markerEnd="url(#arrow-feedback-loop)" />
      <Caption x={400} y={290}>反馈只有在能被用来调整下一步行动时才真正有效。</Caption>
    </Frame>
  ),
};

export function ScienceDiagram({ name, className }: { name: string; className?: string }) {
  const key = diagramNames.includes(name as DiagramName) ? (name as DiagramName) : "memory-processing";
  const Diagram = diagrams[key];
  return <div className={className}><Diagram /></div>;
}
