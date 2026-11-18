<a href="https://design.aiyazone.com/">
  <img src="https://raw.githubusercontent.com/AIYAZONE/design-system/master/public/logo.svg" alt="AIYAZONE DESIGN SYSTEM" width="206" height="44">
</a>

# AIYAZONE Design System

[简体中文](./README.md) · [English](./README.en.md)

ZDS is AIYAZONE's Web design system. It provides design tokens, Lit-based Web Components, icons, and internationalization for plain HTML and framework projects. Applications manage their own business data and page workflows.

[![CI](https://github.com/AIYAZONE/design-system/actions/workflows/ci.yml/badge.svg)](https://github.com/AIYAZONE/design-system/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@aiyazone/design-system?label=design-system)](https://www.npmjs.com/package/@aiyazone/design-system)
[![tokens](https://img.shields.io/npm/v/@aiyazone/tokens?label=tokens)](https://www.npmjs.com/package/@aiyazone/tokens)

[Documentation](https://design.aiyazone.com/) · [Components](https://design.aiyazone.com/storybook/) · [Icons](https://design.aiyazone.com/icons/) · [Examples](https://design.aiyazone.com/examples/) · [AI usage guide](https://design.aiyazone.com/ai-usage.html) · [Architecture overview](https://design.aiyazone.com/architecture.html)

## What's included

| Capability | Contents |
| --- | --- |
| Components | `zone-*` custom elements for buttons, selectors, dialogs, and notifications; [full API reference](./docs/api/README.md) |
| Design tokens and themes | Color, typography, spacing, and other tokens, plus v1, v2, and v3 theme CSS |
| Icons | SVG icons loaded through `<zone-icon>` |
| Internationalization | Translation APIs, declarative DOM translation, and language switching |
| AI reference material | [llms.txt](https://design.aiyazone.com/llms.txt), [llms-full.txt](https://design.aiyazone.com/llms-full.txt), and component APIs |

## Quick start

### npm projects

```bash
npm install @aiyazone/design-system lit
```

Register the components and load one theme in your application entry point:

```ts
import '@aiyazone/design-system';
import '@aiyazone/design-system/index-v3.css';
```

Use the components in HTML or your framework's templates:

```html
<zone-button variant="primary" icon="arrow-right">Get started</zone-button>
```

The npm entry point shares the application's Lit 3 installation and requires a bundler to resolve dependencies. Follow your framework's conventions for custom element configuration, event binding, and assigning complex properties.

### Static HTML via CDN

Save the following as an HTML file to use ZDS without build tools. This example pins the published and verified version `0.5.0`; keep JavaScript and CSS on the same version.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>ZDS example</title>
    <link rel="stylesheet" crossorigin
      href="https://cdn.jsdelivr.net/npm/@aiyazone/design-system@0.5.0/dist/index-v3.css">
    <script type="module" crossorigin
      src="https://cdn.jsdelivr.net/npm/@aiyazone/design-system@0.5.0/dist/cdn/index.js"></script>
  </head>
  <body>
    <zone-button variant="primary" icon="arrow-right">Get started</zone-button>
  </body>
</html>
```

The CDN entry point bundles Lit, components, icons, and translations, so no import map is needed. unpkg supports the same package version and file paths. Use either npm or CDN on a given page. See the [integration guide](./docs/usage.md#版本与回退) for upgrades and rollback.

### Design tokens only

```bash
npm install @aiyazone/tokens
```

```ts
import '@aiyazone/tokens/dist/tokens.css';
```

The tokens package does not depend on components or Lit. See the [token documentation](./docs/tokens) for token names and generated files.

## Integration notes

- Only `@aiyazone/design-system` and `@aiyazone/tokens` are published. core, icons, i18n, and utils are internal workspace modules; applications should import the main package.
- Customize components through public properties and CSS variables. Internal Shadow DOM class names are not stable interfaces.
- v1, v2, and v3 are theme versions. See [themes and styles](./docs/usage.md#主题与样式) for configuration.
- AI reference material provides component and token context. Generated pages still need interaction, responsive layout, and accessibility checks.

The linked integration guides, API reference, and roadmap are currently in Chinese.

## Local development

Use Node.js 22.13+ (CI uses Node 22) and pnpm 10.28.0. Run these commands from the repository root:

```bash
corepack enable
pnpm install
pnpm --filter @aiyazone/portal dev
```

| Command | Purpose |
| --- | --- |
| `pnpm storybook` | Start the component documentation |
| `pnpm design:build` | Build npm and CDN bundles, types, and themes |
| `pnpm portal:build:all` | Build the complete documentation site |
| `pnpm lint && pnpm type-check && pnpm test` | Check source code |
| `pnpm packages:test:browser` | Verify isolated installation and browser behavior of the packaged components at three viewport sizes; build first and install Chromium |

See [development and publishing](./docs/development.md) for the build order, complete checks, and release process.

## Repository structure

```text
apps/
  portal/       Documentation portal, architecture overview, and AI examples
  storybook/    Component documentation
  examples/     Page and component examples
packages/
  core/         Web Components
  icons/        SVG icons
  i18n/         Internationalization
  utils/        Internal utilities
  tokens/       Design token sources and generated files
src/            Main package entry points and global theme styles
docs/           Integration guides, APIs, tokens, and roadmap
scripts/        Build, validation, and release scripts
```

See the [ROADMAP](./docs/ROADMAP.md) for project progress and next steps.
