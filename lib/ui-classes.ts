// file: lib/ui-classes.ts
// description: Canonical Tailwind class strings for chrome and content UI tiers
// reference: app/globals.css, lib/motion.tsx, components/header.tsx, components/footer.tsx

// Every token below declares its transition exactly once: either through a
// named utility from globals.css (interactive-base, interactive-press,
// interactive-card, cta-morph) or through Tailwind transition-* utilities.
// Mixing the two cancels one of them. See DESIGN.md, "One transition source".

/** Press feedback for buttons and icon controls. */
export const interactive_press = "interactive-press active:scale-[0.96]";

/** Card lift and shadow on hover. */
export const interactive_card =
  "interactive-card hover:-translate-y-1 hover:shadow-lg active:translate-y-0 active:shadow-2xl/20";

/** Tier A - primary CTA (accent pill morph). */
export const chrome_primary_cta =
  "bg-accent cta-morph rounded-[3.5px] px-5 py-3 text-sm font-medium tracking-tight text-black hover:rounded-[50px] hover:brightness-105 focus-ring active:scale-[0.96] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 disabled:hover:rounded-[3.5px]";

/** Tier A - secondary CTA (muted pill morph). */
export const chrome_secondary_cta =
  "bg-muted text-foreground cta-morph rounded-[3.5px] px-5 py-3 text-sm font-medium tracking-tight hover:rounded-[50px] hover:brightness-95 focus-ring active:scale-[0.96] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 disabled:hover:rounded-[3.5px]";

/** Tier A - arrow CTA shell (white or accent background added per context). */
export const chrome_arrow_cta =
  "group cta-morph inline-flex items-center gap-3 rounded-[3.5px] py-3 pr-3 pl-4 font-medium tracking-tight hover:rounded-[50px] focus-ring active:scale-[0.96]";

/** Tier A - arrow CTA chevron badge. */
export const chrome_arrow_cta_badge =
  "flex min-h-11 min-w-11 items-center justify-center rounded-full transition-transform duration-300 ease-out group-hover:scale-110 group-active:scale-105";

/** Tier A - quiet text link with hover surface. */
export const chrome_quiet_link =
  "text-muted-foreground interactive-base rounded-[3.5px] px-3 py-1.5 text-sm hover:bg-foreground/5 hover:text-foreground focus-ring active:opacity-80 dark:hover:bg-foreground/10";

/** Tier A - circular icon button (44px minimum touch target). */
export const chrome_icon_circle =
  "flex min-h-11 min-w-11 items-center justify-center rounded-full interactive-base hover:scale-110 active:scale-[0.96] focus-ring";

/** Tier A - card / panel shell on landing sections. */
export const chrome_card_shell =
  "bg-muted rounded-2xl border border-neutral-200/10 shadow-2xl/20";

/** Tier A - section horizontal padding and vertical rhythm. */
export const chrome_section = "px-6 py-16 md:py-32";

/** Tier A - section heading. */
export const chrome_section_heading =
  "text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl";

/** Tier A - section subheading. */
export const chrome_section_sub = "text-muted-foreground text-lg";

/** Tier A - modal / mega-menu backdrop overlay. */
export const chrome_overlay =
  "fixed inset-0 bg-black/60 backdrop-blur-sm";

/** Tier A - chrome form control (select, input on landing). */
export const chrome_form_control =
  "bg-background text-foreground border-neutral-200/10 w-full rounded-[3.5px] border px-3 py-2.5 text-base sm:text-sm font-medium tracking-tight transition-colors duration-150 ease-out focus-visible:border-ring/50 focus-ring disabled:opacity-50";

/** Minimum 44px touch target for icon buttons and compact controls. */
export const touch_target =
  "inline-flex min-h-11 min-w-11 items-center justify-center focus-ring interactive-base active:scale-[0.96]";

/** Tier B - full-screen mobile dialog / sheet shell. */
export const content_dialog_sheet_sm =
  "bg-background fixed inset-0 z-50 flex h-[100dvh] w-full flex-col rounded-none border-0 sm:static sm:z-auto sm:h-auto sm:rounded-xl sm:border sm:border-border";

/** Tier B - docs sidebar / nav link base. */
export const content_nav_link =
  "interactive-base block rounded-md border-l-2 border-transparent py-2 pl-[calc(0.75rem-2px)] pr-3 text-sm focus-ring active:border-accent active:bg-muted";

/** Tier B - docs sidebar / nav link active state. */
export const content_nav_link_active = "bg-accent font-medium text-black";

/** Tier B - docs sidebar / nav link inactive state. */
export const content_nav_link_inactive =
  "text-muted-foreground hover:bg-muted hover:text-foreground";

/** Tier B - inline prose link. */
export const content_inline_link =
  "nav-link-underline text-foreground underline underline-offset-4 transition-opacity duration-200 ease-out hover:opacity-70 focus-ring active:opacity-80";

/** Tier B - content card (docs home, pager). */
export const content_card =
  "border-border interactive-card rounded-xl border p-4 hover:border-accent/30 focus-ring";

/** Tier B - content form control (search trigger, inputs). */
export const content_form_control =
  "border-border rounded-lg border bg-muted/50 px-3 py-2 text-sm transition-colors duration-150 ease-out focus-visible:border-ring/50 focus-ring active:opacity-80";

/** Tier B - dialog / search panel. */
export const content_dialog_panel =
  "bg-background w-full max-w-xl rounded-xl border border-border shadow-2xl/20";

/** Tier B - breadcrumb link. */
export const content_breadcrumb_link =
  "nav-link-underline transition-opacity duration-200 ease-out hover:opacity-70 focus-ring active:opacity-80";
