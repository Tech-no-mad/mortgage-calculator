# American UI & Top 10 Brokers Implementation Plan

Based on your request, we are going to implement a patriotic, "American" design system across the website, customize individual state pages to feel unique to each state, and expand our broker affiliate offerings.

## Open Questions
- **State UI Customizations:** My plan is to add subtle state-specific elements (like the state's official colors or a faint outline/flag pattern) to the background of each state's page. Does that align with your vision, or did you want more drastic layout changes per state?
- **American Feel:** I plan to introduce a refined Red, White, and Blue color palette for accents (buttons, highlights) while keeping the core dark/light mode surface colors intact to ensure readability. Is there any specific imagery (like stars, eagles) you want incorporated, or keep it modern and professional?

## Proposed Changes

### Expand Brokers & Landing Page
#### [MODIFY] [brokers.astro](file:///c:/Mortgage Calculator/src/pages/brokers.astro)
- Add 8 new high-rated national mortgage lenders (e.g., LoanDepot, Chase, Bank of America, Fairway, Guild Mortgage, PennyMac, U.S. Bank, Navy Federal) to reach a top 10 list.
- Enhance the UI to look more like a premium comparison table.

#### [MODIFY] [index.astro](file:///c:/Mortgage Calculator/src/pages/index.astro)
- Add a new card/link in the "More Tools" (or Quick Links) section specifically directing users to the Top 10 Brokers page.

### American UI Design System
#### [MODIFY] [global.css](file:///c:/Mortgage Calculator/src/styles/global.css)
- Integrate a modern "American" accent palette (Navy Blues, Crimson Reds, and Clean Whites).
- Apply these accents to buttons, gradients, and hover states across the site.
- Ensure all changes strictly respect the `var(--bg-surface)` variables so that Dark/Light toggles remain unaffected and perfectly legible.

### State-Specific UI
#### [MODIFY] [[state].astro](file:///c:/Mortgage Calculator/src/pages/states/[state].astro)
- Implement a dynamic styling system. Based on the `state` parameter, the page will inject subtle unique characteristics (e.g., Texas gets a Lone Star accent scheme, California gets a Golden State hue, etc.).
- Add a visual hero section for each state featuring an American/State-centric design.

## Verification Plan
1. Manually check the landing page to ensure the new Brokers link is visible.
2. Review the `/brokers` page to confirm 10 lenders are listed with consistent styling.
3. Toggle between Light and Dark mode to ensure the new "American" colors don't break contrast ratios.
4. Navigate to `/states/texas` and `/states/california` to verify the state-specific dynamic UI is rendering correctly.
