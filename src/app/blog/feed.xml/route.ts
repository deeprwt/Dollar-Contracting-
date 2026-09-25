import { getAllPublishedPosts } from "@/lib/blog/posts";
import { siteConfig } from "@/lib/site-config";

// RSS 2.0 feed of the latest posts at /blog/feed.xml. Cached like the blog
// pages and revalidated whenever a post is saved.
export const revalidate = 300;

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  let posts: Awaited<ReturnType<typeof getAllPublishedPosts>> = [];
  try {
    posts = (await getAllPublishedPosts()).slice(0, 50);
  } catch {
    posts = [];
  }

  const blogUrl = `${siteConfig.url}/blog`;
  const items = posts
    .map((post) => {
      const url = `${blogUrl}/${post.slug}`;
      return `    <item>
      <title>${esc(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      ${post.published_at ? `<pubDate>${new Date(post.published_at).toUTCString()}</pubDate>` : ""}
      <description>${esc(post.excerpt)}</description>
      ${post.category ? `<category>${esc(post.category)}</category>` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(`${siteConfig.name} Blog`)}</title>
    <link>${blogUrl}</link>
    <description>${esc("Renovation tips, cost guides and project stories from Thunder Bay's general contractor.")}</description>
    <language>en-ca</language>
    <atom:link href="${blogUrl}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
