import type { MetadataRoute } from "next";

/** Página pessoal sem login: pede aos buscadores que não indexem nada. */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
