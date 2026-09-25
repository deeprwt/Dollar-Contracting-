import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** Categories and tags already used on any post, for the editor's autocomplete. */
export async function getEditorSuggestions(): Promise<{ categories: string[]; tags: string[] }> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("blog_posts").select("category, tags").limit(1000);
  const categories = new Set<string>();
  const tags = new Set<string>();
  for (const row of data ?? []) {
    if (row.category) categories.add(row.category);
    for (const t of row.tags ?? []) tags.add(t);
  }
  return {
    categories: [...categories].sort((a, b) => a.localeCompare(b)),
    tags: [...tags].sort(),
  };
}
