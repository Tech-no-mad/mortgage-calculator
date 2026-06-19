import type { APIRoute } from 'astro';
import statesData from '../../data/states.json';

// Global RLHF Map for persistence across requests in memory
const globalAny: any = globalThis;
if (!globalAny.rlhfMap) {
  globalAny.rlhfMap = new Map<string, string>([
    ['dp', 'down-payment'],
    ['downpayment', 'down-payment'],
    ['dwn pymnt', 'down-payment'],
    ['hp', 'home-price'],
    ['homeprice', 'home-price'],
    ['loan', 'home-price'],
    ['ir', 'interest-rate'],
    ['interest', 'interest-rate'],
    ['rate', 'interest-rate'],
    ['term', 'term'],
    ['years', 'term'],
    ['yr', 'term'],
    ['tax', 'tax-rate'],
    ['taxes', 'tax-rate'],
    ['insurance', 'home-insurance'],
    ['ins', 'home-insurance'],
    ['state', 'state-selector']
  ]);
}
const rlhfMap: Map<string, string> = globalAny.rlhfMap;

// Levenshtein distance for fuzzy matching
function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1], matrix[i][j - 1], matrix[i - 1][j]) + 1;
      }
    }
  }
  return matrix[a.length][b.length];
}

const FIELD_MAP: Record<string, string[]> = {
  'home-price': ['home-price', 'loan-amount', 'home-value'],
  'down-payment': ['down-payment'],
  'interest-rate': ['interest-rate', 'heloc-rate'],
  'term': ['term'],
  'tax-rate': ['tax-rate'],
  'home-insurance': ['home-insurance'],
  'state-selector': ['state-selector']
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const query = data.query || '';
    const text = query.toLowerCase();

    // 1. RLHF Learning Interceptor
    // e.g. "learn that hp means home price" or "hp is home price"
    const learnMatch = query.match(/(.+?)\s+(?:means|is)\s+(.+)/i);
    if (learnMatch && (text.includes('learn') || (text.includes('means') && text.split(' ').length < 8) || data.learningMode)) {
      let alias = learnMatch[1].replace(/learn that /i, '').replace(/['"]/g, '').trim().toLowerCase();
      // If learning mode from client clarification, alias is just the target
      if (data.learningMode && data.alias) alias = data.alias.toLowerCase();
      
      let target = learnMatch[2].replace(/['"\.]/g, '').trim().toLowerCase();
      
      let closestField = target;
      let bestDist = 999;
      for (const field of Object.keys(FIELD_MAP)) {
        const d = levenshtein(target.replace(/\s+/g, '-'), field);
        if (d < bestDist) { bestDist = d; closestField = field; }
      }
      for (const [k, v] of rlhfMap.entries()) {
        const d = levenshtein(target.replace(/\s+/g, '-'), v);
        if (d < bestDist) { bestDist = d; closestField = v; }
      }

      // Safeguard threshold (max 5 edits)
      if (bestDist <= 5) {
        rlhfMap.set(alias, closestField);
        return new Response(JSON.stringify({ response: `Got it! I've learned that "${alias}" means "${closestField.replace('-', ' ')}". I will remember this for next time.` }));
      } else {
        return new Response(JSON.stringify({ response: `I tried to learn that, but "${target}" doesn't match any fields I know about (like home price, down payment, etc).` }));
      }
    }

    // 2. Navigation Actions
    if (text.includes('go to') || text.includes('navigate') || text.includes('take me to')) {
      if (text.includes('refinance')) return new Response(JSON.stringify({ response: "Navigating...", action: { type: 'navigate', payload: '/refinance-calculator' } }));
      if (text.includes('extra') || text.includes('payoff')) return new Response(JSON.stringify({ response: "Navigating...", action: { type: 'navigate', payload: '/extra-payment-calculator' } }));
      if (text.includes('afford')) return new Response(JSON.stringify({ response: "Navigating...", action: { type: 'navigate', payload: '/how-much-can-i-afford' } }));
      if (text.includes('amortization')) return new Response(JSON.stringify({ response: "Navigating...", action: { type: 'navigate', payload: '/amortization-schedule' } }));
      if (text.includes('heloc')) return new Response(JSON.stringify({ response: "Navigating...", action: { type: 'navigate', payload: '/heloc-calculator' } }));
      return new Response(JSON.stringify({ response: "Navigating to Main Calculator...", action: { type: 'navigate', payload: '/' } }));
    }

    // 3. Smart Parser with Contextual Numbers
    let fills: any[] = [];
    let rtext = "I've updated the calculator: ";
    let unknownWords: string[] = [];

    // Parse states first
    let stateFound = false;
    for (const state of statesData) {
      if (text.includes(state.name.toLowerCase()) || text.match(new RegExp(`\\b${state.abbr.toLowerCase()}\\b`, 'i'))) {
        if (text.includes('set') || text.includes('change') || text.includes('make') || text.includes('update')) {
          fills.push({ id: ['state-selector'], value: state.abbr });
          rtext += `State to ${state.name}. `;
          stateFound = true;
          break; // only do one state
        }
      }
    }

    // Parse numeric fields
    if (text.includes('set') || text.includes('change') || text.includes('make') || text.includes('update')) {
      // Find numbers and their preceding/succeeding 2 words
      const words = query.split(/\s+/);
      
      for (let i = 0; i < words.length; i++) {
        let w = words[i].toLowerCase();
        const numMatch = w.match(/^(\$?\d+(?:,\d+)*(?:\.\d+)?)(k|m|%|yr|years?)?$/i);
        
        if (numMatch) {
          let numStr = numMatch[1].replace(/[$,]/g, '');
          let num = parseFloat(numStr);
          let modifier = numMatch[2]?.toLowerCase();
          
          if (modifier === 'k') num *= 1000;
          if (modifier === 'm') num *= 1000000;
          
          // Contextual analysis: look at -3 to +3 words around the number
          let contextWords = words.slice(Math.max(0, i - 3), Math.min(words.length, i + 4));
          contextWords = contextWords.filter(cw => cw.toLowerCase() !== w && cw.length > 1);
          
          let matchedField = null;
          let bestDist = 999;

          // Explicit overrides
          if (modifier === 'yr' || modifier === 'year' || modifier === 'years') {
            matchedField = 'term';
            bestDist = 0;
          }

          if (!matchedField) {
            for (const cw of contextWords) {
              let clean = cw.toLowerCase().replace(/[^\w]/g, '');
              if (!clean) continue;

              // Check RLHF Map first (exact matches on abbreviations)
              if (rlhfMap.has(clean)) {
                matchedField = rlhfMap.get(clean);
                bestDist = 0;
                break;
              }

              // Check Fuzzy Fields
              for (const field of Object.keys(FIELD_MAP)) {
                let d = levenshtein(clean, field);
                let d2 = levenshtein(clean, field.replace('-', '')); // check without dash
                let minD = Math.min(d, d2);
                
                // Allow fuzzy match if within 3 edits
                if (minD < bestDist && minD <= 3) {
                  bestDist = minD;
                  matchedField = field;
                }
              }
            }
          }

          // If STILL no match, try bigrams (e.g. "home price", "down payment")
          if (!matchedField) {
            for (let j = 0; j < contextWords.length - 1; j++) {
              let bigram = contextWords[j].toLowerCase().replace(/[^\w]/g, '') + '-' + contextWords[j+1].toLowerCase().replace(/[^\w]/g, '');
              
              if (rlhfMap.has(bigram)) {
                matchedField = rlhfMap.get(bigram);
                break;
              }
              for (const field of Object.keys(FIELD_MAP)) {
                let d = levenshtein(bigram, field);
                if (d <= 3) { matchedField = field; break; }
              }
            }
          }

          // Fallbacks based on value
          if (!matchedField) {
            if (modifier === '%') {
              matchedField = num > 10 ? 'down-payment' : 'interest-rate';
            } else if (num > 10000) {
              matchedField = 'home-price';
            } else if (num >= 10 && num <= 40) {
              matchedField = 'term';
            }
          }

          if (matchedField) {
            fills.push({ id: FIELD_MAP[matchedField], value: num.toString() });
            rtext += `${matchedField.replace('-', ' ')} to ${modifier === '%' ? num + '%' : num}. `;
          } else {
             // We found a number but literally have no idea what it is.
             unknownWords.push(contextWords.join(" "));
          }
        }
      }

      if (fills.length > 0) {
        return new Response(JSON.stringify({ response: rtext, action: { type: 'fill', payload: fills } }));
      }
      
      if (unknownWords.length > 0) {
        return new Response(JSON.stringify({ 
          response: `I see you want to update something, but I don't recognize the terms you used around the numbers. What do you mean by it? (e.g. "it means down payment")`,
          action: null
        }));
      }
    }

    // 4. Data Interceptor
    for (const state of statesData) {
      if (text.includes(state.name.toLowerCase())) {
        if (text.includes('tax')) return new Response(JSON.stringify({ response: `The average property tax rate in **${state.name}** is **${state.taxRate}%**.` }));
        if (text.includes('insurance')) return new Response(JSON.stringify({ response: `The average annual home insurance cost in **${state.name}** is around **$${state.insurance.toLocaleString()}**.` }));
        if (text.includes('price')) return new Response(JSON.stringify({ response: `The median home price in **${state.name}** is **$${state.medianPrice.toLocaleString()}**.` }));
        if (!stateFound) {
           return new Response(JSON.stringify({ response: `**${state.name}** has a median home price of **$${state.medianPrice.toLocaleString()}**, an average property tax rate of **${state.taxRate}%**, and annual home insurance around **$${state.insurance.toLocaleString()}**.` }));
        }
      }
    }

    return new Response(JSON.stringify({ response: "I'm a Virtual Assistant. Ask me to 'Set the home price to 400k' or 'What is the property tax in Colorado?'" }));
    
  } catch (error) {
    return new Response(JSON.stringify({ response: "Sorry, I ran into an error processing that request." }), { status: 500 });
  }
};
