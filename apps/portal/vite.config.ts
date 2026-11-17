import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';
import { createIconsManifest } from './scripts/icons-manifest.mjs';

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

const zoneRoot = findUp(process.cwd(), (pkg) => pkg.name === '@aiyazone/design-system');
const zonePkg = zoneRoot?.pkg ?? null;

const envZoneVersion = process.env.ZONE_VERSION;

const fileZoneVersion = typeof zonePkg?.version === 'string' ? zonePkg.version : undefined;

const zoneVersion =
  typeof envZoneVersion === 'string' && envZoneVersion.trim() ? envZoneVersion.trim() : fileZoneVersion;

export default defineConfig({
  plugins: [
    tailwindcss(),
    {
      name: 'portal-subsites',
      configureServer(server) {
        // 完整构建后的子站在门户开发地址下可直接浏览。
        server.middlewares.use((request, response, next) => {
          const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
          if (pathname === '/icons/' || pathname === '/icons') {
            request.url = '/icons/index.html';
            next();
            return;
          }
          const iconsSource = path.resolve(zoneRoot?.dir ?? process.cwd(), 'packages/icons/src/icons');
          if (pathname === '/icons/icons-manifest.json') {
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify(createIconsManifest(zoneRoot?.dir ?? process.cwd())));
            return;
          }
          if (pathname.startsWith('/icons/assets/')) {
            const match = /^\/icons\/assets\/(system|social-media)\/([a-z0-9-]+)\.svg$/.exec(pathname);
            const file = match && path.join(iconsSource, match[1], `${match[2]}.svg`);
            if (!file || !fs.existsSync(file)) {
              response.statusCode = 404;
              response.end('Icon not found');
              return;
            }
            response.setHeader('Content-Type', 'image/svg+xml');
            fs.createReadStream(file).pipe(response);
            return;
          }
          if (!/^\/(examples|storybook|icons)\//.test(pathname)) { next(); return; }
          const dist = path.resolve(zoneRoot?.dir ?? process.cwd(), 'apps/portal/dist');
          let file: string;
          try { file = path.resolve(dist, `.${decodeURIComponent(pathname)}`); }
          catch { next(); return; }
          if (!file.startsWith(`${dist}${path.sep}`)) { next(); return; }
          if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
          if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { next(); return; }
          const mime: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png' };
          response.setHeader('Content-Type', mime[path.extname(file)] ?? 'application/octet-stream');
          fs.createReadStream(file).pipe(response);
        });
      },
    },
  ],
  define: {
    __ZONE_VERSION__: zoneVersion ? JSON.stringify(zoneVersion) : JSON.stringify('unknown'),
  },
  resolve: {
    alias: {
      '@aiyazone/core': path.join(zoneRoot?.dir ?? process.cwd(), 'packages/core/src/index.ts'),
      '@aiyazone/icons': path.join(zoneRoot?.dir ?? process.cwd(), 'packages/icons/src/index.ts'),
      '@aiyazone/utils': path.join(zoneRoot?.dir ?? process.cwd(), 'packages/utils/src'),
    },
  },
  optimizeDeps: { exclude: ['@aiyazone/core', '@aiyazone/icons', '@aiyazone/utils'] },
  server: {
    host: true
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        architecture: 'architecture.html'
      }
    }
  }
});
