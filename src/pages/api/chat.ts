import type { APIRoute } from 'astro';
import statesData from '../../data/states.json';

const FIELDS = {
  PRICE: 'home-price',
  DOWN_PAYMENT: 'down-payment',
  RATE: 'interest-rate',
  TERM: 'term',
  TAX: 'tax-rate',
  INSURANCE: 'home-insurance',
  STATE: 'state-selector'
};

const FIELD_MAP: Record<string, string[]> = {
  [FIELDS.PRICE]: ['home-price', 'loan-amount', 'home-value'],
  [FIELDS.DOWN_PAYMENT]: ['down-payment'],
  [FIELDS.RATE]: ['interest-rate', 'heloc-rate'],
  [FIELDS.TERM]: ['term'],
  [FIELDS.TAX]: ['tax-rate'],
  [FIELDS.INSURANCE]: ['home-insurance'],
  [FIELDS.STATE]: ['state-selector']
};

class TrieNode {
  children: Record<string, TrieNode> = {};
  value: string | null = null;
}

class DictionaryTrie {
  root: TrieNode = new TrieNode();

  insert(word: string, value: string): void {
    let current = this.root;
    for (const char of word) {
      if (!current.children[char]) {
        current.children[char] = new TrieNode();
      }
      current = current.children[char];
    }
    current.value = value;
  }

  search(word: string, maxDistance: number = 2): string | null {
    let current = this.root;
    let exactFound = true;
    for (const char of word) {
      if (!current.children[char]) {
        exactFound = false;
        break;
      }
      current = current.children[char];
    }
    if (exactFound && current.value) return current.value;

    let bestMatch: string | null = null;
    let bestDist = maxDistance + 1;
    const currentRow = Array.from({ length: word.length + 1 }, (_, i) => i);

    const searchRecursive = (node: TrieNode, letter: string, previousRow: number[]) => {
      const size = word.length;
      const row = [previousRow[0] + 1];

      for (let i = 1; i <= size; i++) {
        const insertCost = row[i - 1] + 1;
        const deleteCost = previousRow[i] + 1;
        const substituteCost = word[i - 1] === letter ? previousRow[i - 1] : previousRow[i - 1] + 1;
        row.push(Math.min(insertCost, deleteCost, substituteCost));
      }

      if (row[size] <= maxDistance && node.value) {
        if (row[size] < bestDist) {
          bestDist = row[size];
          bestMatch = node.value;
        }
      }

      if (Math.min(...row) <= maxDistance) {
        for (const childLetter of Object.keys(node.children)) {
          searchRecursive(node.children[childLetter], childLetter, row);
        }
      }
    };

    for (const letter of Object.keys(this.root.children)) {
      searchRecursive(this.root.children[letter], letter, currentRow);
    }

    return bestMatch;
  }
}

const BASE_DICTIONARY: Record<string, string> = {
  'set': 'ACTION', 'change': 'ACTION', 'make': 'ACTION', 'update': 'ACTION', 'adjust': 'ACTION', 'switch': 'ACTION',
  'go': 'NAV', 'navigate': 'NAV', 'take': 'NAV',
  'price': FIELDS.PRICE, 'pryce': FIELDS.PRICE, 'cost': FIELDS.PRICE, 'value': FIELDS.PRICE, 'hoem': FIELDS.PRICE, 'home': FIELDS.PRICE, 'loan': FIELDS.PRICE, 'amount': FIELDS.PRICE, 'principal': FIELDS.PRICE, 'hp': FIELDS.PRICE,
  'down': FIELDS.DOWN_PAYMENT, 'downpayment': FIELDS.DOWN_PAYMENT, 'upfront': FIELDS.DOWN_PAYMENT, 'dp': FIELDS.DOWN_PAYMENT, 'initial': FIELDS.DOWN_PAYMENT,
  'rate': FIELDS.RATE, 'interest': FIELDS.RATE, 'apr': FIELDS.RATE, 'ir': FIELDS.RATE, 'fixed': FIELDS.RATE,
  'term': FIELDS.TERM, 'duration': FIELDS.TERM, 'years': FIELDS.TERM, 'yr': FIELDS.TERM,
  'tax': FIELDS.TAX, 'taxes': FIELDS.TAX,
  'insurance': FIELDS.INSURANCE, 'ins': FIELDS.INSURANCE,
  'state': FIELDS.STATE
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const query = (data.query || '').trim();
    const history = data.history ? { ...data.history } : {};
    
    // Stateless Memory Resolution
    const sessionOverrides = data.sessionMap || {};
    const intentTrie = new DictionaryTrie();
    
    // Populate Request-specific Trie
    Object.entries(BASE_DICTIONARY).forEach(([word, value]) => intentTrie.insert(word, value));
    Object.entries(sessionOverrides).forEach(([word, value]) => intentTrie.insert(word, value as string));

    const text = query.toLowerCase();

    // 1. Missing Field Context Interception
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
      
      let closestField = intentTrie.search(target, 3);
      if (closestField && closestField !== 'ACTION' && closestField !== 'NAV') {
        return new Response(JSON.stringify({ 
          response: `Got it! I've learned that "${alias}" means "${closestField.replace('-', ' ')}".`, 
          context: null,
          updateSessionMap: { key: alias, value: closestField }
        }));
      }

      return new Response(JSON.stringify({ 
        response: `I tried to learn that, but "${target}" doesn't match any fields I know about.`, 
        context: null 
      }));
    }

    // 3. Conversational Complaints (Amnesia trigger)
    if (/did not update|forgot|missed/i.test(text)) {
      let missingField: string | null = null;
      for (const token of text.replace(/[,.!?;:]/g, ' ').split(/\s+/)) {
         let match = intentTrie.search(token, 2);
         if (match && match !== 'ACTION' && match !== 'NAV' && match !== FIELDS.STATE) {
           missingField = match;
         }
      }
      if (missingField) {
        return new Response(JSON.stringify({ 
          response: `Ah, I apologize! What number did you want to set the ${missingField.replace('-', ' ')} to?`,
          context: { missingField }
        }));
      }
    }

    // 4. Token Processing
    const tokens = text.replace(/[,.!?;:]/g, ' ').split(/\s+/).filter(t => t.length > 0);

    let fills: any[] = [];
    let actions: any[] = [];
    let responseTextPieces: string[] = [];
    let currentIntent: 'SET' | 'NAV' | 'QUERY' | null = null;
    let pendingField: string | null = null;

    // Detect general intent for State Parsing
    const isNavIntent = text.includes('navigate') || text.includes('go to') || tokens.includes('nav');
    const isQueryIntent = tokens.some(t => ['what', 'how', 'tell', 'average'].includes(t));
    
    // Multi-word state matching
    let foundState = statesData.find(s => text.includes(s.name.toLowerCase()));
    if (!foundState) {
      foundState = statesData.find(s => new RegExp(`\\b${s.abbr.toLowerCase()}\\b`, 'i').test(text));
    }
    
    if (foundState) {
      if (isNavIntent || tokens.includes('to')) {
        actions.push({ type: 'navigate', payload: `/states/${foundState.slug}` });
        responseTextPieces.push(`Navigating to ${foundState.name}.`);
      } else if (!isQueryIntent) {
        fills.push({ id: FIELD_MAP[FIELDS.STATE][0], value: foundState.abbr });
        responseTextPieces.push(`State set to ${foundState.name}.`);
      }
    }

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      // Only fuzzy search words longer than 2 characters to prevent "to" -> "go" misfires
      const matchedNodeValue = token.length > 2 ? intentTrie.search(token, 2) : intentTrie.search(token, 0);

      // Intent Nodes
      if (matchedNodeValue === 'ACTION') { currentIntent = 'SET'; continue; }
      if (matchedNodeValue === 'NAV') { currentIntent = 'NAV'; continue; }
      if (['what', 'how', 'tell', 'average'].includes(token)) { currentIntent = 'QUERY'; continue; }

      // Field Target Nodes
      if (matchedNodeValue && matchedNodeValue !== 'ACTION' && matchedNodeValue !== 'NAV') {
        pendingField = matchedNodeValue;
        if (token === 'down' && tokens[i + 1] === 'payment') i++; 
        continue;
      }

      // Numeric Terminal Values
      const numMatch = token.match(/^(\$?\d+(?:,\d+)*(?:\.\d+)?)(k|m|%|yr|years?)?$/i);
      if (numMatch) {
        let numStr = numMatch[1].replace(/[$,]/g, '');
        let num = parseFloat(numStr);
        let modifier = numMatch[2]?.toLowerCase() || '';

        if (modifier === 'k') num *= 1000;
        if (modifier === 'm') num *= 1000000;
        if (['yr', 'year', 'years', 'yrs'].includes(modifier)) pendingField = FIELDS.TERM;
        if (modifier === '%') pendingField = pendingField || (num > 10 ? FIELDS.DOWN_PAYMENT : FIELDS.RATE);

        if (!pendingField) {
          if (num >= 10000) pendingField = FIELDS.PRICE;
          else if (num >= 10 && num <= 50) pendingField = FIELDS.TERM;
        }

        if (pendingField) {
          fills.push({ id: FIELD_MAP[pendingField], value: num.toString() });
          responseTextPieces.push(`${pendingField.replace('-', ' ')} updated to ${modifier === '%' ? num + '%' : num}.`);
          pendingField = null; // Clean tree terminal execution
        }
      }

      // Explicit Info Node Interceptions
      if (currentIntent === 'QUERY' || (matchedNodeValue && [FIELDS.TAX, FIELDS.INSURANCE, FIELDS.PRICE].includes(matchedNodeValue))) {
        const targetNode = matchedNodeValue || pendingField;
        
        let matchedState = statesData.find(s => tokens.includes(s.name.toLowerCase()));
        if (!matchedState && history.activeScope) {
           const slug = history.activeScope.split('/').pop();
           matchedState = statesData.find(s => s.slug === slug);
        }

        if (matchedState && targetNode) {
          if (targetNode === FIELDS.TAX) responseTextPieces.push(`The average property tax rate in **${matchedState.name}** is **${matchedState.taxRate}%**.`);
          if (targetNode === FIELDS.INSURANCE) responseTextPieces.push(`The average annual home insurance cost in **${matchedState.name}** is around **$${matchedState.insurance.toLocaleString()}**.`);
          if (targetNode === FIELDS.PRICE) responseTextPieces.push(`The median home price in **${matchedState.name}** is **$${matchedState.medianPrice.toLocaleString()}**.`);
          
          currentIntent = null; // consume query
        }
      }
    }

    // General Information Queries (no target node specified)
    if (currentIntent === 'QUERY' && responseTextPieces.length === 0) {
       let matchedState = statesData.find(s => tokens.includes(s.name.toLowerCase()));
       if (!matchedState && history.activeScope) {
          const slug = history.activeScope.split('/').pop();
          matchedState = statesData.find(s => s.slug === slug);
       }
       if (matchedState) {
          responseTextPieces.push(`**${matchedState.name}** has a median home price of **$${matchedState.medianPrice.toLocaleString()}**, an average property tax rate of **${matchedState.taxRate}%**, and annual home insurance around **$${matchedState.insurance.toLocaleString()}**.`);
       } else {
          // General topic queries
          if (tokens.includes('fha')) {
            responseTextPieces.push(`An FHA loan is backed by the government and allows down payments as low as 3.5%. You can learn more on our [FHA Loans page](/fha-loans).`);
          } else if (tokens.includes('va')) {
            responseTextPieces.push(`A VA loan is for veterans and service members, offering 0% down payments with no private mortgage insurance. Learn more on our [VA Loans page](/va-loans).`);
          } else if (tokens.includes('jumbo')) {
            responseTextPieces.push(`A Jumbo loan is required when financing exceeds the conforming loan limits. You can read more on our [Jumbo Loans page](/jumbo-loans).`);
          } else if (tokens.includes('brokers') || tokens.includes('broker')) {
            responseTextPieces.push(`Mortgage brokers help you shop across multiple lenders to find the best rate. Learn more on our [Brokers page](/brokers).`);
          } else if (tokens.includes('contact')) {
            responseTextPieces.push(`You can get in touch with us on our [Contact page](/contact).`);
          } else if (tokens.includes('about')) {
            responseTextPieces.push(`You can read about us on our [About page](/about).`);
          } else if (tokens.includes('privacy') || tokens.includes('legal')) {
            responseTextPieces.push(`You can review our privacy policy on our [Privacy page](/privacy).`);
          } else if (tokens.includes('terms') || tokens.includes('conditions')) {
            responseTextPieces.push(`You can read our terms of service on our [Terms page](/terms).`);
          } else if (tokens.includes('faq') || tokens.includes('questions')) {
            responseTextPieces.push(`You can find answers to frequently asked questions on our [FAQ page](/faq).`);
          }
       }
    }

    // Process macros
    if (tokens.includes('fha')) {
      fills.push({ id: FIELD_MAP[FIELDS.DOWN_PAYMENT], value: '3.5' });
      responseTextPieces.push('Switched to FHA parameters (3.5% down).');
    }
    if (tokens.includes('va') || tokens.includes('valoan')) {
      fills.push({ id: FIELD_MAP[FIELDS.DOWN_PAYMENT], value: '0' });
      responseTextPieces.push('Switched to VA parameters (0% down).');
    }
    if (tokens.includes('jumbo')) {
      responseTextPieces.push('Switched to Jumbo parameters.');
    }

    // Catch generic navigate commands (if no state was matched but a path was hit)
    if (currentIntent === 'NAV' && actions.length === 0) {
      const paths: Record<string, string> = {
        // Existing routes
        'refinance': '/refinance-calculator',
        'extra': '/extra-payment-calculator',
        'payoff': '/extra-payment-calculator',
        'afford': '/how-much-can-i-afford',
        'affordability': '/how-much-can-i-afford',
        'amortization': '/amortization-schedule',
        'heloc': '/heloc-calculator',
        'recast': '/recast-calculator',
        'about': '/about',
        'contact': '/contact',
        'faq': '/faq',
        'privacy': '/privacy',
        'terms': '/terms',
        'brokers': '/brokers',
        'broker': '/brokers',
        'fha': '/fha-loans',
        'va': '/va-loans',
        'jumbo': '/jumbo-loans',
        'home': '/',
        'main': '/',
        // New calculator routes
        'reverse': '/reverse-mortgage-calculator',
        'hecm': '/reverse-mortgage-calculator',
        'retirement': '/reverse-mortgage-calculator',
        'arm': '/arm-calculator',
        'adjustable': '/arm-calculator',
        'variable': '/arm-calculator',
        'commercial': '/commercial-mortgage-calculator',
        'business': '/commercial-mortgage-calculator',
        'balloon': '/commercial-mortgage-calculator',
        'auto': '/auto-loan-calculator',
        'car': '/auto-loan-calculator',
        'vehicle': '/auto-loan-calculator',
        'truck': '/auto-loan-calculator',
        'investment': '/investment-property-calculator',
        'rental': '/investment-property-calculator',
        'cashflow': '/investment-property-calculator',
        'roi': '/investment-property-calculator',
        'personal': '/loan-payment-calculator',
        'generic': '/loan-payment-calculator',
        'second': '/loan-payment-calculator',
        'loan': '/loan-payment-calculator',
      };
      
      let matchedPath = '/';
      for (const key of Object.keys(paths)) {
        if (tokens.includes(key)) {
          matchedPath = paths[key];
          break;
        }
      }
      
      actions.push({ type: 'navigate', payload: matchedPath });
      responseTextPieces.push(matchedPath === '/' ? "Navigating to Main Calculator..." : "Navigating...");
    }

    if (fills.length > 0) {
      actions.push({ type: 'fill', payload: fills });
    }

    if (actions.length > 0 || responseTextPieces.length > 0) {
      const finalResponse = responseTextPieces.length > 0 ? responseTextPieces.join(' ') : "I've updated the calculator.";
      return new Response(JSON.stringify({ response: finalResponse, actions, context: history }));
    }

    return new Response(JSON.stringify({ response: "I didn't quite catch that. Ask me to 'Set the home price to 400k', 'Make it an FHA loan', 'Take me to Washington', or 'What is the property tax?'", context: history }));

  } catch (error) {
    return new Response(JSON.stringify({ response: "An error occurred handling your request.", context: null }), { status: 500 });
  }
};
