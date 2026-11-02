import type { NextConfig } from "next";

/**
 * Publicação no GitHub Pages: `npm run build:pages` gera a pasta `out/` (site estático).
 * Sem PAGES_EXPORT o app se comporta normalmente (`npm run dev` / `npm run build`).
 * O site de projeto fica em https://<usuario>.github.io/<repositorio>/, por isso o basePath.
 */
const isPages = process.env.PAGES_EXPORT === "1";
const pagesBasePath = process.env.PAGES_BASE_PATH ?? "/minhas-entregas";

const nextConfig: NextConfig = {
  ...(isPages ? { output: "export", basePath: pagesBasePath, trailingSlash: true, images: { unoptimized: true } } : {}),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
