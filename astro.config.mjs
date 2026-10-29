import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// IMPORTANT: change `site` once you have your real domain.
// This URL is used to generate the sitemap and RSS feed correctly.
export default defineConfig({
  site: 'https://ifeyibatindek.com',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true
    }
  }
});
