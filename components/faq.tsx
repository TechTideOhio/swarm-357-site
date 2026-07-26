"use client";

import { faqConfig } from "@/lib/config";
import { landing_faqs } from "@/lib/faq-data";
import { easeOut, fadeInUpView } from "@/lib/motion";
import {
  chrome_arrow_cta,
  chrome_arrow_cta_badge,
  chrome_card_shell,
} from "@/lib/ui-classes";
import { ChevronDown, ChevronRightIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";

const faqs = landing_faqs;

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
      {...fadeInUpView}
      transition={{ ...fadeInUpView.transition, delay: index * 0.05 }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${index}`}
        className="group focus-ring hover:bg-foreground/5 active:bg-foreground/10 flex w-full items-center justify-between py-6 text-left transition-colors duration-200"
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
            id={`faq-panel-${index}`}
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

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-foreground px-6 py-16 md:py-32 rounded-4xl">
      <div className="mx-auto max-w-3xl">
        <motion.div className="mb-12 text-center md:mb-16" {...fadeInUpView}>
          <h2 className="text-background text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
            {faqConfig.title}
          </h2>
        </motion.div>

        <motion.div
          className={`${chrome_card_shell} bg-background px-6 py-2 md:px-10`}
          {...fadeInUpView}
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
          {...fadeInUpView}
          transition={{ ...fadeInUpView.transition, delay: 0.2 }}
        >
          <p className="text-background/60 mb-6 text-base">
            {faqConfig.contact.text}
          </p>
          <a
            href={faqConfig.contact.cta.href}
            className={`${chrome_arrow_cta} bg-accent text-black`}
          >
            <span>{faqConfig.contact.cta.text}</span>
            <span className={`${chrome_arrow_cta_badge} bg-white text-black`}>
              <ChevronRightIcon className="relative left-px h-4 w-4" />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
