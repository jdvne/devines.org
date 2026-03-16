import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import yaml from '@rollup/plugin-yaml';

export default defineConfig({
  site: 'https://devines.org',
  output: 'static',
  integrations: [mdx()],
  vite: {
    plugins: [
      yaml(),
      {
        name: 'geojson',
        transform(code, id) {
          if (id.endsWith('.geojson')) {
            return { code: `export default ${code}` };
          }
        },
      },
    ],
  },
  markdown: {
    shikiConfig: { theme: 'github-dark' },
  },
});
