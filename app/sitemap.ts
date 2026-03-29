import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    "/",
    "/flags",
    "/capitals",
    "/blurred-flags",
    "/borders",
    "/countries",
    "/dle",
    "/europe-flags",
    "/africa-flags",
    "/asia-flags",
    "/north-america-flags",
    "/south-america-flags",
    "/oceania-flags",
    "/europe-capitals",
    "/africa-capitals",
    "/asia-capitals",
    "/north-america-capitals",
    "/south-america-capitals",
    "/oceania-capitals"
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7
  }));
}
