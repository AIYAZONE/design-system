
import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import svgr from "vite-plugin-svgr";
import path from "path";
import fs from 'fs';
import { fileURLToPath } from 'url';

const config: StorybookConfig = {
  stories: [
    "../src/stories/**/*.mdx",
    "../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    "@storybook/theming"
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

viteFinal(config) {
    return mergeConfig(config, {
      plugins: [
        svgr({ include: "**/*.svg" }),
        {
          name: 'copy-static-assets',
          apply: 'build',
          enforce: 'post',
          async generateBundle() {
            const assetsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/stories/assets');
            const files = await fs.promises.readdir(assetsDir);

            files.forEach(file => {
              if (file.match(/\.(png|jpe?g|gif|svg)$/i)) {
                this.emitFile({
                  type: 'asset',
                  fileName: file,
                  source: fs.readFileSync(path.resolve(assetsDir, file))
                });
              }
            });
          }
        }
      ],
    });
  },
};
export default config;
