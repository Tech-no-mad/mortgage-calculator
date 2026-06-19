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
    ['state', 'state-selector'],
    // Extended synonyms
    ['cost', 'home-price'],
    ['value', 'home-price'],
    ['amount', 'home-price'],
    ['principal', 'home-price'],
    ['upfront', 'down-payment'],
    ['initial', 'down-payment'],
    ['apr', 'interest-rate'],
    ['fixed', 'interest-rate'],
    ['duration', 'term'],
    ['length', 'term'],
    ['period', 'term']
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
    const history = data.history || {};

    // Check conversational context for missing fields
    if (history.missingField) {
      // Look for a single number in the user's response
      const numMatch = query.match(/^(\$?\d+(?:,\d+)*(?:\.\d+)?)(k|m|%|yr|years?)?$/i);
      if (numMatch || query.match(/\d+/)) {
        let nStr = numMatch ? numMatch[1].replace(/[$,]/g, '') : query.match(/\d+/)[0];
        let num = parseFloat(nStr);
        let mod = numMatch ? numMatch[2]?.toLowerCase() : '';
        if (mod === 'k') num *= 1000;
        if (mod === 'm') num *= 1000000;
        
        let fills = [{ id: FIELD_MAP[history.missingField], value: num.toString() }];
        return new Response(JSON.stringify({ 
          response: `Got it! I've updated the ${history.missingField.replace('-', ' ')} to ${mod === '%' ? num + '%' : num}.`, 
          action: { type: 'fill', payload: fills },
          context: null // clear context
        }));
      }
    }

    // 1. RLHF Learning Interceptor
    const learnMatch = query.match(/(.+?)\s+(?:means|is)\s+(.+)/i);
    if (learnMatch && (text.includes('learn') || (text.includes('means') && text.split(' ').length < 8) || data.learningMode)) {
      let alias = learnMatch[1].replace(/learn that /i, '').replace(/['"]/g, '').trim().toLowerCase();
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

      if (bestDist <= 5) {
        rlhfMap.set(alias, closestField);
        return new Response(JSON.stringify({ response: `Got it! I've learned that "${alias}" means "${closestField.replace('-', ' ')}". I will remember this for next time.`, context: null }));
      } else {
        return new Response(JSON.stringify({ response: `I tried to learn that, but "${target}" doesn't match any fields I know about.`, context: null }));
      }
    }

    let fills: any[] = [];
    let actions: any[] = [];
    let rtext = "I've updated the calculator: ";
    let unknownWords: string[] = [];
    let targetStatePath = null;
    let stateFound = false;

    // Parse states first
    const commonWords = ['me', 'in', 'or', 'as', 'do', 'hi', 'la', 'ma', 'md', 'ok', 'pa', 'sc', 'va', 'wa'];
    for (const state of statesData) {
      const explicitAbbr = text.match(new RegExp(`\\b${state.abbr.toLowerCase()}\\b`, 'i')) 
                            && (query.includes(state.abbr) || !commonWords.includes(state.abbr.toLowerCase()));
                            
      if (text.includes(state.name.toLowerCase()) || explicitAbbr) {
        if (text.includes('take me to') || text.includes('go to') || text.includes('navigate') || text.includes('section') || text.includes('to ' + state.name.toLowerCase()) || text.includes('no to')) {
           targetStatePath = `/states/${state.slug}`;
           stateFound = true;
        }
        if (text.includes('set') || text.includes('change') || text.includes('make') || text.includes('update') || text.includes('switch')) {
          fills.push({ id: ['state-selector'], value: state.abbr });
          rtext += `State to ${state.name}. `;
          stateFound = true;
          break;
        }
      }
    }

    // Parse numeric fields
    if (text.includes('set') || text.includes('change') || text.includes('make') || text.includes('update') || text.includes('adjust') || text.includes('switch')) {
      const words = query.split(/\s+/);
      
      for (let i = 0; i < words.length; i++) {
        // Strip trailing punctuation from the word so regex can match properly
        let w = words[i].toLowerCase().replace(/[.,!?;:]+$/, '');
        const numMatch = w.match(/^(\$?\d+(?:,\d+)*(?:\.\d+)?)(k|m|%|yr|years?)?$/i);
        
        if (numMatch) {
          let numStr = numMatch[1].replace(/[$,]/g, '');
          let num = parseFloat(numStr);
          let modifier = numMatch[2]?.toLowerCase();
          
          if (modifier === 'k') num *= 1000;
          if (modifier === 'm') num *= 1000000;
          
          let contextWords = words.slice(Math.max(0, i - 3), Math.min(words.length, i + 4));
          contextWords = contextWords.filter(cw => cw.toLowerCase() !== w && cw.length > 1);
          
          let matchedField = null;
          let bestDist = 999;

          if (modifier === 'yr' || modifier === 'year' || modifier === 'years' || modifier === 'yrs') {
            matchedField = 'term';
            bestDist = 0;
          }

          if (!matchedField) {
            for (const cw of contextWords) {
              let clean = cw.toLowerCase().replace(/[^\w]/g, '');
              if (!clean) continue;

              if (rlhfMap.has(clean)) {
                matchedField = rlhfMap.get(clean);
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

    // Conversational Complaints
    if (text.includes('did not update') || text.includes('forgot') || text.includes('missed')) {
       // Check if they mentioned a field
       let missingField = null;
       for (const field of Object.keys(FIELD_MAP)) {
          if (text.includes(field.replace('-', ' '))) missingField = field;
       }
       for (const [k, v] of rlhfMap.entries()) {
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

    if (fills.length > 0) {
      actions.push({ type: 'fill', payload: fills });
    }

    if (targetStatePath) {
      actions.push({ type: 'navigate', payload: targetStatePath });
      rtext += `Navigating you to ${targetStatePath.split('/').pop()}...`;
    } else if (text.includes('go to') || text.includes('navigate') || text.includes('take me to') || text.includes('section')) {
      if (text.includes('refinance')) { actions.push({ type: 'navigate', payload: '/refinance-calculator' }); rtext += "Navigating..."; }
      else if (text.includes('extra') || text.includes('payoff')) { actions.push({ type: 'navigate', payload: '/extra-payment-calculator' }); rtext += "Navigating..."; }
      else if (text.includes('afford')) { actions.push({ type: 'navigate', payload: '/how-much-can-i-afford' }); rtext += "Navigating..."; }
      else if (text.includes('amortization')) { actions.push({ type: 'navigate', payload: '/amortization-schedule' }); rtext += "Navigating..."; }
      else if (text.includes('heloc')) { actions.push({ type: 'navigate', payload: '/heloc-calculator' }); rtext += "Navigating..."; }
      else { actions.push({ type: 'navigate', payload: '/' }); rtext += "Navigating to Main Calculator..."; }
    }

    if (actions.length > 0) {
      return new Response(JSON.stringify({ response: rtext, actions: actions, context: null }));
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

    return new Response(JSON.stringify({ response: "I'm a Virtual Assistant. Ask me to 'Set the home price to 400k', 'Take me to Washington and set the term to 15 yr', or 'What is the property tax in Colorado?'", context: null }));
    
  } catch (error) {
    return new Response(JSON.stringify({ response: "Sorry, I ran into an error processing that request.", context: null }), { status: 500 });
  }
};
