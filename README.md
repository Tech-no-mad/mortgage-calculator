# MortgageDash (Mortgage Calculator Suite)

A comprehensive, high-performance Mortgage Calculator suite built with [Astro](https://astro.build/) and [Tailwind CSS](https://tailwindcss.com/). This application features dynamic home loan calculators, an intelligent Virtual Assistant chatbot, state-specific mortgage data integration, and built-in technical SEO optimization.

## 🚀 Features

- **Advanced Calculators:** 
  - Standard Amortization (with Monthly & Yearly aggregate views)
  - Refinance Calculator (with break-even analysis)
  - Extra Payment Calculator
  - Affordability Calculator
  - Recast Calculator
  - HELOC (Home Equity Line of Credit)
- **State-Specific Integrations:** Select a state to instantly pre-fill local property tax rates, median home prices, and annual home insurance averages directly into the calculators.
- **Loan Type Guides:** Comprehensive information and tools for VA, FHA, and Jumbo loans.
- **AI Virtual Assistant (Chatbot):** 
  - **State Memory:** Answers localized property tax, home price, and insurance questions (e.g. "What is the property tax in Colorado?").
  - **Combined Actions:** Can parse complex prompts to simultaneously navigate your browser *and* autofill data across pages (e.g. "Take me to Washington and set the term to 15 yr").
  - **Fuzzy Semantic Memory:** Uses Levenshtein Distance and an extensive global dictionary to instinctively map typos and synonyms (like `cost`, `value`, or `hoem pryce`) directly to their correct inputs.
  - **Contextual Scope Isolator:** Because the app is a Multi-Page Application (MPA), the Chatbot tracks your `activeScope` across physical page reloads via `sessionStorage`. If you are on the Washington page, asking *"What is the tax?"* automatically fetches Washington's tax rate without you needing to specify it!
  - **Parameter Shifts:** Automatically recognizes concepts like "FHA Loan" or "VA Loan" not as separate pages, but as parameter shifts, seamlessly modifying the Main Calculator's constraints (e.g. dropping down payment to 3.5% or 0%) while keeping you in the current scope.
  - **Conversational Memory:** Uses compressed lightweight context history so you can have natural multi-turn conversations (e.g. pointing out a missing field and answering the follow-up question).
  - **Global RLHF Dictionary:** Features a Reinforcement Learning from Human Feedback (RLHF) loop. If it doesn't recognize an abbreviation (e.g. "dp"), it will ask for clarification. Once answered, it securely saves this to global memory for all future users.
  - **Responsive UI & Controls:** Features a gorgeous full-screen vertical drawer on desktop and mobile. You can now freely minimize the chat to a sleek header, or maximize it to overtake the full screen!
  - **Secure Server-Side API:** The Chatbot's logic and data are hidden safely on the server behind an `/api/chat` endpoint, preventing client-side tampering.
- **Technical SEO & Edge Deployment:** 
  - Deployed seamlessly to Cloudflare Pages via `@astrojs/cloudflare`
  - Dynamic `sitemap.xml` generation and `robots.txt`
  - Extensive JSON-LD structured data and semantic markup
  - Wildcard `_headers` configuration to manage indexing during staging

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |

## 🛠 Tech Stack

- **Framework:** Astro
- **Styling:** Tailwind CSS
- **Backend Adapter:** `@astrojs/cloudflare` (Configured for Cloudflare Pages edge execution)
- **SEO/Sitemaps:** `@astrojs/sitemap`

## 📁 Directory Structure

- `src/pages/` - Contains all routing logic including state guides and calculators.
- `src/pages/api/` - Contains secure server-side API endpoints (like the Chatbot's logic).
- `src/components/` - Reusable UI components including the Header, Footer, and the Chatbot Assistant.
- `src/layouts/` - Contains `BaseLayout.astro` which handles global SEO meta tags, dark/light mode context, and styling.
- `src/styles/` - Global CSS tokens and resets.
- `src/data/` - Static JSON data (like `states.json`) used by the calculators and the Virtual Assistant.
- `public/` - Static assets including favicons, robots.txt, and `_headers`.
