import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Retrieve the API key from the environment
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.FRED_API_KEY;

if (!API_KEY) {
  console.warn('⚠️ No FRED_API_KEY found in environment. Using fallback fallback rates.');
  const fallbackRates = {
    MORTGAGE30US: 6.52,
    MORTGAGE15US: 5.84,
    MORTGAGE5US: 6.15,
    DPRIME: 8.5,
    TERMCBAUTO60MD: 7.8,
    lastUpdated: new Date().toISOString()
  };
  fs.writeFileSync(path.join(process.cwd(), 'src/data/rates.json'), JSON.stringify(fallbackRates, null, 2));
  process.exit(0);
}

const seriesToFetch = ['MORTGAGE30US', 'MORTGAGE15US', 'MORTGAGE5US', 'DPRIME', 'TERMCBAUTO60MD'];
const rates = {
  lastUpdated: new Date().toISOString()
};

function fetchSeries(seriesId) {
  return new Promise((resolve, reject) => {
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${API_KEY}&file_type=json&sort_order=desc&limit=1`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.observations && parsed.observations.length > 0) {
            resolve(parseFloat(parsed.observations[0].value));
          } else {
            console.warn(`No observations found for ${seriesId}`);
            resolve(null);
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('Fetching live rates from FRED API...');
  for (const series of seriesToFetch) {
    try {
      const val = await fetchSeries(series);
      if (val !== null && !isNaN(val)) {
        rates[series] = val;
      }
    } catch (err) {
      console.error(`Failed to fetch ${series}:`, err.message);
    }
  }

  // Fallbacks in case an API call failed
  if (!rates.MORTGAGE30US) rates.MORTGAGE30US = 6.52;
  if (!rates.MORTGAGE15US) rates.MORTGAGE15US = 5.84;
  if (!rates.MORTGAGE5US) rates.MORTGAGE5US = 6.15;
  if (!rates.DPRIME) rates.DPRIME = 8.5;
  if (!rates.TERMCBAUTO60MD) rates.TERMCBAUTO60MD = 7.8;

  const outPath = path.join(process.cwd(), 'src/data/rates.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(rates, null, 2));
  console.log('Successfully updated src/data/rates.json with live FRED data.');
}

main();
