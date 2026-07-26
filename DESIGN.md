# Swarm 357 Design System

Canonical design reference for the Swarm 357 product surface. This document describes the tokens, class tiers, interaction rules, and content standards that the landing site and documentation library are built on.

The code is the source of truth. This document explains it. When they disagree, fix the document.

| Concern | File |
|---------|------|
| Color, typography, and utility tokens | [`app/globals.css`](app/globals.css) |
| Canonical class strings | [`lib/ui-classes.ts`](lib/ui-classes.ts) |
| Motion presets and reduced-motion handling | [`lib/motion.tsx`](lib/motion.tsx) |
| Navigation and the external link policy | [`lib/navigation.ts`](lib/navigation.ts), [`lib/site-url.ts`](lib/site-url.ts) |
| Automated enforcement | [`scripts/check-content.ts`](scripts/check-content.ts) |

## Contents

- [Principles](#principles)
- [Voice and copy](#voice-and-copy)
- [Color](#color)
- [Typography](#typography)
- [Shape and elevation](#shape-and-elevation)
- [Class tiers](#class-tiers)
- [Interaction](#interaction)
- [Motion](#motion)
- [Accessibility](#accessibility)
- [Responsive rules](#responsive-rules)
- [Assets](#assets)
- [Link policy](#link-policy)
- [Enforcement](#enforcement)
- [Extending the system](#extending-the-system)

## Principles

1. **Honest before impressive.** The product claims a 357-role catalog, not 357 parallel model sessions. Copy, badges, and maturity labels mirror [`STATUS.md`](https://github.com/TechTideOhio/swarm-357) in the core repo rather than marketing ambition.
2. **One accent, used sparingly.** A single yellow accent carries calls to action and active states. Everything else is neutral so the accent still means something.
3. **Tokens over literals.** Components consume CSS variables and exported class strings. Raw hex values and one-off Tailwind stacks are treated as drift.
4. **Interaction is a system, not a decoration.** Hover, press, focus, and motion behave the same way across the marketing surface and the documentation library.
5. **Motion is optional.** Every animation has a reduced-motion path that still communicates state change.

## Voice and copy

- Plain, technical, and specific. Prefer a measured claim with a link to evidence over a superlative.
- Sentence case for headings. Title case only for proper nouns and product names.
- **No em dashes or en dashes anywhere in public copy.** Use a comma, a period, a colon, or a hyphen. This is enforced in CI across `app/`, `components/`, `lib/`, `content/docs/`, `content/blog/`, and `content/data/`.
- Avoid double hyphens as a substitute for a dash. Rewrite the sentence instead.
- Numbers that appear on the site come from generated data, not from prose written by hand. Eval figures originate in `evals/baselines/latest.json` in the core repo and reach the site through `bun run generate:content`.

## Color

Tokens are declared once in [`app/globals.css`](app/globals.css) and exposed to Tailwind through `@theme inline`. Components reference the semantic name, never the hex value.

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `--background` | `#ffffff` | `#0a0a0a` | Page and panel base |
| `--foreground` | `#0a0a0a` | `#fafafa` | Body text |
| `--muted` | `#f5f5f5` | `#171717` | Secondary surfaces, cards, code blocks |
| `--muted-foreground` | `#737373` | `#a3a3a3` | Supporting text and captions |
| `--border` | `#e5e5e5` | `#262626` | Hairlines and dividers |
| `--accent` | `#ffd900` | `#ffd900` | Primary calls to action, active nav, selection |
| `--ring` | `#0066ff` | `#3b82f6` | Focus outlines and link underlines |
| `--menu-card` | `#1a1a1a` | `#f0f0f0` | Mega-menu cards, inverted against the page |

Rules:

- The accent is constant across themes. Text on the accent is always black, which keeps contrast above 4.5:1 in both themes.
- The ring differs per theme so the focus outline stays visible on both backgrounds. Never replace the ring with the accent.
- Dark mode is class based (`html.dark`) and driven by `next-themes`. Do not add `dark:` overrides for values that already have a token.

## Typography

| Role | Family | Variable |
|------|--------|----------|
| Interface and body | Geist Sans | `--font-sans` |
| Code and metrics | Geist Mono | `--font-mono` |

Both are loaded in [`app/layout.tsx`](app/layout.tsx) through `next/font/google` with `display: swap`, so there is no external stylesheet request and no layout shift.

Scale, expressed as the Tailwind classes actually in use:

| Level | Classes |
|-------|---------|
| Page hero | `text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight` |
| Section heading | `text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight` (`chrome_section_heading`) |
| Subsection heading | `text-2xl md:text-3xl font-medium tracking-tight` |
| Lead paragraph | `text-lg md:text-xl leading-relaxed text-muted-foreground` |
| Body | `text-base leading-relaxed` |
| Caption and eyebrow | `text-sm tracking-widest uppercase text-muted-foreground` |

Headings use `font-medium` with tight tracking rather than bold weights. Emphasis comes from size and spacing.

## Shape and elevation

| Element | Radius |
|---------|--------|
| Buttons and inputs at rest | `rounded-[3.5px]` |
| Buttons on hover | `rounded-[50px]` (the pill morph) |
| Cards and panels | `rounded-2xl` |
| Documentation cards and dialogs | `rounded-xl` |
| Icon buttons and badges | `rounded-full` |

Elevation is deliberately shallow. Landing panels use `shadow-2xl/20` over a `bg-muted` surface with a `border-neutral-200/10` hairline. Documentation surfaces use a `border-border` hairline and no shadow at rest. Form controls never carry a shadow.

## Class tiers

[`lib/ui-classes.ts`](lib/ui-classes.ts) exports every canonical class string. Components import these rather than assembling Tailwind stacks inline. There are two tiers plus a shared group.

### Tier A, chrome

Marketing surfaces: the header, the landing sections, and the footer.

| Export | Purpose |
|--------|---------|
| `chrome_primary_cta` | Accent call to action with pill morph |
| `chrome_secondary_cta` | Muted call to action with pill morph |
| `chrome_arrow_cta`, `chrome_arrow_cta_badge` | Arrow call to action and its chevron badge |
| `chrome_quiet_link` | Low emphasis text link with a hover surface |
| `chrome_icon_circle` | Circular icon button, 44px minimum |
| `chrome_card_shell` | Landing card and panel shell |
| `chrome_section`, `chrome_section_heading`, `chrome_section_sub` | Section rhythm and headings |
| `chrome_form_control` | Landing input and select |
| `chrome_overlay` | Modal and mega-menu backdrop |

### Tier B, content

Documentation and long-form reading surfaces.

| Export | Purpose |
|--------|---------|
| `content_nav_link`, `content_nav_link_active`, `content_nav_link_inactive` | Sidebar and drawer navigation |
| `content_inline_link` | Prose link with an underline |
| `content_card` | Documentation home and pager cards |
| `content_form_control` | Search trigger and documentation inputs |
| `content_dialog_panel`, `content_dialog_sheet_sm` | Search dialog and mobile sheet |
| `content_breadcrumb_link` | Breadcrumb trail |

### Shared

| Export | Purpose |
|--------|---------|
| `interactive_press` | Press feedback, `active:scale-[0.96]` |
| `interactive_card` | Hover lift and shadow for cards |
| `touch_target` | 44px minimum hit area for compact controls |

## Interaction

Every interactive element answers four states the same way.

| State | Behavior |
|-------|----------|
| Rest | Token colors, `rounded-[3.5px]` for controls |
| Hover | Color or brightness shift, cards lift by `-translate-y-1`, buttons morph toward a pill |
| Press | `active:scale-[0.96]` on buttons, `active:opacity-80` on links |
| Focus | `.focus-ring` renders a 2px `--ring` outline at 2px offset on `:focus-visible` only |
| Disabled | `disabled:opacity-50`, pointer events off, press and morph suppressed |

Named utilities in [`app/globals.css`](app/globals.css):

| Utility | Behavior |
|---------|----------|
| `.interactive-base` | 200ms transition across color, transform, and shadow |
| `.interactive-press` | 200ms transform-only transition |
| `.interactive-card` | 300ms transition across transform, shadow, border, and background |
| `.glow-accent` | Accent halo for the single most important call to action on a page |
| `.glow-accent-subtle` | Accent ring for a highlighted card, such as the featured pricing tier |
| `.nav-link-underline` | Ring-colored underline that scales in from the center on hover and focus |
| `.focus-ring` | The only sanctioned focus treatment |

Two rules that are easy to get wrong:

1. **One glow per page.** `.glow-accent` marks a single primary action. If a second element glows, neither reads as primary.
2. **The pill morph is slow on purpose.** Calls to action animate radius over `duration-500` while color and press respond at 200ms. Do not shorten the morph to match the press.

## Motion

Presets live in [`lib/motion.tsx`](lib/motion.tsx). Components import a preset rather than writing transition objects inline.

| Preset | Use |
|--------|-----|
| `fadeInUp`, `fadeInUpView` | Section entrance, 30px rise over 0.8s |
| `staggerContainer`, `StaggerItem` | Lists and card grids, 0.1s between children |
| `overlayFade` with `overlayFadeTransition` | Modal and drawer backdrops, 0.3s |
| `dialogSpring` with `dialogSpringTransition` | Dialog panels, spring at stiffness 400 and damping 25 |
| `toastSpring` with `toastSpringTransition` | Toasts, spring at stiffness 400 and damping 30 |

Canonical easings are `easeOut` at `[0.16, 1, 0.3, 1]` and `easeInOut` at `[0.65, 0, 0.35, 1]`.

Reduced motion is handled in two layers. A global media query in `app/globals.css` collapses CSS animation and transition durations and cancels press scaling. In React, `useReducedMotion()` from the `ReducedMotionProvider` swaps every preset for its opacity-only fallback (`overlayFadeReduced`, `dialogSpringReduced`, `toastSpringReduced`). New animated components must consume the hook.

## Accessibility

- Focus is visible on every interactive element through `.focus-ring`. Removing an outline without providing one is a CI failure.
- Minimum hit area is 44 by 44 pixels, applied through `touch_target`, `chrome_icon_circle`, or explicit `min-h-11 min-w-11`.
- A skip link (`.skip-to-content`) precedes the header and targets `#main-content`, which every page provides.
- Inputs render at `text-base` below the `sm` breakpoint so iOS does not zoom on focus, then drop to `text-sm`.
- Modals and the mobile navigation sheet trap focus (`lib/use-focus-trap.ts`) and lock body scroll (`lib/use-body-scroll-lock.ts`), and close on `Escape`.
- Images carry descriptive alternative text. Decorative art is marked accordingly.
- Color is never the only signal. Status badges pair the accent with a text label.

## Responsive rules

| Breakpoint | Behavior |
|------------|----------|
| Below `sm` (640px) | Dialogs become full-screen sheets at `100dvh` through `content_dialog_sheet_sm`. Tables become stacked cards. Inputs use `text-base`. |
| Below `lg` (1024px) | The documentation sidebar collapses into a toolbar with a drawer and a search trigger. |
| `lg` and above | The header expands to the mega-menu. The documentation layout shows the sidebar and the table of contents. |

The mobile navigation is a full-screen sheet opened from the header, not a bottom bar. Section padding scales through `chrome_section` (`px-6 py-16 md:py-32`).

## Assets

| Path | Contents |
|------|----------|
| `public/assets/` | Architecture and eval diagrams shared with the core repo |
| `public/art/hero/`, `public/art/testimonials/` | Landing artwork |
| `public/og-image.png` | Open Graph and social card image |

Diagrams are authored as SVG in the core repo under `docs/assets/` and mirrored here. Regenerate them in the core repo rather than editing the copies in `public/`.

## Link policy

The site keeps exactly two canonical GitHub URLs, defined once in [`lib/site-url.ts`](lib/site-url.ts):

| Constant | Target |
|----------|--------|
| `GITHUB_URL` | The core repository |
| `GITHUB_SITE_URL` | This landing repository |
| `PYPI_URL` | The published `techtide-swarm` package |

Rules:

- Site chrome, meaning the header, the footer, and `lib/config.ts`, may link to `GITHUB_URL` only, and only through `github_social` in `lib/navigation.ts`.
- Body copy and documentation may reference `GITHUB_SITE_URL` and `PYPI_URL` where they are genuinely useful.
- Any other variant of a Swarm 357 GitHub URL fails CI. Deep links to files or branches are not allowed because they rot.
- Documentation synced from the core repo is rewritten by [`scripts/generate-content.ts`](scripts/generate-content.ts). Repo-relative paths such as `STATUS.md` resolve to their published route, and everything else falls back to the canonical repository URL.

## Enforcement

`bun run check:content` fails the build on:

- em dashes and en dashes in scanned source and content,
- malformed URLs with an empty host, such as `https:///docs`,
- GitHub URLs outside the two canonical constants,
- external URLs in navigation configuration,
- missing frontmatter or unresolved internal documentation links,
- `focus:outline-none` without a focus ring,
- legacy `rounded-md` call-to-action bases,
- shadows on form controls,
- icon buttons below the 44px touch target,
- inputs that use `text-sm` without a mobile `text-base` override,
- interactive elements with a raw class string and no focus ring.

Run the full gate before opening a pull request:

```bash
bun run check:content
bun run verify:links
bun run typecheck
bun run lint
bun run build
```

## Extending the system

1. Check whether an existing export in `lib/ui-classes.ts` already covers the case. Most new work is composition, not new tokens.
2. If a new class string is genuinely needed, add it to `lib/ui-classes.ts` with a doc comment naming its tier, and import it. Do not inline the stack.
3. If a new color is genuinely needed, add a CSS variable in both themes and expose it through `@theme inline`. Do not introduce a raw hex value in a component.
4. Animate through a preset in `lib/motion.tsx` and read `useReducedMotion()`.
5. Update this document in the same change, then run the full gate above.
