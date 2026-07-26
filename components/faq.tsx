"use client";

import { faqConfig } from "@/lib/config";
import { easeOut } from "@/lib/motion";
import { ChevronDown, ChevronRightIcon } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useRef, useState, type ReactNode } from "react";

const faqs = [
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
      "Short names (opus, sonnet, haiku) resolve to Claude model IDs. Live calls go through the Anthropic Messages API shape — directly with ANTHROPIC_API_KEY, or via OpenRouter (OPENROUTER_API_KEY + ANTHROPIC_BASE_URL). Cheap OpenRouter remaps are opt-in only (SWARM_OPENROUTER_CHEAP=1).",
  },
];

function FAQItem({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqs)[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}): ReactNode {
  return (
    <motion.div
      className="border-foreground/10 border-b last:border-b-0"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8, delay: index * 0.05, ease: easeOut }}
    >
      <button
        onClick={onToggle}
        className="group flex w-full items-center justify-between py-6 text-left"
      >
        <span className="text-foreground text-lg font-medium pr-8 md:text-xl">
          {faq.question}
        </span>
        <motion.div
          className="text-foreground/50 shrink-0"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: easeOut }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: easeOut }}
            className="overflow-hidden"
          >
            <p className="text-muted-foreground pb-6 text-base leading-relaxed">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ(): ReactNode {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.5 });

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-foreground px-6 py-16 md:py-32 rounded-4xl">
      <div className="mx-auto max-w-3xl">
        <motion.div
          ref={headerRef}
          className="mb-12 text-center md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: easeOut }}
        >
          <h2 className="text-background text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
            {faqConfig.title}
          </h2>
        </motion.div>

        <motion.div
          className="bg-background rounded-2xl border border-neutral-200/10 px-6 py-2 shadow-2xl/20 md:px-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: easeOut }}
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.question}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </motion.div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.2, ease: easeOut }}
        >
          <p className="text-background/60 mb-6 text-base">
            {faqConfig.contact.text}
          </p>
          <a
            href={faqConfig.contact.cta.href}
            className="group bg-accent inline-flex items-center gap-3 rounded-[3.5px] py-3 pr-3 pl-4 font-medium tracking-tight text-black transition-all duration-500 ease-out hover:rounded-[50px]"
          >
            <span>{faqConfig.contact.cta.text}</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-all duration-300 ease-out group-hover:scale-110">
              <ChevronRightIcon className="relative left-px h-4 w-4" />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
