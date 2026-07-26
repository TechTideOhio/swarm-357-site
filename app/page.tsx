import { FAQ } from "@/components/faq";
import { AgentRoster } from "@/components/agent-roster";
import { Features } from "@/components/features";
import { FinalCTA } from "@/components/final-cta";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { LatestPosts } from "@/components/latest-posts";
import { Pricing } from "@/components/pricing";
import { LiveStats } from "@/components/live-stats";
import { Testimonials } from "@/components/testimonials";
import { RecentRuns } from "@/components/recent-runs";
import { TryItLive } from "@/components/try-it-live";
import { features } from "@/lib/config";
import { landing_faqs } from "@/lib/faq-data";
import type { Metadata } from "next";
import { createMetadata, siteConfig } from "@/lib/metadata";
import { GITHUB_URL, PYPI_URL, SITE_URL } from "@/lib/site-url";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: `${siteConfig.name} - ${siteConfig.tagline}`,
  description: siteConfig.description,
  path: "/",
});

const software_json_ld = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Swarm 357",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Cross-platform",
  description: siteConfig.description,
  url: SITE_URL,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

const organization_json_ld = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TechTide AI",
  url: SITE_URL,
  logo: `${SITE_URL}/icon-512.png`,
  sameAs: [GITHUB_URL, PYPI_URL],
};

const website_json_ld = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: SITE_URL,
  description: siteConfig.description,
  publisher: { "@type": "Organization", name: "TechTide AI", url: SITE_URL },
};

const faq_json_ld = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: landing_faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function HomePage(): ReactNode {
  return (
    <main id="main-content" className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(software_json_ld) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization_json_ld) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website_json_ld) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq_json_ld) }}
      />
      <Hero />
      <section id="try-it-live" className="scroll-mt-24">
        <TryItLive />
      </section>
      <HowItWorks />
      <Features />
      <AgentRoster />
      <LiveStats />
      <RecentRuns />
      {features.testimonialsSection ? <Testimonials /> : null}
      <LatestPosts />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
