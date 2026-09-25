// Blog images live in the public `blog` Supabase Storage bucket, one folder per
// post: `posts/<post-id>/<file>`. The database stores only the path; the public
// URL is derived here so a change of Supabase host never strands old rows.

export const BLOG_BUCKET = "blog";

export function blogImageUrl(path: string): string {
  const encoded = path.split("/").map(encodeURIComponent).join("/");
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BLOG_BUCKET}/${encoded}`;
}

export function postImageFolder(postId: string): string {
  return `posts/${postId}`;
}
