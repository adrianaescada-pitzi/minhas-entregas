import type { MetadataRoute } from "next";

export const dynamic = "force-static";

/** Página pessoal sem login: pede aos buscadores que não indexem nada. */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
