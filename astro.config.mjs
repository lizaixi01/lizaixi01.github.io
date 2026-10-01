import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://lizaixi01.github.io',
  output: 'static',
  trailingSlash: 'always',
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
});
