# @aiyazone/design-system

## 0.4.1

### Patch Changes

- Recover the release after the original v0.4.0 attempt failed. Require matching GitHub repository metadata for both public packages before OIDC publication, and add the tokens repository metadata required by npm provenance. Preserve the original v0.4.0 tag.

## 0.4.0

### Minor Changes

- Split npm and CDN entry points: npm shares the application's Lit 3 runtime, while `dist/cdn/index.js` includes the browser runtime, components, dynamic icons and translations. Load theme CSS separately at the same version. Existing browser URLs pointing at `dist/index.esm.js` must migrate to the CDN entry.

  Publish only the design-system bundle and tokens. Core, icons, i18n and utils remain private workspace modules. Include component subpath/type fixes, shared registration and language state fixes, and the CommonJS dynamic icon fix in the public bundle.
