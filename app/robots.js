export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/private/",
    },
    sitemap: "https://anandmuraleedharan.com/sitemap.xml",
  };
}
