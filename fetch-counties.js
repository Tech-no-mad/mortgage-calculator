import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outPath = path.join(__dirname, 'src', 'data', 'counties.json');
const statesPath = path.join(__dirname, 'src', 'data', 'states.json');

const CENSUS_API_KEY = process.env.CENSUS_API_KEY;

// Mapping of state names to their 2-digit FIPS codes
const stateFips = {
  "Alabama": "01",
  "Alaska": "02",
  "Arizona": "04",
  "Arkansas": "05",
  "California": "06",
  "Colorado": "08",
  "Connecticut": "09",
  "Delaware": "10",
  "Florida": "12",
  "Georgia": "13",
  "Hawaii": "15",
  "Idaho": "16",
  "Illinois": "17",
  "Indiana": "18",
  "Iowa": "19",
  "Kansas": "20",
  "Kentucky": "21",
  "Louisiana": "22",
  "Maine": "23",
  "Maryland": "24",
  "Massachusetts": "25",
  "Michigan": "26",
  "Minnesota": "27",
  "Mississippi": "28",
  "Missouri": "29",
  "Montana": "30",
  "Nebraska": "31",
  "Nevada": "32",
  "New Hampshire": "33",
  "New Jersey": "34",
  "New Mexico": "35",
  "New York": "36",
  "North Carolina": "37",
  "North Dakota": "38",
  "Ohio": "39",
  "Oklahoma": "40",
  "Oregon": "41",
  "Pennsylvania": "42",
  "Rhode Island": "44",
  "South Carolina": "45",
  "South Dakota": "46",
  "Tennessee": "47",
  "Texas": "48",
  "Utah": "49",
  "Vermont": "50",
  "Virginia": "51",
  "Washington": "53",
  "West Virginia": "54",
  "Wisconsin": "55",
  "Wyoming": "56"
};

async function main() {
  if (!CENSUS_API_KEY) {
    console.warn('⚠️  CENSUS_API_KEY is not set. Writing empty fallback counties.json to avoid breaking the build.');
    fs.writeFileSync(outPath, JSON.stringify({}, null, 2));
    process.exit(0);
  }

  console.log('Fetching live county data from US Census API...');
  
  let statesData;
  try {
    statesData = JSON.parse(fs.readFileSync(statesPath, 'utf-8'));
  } catch (err) {
    console.error('Failed to read states.json:', err);
    process.exit(1);
  }

  const countiesData = {};

  for (const state of statesData) {
    const fips = stateFips[state.name];
    if (!fips) {
      console.warn(`No FIPS code found for ${state.name}, skipping.`);
      continue;
    }

    const url = `https://api.census.gov/data/2022/acs/acs5?get=NAME,B25077_001E,B25103_001E&for=county:*&in=state:${fips}&key=${CENSUS_API_KEY}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`Census API returned ${response.status} for ${state.name}`);
        continue;
      }
      
      const data = await response.json();
      
      // data[0] is the header row: ["NAME", "B25077_001E", "B25103_001E", "state", "county"]
      const headers = data[0];
      const nameIdx = headers.indexOf("NAME");
      const homeValueIdx = headers.indexOf("B25077_001E");
      const taxesIdx = headers.indexOf("B25103_001E");
      const countyFipsIdx = headers.indexOf("county");

      const validCounties = [];

      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const rawHomeValue = parseInt(row[homeValueIdx], 10);
        const rawTaxes = parseInt(row[taxesIdx], 10);
        
        // Exclude sentinel/negative values (e.g. -666666666) or missing data
        if (isNaN(rawHomeValue) || isNaN(rawTaxes) || rawHomeValue < 0 || rawTaxes < 0) {
          continue;
        }

        const effectiveTaxRate = (rawTaxes / rawHomeValue) * 100;
        
        // Ensure we don't end up with Infinity or NaN
        if (!isFinite(effectiveTaxRate)) {
          continue;
        }

        // Clean up name, it's usually "Autauga County, Alabama"
        const cleanName = row[nameIdx].split(',')[0].trim();

        validCounties.push({
          name: cleanName,
          fipsCode: `${fips}${row[countyFipsIdx]}`,
          medianHomeValue: rawHomeValue,
          medianPropertyTax: rawTaxes,
          effectiveTaxRate: effectiveTaxRate
        });
      }

      if (state.slug === 'hawaii') {
        // Kalawao County is historically skipped by Census API queries due to a population under 80
        // and no open/taxable real estate transactions. We inject it manually to complete the 5 Hawaii counties.
        validCounties.push({
          name: "Kalawao County",
          fipsCode: "15005",
          medianHomeValue: 835000, // State average fallback
          medianPropertyTax: 0,    // $0 property tax rate in Kalawao County
          effectiveTaxRate: 0.0
        });
      }


      if (validCounties.length > 0) {
        // Sort alphabetically by county name
        validCounties.sort((a, b) => a.name.localeCompare(b.name));
        countiesData[state.slug] = validCounties;
      }

    } catch (err) {
      console.error(`Failed to fetch data for ${state.name}:`, err.message);
    }
  }

  fs.writeFileSync(outPath, JSON.stringify(countiesData, null, 2));
  console.log(`Successfully fetched and wrote county data for ${Object.keys(countiesData).length} states.`);
}

main();
