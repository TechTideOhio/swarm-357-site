// file: lib/faq-data.ts
// description: Shared FAQ items for the landing accordion and FAQPage JSON-LD
// reference: components/faq.tsx, app/page.tsx

export interface FaqItem {
  question: string;
  answer: string;
}

export const landing_faqs: FaqItem[] = [
  {
    question: "Do I need all 357 agents running at once?",
    answer:
      "No. The 357 roles are a template catalog. You boot only the layers and agents your task needs. A typical swarm run uses 3-8 agents across 2-3 layers. Budget caps prevent runaway costs.",
  },
  {
    question: "What happens if the Memvid bridge is not installed?",
    answer:
      "MemoryManager gracefully falls back to flat .swarm/topics/ JSON files. The bridge is optional. Install it when you want portable, searchable .mv2 memory with integrity verification.",
  },
  {
    question: "Does this work without an Anthropic API key?",
    answer:
      "Yes. The CLI runs in simulation mode without a key. swarm demo shows the full architecture and pipeline with stub outputs. For live runs set ANTHROPIC_API_KEY, or use OpenRouter via OPENROUTER_API_KEY and ANTHROPIC_BASE_URL.",
  },
  {
    question: "How does the security gate work?",
    answer:
      "BashSecurityGate validates every shell command against 13 pattern rules before execution. It blocks destructive operations, secret exfiltration, elevated commands, and remote code injection. Every rule has a corresponding test.",
  },
  {
    question: "Can I use models other than Claude?",
    answer:
      "Short names (opus, sonnet, haiku) resolve to Claude model IDs. Live calls go through the Anthropic Messages API shape, directly with ANTHROPIC_API_KEY, or via OpenRouter (OPENROUTER_API_KEY + ANTHROPIC_BASE_URL). Cheap OpenRouter remaps are opt-in only (SWARM_OPENROUTER_CHEAP=1).",
  },
];
