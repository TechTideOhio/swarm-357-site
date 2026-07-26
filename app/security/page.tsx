// file: app/security/page.tsx
// description: Redirect to security documentation section
// reference: docs/security/security-model

import { redirect } from "next/navigation";

export default function SecurityPage() {
  redirect("/docs/security/security-model");
}
