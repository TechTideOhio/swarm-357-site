// file: app/status/page.tsx
// description: Redirect-style status page linking to docs maturity matrix
// reference: docs/resources/status

import { redirect } from "next/navigation";

export default function StatusPage() {
  redirect("/docs/resources/status");
}
