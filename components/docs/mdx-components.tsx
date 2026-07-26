// file: components/docs/mdx-components.tsx
// description: Custom MDX component mappings for documentation pages
// reference: lib/content/mdx.ts, app/docs/[[...slug]]/page.tsx

import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import { content_inline_link } from "@/lib/ui-classes";
import type { ReactNode } from "react";
import { Callout } from "./callout";

function Pre({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  return (
    <pre
      className="my-6 overflow-x-auto rounded-xl border border-border bg-muted p-4 text-sm"
      {...props}
    >
      {children}
    </pre>
  );
}

function Code({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const is_block = className?.includes("language-");
  if (is_block) {
    return (
      <code className={`font-mono text-sm ${className ?? ""}`} {...props}>
        {children}
      </code>
    );
  }
  return (
    <code
      className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground"
      {...props}
    >
      {children}
    </code>
  );
}

function Table({ children, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-left text-sm" {...props}>
        {children}
      </table>
    </div>
  );
}

function Th({ children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className="border-b border-border bg-muted px-4 py-3 font-semibold" {...props}>
      {children}
    </th>
  );
}

function Td({ children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className="border-b border-border px-4 py-3 align-top" {...props}>
      {children}
    </td>
  );
}

function A({ href, children }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const is_external = href?.startsWith("http");
  const className = content_inline_link;
  if (is_external) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href ?? "#"} className={className}>
      {children}
    </Link>
  );
}

export const mdx_components: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="mb-6 text-3xl font-medium tracking-tight md:text-4xl">{children}</h1>
  ),
  h2: ({ children, id }) => (
    <h2 id={id} className="mt-12 mb-4 scroll-mt-28 text-2xl font-medium tracking-tight">
      {children}
    </h2>
  ),
  h3: ({ children, id }) => (
    <h3 id={id} className="mt-8 mb-3 scroll-mt-28 text-xl font-medium tracking-tight">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-muted-foreground mb-4 text-base leading-relaxed">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="text-muted-foreground mb-4 list-disc space-y-2 pl-6">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="text-muted-foreground mb-4 list-decimal space-y-2 pl-6">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-accent text-muted-foreground my-6 border-l-4 pl-4 italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-border my-10" />,
  pre: Pre,
  code: Code,
  table: Table,
  th: Th,
  td: Td,
  a: A,
  Callout,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
};

export function MdxContent({ children }: { children: ReactNode }) {
  return <div className="max-w-none">{children}</div>;
}
