import Link from "next/link";
import { ArrowRight, Compass, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

function HeroArt() {
  const nodes = [
    { x: 310, y: 96, r: 8 },
    { x: 220, y: 148, r: 5 },
    { x: 404, y: 150, r: 6 },
    { x: 172, y: 232, r: 7 },
    { x: 448, y: 236, r: 5 },
    { x: 310, y: 208, r: 10 },
    { x: 258, y: 286, r: 5 },
    { x: 372, y: 292, r: 7 },
  ];
  const edges = [
    [0, 1], [0, 2], [0, 5], [1, 5], [2, 5], [1, 3], [2, 4], [5, 6], [5, 7], [3, 6], [4, 7], [6, 7],
  ];
  return (
    <svg viewBox="0 0 620 520" className="h-auto w-full" role="img" aria-label="书本、知识网络与学习路径的抽象科学插画">
      <defs>
        <linearGradient id="hero-paper" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(var(--surface))" />
          <stop offset="100%" stopColor="hsl(var(--background))" />
        </linearGradient>
        <linearGradient id="hero-book" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.22" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      <rect x="70" y="40" width="480" height="440" rx="10" fill="url(#hero-paper)" stroke="hsl(var(--border))" />
      <circle cx="310" cy="205" r="134" fill="none" stroke="hsl(var(--primary))" strokeOpacity="0.16" />
      <circle cx="310" cy="205" r="96" fill="none" stroke="hsl(var(--primary))" strokeOpacity="0.12" strokeDasharray="4 6" />

      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="hsl(var(--primary))"
          strokeOpacity="0.35"
          strokeWidth="1.2"
        />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={n.r + 5} fill="hsl(var(--primary))" fillOpacity="0.08" />
          <circle cx={n.x} cy={n.y} r={n.r} fill={i === 5 ? "hsl(var(--primary))" : "hsl(var(--card))"} stroke="hsl(var(--primary))" strokeWidth="1.6" />
        </g>
      ))}

      <g transform="translate(0, 28)">
        <path d="M 155 382 C 220 358, 274 358, 310 376 C 346 358, 400 358, 465 382 L 465 440 C 400 418, 346 418, 310 436 C 274 418, 220 418, 155 440 Z" fill="url(#hero-book)" stroke="hsl(var(--primary))" strokeWidth="1.5" />
        <line x1="310" y1="376" x2="310" y2="436" stroke="hsl(var(--primary))" strokeOpacity="0.6" strokeWidth="1.2" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <path d={`M 178 ${392 + i * 13} C 228 ${375 + i * 13}, 272 ${377 + i * 13}, 298 ${388 + i * 13}`} fill="none" stroke="hsl(var(--primary))" strokeOpacity="0.3" strokeWidth="1" />
            <path d={`M 322 ${388 + i * 13} C 348 ${377 + i * 13}, 392 ${375 + i * 13}, 442 ${392 + i * 13}`} fill="none" stroke="hsl(var(--primary))" strokeOpacity="0.3" strokeWidth="1" />
          </g>
        ))}
      </g>

      <g fontSize="11" fill="hsl(var(--muted-foreground))" fontFamily="var(--font-sans)">
        <rect x="92" y="86" width="96" height="30" rx="4" fill="hsl(var(--card))" stroke="hsl(var(--border))" />
        <text x="140" y="105" textAnchor="middle">编码 · Encoding</text>
        <rect x="432" y="300" width="104" height="30" rx="4" fill="hsl(var(--card))" stroke="hsl(var(--border))" />
        <text x="484" y="319" textAnchor="middle">提取 · Retrieval</text>
        <rect x="96" y="300" width="90" height="30" rx="4" fill="hsl(var(--card))" stroke="hsl(var(--border))" />
        <text x="141" y="319" textAnchor="middle">注意 · Attention</text>
      </g>
    </svg>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-gradient-to-b from-surface/60 to-background">
      <div className="container grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="animate-fade-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Evidence-based ideas for lifelong learners
          </div>
          <h1 className="font-serif text-[46px] font-semibold leading-[1.1] tracking-tight sm:text-[58px] lg:text-[68px]">
            Learn How
            <br />
            to <span className="text-primary">Learn.</span>
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-[1.9] text-muted-foreground">
            探索学习科学、记忆、认知与思维的奥秘，用更科学的方法构建自己的知识体系。
          </p>
          <p className="mt-2 font-serif text-sm italic text-muted-foreground/80">
            Evidence-based ideas and practical tools for lifelong learners.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/learning-science">
                探索学习科学 <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/tools">
                <Compass className="h-4 w-4" /> 发现学习工具
              </Link>
            </Button>
          </div>
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-6 text-xs text-muted-foreground">
            <span><strong className="mr-1 font-semibold text-foreground">8</strong> 个知识分类</span>
            <span><strong className="mr-1 font-semibold text-foreground">30+</strong> 篇深度文章</span>
            <span><strong className="mr-1 font-semibold text-foreground">15</strong> 种学习方法</span>
            <span><strong className="mr-1 font-semibold text-foreground">9</strong> 个实用工具</span>
          </div>
        </div>
        <div className="animate-fade-in lg:pl-4">
          <HeroArt />
        </div>
      </div>
    </section>
  );
}
