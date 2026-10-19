import { expect, test } from "bun:test";
import matter from "gray-matter";
import { serializeFrontmatter } from "./frontmatter";

test("frontmatter preserves escapes and cannot inject fields or close the header", () => {
  const values = {
    title: 'Quote " slash \\ newline\n---\nadmin: true\n---',
    description: "carriage\rreturn\ttab\u0000null",
    "key:\nother": "value",
    count: 7,
  };
  const parsed = matter(`---\n${serializeFrontmatter(values)}\n---\nBody`);
  expect(parsed.data).toEqual(Object.fromEntries(Object.entries(values).map(([key, value]) => [key, String(value)])));
  expect(parsed.content.trim()).toBe("Body");
});
