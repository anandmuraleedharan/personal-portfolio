export default function sitemap() {
  return [
    {
      url: "https://anandmuraleedharan.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://anandmuraleedharan.com/resume",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
