import { defineConfig } from 'astro/config';
import node from "@astrojs/node";
import { readFileSync } from 'fs';

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone"
  }),
  // This stuff from https://docs.sheetjs.com/docs/demos/static/astro
  vite: {
    assetsInclude: ['**/*.xlsx'],
    plugins: [
      {
        name: "sheet-base64",
        transform(code, id) {
          if (!id.match(/\.(numbers|xlsx)$/)) return;
          var data = readFileSync(id, "base64");
          return `export default '${data}'`;
        }
      }
    ]
  }
});