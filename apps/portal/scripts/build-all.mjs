import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../..');
const portalDist = path.resolve(__dirname, '../dist');

function run(command) {
  console.log(`Running: ${command}`);
  execSync(command, { stdio: 'inherit', cwd: rootDir });
}

function copyDir(src, dest) {
  console.log(`Copying ${src} to ${dest}`);
  fs.cpSync(src, dest, { recursive: true });
}

try {
  // 1. Build Portal
  console.log('Building Portal...');
  run('pnpm run build --filter=@jackery/portal');

  // 2. Build Examples
  console.log('Building Examples...');
  // Note: We might need to adjust base path for examples. For now assuming it works or has relative paths.
  // Passing --base=/examples/ to vite build if supported by the script, otherwise relying on config.
  // Let's try to set base via environment variable if vite config picks it up, or just build.
  run('pnpm run build --filter=@jackery/examples');
  
  const examplesDist = path.resolve(rootDir, 'apps/examples/dist');
  const examplesTarget = path.join(portalDist, 'examples');
  copyDir(examplesDist, examplesTarget);

  // 3. Build Storybook
  console.log('Building Storybook...');
  run('pnpm run build:storybook --filter=@jackery/storybook');
  
  const storybookDist = path.resolve(rootDir, 'apps/storybook/storybook-static');
  const storybookTarget = path.join(portalDist, 'storybook');
  copyDir(storybookDist, storybookTarget);

  // 4. Build Icons
  console.log('Building Icons Storybook...');
  run('pnpm run build:storybook --filter=@jackery/icons');
  
  const iconsDist = path.resolve(rootDir, 'packages/icons/storybook-static');
  const iconsTarget = path.join(portalDist, 'icons');
  copyDir(iconsDist, iconsTarget);

  console.log('All builds completed successfully!');
  console.log(`Portal is ready at: ${portalDist}`);

} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
