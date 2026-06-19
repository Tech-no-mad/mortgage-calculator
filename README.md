# MortgageDash (Mortgage Calculator Suite)

A comprehensive, high-performance Mortgage Calculator suite built with [Astro](https://astro.build/) and [Tailwind CSS](https://tailwindcss.com/). This application features dynamic home loan calculators, state-specific mortgage guides, a smart AI chatbot, and built-in technical SEO optimization for maximum visibility.

## 🚀 Features

- **Advanced Calculators:** 
  - Standard Amortization
  - Refinance Calculator
  - Extra Payment Calculator
  - Affordability Calculator
  - Recast Calculator
  - HELOC (Home Equity Line of Credit)
- **Loan Type Guides:** Comprehensive information and tools for VA, FHA, and Jumbo loans.
- **State-Specific Guides:** Localized guides and tools optimized for all 50 US states.
- **Interactive AI Chatbot:** Features a smart assistant trained on a financial knowledge base to answer user questions with instant access to the right calculators.
- **Local Lead Capture:** Backend API to capture lead generation emails and save them locally to a CSV.
- **Technical SEO:** 
  - Dynamic `sitemap.xml` generation
  - `robots.txt` configuration
  - Cloudflare Pages no-index protection (`_headers`)
  - Extensive JSON-LD structured data and semantic markup

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
- **Backend Adapter:** `@astrojs/node`
- **SEO/Sitemaps:** `@astrojs/sitemap`

## 📁 Directory Structure

- `src/pages/` - Contains all routing logic including state guides and calculators.
- `src/components/` - Reusable UI components including the Header, Footer, and the Chatbot.
- `src/layouts/` - Contains `BaseLayout.astro` which handles global SEO meta tags, dark/light mode context, and styling.
- `src/styles/` - Global CSS tokens and resets.
- `src/data/` - Static JSON data such as the 50 US states mapping.
- `public/` - Static assets including favicons, robots.txt, and _headers.

## 🤝 Lead Capture

Leads collected through the site's contact forms are saved securely as a local file (`leads.csv`) in the root directory via the `/api/contact.ts` endpoint. 

*Note: The Node filesystem (`fs`) module is used for saving leads locally. If deploying to serverless edge platforms like Cloudflare Pages, the API endpoint will need to be adapted to use external databases (like D1) or email forwarding APIs.*
