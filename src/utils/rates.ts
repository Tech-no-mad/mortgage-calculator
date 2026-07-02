import fallbackRates from '../data/rates.json';

let memoryCache: any = null;
let cacheTime = 0;

export async function getLiveRates(AstroContext: any) {
  // If we have a fresh memory cache (less than 60 minutes old), use it.
  // Note: On Cloudflare Workers, global state persists across some requests in the same isolate.
  if (memoryCache && Date.now() - cacheTime < 3600 * 1000) {
    return memoryCache;
  }

  // Retrieve the API key from Cloudflare locals (production), import.meta.env, or process.env
  let API_KEY: string | undefined;
  
  try {
    // Try to get from Cloudflare Workers runtime (Astro v6 standard)
    const { env } = await import('cloudflare:workers');
    API_KEY = (env as any).FRED_API_KEY;
  } catch (e) {
    // Fallback to Node.js environments
    API_KEY = 
      (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.FRED_API_KEY : undefined) || 
      (typeof process !== 'undefined' ? process.env.FRED_API_KEY : undefined);
  }

  if (!API_KEY) {
    return fallbackRates;
  }

  try {
    const seriesToFetch = ['MORTGAGE30US', 'MORTGAGE15US', 'MORTGAGE5US', 'DPRIME', 'TERMCBAUTO60MD'];
    const rates: Record<string, any> = { lastUpdated: new Date().toISOString() };
    
    // Fetch all series concurrently
    const promises = seriesToFetch.map(async (seriesId) => {
      const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${API_KEY}&file_type=json&sort_order=desc&limit=1`;
      
      // We instruct Cloudflare to cache this outbound fetch at the edge for 1 hour.
      // The `cf` object is specific to Cloudflare Workers runtime.
      const fetchOptions = {
        cf: { cacheTtl: 3600 }
      } as any;

      const res = await fetch(url, fetchOptions);
      if (!res.ok) return;
      const data = await res.json();
      if (data.observations && data.observations.length > 0) {
        rates[seriesId] = parseFloat(data.observations[0].value);
      }
    });
    
    await Promise.allSettled(promises);

    // Apply fallbacks for any missing rates to ensure the calculators don't break
    if (!rates.MORTGAGE30US) rates.MORTGAGE30US = fallbackRates.MORTGAGE30US;
    if (!rates.MORTGAGE15US) rates.MORTGAGE15US = fallbackRates.MORTGAGE15US;
    if (!rates.MORTGAGE5US) rates.MORTGAGE5US = fallbackRates.MORTGAGE5US;
    if (!rates.DPRIME) rates.DPRIME = fallbackRates.DPRIME;
    if (!rates.TERMCBAUTO60MD) rates.TERMCBAUTO60MD = fallbackRates.TERMCBAUTO60MD;

    memoryCache = rates;
    cacheTime = Date.now();
    return rates;
  } catch (error) {
    console.error("FRED Fetch Error:", error);
    return fallbackRates;
  }
}
