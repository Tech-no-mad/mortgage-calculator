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
  - **Auto-Navigation:** Navigates the user to different calculators based on intent (e.g. "Go to the Refinance Calculator").
  - **Auto-Filling:** Parses user input and fills out calculator forms automatically (e.g. "Set my home price to 400k and down payment to 20%").
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
- `src/components/` - Reusable UI components including the Header, Footer, and the Chatbot Assistant.
- `src/layouts/` - Contains `BaseLayout.astro` which handles global SEO meta tags, dark/light mode context, and styling.
- `src/styles/` - Global CSS tokens and resets.
- `src/data/` - Static JSON data (like `states.json`) used by the calculators and the Virtual Assistant.
- `public/` - Static assets including favicons, robots.txt, and `_headers`.
