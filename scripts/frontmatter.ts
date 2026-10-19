export function serializeFrontmatter(values: Record<string, string | number>): string {
  return Object.entries(values)
    .map(([key, value]) => `${JSON.stringify(key)}: ${JSON.stringify(String(value))}`)
    .join("\n");
}
