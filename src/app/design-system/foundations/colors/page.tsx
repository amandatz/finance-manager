const INK_SCALE = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const LAVENDER_SCALE = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const SEMANTIC_TOKENS: Array<{ name: string; variable: string; light: string; dark: string }> = [
  { name: "Background", variable: "--background", light: "ink-50", dark: "ink-950" },
  { name: "Foreground", variable: "--foreground", light: "ink-950", dark: "ink-50" },
  { name: "Surface", variable: "--surface", light: "white", dark: "ink-900" },
  { name: "Surface elevated", variable: "--surface-elevated", light: "white", dark: "ink-800" },
  { name: "Primary", variable: "--primary", light: "lavender-600", dark: "lavender-400" },
  { name: "Secondary", variable: "--secondary", light: "ink-100", dark: "ink-800" },
  { name: "Muted", variable: "--muted", light: "ink-100", dark: "ink-800" },
  { name: "Accent", variable: "--accent", light: "lavender-100", dark: "lavender-950" },
  { name: "Border", variable: "--border", light: "ink-200", dark: "ink-800" },
  { name: "Ring", variable: "--ring", light: "lavender-500", dark: "lavender-400" },
];

const STATUS_TOKENS: Array<{ name: string; variable: string }> = [
  { name: "Success", variable: "--success" },
  { name: "Warning", variable: "--warning" },
  { name: "Destructive", variable: "--destructive" },
  { name: "Info", variable: "--info" },
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
              className="h-12 w-12 rounded-lg border border-border/60"
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
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
      <div
        className="h-10 w-10 shrink-0 rounded-lg border border-border/60"
        style={{ background: `var(${cssVar})` }}
      />
      <div className="flex min-w-0 flex-col">
        <span className="text-sm font-medium">{label}</span>
        <code className="truncate text-xs text-muted-foreground">{sublabel ?? cssVar}</code>
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
          Two layers: context-free <strong className="text-foreground">primitives</strong> (the raw
          ink and lavender scales below), and <strong className="text-foreground">semantic tokens</strong>{" "}
          that assign a primitive to a role like &ldquo;surface&rdquo; or &ldquo;ring&rdquo; per theme.
          Components only ever consume the semantic layer — toggle the theme switcher in the header
          to see every swatch on this page update live.
        </p>
      </div>

      <section className="flex flex-col gap-6">
        <h2 className="text-lg font-semibold">Primitives</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          <code>ink</code> is a charcoal neutral scale with a faint lavender undertone — used for the
          dark theme&rsquo;s base instead of pure black. <code>lavender</code> is the primary accent.
        </p>
        <ScaleRow name="ink" prefix="ink" steps={INK_SCALE} />
        <ScaleRow name="lavender" prefix="lavender" steps={LAVENDER_SCALE} />
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
          Distinct, accessible hues for success, warning, destructive, and informational states —
          each paired with a matching <code>-foreground</code> token for text placed on top of it.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {STATUS_TOKENS.map((token) => (
            <TokenSwatch key={token.variable} label={token.name} cssVar={token.variable} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-lg font-semibold">Chart colors</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          A six-color categorical palette for data visualization, kept visually distinct from the
          semantic status colors above.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {CHART_TOKENS.map((token) => (
            <TokenSwatch key={token.variable} label={token.name} cssVar={token.variable} />
          ))}
        </div>
      </section>
    </div>
  );
}
