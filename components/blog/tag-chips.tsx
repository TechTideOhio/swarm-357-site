// file: components/blog/tag-chips.tsx
// description: Linked topic chips pointing at the tag hub pages
// reference: lib/content/tags.ts, app/blog/[slug]/page.tsx, app/blog/tags/page.tsx

import Link from "next/link";
import { tag_to_slug } from "@/lib/content/tags";
import { content_tag_chip } from "@/lib/ui-classes";
import type { ReactNode } from "react";

export function TagChips({
  tags,
  label = "Topics",
}: {
  tags: string[];
  label?: string;
}): ReactNode {
  if (tags.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2" aria-label={label}>
      {tags.map((tag) => (
        <li key={tag}>
          <Link href={`/blog/tag/${tag_to_slug(tag)}`} className={content_tag_chip}>
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
