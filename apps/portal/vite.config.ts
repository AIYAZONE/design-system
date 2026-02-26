import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

const tryReadJson = (filePath: string) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>;
  } catch {
    return null;
  }
};

const findUp = (startDir: string, matcher: (pkg: Record<string, unknown>) => boolean) => {
  let current = startDir;
  for (let i = 0; i < 12; i += 1) {
    const pkgPath = path.join(current, 'package.json');
    const pkg = tryReadJson(pkgPath);
    if (pkg && matcher(pkg)) return { dir: current, pkg };
    const next = path.dirname(current);
    if (next === current) break;
    current = next;
  }
  return null;
};

const jdsRoot = findUp(process.cwd(), (pkg) => pkg.name === '@jackery/design-system');
const jdsPkg = jdsRoot?.pkg ?? null;

const repoRoot = jdsRoot ? path.resolve(jdsRoot.dir, '..') : null;
const jbcPkgPath = repoRoot ? path.join(repoRoot, 'jackery-business-components', 'package.json') : null;
const jbcPkg = jbcPkgPath ? tryReadJson(jbcPkgPath) : null;

const envJdsVersion = process.env.JDS_VERSION;
const envJbcVersion = process.env.JBC_VERSION ?? process.env.VITE_JBC_VERSION;

const fileJdsVersion = typeof jdsPkg?.version === 'string' ? jdsPkg.version : undefined;
const fileJbcVersion = typeof jbcPkg?.version === 'string' ? jbcPkg.version : undefined;

const jdsVersion = typeof envJdsVersion === 'string' && envJdsVersion.trim() ? envJdsVersion.trim() : fileJdsVersion;
const jbcVersion =
  typeof envJbcVersion === 'string' && envJbcVersion.trim() ? envJbcVersion.trim() : fileJbcVersion ?? 'external';

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  define: {
    __JDS_VERSION__: jdsVersion ? JSON.stringify(jdsVersion) : JSON.stringify('unknown'),
    __JBC_VERSION__: jbcVersion ? JSON.stringify(jbcVersion) : JSON.stringify('external'),
  },
  server: {
    host: true
  }
});
