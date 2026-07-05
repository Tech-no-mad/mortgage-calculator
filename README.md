# 🏡 MortgageDash: The Modern Mortgage Calculator Suite

Welcome to **MortgageDash**, a completely free, high-performance web application built to bring transparency and beautiful design back to the home-buying process. Built on the lightning-fast [Astro](https://astro.build/) framework and styled with [Tailwind CSS](https://tailwindcss.com/), this suite of tools calculates everything from standard amortizations to complex refinancing models, all while prioritizing your privacy.

---

## ✨ Core Features

- **Gorgeous, Premium UI:** Step away from clunky, outdated financial tools. MortgageDash features modern glassmorphism, dynamic Aurora background gradients, SVG Donut Chart animations, and state-specific parallax headers.
- **Interactive Onboarding Guides:** First-time users are greeted with sequential, floating tooltips that highlight each input step-by-step. The onboarding engine intelligently skips over fixed loan parameters (like FHA down payments), while continuous ripple animations prompt users toward key navigation features like the AI Chatbot.
- **Advanced Calculation Engine:** Our expanding suite includes tools for standard Amortization, Refinancing, Extra Payments, Affordability, Recasting, HELOC scenarios, Reverse Mortgages, ARM (Adjustable Rate Mortgages), Commercial Loans, Auto Loans, Investment Properties, and Generic Loan Payments.
- **50-State Precision Integration:** No more guessing local taxes! Select any US state to instantly pre-fill its local property tax rate, median home price, and annual home insurance averages directly into the calculators. Includes support for extended 50-year loan terms.
- **Loan Type Mastery:** Comprehensive, interactive guides and integrated parameter shifts for FHA, VA, and Jumbo loan types.
- **Educational Blog:** A comprehensive library of clear, jargon-free guides designed for first-time homebuyers. Includes practical advice on affordability, loan terms, credit scores, PMI strategies, and refinancing, perfectly optimized for SEO with semantic structures and Article schema.

---

## 🤖 The Intelligent Virtual Assistant

MortgageDash isn't just a calculator; it's a financial companion. We've built a powerful, server-side Natural Language Processing (NLP) chatbot that allows you to control the calculators with simple text commands.

- **Contextual Scope Isolator:** Because we use a fast Multi-Page Application (MPA) architecture, the Assistant tracks your location using `sessionStorage`. If you're on the California page and ask *"What are the taxes?"*, it instinctively knows to fetch California's data.
- **Fuzzy Semantic Memory:** Typos happen! Using Levenshtein Distance algorithms and an extensive dictionary, the bot maps mistakes (like "hoem pryce" or "dp") directly to the correct inputs.
- **Conversational Memory & Combined Actions:** The bot remembers what you were talking about. You can string together commands like *"Take me to Washington and set the term to 15 yr"* and watch the UI automatically update.
- **Global RLHF Dictionary:** Utilizing a Reinforcement Learning from Human Feedback (RLHF) loop, the bot learns over time. If it encounters a new term, it will securely save it to global memory to help future users.

---

## 💰 AdSense, E-E-A-T & SEO Optimization

We've architected MortgageDash from the ground up to be fully compliant with strict advertising and search engine policies, heavily focusing on Google's E-E-A-T (Experience, Expertise, Authoritativeness, and Trustworthiness) standards for YMYL sites.

- **Google AdSense Ready:** Fully compliant with Google's program policies. The platform includes a dynamic CCPA/GDPR "Accept/Decline" cookie consent banner, a verified `ads.txt`, and mandatory "Your Money or Your Life" (YMYL) financial disclaimers baked directly into the global layout.
- **Deep JSON-LD Schema Architecture:** Every single calculator page features precisely mapped `WebApplication` and custom-written `FAQPage` schemas. This allows Google to generate rich snippet results without penalizing for duplicated/templatized content.
- **Defeating "Thin Content":** Static tool pages are notorious for failing SEO and AdSense crawls. We solved this by programmatically generating data-rich text blocks on all 50 state pages—detailing local property tax rates, median home pricing, and insurance premiums—to provide deep value to search crawlers, complete with dynamically generated state-level schema graphs.
- **Robust E-E-A-T Signals:** The platform features clear editorial oversight with a prominent Author/Reviewer section, alongside a transparent "Methodology" section detailing exact calculation formulas (PITI) and official data sources (FRED API).
- **Intelligent Cross-Linking Engine:** To maximize pagerank flow, all calculator modules programmatically link to contextually relevant parallel tools and state spotlights, eliminating SEO dead-ends and heavily reducing bounce rates.
- **Local Data Privacy:** Our legal and contact pages transparently articulate our "Privacy First" stance. All financial calculations occur securely within the client-side sandbox; we never harvest or store your income or loan data.

---

## 📊 High-RPM Monetization Architecture

MortgageDash implements an advanced, multi-channel revenue strategy designed for the premium US Finance vertical.

- **Strategic Ad Placement:** A reusable `AdSlot.astro` component places ads in 4 high-viewability positions across every page: Leaderboard (above calculator), Rectangle (between results and tools), Rectangle-lg (between tools and SEO content), and a persistent Sticky Anchor ad fixed to the viewport bottom.

- **Email Capture Funnel:** The `EmailModal.astro` component replaces the legacy `mailto:` link with a beautiful glassmorphism modal that captures user emails alongside their live calculated values. Stored in `localStorage` and ready for Mailchimp integration.
- **Mobile Sticky Payment Bar:** On mobile devices, a fixed bottom bar shows the live monthly payment amount as users scroll, using `IntersectionObserver` to hide when the results section is visible.

---

## 📈 Live Financial Data Automation

MortgageDash uses a dynamic Server-Side Rendering (SSR) approach to fetch live economic data directly from the Federal Reserve Economic Data (FRED) API at request time.
- **~3,100 Auto-Generated County Pages:** One dedicated landing page for every US county using US Census data. This gives ~93,000 hyper-local keywords like `Autauga County mortgage calculator`.
- **15 Long-form Mortgage Guides:** High-quality, SEO-optimized guides covering high-volume queries (first-time buyer, down payment, PMI, etc.).
- **Live Interest Rates:** Fetches the actual current 30-year fixed, 15-year fixed, and 5/1 ARM rates directly from the Federal Reserve Economic Data (FRED) API at build time. No more "assuming 6.5%" – real numbers based on today's market.
- **Accurate Property Taxes by State & County:** Integrates live data from the US Census Bureau API to pull the true median home value and effective property tax rate for all 50 states and over 3,100 counties. If a user selects "Texas", the tax rate automatically adjusts to 1.63% (vs Hawaii at 0.27%).
- **Advanced Amortization Engine:** A robust TypeScript calculation engine that handles Principal & Interest (P&I), Property Taxes, Homeowners Insurance, HOA fees, and Private Mortgage Insurance (PMI) based on down payment percentage.
- **Dynamic 100K+ Keyword Footprint:** Every page, including the calculators, blog posts, and dynamic county pages, is heavily optimized with an expansive set of long-tail intent keywords.
- **Interactive Visualizations:** Uses Highcharts to render beautiful, responsive breakdown charts and amortization curve graphs that update in real-time as the user moves sliders.
- **Cloudflare Edge Caching:** To prevent exhausting the FRED API limits (120 requests/minute), the outbound requests use Cloudflare's native `cf: { cacheTtl: 3600 }` edge cache and an isolate memory cache. This ensures instant performance while providing up-to-date daily data without requiring manual redeployments.
- **Comprehensive Rates:** Dynamically fetches current values for 30-Year Mortgages, 15-Year Mortgages, 5/1 ARMs, the US Prime Rate, and 60-Month Auto Loans.
- **Robust Fallbacks:** In the event of a FRED API outage or missing API keys, the system gracefully falls back to a locally cached `rates.json` baseline.

---

## ♿ UX, Accessibility & Audits

We take user experience and accessibility seriously, having recently implemented comprehensive recommendations from a WebsiteRating.com audit:
- **100/100 Accessibility Score:** Every calculator input, dropdown, and chatbot interface is strictly mapped with `aria-label` attributes to ensure flawless screen reader navigation.
- **Responsive Tap Targets:** Optimized mobile button sizing ensures "fat-finger" errors are minimized during loan term selection.
- **Frictionless Conversion:** Features like the "Email me this breakdown" CTA allows users to seamlessly save their calculated results with a single click.
- **Unobtrusive Cookie Banner:** A sleek, bottom-docked privacy banner prevents overlapping critical Monthly Payment UI elements on smaller viewports.

---

## 🚀 Technical Infrastructure

- **Edge Deployment:** Configured with `@astrojs/cloudflare` to deploy seamlessly to Cloudflare Workers/Pages on the custom domain [mortgagedash.app](https://mortgagedash.app).
- **Verified Email Infrastructure:** Integrated with Resend API using custom domain authentication to send mortgage breakdown reports from `notifications@mortgagedash.app`.
- **Technical SEO:** Includes dynamic `sitemap-index.xml` generation, `robots.txt` configuration pointing to the custom domain, extensive JSON-LD structured data, and semantic HTML markup.
- **TypeScript Hydration:** Strict TypeScript compilation ensures that our interactive DOM logic runs flawlessly during static site generation.

---

## 🛠 Getting Started

Run the following commands from your terminal at the root of the project to dive right in:

| Command | Action |
| :--- | :--- |
| `npm install` | Installs the necessary dependencies. |
| `npm run dev` | Starts the local dev server at `localhost:4321`. |
| `npm run build` | Builds your production-ready site to `./dist/`. |
| `npm run preview` | Previews your local build before deploying. |

---

## 📂 Project Architecture

- **`src/pages/`** - The core routing logic, including the individual state guides and standalone calculators.
- **`src/pages/api/`** - Secure, server-side API endpoints (like the core engine for the Chatbot Assistant).
- **`src/components/`** - Modular UI pieces including the Header, Footer, floating Chatbot, reusable `AdSlot`, `AffiliateCTA`, and `EmailModal` components.
- **`src/layouts/`** - Home to `BaseLayout.astro`, handling global SEO meta tags, dark/light mode context, cookie banners, and bot layout shielding.
- **`src/styles/`** - Global CSS tokens, Aurora gradients, and resets.
- **`src/data/`** - Static JSON databases (like `states.json`) powering the calculations and the Virtual Assistant.
- **`public/`** - Static assets including favicons, robots.txt, ads.txt, and `_headers`.

---
*Built with ❤️ for US homebuyers. Make confident decisions with MortgageDash.*
