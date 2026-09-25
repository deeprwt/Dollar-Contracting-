import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PostEditor } from "@/components/admin/blog/post-editor";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { toEditorPost } from "@/lib/blog/editor";
import type { BlogPost } from "@/lib/supabase/types";
import { getEditorSuggestions } from "../../suggestions";

export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  const supabase = await createSupabaseServerClient();
  const [{ data: post }, { categories, tags }] = await Promise.all([
    supabase.from("blog_posts").select("*").eq("id", id).maybeSingle(),
    getEditorSuggestions(),
  ]);
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to blog
        </Link>
        <h1 className="heading-display mt-2 text-3xl">Edit post</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Changes to a published post go live as soon as you click Update.
        </p>
      </div>
      <PostEditor
        key={post.id}
        initial={toEditorPost(post as BlogPost)}
        isNew={false}
        categories={categories}
        knownTags={tags}
      />
    </div>
  );
}
