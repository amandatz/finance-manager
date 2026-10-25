const NEUTRAL_SCALE = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const LILAC_SCALE = [300, 400, 500, 600, 700];
const CLAY_SCALE = [300, 500, 700];

const SEMANTIC_TOKENS: Array<{ name: string; variable: string; light: string; dark: string }> = [
  { name: "Background", variable: "--background", light: "neutral-50", dark: "neutral-950" },
  { name: "Foreground", variable: "--foreground", light: "neutral-900", dark: "neutral-50" },
  { name: "Surface", variable: "--surface", light: "neutral-0", dark: "neutral-900" },
  { name: "Surface elevated", variable: "--surface-elevated", light: "neutral-0", dark: "neutral-800" },
  { name: "Primary / Accent", variable: "--accent", light: "neutral-900 (black)", dark: "neutral-50 (white)" },
  { name: "Secondary", variable: "--secondary", light: "neutral-100", dark: "neutral-800" },
  { name: "Muted", variable: "--muted", light: "neutral-100", dark: "neutral-800" },
  { name: "Border", variable: "--border", light: "neutral-200", dark: "neutral-800" },
  { name: "Ring", variable: "--ring", light: "neutral-900", dark: "neutral-50" },
];

const STATUS_TOKENS: Array<{ name: string; variable: string }> = [
  { name: "Status success (text only)", variable: "--status-success" },
  { name: "Status danger (text only)", variable: "--status-danger" },
];

const CHART_TOKENS = [1, 2, 3, 4, 5, 6].map((n) => ({ name: `Chart ${n}`, variable: `--chart-${n}` }));

function ScaleRow({ name, prefix, steps }: { name: string; prefix: string; steps: number[] }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium">{name}</p>
      <div className="flex flex-wrap gap-2">
        {steps.map((step) => (
          <div key={step} className="flex flex-col items-center gap-1.5">
            <div
              className="h-12 w-12 rounded-sm border border-border/60"
              style={{ background: `var(--${prefix}-${step})` }}
            />
            <span className="text-xs text-muted-foreground">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TokenSwatch({ label, cssVar, sublabel }: { label: string; cssVar: string; sublabel?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-card border border-border bg-surface p-3">
      <div
        className="h-10 w-10 shrink-0 rounded-sm border border-border/60"
        style={{ background: `var(${cssVar})` }}
      />
      <div className="flex min-w-0 flex-col">
        <span className="text-sm font-medium">{label}</span>
        <code className="truncate text-xs text-muted-foreground">{sublabel ?? cssVar}</code>
      </div>
    </div>
  );
}

function GradientSwatch({ label, cssVar }: { label: string; cssVar: string }) {
  return (
    <div className="flex items-center gap-3 rounded-card border border-border bg-surface p-3">
      <div className="h-10 w-16 shrink-0 rounded-sm" style={{ backgroundImage: `var(${cssVar})` }} />
      <div className="flex min-w-0 flex-col">
        <span className="text-sm font-medium">{label}</span>
        <code className="truncate text-xs text-muted-foreground">{cssVar}</code>
      </div>
    </div>
  );
}

export default function ColorsFoundationPage() {
  return (
    <div className="flex flex-col gap-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Colors</h1>
        <p className="max-w-2xl text-muted-foreground">
          Two layers: context-free <strong className="text-foreground">primitives</strong> (the
          neutral scale plus two single-purpose accents below), and{" "}
          <strong className="text-foreground">semantic tokens</strong> that assign a primitive to a
          role like &ldquo;surface&rdquo; or &ldquo;ring&rdquo; per theme. Components only ever
          consume the semantic layer — toggle the theme switcher in the header to see every swatch
          on this page update live.
        </p>
      </div>

      <section className="flex flex-col gap-6">
        <h2 className="text-lg font-semibold">Primitives</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          <code>neutral</code> is a true-gray scale with no undertone — black (
          <code>neutral-900</code>) is the system&rsquo;s one accent for primary actions and the
          highlighted &ldquo;Total Balance&rdquo; card. <code>lilac</code> is reserved for charts,
          with one documented exception (the &ldquo;Income&rdquo; KPI card gradient). <code>clay</code>{" "}
          exists solely for the &ldquo;Expenses&rdquo; KPI card gradient — neither accent appears in
          buttons, badges, or borders.
        </p>
        <ScaleRow name="neutral" prefix="neutral" steps={NEUTRAL_SCALE} />
        <ScaleRow name="lilac (charts only, 600/700 reserved for the Income gradient)" prefix="lilac" steps={LILAC_SCALE} />
        <ScaleRow name="clay (Expenses gradient only)" prefix="clay" steps={CLAY_SCALE} />
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-lg font-semibold">Semantic tokens</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Each row shows which primitive the token resolves to in light vs. dark mode. The swatch
          reflects whichever theme is active right now.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {SEMANTIC_TOKENS.map((token) => (
            <TokenSwatch
              key={token.variable}
              label={token.name}
              cssVar={token.variable}
              sublabel={`light: ${token.light} · dark: ${token.dark}`}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-lg font-semibold">Status colors</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Green and red appear only as text color (status labels, trend arrows) — never as a
          background fill on a badge, card, or button.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {STATUS_TOKENS.map((token) => (
            <div key={token.variable} className="flex items-center gap-3 rounded-card border border-border bg-surface p-3">
              <span className="text-sm font-semibold" style={{ color: `var(${token.variable})` }}>
                Aa
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="text-sm font-medium">{token.name}</span>
                <code className="truncate text-xs text-muted-foreground">{token.variable}</code>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-lg font-semibold">Chart colors</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          A six-color categorical palette for data visualization — the first three are lilac shades,
          kept visually distinct from the semantic status colors above.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {CHART_TOKENS.map((token) => (
            <TokenSwatch key={token.variable} label={token.name} cssVar={token.variable} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-lg font-semibold">KPI gradients</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Reserved for exactly the three highlighted KPI cards on the dashboard — never used
          elsewhere. Each card gets its own saturated hue family, ordered by emphasis: black
          (primary), lilac (secondary), clay (tertiary).
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <GradientSwatch label="Accent (Total Balance)" cssVar="--gradient-kpi-accent" />
          <GradientSwatch label="Secondary (Income this month)" cssVar="--gradient-kpi-secondary" />
          <GradientSwatch label="Tertiary (Expenses this month)" cssVar="--gradient-kpi-tertiary" />
        </div>
      </section>
    </div>
  );
}
