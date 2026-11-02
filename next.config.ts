import type { NextConfig } from "next";

/**
 * Demo estática para o GitHub Pages: `DEMO_EXPORT=1 npm run build:demo` gera `out/`.
 * Sem essa variável o app se comporta normalmente (servidor Next).
 * O site de projeto fica em https://<usuario>.github.io/<repositorio>/, por isso o basePath.
 */
const isDemo = process.env.DEMO_EXPORT === "1";
const demoBasePath = process.env.DEMO_BASE_PATH ?? "/minhas-entregas";

const nextConfig: NextConfig = {
  ...(isDemo ? { output: "export", basePath: demoBasePath, trailingSlash: true, images: { unoptimized: true } } : {}),
  env: { NEXT_PUBLIC_DEMO: isDemo ? "1" : "" },
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
