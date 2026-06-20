import type { APIRoute } from 'astro';
import statesData from '../../data/states.json';

// Baseline dictionary. Dynamic additions should ideally be passed back & forth via request body.
const BASE_RLHF_MAP = new Map<string, string>([
  ['dp', 'down-payment'], ['downpayment', 'down-payment'], ['dwn pymnt', 'down-payment'],
  ['hp', 'home-price'], ['homeprice', 'home-price'], ['loan', 'home-price'],
  ['ir', 'interest-rate'], ['interest', 'interest-rate'], ['rate', 'interest-rate'],
  ['term', 'term'], ['years', 'term'], ['yr', 'term'],
  ['tax', 'tax-rate'], ['taxes', 'tax-rate'], ['insurance', 'home-insurance'],
  ['ins', 'home-insurance'], ['state', 'state-selector'], ['cost', 'home-price'],
  ['value', 'home-price'], ['price', 'home-price'], ['pryce', 'home-price'],
  ['hoem', 'home-price'], ['amount', 'home-price'], ['principal', 'home-price'],
  ['upfront', 'down-payment'], ['initial', 'down-payment'], ['apr', 'interest-rate'],
  ['fixed', 'interest-rate'], ['duration', 'term']
]);

function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      matrix[i][j] = a[i - 1] === b[j - 1] 
        ? matrix[i - 1][j - 1] 
        : Math.min(matrix[i - 1][j - 1], matrix[i][j - 1], matrix[i - 1][j]) + 1;
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
    const query = (data.query || '').trim();
    const text = query.toLowerCase();
    
    // Create an immutable shallow copy of context
    const history = data.history ? { ...data.history } : {};
    
    // Merge baseline maps with runtime user session overrides if provided
    const sessionOverrides = data.sessionMap ? new Map(Object.entries(data.sessionMap)) : new Map();
    const activeMap = new Map([...BASE_RLHF_MAP, ...sessionOverrides]);

    // 1. Context Resolution Interceptor
    if (history.missingField) {
      const numMatch = query.match(/^(\$?\d+(?:,\d+)*(?:\.\d+)?)(k|m|%|yr|years?)?$/i);
      const fallbackMatch = query.match(/\d+/);
      
      if (numMatch || fallbackMatch) {
        let nStr = numMatch ? numMatch[1].replace(/[$,]/g, '') : fallbackMatch![0];
        let num = parseFloat(nStr);
        let mod = numMatch ? numMatch[2]?.toLowerCase() : '';
        if (mod === 'k') num *= 1000;
        if (mod === 'm') num *= 1000000;
        
        return new Response(JSON.stringify({ 
          response: `Got it! I've updated the ${history.missingField.replace('-', ' ')} to ${mod === '%' ? num + '%' : num}.`, 
          actions: [{ type: 'fill', payload: [{ id: FIELD_MAP[history.missingField], value: num.toString() }] }],
          context: null
        }));
      }
    }

    // 2. Learning Routine
    const learnMatch = query.match(/(.+?)\s+(?:means|is)\s+(.+)/i);
    const splitLength = text.split(/\s+/).length;
    if (learnMatch && (text.includes('learn') || (text.includes('means') && splitLength < 8) || data.learningMode)) {
      let alias = learnMatch[1].replace(/learn that /i, '').replace(/['"]/g, '').trim().toLowerCase();
      if (data.learningMode && data.alias) alias = data.alias.toLowerCase();
      let target = learnMatch[2].replace(/['"\.]/g, '').trim().toLowerCase();
      
      let closestField = target;
      let bestDist = 999;
      for (const field of Object.keys(FIELD_MAP)) {
        const d = levenshtein(target.replace(/\s+/g, '-'), field);
        if (d < bestDist) { bestDist = d; closestField = field; }
      }
      for (const [v] of activeMap.entries()) {
        const d = levenshtein(target.replace(/\s+/g, '-'), v);
        if (d < bestDist) { bestDist = d; closestField = v; }
      }

      if (bestDist <= 5) {
        return new Response(JSON.stringify({ 
          response: `Got it! I've learned that "${alias}" means "${closestField.replace('-', ' ')}".`, 
          context: null,
          updateSessionMap: { key: alias, value: closestField } // Instruct client frontend to hold state
        }));
      }
      return new Response(JSON.stringify({ response: `I tried to learn that, but "${target}" doesn't match any fields I know about.`, context: null }));
    }

    let fills: any[] = [];
    let actions: any[] = [];
    let rtext = "I've updated the calculator: ";
    let unknownWords: string[] = [];
    let targetStatePath: string | null = null;
    let stateFound = false;

    // 3. Entity Parsing (Geography)
    const commonWords = ['me', 'in', 'or', 'as', 'do', 'hi', 'la', 'ma', 'md', 'ok', 'pa', 'sc', 'va', 'wa'];
    for (const state of statesData) {
      const explicitAbbr = text.match(new RegExp(`\\b${state.abbr.toLowerCase()}\\b`, 'i')) 
                            && (query.includes(state.abbr) || !commonWords.includes(state.abbr.toLowerCase()));
                            
      if (text.includes(state.name.toLowerCase()) || explicitAbbr) {
        if (/take me to|go to|navigate|section|to \w+|no to/i.test(text)) {
           targetStatePath = `/states/${state.slug}`;
           stateFound = true;
        }
        if (/set|change|make|update|switch/i.test(text)) {
          fills.push({ id: ['state-selector'], value: state.abbr });
          rtext += `State to ${state.name}. `;
          stateFound = true;
          break;
        }
      }
    }

    // 4. Numerical Evaluation Engine
    if (/set|change|make|update|adjust|switch/i.test(text)) {
      const words = query.split(/\s+/);
      
      for (let i = 0; i < words.length; i++) {
        let w = words[i].toLowerCase().replace(/[.,!?;:]+$/, '');
        const numMatch = w.match(/^(\$?\d+(?:,\d+)*(?:\.\d+)?)(k|m|%|yr|years?)?$/i);
        
        if (numMatch) {
          let numStr = numMatch[1].replace(/[$,]/g, '');
          let num = parseFloat(numStr);
          let modifier = numMatch[2]?.toLowerCase();
          
          if (modifier === 'k') num *= 1000;
          if (modifier === 'm') num *= 1000000;

          let contextWords = words.slice(Math.max(0, i - 3), Math.min(words.length, i + 4))
                                  .filter(cw => cw.toLowerCase() !== w && cw.length > 1);
          
          let matchedField: string | null = null;
          let bestDist = 999;

          if (['yr', 'year', 'years', 'yrs'].includes(modifier || '')) {
            matchedField = 'term';
            bestDist = 0;
          }

          if (!matchedField) {
            for (const cw of contextWords) {
              let clean = cw.toLowerCase().replace(/[^\w]/g, '');
              if (!clean) continue;

              if (activeMap.has(clean)) {
                matchedField = activeMap.get(clean)!;
                bestDist = 0;
                break;
              }

              for (const field of Object.keys(FIELD_MAP)) {
                let d = levenshtein(clean, field);
                let d2 = levenshtein(clean, field.replace('-', ''));
                let minD = Math.min(d, d2);
                if (minD < bestDist && minD <= 3) {
                  bestDist = minD;
                  matchedField = field;
                }
              }
            }
          }

          if (!matchedField) {
            for (let j = 0; j < contextWords.length - 1; j++) {
              let bigram = contextWords[j].toLowerCase().replace(/[^\w]/g, '') + '-' + contextWords[j+1].toLowerCase().replace(/[^\w]/g, '');
              if (activeMap.has(bigram)) {
                matchedField = activeMap.get(bigram)!;
                break;
              }
              for (const field of Object.keys(FIELD_MAP)) {
                if (levenshtein(bigram, field) <= 3) { matchedField = field; break; }
              }
            }
          }

          if (!matchedField) {
            if (modifier === '%') matchedField = num > 10 ? 'down-payment' : 'interest-rate';
            else if (num > 10000) matchedField = 'home-price';
            else if (num >= 10 && num <= 40) matchedField = 'term';
          }

          if (matchedField) {
            fills.push({ id: FIELD_MAP[matchedField], value: num.toString() });
            rtext += `${matchedField.replace('-', ' ')} to ${modifier === '%' ? num + '%' : num}. `;
          } else {
             unknownWords.push(contextWords.join(" "));
          }
        }
      }
    }

    // 5. Context Capture Strategy
    if (/did not update|forgot|missed/i.test(text)) {
       let missingField: string | null = null;
       for (const field of Object.keys(FIELD_MAP)) {
          if (text.includes(field.replace('-', ' '))) missingField = field;
       }
       for (const [k, v] of activeMap.entries()) {
          if (text.includes(k)) missingField = v;
       }
       if (missingField) {
         return new Response(JSON.stringify({ 
           response: `Ah, I apologize! What number did you want to set the ${missingField.replace('-', ' ')} to?`,
           context: { missingField }
         }));
       }
    }

    if (unknownWords.length > 0 && fills.length === 0) {
      return new Response(JSON.stringify({ 
        response: `I see you want to update something, but I don't recognize the terms you used around the numbers. What do you mean by it?`,
        context: null
      }));
    }

    // 6. Multi-bracket Parameter Modifiers
    if (text.includes('fha')) {
       fills.push({ id: ['down-payment'], value: '3.5' });
       rtext += 'Switched to FHA parameters (3.5% down). ';
    }
    
    if (/\bva\b/i.test(text) || text.includes('va loan')) {
      if (!targetStatePath || !targetStatePath.includes('virginia')) {
        fills.push({ id: ['down-payment'], value: '0' });
        rtext += 'Switched to VA parameters (0% down). ';
      }
    }
    
    if (text.includes('jumbo')) {
      rtext += 'Switched to Jumbo parameters. ';
    }
    
    if (fills.length > 0) actions.push({ type: 'fill', payload: fills });
    
    if (targetStatePath) {
      actions.push({ type: 'navigate', payload: targetStatePath });
      rtext += `Navigating you to ${targetStatePath.split('/').pop()}...`;
    } else if (/go to|navigate|take me to|section/i.test(text)) {
      const paths: Record<string, string> = {
        refinance: '/refinance-calculator',
        extra: '/extra-payment-calculator', 
        payoff: '/extra-payment-calculator',
        afford: '/how-much-can-i-afford',
        amortization: '/amortization-schedule',
        heloc: '/heloc-calculator'
      };
      let matchedPath = '/';
      for (const key of Object.keys(paths)) {
        if (text.includes(key)) { matchedPath = paths[key]; break; }
      }
      actions.push({ type: 'navigate', payload: matchedPath });
      rtext += matchedPath === '/' ? "Navigating to Main Calculator..." : "Navigating...";
    }
    
    if (actions.length > 0) {
      return new Response(JSON.stringify({ response: rtext, actions: actions, context: history }));
    }

    // 7. Information Queries
    if (/what|how much|tell me|average/i.test(text)) {
      let matchedState = statesData.find(s => text.includes(s.name.toLowerCase()));
      if (!matchedState && history.activeScope) {
        const scopeStr = history.activeScope.toString().toLowerCase();
        if (scopeStr.includes('/states/')) {
          const scopeSlug = scopeStr.replace(/\/$/, '').split('/').pop();
          matchedState = statesData.find(s => s.slug === scopeSlug);
        }
      }
      if (matchedState) {
        if (text.includes('tax')) return new Response(JSON.stringify({ response: `The average property tax rate in **${matchedState.name}** is **${matchedState.taxRate}%**.` }));
        if (text.includes('insurance')) return new Response(JSON.stringify({ response: `The average annual home insurance cost in **${matchedState.name}** is around **$${matchedState.insurance.toLocaleString()}**.` }));
        if (text.includes('price') || text.includes('cost')) return new Response(JSON.stringify({ response: `The median home price in **${matchedState.name}** is **$${matchedState.medianPrice.toLocaleString()}**.` }));
        if (!stateFound) {
          return new Response(JSON.stringify({ response: `**${matchedState.name}** has a median home price of **$${matchedState.medianPrice.toLocaleString()}**, an average property tax rate of **${matchedState.taxRate}%**, and annual home insurance around **$${matchedState.insurance.toLocaleString()}**.` }));
        }
      }
    }

    return new Response(JSON.stringify({ response: "I'm a Virtual Assistant. Ask me to 'Set the home price to 400k', 'Make it an FHA loan', 'Take me to Washington', or 'What is the property tax?'", context: history }));

  } catch (error) {
    return new Response(JSON.stringify({ response: "Sorry, I ran into an error processing that request.", context: null }), { status: 500 });
  }
}
