// file: components/docs/callout.tsx
// description: Callout box component for MDX documentation pages
// reference: components/docs/mdx-components.tsx

import type { ReactNode } from "react";

type CalloutVariant = "info" | "warning" | "tip";

const styles: Record<CalloutVariant, string> = {
  info: "border-ring/30 bg-ring/5",
  warning: "border-accent/50 bg-accent/10",
  tip: "border-foreground/20 bg-muted",
};

export function Callout({
  variant = "info",
  title,
  children,
}: {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
}) {
  return (
    <aside
      className={`my-6 rounded-xl border p-4 ${styles[variant]}`}
      role="note"
    >
      {title ? <p className="mb-2 font-semibold text-foreground">{title}</p> : null}
      <div className="text-muted-foreground text-sm leading-relaxed">{children}</div>
    </aside>
  );
}
