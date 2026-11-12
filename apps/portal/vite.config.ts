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

const zoneRoot = findUp(process.cwd(), (pkg) => pkg.name === '@zone/design-system');
const zonePkg = zoneRoot?.pkg ?? null;

const envZoneVersion = process.env.ZONE_VERSION;

const fileZoneVersion = typeof zonePkg?.version === 'string' ? zonePkg.version : undefined;

const zoneVersion =
  typeof envZoneVersion === 'string' && envZoneVersion.trim() ? envZoneVersion.trim() : fileZoneVersion;

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  define: {
    __ZONE_VERSION__: zoneVersion ? JSON.stringify(zoneVersion) : JSON.stringify('unknown'),
  },
  server: {
    host: true
  }
});
