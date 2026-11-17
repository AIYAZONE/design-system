# AIYAZONE Design System site design

This system applies to the public portal routes. Keep existing route ownership and generated Storybook pages intact.

## Product position

AIYAZONE Design System is a small, framework-neutral UI foundation: design tokens, Lit Web Components, icons, localization utilities, and generated implementation references. AI-readable files provide context. They do not constrain model output. The repository's own AI sample is checked by CI; consumer projects need their own checks.

## Genre and voice

- Genre: technical editorial, built like a component standard rather than a SaaS sales page.
- Home page: specimen-led index. Lead with one concise claim, show running ZDS elements directly, then trace source → generated references → consumer page.
- Architecture page: Long Document organized as current state, source-to-consumer flow, automated checks, and explicitly future work.
- Reference pages: single reading column with clear section titles and practical examples.
- Copy: specific, calm, factual. Label shipped capabilities and future ideas separately. Do not imply every AI output is automatically compliant.

## Theme

The canonical CSS values live in the root tokens.css file.

- Paper: nearly white neutral.
- Ink: near-black graphite with strong text contrast.
- Muted text and rules: neutral gray; rules provide the page grid.
- Accent: dark AIYAZONE orange for controls; brighter brand orange is reserved for tiny status marks.
- Display, body, and code use named font tokens.
- No gradient text, decorative glow, glass surfaces, soft floating cards, or invented usage metrics.
- Prefer square edges, direct typography, and explicit rules over shadows, pills, and repeated panels.

## Interaction

- CTAs use one orange filled action and quiet text links.
- Component previews use real ZDS elements registered from the workspace packages.
- No decorative motion. Respect reduced-motion preferences.
- All text links and controls remain single-line at narrow widths.

## Shared structure

- Header navigation stays consistent across portal routes, with a compact wordmark and ruled active state.
- Home leads with a typographic statement and a live component bench, then shows the source path, the exact AI sample checks, and install commands.
- Architecture separates what exists from what is considered later.
- AI guidance describes recommendations and the checks that actually run.

## Exports

### tokens.css

See the root tokens.css.

### Tailwind v4

~~~css
@theme {
  --color-paper: oklch(98.5% 0.003 95);
  --color-ink: oklch(17% 0.008 50);
  --color-accent: oklch(52% 0.19 38);
  --color-accent-bright: oklch(76% 0.16 48);
  --color-on-dark-muted: oklch(100% 0 0 / 0.72);
  --color-on-dark-copy: oklch(91% 0.003 95);
  --color-on-dark-rule: oklch(100% 0 0 / 0.24);
  --color-accent-bright: oklch(76% 0.16 48);
  --color-on-dark-muted: oklch(100% 0 0 / 0.72);
  --color-on-dark-copy: oklch(91% 0.003 95);
  --color-on-dark-rule: oklch(100% 0 0 / 0.24);
  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif;
  --font-mono: ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, monospace;
  --spacing-4: 1rem;
  --spacing-8: 2rem;
}
~~~

### DTCG

~~~json
{
  "color": {
    "paper": { "$value": "oklch(98.5% 0.003 95)", "$type": "color" },
    "ink": { "$value": "oklch(17% 0.008 50)", "$type": "color" },
    "accent": { "$value": "oklch(52% 0.19 38)", "$type": "color" },
    "accentBright": { "$value": "oklch(76% 0.16 48)", "$type": "color" },
    "onDarkMuted": { "$value": "oklch(100% 0 0 / 0.72)", "$type": "color" },
    "onDarkCopy": { "$value": "oklch(91% 0.003 95)", "$type": "color" },
    "onDarkRule": { "$value": "oklch(100% 0 0 / 0.24)", "$type": "color" }
  },
  "font": {
    "sans": { "$value": "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, PingFang SC, sans-serif", "$type": "fontFamily" },
    "mono": { "$value": "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", "$type": "fontFamily" }
  },
  "space": {
    "4": { "$value": "1rem", "$type": "dimension" },
    "8": { "$value": "2rem", "$type": "dimension" }
  }
}
~~~

### shadcn/ui

~~~css
:root {
  --background: 98.5% 0.003 95;
  --foreground: 17% 0.008 50;
  --primary: 52% 0.19 38;
  --border: 88% 0.01 92;
  --ring: 52% 0.19 38;
  --radius: 0.5rem;
}
~~~
