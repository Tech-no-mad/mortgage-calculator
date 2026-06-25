# 🏡 MortgageDash: The Modern Mortgage Calculator Suite

Welcome to **MortgageDash**, a completely free, high-performance web application built to bring transparency and beautiful design back to the home-buying process. Built on the lightning-fast [Astro](https://astro.build/) framework and styled with [Tailwind CSS](https://tailwindcss.com/), this suite of tools calculates everything from standard amortizations to complex refinancing models, all while prioritizing your privacy.

---

## ✨ Core Features

- **Gorgeous, Premium UI:** Step away from clunky, outdated financial tools. MortgageDash features modern glassmorphism, dynamic Aurora background gradients, SVG Donut Chart animations, and state-specific parallax headers.
- **Interactive Onboarding Guides:** First-time users are greeted with sequential, floating tooltips that highlight each input step-by-step. The onboarding engine intelligently skips over fixed loan parameters (like FHA down payments), while continuous ripple animations prompt users toward key navigation features like the AI Chatbot.
- **Advanced Calculation Engine:** Our expanding suite includes tools for standard Amortization, Refinancing, Extra Payments, Affordability, Recasting, HELOC scenarios, Reverse Mortgages, ARM (Adjustable Rate Mortgages), Commercial Loans, Auto Loans, Investment Properties, and Generic Loan Payments.
- **50-State Precision Integration:** No more guessing local taxes! Select any US state to instantly pre-fill its local property tax rate, median home price, and annual home insurance averages directly into the calculators. Includes support for extended 50-year loan terms.
- **Loan Type Mastery:** Comprehensive, interactive guides and integrated parameter shifts for FHA, VA, and Jumbo loan types.

---

## 🤖 The Intelligent Virtual Assistant

MortgageDash isn't just a calculator; it's a financial companion. We've built a powerful, server-side Natural Language Processing (NLP) chatbot that allows you to control the calculators with simple text commands.

- **Contextual Scope Isolator:** Because we use a fast Multi-Page Application (MPA) architecture, the Assistant tracks your location using `sessionStorage`. If you're on the California page and ask *"What are the taxes?"*, it instinctively knows to fetch California's data.
- **Fuzzy Semantic Memory:** Typos happen! Using Levenshtein Distance algorithms and an extensive dictionary, the bot maps mistakes (like "hoem pryce" or "dp") directly to the correct inputs.
- **Conversational Memory & Combined Actions:** The bot remembers what you were talking about. You can string together commands like *"Take me to Washington and set the term to 15 yr"* and watch the UI automatically update.
- **Global RLHF Dictionary:** Utilizing a Reinforcement Learning from Human Feedback (RLHF) loop, the bot learns over time. If it encounters a new term, it will securely save it to global memory to help future users.

---

## 💰 AdSense & SEO Optimization

We've architected MortgageDash from the ground up to be fully compliant with strict advertising and search engine policies.

- **Google AdSense Ready:** Fully compliant with Google's program policies. The platform includes a dynamic CCPA/GDPR "Accept/Decline" cookie consent banner, a verified `ads.txt`, and mandatory "Your Money or Your Life" (YMYL) financial disclaimers baked directly into the global layout.
- **Defeating "Thin Content":** Static tool pages are notorious for failing SEO and AdSense crawls. We solved this by programmatically generating data-rich text blocks on all 50 state pages—detailing local property tax rates, median home pricing, and insurance premiums—to provide deep value to search crawlers.
- **Local Data Privacy:** Our legal and contact pages transparently articulate our "Privacy First" stance. All financial calculations occur securely within the client-side sandbox; we never harvest or store your income or loan data.

---

## 📈 Live Financial Data Automation

MortgageDash uses a build-time automation script to fetch live economic data directly from the Federal Reserve Economic Data (FRED) API.
- **Automated Accuracy:** A Node.js script (`fetch-rates.js`) executes automatically prior to every `npm run build`.
- **Comprehensive Rates:** Dynamically fetches current values for 30-Year Mortgages, 15-Year Mortgages, 5/1 ARMs, the US Prime Rate, and 60-Month Auto Loans.
- **Self-Sustaining Architecture:** Integrated with Cloudflare Pages environment variables, the site statically pre-renders with 100% accurate, live rates every week without any manual intervention.

---

## ♿ UX, Accessibility & Audits

We take user experience and accessibility seriously, having recently implemented comprehensive recommendations from a WebsiteRating.com audit:
- **100/100 Accessibility Score:** Every calculator input, dropdown, and chatbot interface is strictly mapped with `aria-label` attributes to ensure flawless screen reader navigation.
- **Responsive Tap Targets:** Optimized mobile button sizing ensures "fat-finger" errors are minimized during loan term selection.
- **Frictionless Conversion:** Features like the "Email me this breakdown" CTA allows users to seamlessly save their calculated results with a single click.
- **Unobtrusive Cookie Banner:** A sleek, bottom-docked privacy banner prevents overlapping critical Monthly Payment UI elements on smaller viewports.

---

## 🚀 Technical Infrastructure

- **Edge Deployment:** Configured with `@astrojs/cloudflare` to deploy seamlessly to Cloudflare Pages for instant, edge-network performance.
- **Technical SEO:** Includes dynamic `sitemap-index.xml` generation, `robots.txt` configuration, extensive JSON-LD structured data, and semantic HTML markup.
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
- **`src/components/`** - Modular UI pieces including the Header, Footer, and the floating Chatbot interface.
- **`src/layouts/`** - Home to `BaseLayout.astro`, handling global SEO meta tags, dark/light mode context, cookie banners, and bot layout shielding.
- **`src/styles/`** - Global CSS tokens, Aurora gradients, and resets.
- **`src/data/`** - Static JSON databases (like `states.json`) powering the calculations and the Virtual Assistant.
- **`public/`** - Static assets including favicons, robots.txt, ads.txt, and `_headers`.

---
*Built with ❤️ for US homebuyers. Make confident decisions with MortgageDash.*
