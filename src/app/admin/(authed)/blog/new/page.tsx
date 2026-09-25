import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PostEditor } from "@/components/admin/blog/post-editor";
import { newEditorPost } from "@/lib/blog/editor";
import { getEditorSuggestions } from "../suggestions";

export const dynamic = "force-dynamic";

export default async function NewBlogPostPage() {
  const { categories, tags } = await getEditorSuggestions();
  // Minted here so images can upload into the post's folder before the first save.
  const id = crypto.randomUUID();

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
        <h1 className="heading-display mt-2 text-3xl">New post</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Drafts are private. Publish when you&apos;re ready, or pick a date to schedule it.
        </p>
      </div>
      <PostEditor initial={newEditorPost(id)} isNew categories={categories} knownTags={tags} />
    </div>
  );
}
