import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";
import { BlogArticle } from "@/components/blog/blog-article";
import { StatusPill } from "@/components/admin/blog/status-pill";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { displayStatus } from "@/lib/blog/status";
import type { BlogPost } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Renders any post — draft, scheduled or live — exactly as the public page
// would, so it can be checked before publishing. Lives under /admin, so the
// proxy and the authed layout keep it private (and robots.txt disallows it).
export default async function PreviewBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const post = data as BlogPost;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm text-sky-900">
        <span className="inline-flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Preview of the last saved version
          <StatusPill status={displayStatus(post)} />
        </span>
        <Link
          href={`/admin/blog/${post.id}/edit`}
          className="inline-flex items-center gap-1 font-semibold hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to editor
        </Link>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
        <BlogArticle post={post} />
      </div>
    </div>
  );
}
