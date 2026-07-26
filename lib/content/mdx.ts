// file: lib/content/mdx.ts
// description: Compile MDX source to React components with syntax highlighting
// reference: components/docs/mdx-components.tsx

import type { ComponentType } from "react";
import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import type { MDXComponents } from "mdx/types";

/** Escape bare `{expr}` outside fenced and inline code so MDX does not treat them as JSX. */
export function sanitize_mdx_source(text: string): string {
  const lines = text.split("\n");
  let in_fence = false;

  return lines
    .map((line) => {
      if (line.trim().startsWith("```")) {
        in_fence = !in_fence;
        return line;
      }
      if (in_fence) return line;

      const parts = line.split("`");
      return parts
        .map((part, index) => {
          if (index % 2 === 1) return part;
          return part
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\{([^}]*)\}/g, "`{$1}`");
        })
        .join("`");
    })
    .join("\n");
}

export async function compile_mdx(
  source: string,
  components: MDXComponents
): Promise<ComponentType> {
  const safe_source = sanitize_mdx_source(source);

  const compiled = await compile(safe_source, {
    outputFormat: "function-body",
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: { className: ["anchor"] },
        },
      ],
      [
        rehypePrettyCode,
        {
          theme: { dark: "github-dark", light: "github-light" },
          keepBackground: false,
        },
      ],
    ],
  });

  const { default: Content } = await run(compiled, {
    ...runtime,
    baseUrl: import.meta.url,
  });

  const MdxPage = () => Content({ components });
  return MdxPage;
}
