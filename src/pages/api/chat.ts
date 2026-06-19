import type { APIRoute } from 'astro';
import statesData from '../../data/states.json';

// Comprehensive Knowledge Base (Document Lookup Simulation)
const KNOWLEDGE_BASE = [
  {
    topic: "data sources methodology",
    keywords: ["source", "where", "data", "come", "from", "methodology", "origin", "database"],
    answer: "Our data is sourced from several highly reputable national databases. **Property Taxes:** US Census Bureau (Effective Median Rates). **Home Prices:** Zillow Home Value Index and FRED. **Insurance:** National Association of Insurance Commissioners (NAIC). **Interest Rates:** Freddie Mac PMMS."
  },
  {
    topic: "data frequency updates",
    keywords: ["dynamic", "live", "updated", "static", "often", "when", "change"],
    answer: "Currently, our dataset is static and periodically updated manually. It does not update dynamically every day via a live API. This ensures the tool remains 100% free and lightning fast without relying on expensive financial data feeds."
  },
  {
    topic: "accuracy of calculations",
    keywords: ["accurate", "accuracy", "correct", "exact", "right", "true"],
    answer: "The Principal & Interest (P&I) calculations are 100% mathematically exact, utilizing standard global banking formulas. However, Taxes, Insurance, and PMI are generalizations based on state averages. Your exact costs will depend on your specific county assessment and personal credit score."
  },
  {
    topic: "private mortgage insurance pmi",
    keywords: ["pmi", "mortgage insurance", "private mortgage insurance", "under 20%"],
    answer: "PMI (Private Mortgage Insurance) is required by lenders if your down payment is less than 20% of the home's price. It protects the lender, not you. Our calculators estimate PMI at a standard 0.7% annually, but in reality, it ranges from 0.3% to 1.5% based heavily on your credit score."
  },
  {
    topic: "amortization schedule",
    keywords: ["amortization", "schedule", "table", "breakdown"],
    answer: "An amortization schedule is a complete table detailing every monthly payment over the life of your loan. Early on, almost your entire payment goes toward Interest. By the end of the loan, it almost entirely goes toward Principal. You can view this visual breakdown in our Amortization Calculator."
  },
  {
    topic: "refinancing",
    keywords: ["refinance", "refinancing", "when", "worth"],
    answer: "Refinancing involves replacing your current mortgage with a new one to secure a lower interest rate or shorter term. You should calculate the 'Break-Even Point': the time it takes for your monthly savings to outweigh the closing costs of the new loan. Try our Refinance Calculator!"
  },
  {
    topic: "affordability rule",
    keywords: ["afford", "how much", "salary", "income", "rule", "28/36"],
    answer: "We use the industry-standard '28/36 Rule'. This rule states that a household should spend a maximum of 28% of its gross monthly income on total housing expenses, and no more than 36% on total debt service (housing + car loans, student loans, credit cards)."
  },
  {
    topic: "closing costs",
    keywords: ["closing", "costs", "fees", "extra"],
    answer: "Closing costs are fees paid at the closing of a real estate transaction. They usually equal 2% to 5% of the total loan amount and include things like appraisal fees, title insurance, loan origination fees, and escrow prepayments."
  },
  {
    topic: "greeting",
    keywords: ["hello", "hi", "hey", "yo"],
    answer: "Hello! How can I help you with your mortgage questions today?"
  },
  {
    topic: "recast calculator",
    keywords: ["recast", "lump", "sum", "recasting"],
    answer: "A mortgage recast allows you to make a large lump-sum payment to reduce your monthly payment without changing your interest rate or loan term. Try our [Recast Calculator](/recast-calculator) to see your savings!"
  },
  {
    topic: "heloc calculator",
    keywords: ["heloc", "equity", "line", "credit", "borrow"],
    answer: "A Home Equity Line of Credit (HELOC) lets you borrow against the equity in your home. You only pay interest on what you draw during the draw period. Estimate your payments with our [HELOC Calculator](/heloc-calculator)."
  },
  {
    topic: "fha loans",
    keywords: ["fha", "3.5", "down", "credit"],
    answer: "FHA loans are insured by the Federal Housing Administration and allow down payments as low as 3.5% for credit scores of 580+. Check out our [FHA Loans Guide](/fha-loans)."
  },
  {
    topic: "va loans",
    keywords: ["va", "veteran", "military", "zero", "down"],
    answer: "VA loans are a $0-down mortgage option for veterans and active-duty service members. They don't require PMI but have a funding fee. Read our [VA Loans Guide](/va-loans)."
  },
  {
    topic: "jumbo loans",
    keywords: ["jumbo", "large", "expensive", "limit"],
    answer: "Jumbo loans are for high-value properties that exceed conventional conforming loan limits. They generally require larger down payments and higher credit scores. See our [Jumbo Loans Guide](/jumbo-loans)."
  },
  {
    topic: "reverse mortgage",
    keywords: ["reverse", "senior", "retire"],
    answer: "A reverse mortgage allows homeowners aged 62+ to convert part of their home equity into cash without having to sell the home. Ask a certified counselor for more details!"
  },
  {
    topic: "assumable mortgage",
    keywords: ["assumable", "assume", "take", "over"],
    answer: "An assumable mortgage lets a buyer take over the seller's existing mortgage and its interest rate. This is highly valuable when current market rates are higher than the seller's rate. FHA and VA loans are generally assumable."
  },
  {
    topic: "family opportunity mortgage",
    keywords: ["family", "opportunity", "parents", "children"],
    answer: "The Family Opportunity Mortgage allows you to buy a home for an elderly parent or an adult child with a disability as if it were a primary residence, meaning lower interest rates and down payments."
  }
];

function tokenize(text: string) {
  return text.toLowerCase().replace(/[^\w\s]/gi, '').split(/\s+/).filter(w => w.length > 2 || w === "hi");
}

function findBestMatch(query: string): string {
  const userTokens = tokenize(query);
  if (userTokens.length === 0) return "Could you please rephrase that?";

  let bestScore = 0;
  let bestAnswer = "";

  for (const doc of KNOWLEDGE_BASE) {
    let score = 0;
    for (const keyword of doc.keywords) {
      if (query.toLowerCase().includes(keyword)) {
        score += 2;
      }
      if (userTokens.includes(keyword)) {
        score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestAnswer = doc.answer;
    }
  }

  if (bestScore > 0) {
    const prefixes = ["Based on our documentation: ", "Here is what I found in our knowledge base: ", "According to our data: "];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    if (bestAnswer.includes("Hello!")) return bestAnswer;
    return prefix + bestAnswer;
  }
  
  return "I searched our knowledge base but couldn't find a direct answer to that. Try asking about our data sources, PMI, amortization, or how accurate the calculations are!";
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const query = data.query || '';
    const text = query.toLowerCase();

    // 1. Navigation Actions
    if (text.includes('go to') || text.includes('open') || text.includes('navigate') || text.includes('take me to')) {
      if (text.includes('refinance')) {
        return new Response(JSON.stringify({ response: "Navigating you to the Refinance Calculator...", action: { type: 'navigate', payload: '/refinance-calculator' } }));
      }
      if (text.includes('extra payment') || text.includes('payoff')) {
        return new Response(JSON.stringify({ response: "Navigating you to the Extra Payment Calculator...", action: { type: 'navigate', payload: '/extra-payment-calculator' } }));
      }
      if (text.includes('afford')) {
        return new Response(JSON.stringify({ response: "Navigating you to the Affordability Calculator...", action: { type: 'navigate', payload: '/how-much-can-i-afford' } }));
      }
      if (text.includes('amortization')) {
        return new Response(JSON.stringify({ response: "Navigating you to the Amortization Schedule...", action: { type: 'navigate', payload: '/amortization-schedule' } }));
      }
      if (text.includes('heloc') || text.includes('equity')) {
        return new Response(JSON.stringify({ response: "Navigating you to the HELOC Calculator...", action: { type: 'navigate', payload: '/heloc-calculator' } }));
      }
      if (text.includes('home') || text.includes('main')) {
        return new Response(JSON.stringify({ response: "Navigating you to the Main Calculator...", action: { type: 'navigate', payload: '/' } }));
      }
    }

    // 2. Auto-fill Actions
    if (text.includes('set') || text.includes('change') || text.includes('make')) {
      const numMatch = query.match(/(\d+(?:,\d+)*(?:\.\d+)?)\s*(k|m|%)?/gi);
      if (numMatch) {
        let fills: any[] = [];
        let rtext = "I've updated the calculator for you: ";
        numMatch.forEach((val: string) => {
          let num = parseFloat(val.replace(/,/g, ''));
          if (val.toLowerCase().includes('k')) num *= 1000;
          if (val.toLowerCase().includes('m')) num *= 1000000;
          
          if (text.includes('price') || text.includes('home') || text.includes('loan')) {
            fills.push({ id: ['home-price', 'loan-amount', 'home-value'], value: num.toString() });
            rtext += `Home/Loan to $${num.toLocaleString()}. `;
          } else if ((text.includes('down') || text.includes('payment')) && (val.includes('%') || num < 100)) {
            fills.push({ id: ['down-payment'], value: num.toString() });
            rtext += `Down Payment to ${num}%. `;
          } else if (text.includes('rate') || text.includes('interest')) {
            fills.push({ id: ['interest-rate', 'heloc-rate'], value: num.toString() });
            rtext += `Interest Rate to ${num}%. `;
          }
        });

        if (fills.length > 0) {
          return new Response(JSON.stringify({ response: rtext, action: { type: 'fill', payload: fills } }));
        }
      }
    }

    // 3. State Data Interceptor
    for (const state of statesData) {
      if (text.includes(state.name.toLowerCase())) {
        if (text.includes('tax') || text.includes('property') || text.includes('rate')) {
          return new Response(JSON.stringify({ response: `The average property tax rate in **${state.name}** is **${state.taxRate}%**.` }));
        }
        if (text.includes('insurance')) {
          return new Response(JSON.stringify({ response: `The average annual home insurance cost in **${state.name}** is around **$${state.insurance.toLocaleString()}**.` }));
        }
        if (text.includes('price') || text.includes('cost') || text.includes('home')) {
          return new Response(JSON.stringify({ response: `The median home price in **${state.name}** is **$${state.medianPrice.toLocaleString()}**.` }));
        }
        return new Response(JSON.stringify({ response: `**${state.name}** has a median home price of **$${state.medianPrice.toLocaleString()}**, an average property tax rate of **${state.taxRate}%**, and annual home insurance around **$${state.insurance.toLocaleString()}**. We have a [${state.name} Mortgage Calculator](/states/${state.slug}) you can use!` }));
      }
    }

    // 4. Fallback to Knowledge Base
    const response = findBestMatch(query);
    return new Response(JSON.stringify({ response }));
    
  } catch (error) {
    return new Response(JSON.stringify({ response: "Sorry, I ran into an error processing that request." }), { status: 500 });
  }
};
