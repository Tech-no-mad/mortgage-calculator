import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const guidesDir = path.join(__dirname, 'src', 'pages', 'guides');

if (!fs.existsSync(guidesDir)) {
  fs.mkdirSync(guidesDir, { recursive: true });
}

const guides = [
  {
    slug: 'first-time-home-buyer',
    title: 'First-Time Home Buyer Guide 2025 — Steps, Programs & Tips',
    keywords: 'first time home buyer, first time buyer guide, how to buy first home, first home buyer programs, FHA first time buyer, down payment assistance, first time buyer checklist, buy a house, buying a house for the first time, steps to buy a home, home buying process, first time homebuyer grants, first time home buyer loans, first house tips, home ownership, mortgage for first time buyer',
    h1: 'First-Time Home Buyer Guide 2025',
    content: `Buying your first home is an exciting milestone, but the process can often feel overwhelming. From saving for a down payment to securing the right mortgage and finally closing the deal, there are many steps to navigate. This comprehensive guide will walk you through the essential steps, programs, and tips for first-time home buyers in 2025.

## Step 1: Check Your Credit Score

Before you even start looking at houses, you need to know where your credit stands. Your credit score will significantly impact the mortgage rate you qualify for and the types of loans available to you. Generally, you need a score of at least 620 for a conventional loan, though FHA loans can accept scores as low as 580 (or even 500 with a larger down payment).

## Step 2: Save for a Down Payment and Closing Costs

While the traditional advice is to save 20% for a down payment to avoid Private Mortgage Insurance (PMI), many first-time buyers put down much less. Depending on the loan type, you might be able to put down as little as 3% or even 0% (with VA or USDA loans). Don't forget to budget for closing costs, which typically range from 2% to 5% of the loan amount.

## Step 3: Get Pre-Approved for a Mortgage

A mortgage pre-approval tells you exactly how much a lender is willing to let you borrow. This gives you a clear budget for your house hunt and shows sellers that you are a serious, qualified buyer. To get pre-approved, you'll need to provide lenders with financial documents like W-2s, tax returns, and bank statements.

## First-Time Home Buyer Programs

Many states and local governments offer assistance programs for first-time buyers. These can include:
- **Down Payment Assistance (DPA) Programs:** Grants or low-interest loans to help cover your down payment or closing costs.
- **FHA Loans:** Backed by the Federal Housing Administration, these loans have lower credit score requirements and allow down payments as low as 3.5%.
- **VA Loans:** Available to eligible military members and veterans, offering $0 down payment and no PMI.
- **USDA Loans:** For buyers in eligible rural areas, offering $0 down payment and low interest rates.`
  },
  {
    slug: 'down-payment',
    title: 'How Much Down Payment Do You Need? Complete Guide',
    keywords: 'down payment, how much down payment, 20 percent down, down payment assistance, minimum down payment, down payment calculator, what is a down payment, average down payment on a house, 0 down mortgage, zero down payment home loan, save for down payment, down payment rules, down payment gifts, low down payment mortgage',
    h1: 'How Much Down Payment Do You Really Need?',
    content: `One of the most persistent myths in real estate is that you need a 20% down payment to buy a house. While putting down 20% has its benefits, it is by no means a requirement. In fact, the median down payment for first-time home buyers is typically around 6% to 7%.

## Minimum Down Payment Requirements by Loan Type

The amount you need to put down largely depends on the type of mortgage you get:

- **Conventional Loans:** Can require as little as 3% down for first-time buyers.
- **FHA Loans:** Require a minimum of 3.5% down (if your credit score is 580 or higher).
- **VA Loans:** Offer 0% down for eligible veterans and active-duty military.
- **USDA Loans:** Offer 0% down for eligible properties in rural areas.

## The 20% Rule and PMI

If you put down less than 20% on a conventional loan, your lender will typically require you to pay Private Mortgage Insurance (PMI). PMI protects the lender in case you default on the loan. The cost of PMI varies but generally ranges from 0.5% to 1.5% of the original loan amount per year.

While paying PMI adds to your monthly cost, it allows you to buy a home sooner rather than waiting years to save a full 20%.

## Down Payment Assistance Programs

If you're struggling to save for a down payment, look into Down Payment Assistance (DPA) programs in your area. These programs are often run by state or local housing finance agencies and can provide grants or low-interest, forgivable loans to help cover your upfront costs.

## Using Gift Funds

Many lenders allow you to use "gift funds" from a family member for part or all of your down payment. You'll need a formal "gift letter" stating that the money is not a loan and does not need to be repaid.`
  },
  {
    slug: 'closing-costs',
    title: 'Closing Costs Explained — What to Expect & How to Save',
    keywords: 'closing costs, what are closing costs, average closing costs, closing costs calculator, who pays closing costs, how much are closing costs, closing costs estimate, reduce closing costs, no closing cost mortgage, lender fees, title insurance, appraisal fee, loan origination fee, settlement costs',
    h1: 'Understanding Mortgage Closing Costs',
    content: `When you buy a home or refinance a mortgage, you'll have to pay "closing costs." These are processing fees paid to your lender and third parties to finalize the real estate transaction. Closing costs usually amount to 2% to 5% of the total loan amount.

## Common Closing Costs

Your closing costs will be detailed in your Loan Estimate (which you receive after applying for a mortgage) and your Closing Disclosure (which you receive before closing). Typical fees include:

- **Origination Fee:** Charged by the lender for evaluating and processing your loan (typically 0.5% to 1% of the loan amount).
- **Appraisal Fee:** Paid to a professional appraiser to determine the home's fair market value.
- **Title Insurance:** Protects the lender (and you, if you buy an owner's policy) from disputes over property ownership.
- **Home Inspection:** Paid to a licensed inspector to assess the condition of the home.
- **Recording Fees:** Paid to the local government to officially record the change in property ownership.
- **Prepaid Items:** You'll typically need to prepay a portion of your property taxes, homeowners insurance, and any accumulated mortgage interest.

## Who Pays Closing Costs?

Usually, the buyer is responsible for the majority of the closing costs. However, sellers also have closing costs, primarily consisting of the real estate agents' commissions.

In some cases, buyers can negotiate "seller concessions," where the seller agrees to pay a portion of the buyer's closing costs to help close the deal.

## How to Save on Closing Costs

- **Shop Around:** You can't change taxes or government fees, but you *can* shop around for lenders, title companies, and homeowners insurance to find the best rates.
- **Ask for Seller Concessions:** In a buyer's market, you might negotiate for the seller to cover some costs.
- **No-Closing-Cost Mortgages:** Some lenders offer "no-closing-cost" loans. In these cases, the lender covers the fees, but they charge you a higher interest rate in return.`
  },
  {
    slug: 'mortgage-types',
    title: 'Types of Mortgages — Fixed, ARM, FHA, VA, Jumbo & More',
    keywords: 'types of mortgages, mortgage types, fixed rate mortgage, adjustable rate mortgage, FHA loan, VA loan, jumbo loan, conventional loan, USDA loan, interest only mortgage, balloon mortgage, 30 year fixed, 15 year fixed, best mortgage type, choose a mortgage',
    h1: 'Exploring the Different Types of Mortgages',
    content: `Choosing the right type of mortgage is a critical step in the home-buying process. The right loan can save you thousands of dollars and fit your specific financial situation. Here is a breakdown of the most common types of mortgages.

## Conventional Loans

Conventional loans are not backed by the federal government. They are the most common type of mortgage and usually require a minimum credit score of 620.
- **Conforming Loans:** Meet the loan limits set by the Federal Housing Finance Agency (FHFA).
- **Non-Conforming (Jumbo) Loans:** Exceed the FHFA limits and are meant for expensive properties. They usually require higher credit scores and larger down payments.

## Government-Backed Loans

These loans are insured by federal agencies, making them less risky for lenders and often easier to qualify for.
- **FHA Loans:** Backed by the Federal Housing Administration. Ideal for buyers with lower credit scores (minimum 500-580) and smaller down payments (as low as 3.5%).
- **VA Loans:** Backed by the Department of Veterans Affairs. Exclusively for eligible military service members, veterans, and surviving spouses. Offers 0% down and no PMI.
- **USDA Loans:** Backed by the U.S. Department of Agriculture. Designed for low-to-moderate-income buyers in eligible rural and suburban areas. Offers 0% down.

## Fixed-Rate vs. Adjustable-Rate Mortgages

- **Fixed-Rate Mortgage (FRM):** The interest rate remains the same for the entire life of the loan (usually 15 or 30 years). Your monthly principal and interest payment will never change, providing stability.
- **Adjustable-Rate Mortgage (ARM):** The interest rate is fixed for an initial period (e.g., 5, 7, or 10 years) and then adjusts periodically based on market conditions. ARMs usually start with lower rates than fixed-rate mortgages but carry the risk of higher payments later.`
  },
  {
    slug: 'mortgage-pre-approval',
    title: 'How to Get Pre-Approved for a Mortgage in 2025',
    keywords: 'mortgage pre approval, pre approved for mortgage, how to get pre approved, pre approval letter, pre approval vs pre qualification, mortgage application, what do I need for mortgage pre approval, does pre approval affect credit score, pre approval process, mortgage lender pre approval',
    h1: 'The Complete Guide to Mortgage Pre-Approval',
    content: `Getting pre-approved for a mortgage is the most important first step you can take before shopping for a home. A pre-approval letter shows sellers that you are a serious, financially qualified buyer, giving you a crucial edge in a competitive market.

## Pre-Qualification vs. Pre-Approval

It's important to understand the difference:
- **Pre-Qualification:** A quick, informal estimate of how much you *might* be able to borrow based on self-reported financial information. It usually involves a "soft" credit pull.
- **Pre-Approval:** A rigorous process where the lender verifies your income, assets, and debt, and performs a "hard" credit pull. You receive a formal letter stating the exact loan amount you are approved for.

## What You Need for Pre-Approval

To get pre-approved, lenders will thoroughly examine your financial health. Be prepared to provide:
1. **Proof of Income:** W-2 statements for the last two years, recent pay stubs, and tax returns. (Self-employed individuals will need more extensive documentation, like profit and loss statements).
2. **Proof of Assets:** Bank statements (checking and savings) and investment account statements to prove you have the funds for the down payment and closing costs.
3. **Good Credit:** The lender will pull your credit report to check your score and payment history.
4. **Employment Verification:** Lenders want to see a stable employment history, typically at least two years in the same job or field.
5. **Identification:** A valid driver's license, passport, or state ID, and your Social Security number.

## Does Pre-Approval Hurt Your Credit?

Yes, a mortgage pre-approval requires a "hard inquiry" on your credit report, which can temporarily lower your score by a few points. However, credit scoring models typically group multiple mortgage inquiries made within a short window (usually 14 to 45 days) into a single inquiry, so you can shop around for the best rate without tanking your score.

A pre-approval letter is usually valid for 60 to 90 days. If you haven't found a home in that time, you'll need to ask the lender to renew the pre-approval, which may require updated documents.`
  },
  {
    slug: 'home-inspection',
    title: 'Home Inspection Checklist — What Buyers Need to Know',
    keywords: 'home inspection, home inspection checklist, what does home inspection cover, home inspection cost, home inspection tips, do I need a home inspection, what happens after home inspection, failing a home inspection, home inspector',
    h1: 'The Buyer’s Guide to Home Inspections',
    content: `A home inspection is a non-invasive, visual examination of a property's physical structure and essential systems. Even if a home looks perfect on the outside, there could be hidden issues that cost thousands of dollars to fix. Never skip the home inspection!

## What Does a Home Inspection Cover?

A standard home inspection covers the home's major systems and structural components, including:
- **Roof and Exterior:** Shingles, flashing, gutters, siding, windows, doors, and the foundation.
- **Plumbing System:** Pipes, drains, water heater, water pressure, and fixtures.
- **Electrical System:** Service panels, breakers, wiring, outlets, and light switches.
- **HVAC:** Heating and cooling systems, ductwork, and thermostats.
- **Interior:** Walls, ceilings, floors, stairs, and visible insulation.
- **Attic and Basement:** Checking for leaks, structural issues, and proper ventilation.

*Note: Standard inspections usually do not cover pests (termites), mold, radon, asbestos, or septic systems. You may need to hire specialized inspectors for these.*

## How Much Does a Home Inspection Cost?

The cost of a home inspection varies by location and the size of the home, but you can typically expect to pay between $300 and $500. This is paid out-of-pocket by the buyer at the time of the inspection, not rolled into closing costs.

## What to Do After the Inspection

After the inspection, you will receive a detailed report outlining any issues found. If significant problems are discovered, you have a few options (provided you have an inspection contingency in your contract):
1. **Ask the Seller to Fix It:** You can request that the seller complete repairs before closing.
2. **Ask for a Credit:** You can ask for a seller concession (a credit at closing) so you can fix the issue yourself later.
3. **Walk Away:** If the issues are too severe (e.g., major foundational problems), you can cancel the contract and get your earnest money deposit back.`
  },
  {
    slug: 'property-tax',
    title: 'Property Tax Guide — How It Works, Rates by State & Appeals',
    keywords: 'property tax, how property tax works, property tax by state, property tax rate, property tax appeal, property tax assessment, how to lower property taxes, property tax calculator, county property tax, real estate tax',
    h1: 'Everything You Need to Know About Property Taxes',
    content: `Property taxes are a significant ongoing expense for homeowners, often adding hundreds of dollars to a monthly mortgage payment. Understanding how they are calculated, how they differ by location, and how you might lower them is crucial for budgeting.

## How Property Taxes Are Calculated

Your annual property tax bill is generally determined by two factors:
1. **The Assessed Value of Your Home:** This is determined by a local tax assessor. It is often lower than the fair market value (what the home would sell for), though the exact ratio varies by municipality.
2. **The Local Tax Rate (Millage Rate):** This rate is set by your local government (county, city, school district) to fund public services like schools, police, fire departments, and road maintenance.

*Tax Bill = Assessed Value × Property Tax Rate*

## Property Taxes by State

Property tax rates vary wildly across the United States. For example:
- **High-Tax States:** States like New Jersey, Illinois, and New Hampshire have some of the highest effective property tax rates in the country, often exceeding 2%.
- **Low-Tax States:** States like Hawaii, Alabama, and Colorado boast some of the lowest effective rates, often below 0.6%.

Keep in mind that states with low property taxes may have higher sales or income taxes to compensate.

## How to Pay Your Property Taxes

Most homeowners pay their property taxes through an **escrow account** managed by their mortgage lender. The lender divides your annual tax bill by 12 and adds that amount to your monthly mortgage payment. When the taxes are due, the lender pays the local government on your behalf.

If you don't have an escrow account (e.g., your house is paid off), you will receive a bill directly from your local tax authority and must pay it yourself, usually once or twice a year.

## Can You Lower Your Property Taxes?

Yes! If you believe your home's assessed value is too high, you can **appeal your property tax assessment**. This involves reviewing the assessor's data for errors (like incorrect square footage) or finding "comps" (similar homes in your area) that have lower assessed values. You can also apply for **exemptions**, such as homestead exemptions, senior citizen exemptions, or veterans exemptions, which lower the taxable value of your property.`
  },
  {
    slug: 'home-equity',
    title: 'Home Equity — What It Is, How to Build & Use It',
    keywords: 'home equity, what is home equity, home equity loan, home equity line of credit, HELOC vs home equity loan, how to build equity, borrowing against home equity, equity calculator, tap into home equity',
    h1: 'A Complete Guide to Home Equity',
    content: `Home equity is one of the most powerful financial benefits of homeownership. Simply put, equity is the portion of your property that you actually "own" outright. It is the difference between what your home is currently worth and how much you still owe on your mortgage.

## How to Calculate Your Home Equity

*Home Equity = Current Market Value of Home - Remaining Mortgage Balance*

For example, if your home is currently worth $400,000 and you owe $250,000 on your mortgage, your home equity is $150,000.

## How to Build Home Equity

You build equity in two main ways:
1. **Paying Down Your Mortgage:** Every time you make a mortgage payment, a portion goes toward the principal balance. As the balance decreases, your equity increases. (Note: in the early years of a mortgage, payments go mostly toward interest).
2. **Home Price Appreciation:** If the real estate market in your area goes up, the value of your home increases. This "passive" appreciation builds your equity without you doing anything. You can also force appreciation by making smart home improvements.

## How to Use Your Home Equity

Once you have built up significant equity (usually you need to retain at least 15% to 20% equity in the home), you can borrow against it to fund major expenses, consolidate high-interest debt, or make home improvements. The three main ways to access your equity are:

- **Home Equity Loan:** A second mortgage that gives you a lump sum of cash upfront, which you repay with a fixed interest rate over a set term (e.g., 10 or 15 years).
- **Home Equity Line of Credit (HELOC):** A revolving line of credit, similar to a credit card, backed by your home. You can draw from it as needed during a "draw period" and only pay interest on what you use. HELOCs usually have variable interest rates.
- **Cash-Out Refinance:** You replace your current mortgage with a new, larger mortgage. The new loan pays off the old one, and you pocket the difference in cash. This changes your primary mortgage rate and terms.`
  },
  {
    slug: 'mortgage-points',
    title: 'Mortgage Points Explained — Should You Buy Down Your Rate?',
    keywords: 'mortgage points, discount points, buying down rate, mortgage points calculator, are mortgage points worth it, how much is a point on a mortgage, discount points tax deductible, mortgage origination points',
    h1: 'Mortgage Points (Discount Points) Explained',
    content: `When you're finalizing your mortgage, your lender might offer you the option to pay "points" (also known as discount points) to lower your interest rate. This strategy, often called "buying down the rate," can save you money over the long haul, but requires more cash upfront at closing.

## What is a Mortgage Point?

One discount point costs **1% of your total loan amount**.
For example, if you are borrowing $300,000, one point will cost you $3,000.

In exchange for paying this fee upfront at closing, the lender reduces your interest rate. Typically, one point lowers your interest rate by **0.25%**, though this can vary by lender and market conditions.

## Calculating the Break-Even Point

To decide if buying points is worth it, you must calculate your "break-even point"—the number of months it takes for your monthly interest savings to exceed the upfront cost of the points.

**Example Scenario:**
- Loan Amount: $300,000
- Base Rate: 6.5% (Monthly P&I: $1,896)
- Buying 1 Point Cost: $3,000
- New Rate: 6.25% (New Monthly P&I: $1,847)
- Monthly Savings: $49

*Break-Even Calculation:*
$3,000 (upfront cost) ÷ $49 (monthly savings) = **61 months (just over 5 years)**

If you plan to live in the house and keep the mortgage for longer than 61 months, buying the point saves you money. If you sell or refinance before month 61, you lose money on the deal.

## Should You Buy Points?

**Buy points if:**
- You plan to stay in the home for a long time (7-10+ years).
- You have extra cash on hand for closing costs and an emergency fund.
- You want the lowest possible monthly payment.

**Skip points if:**
- You plan to move or refinance in the next few years.
- Cash is tight and you need it for the down payment, moving expenses, or furnishings.`
  },
  {
    slug: 'debt-to-income-ratio',
    title: 'Debt-to-Income Ratio (DTI) — What Lenders Look For',
    keywords: 'debt to income ratio, DTI ratio, what is DTI, DTI for mortgage, how to calculate DTI, ideal DTI ratio, maximum DTI for mortgage, front end DTI, back end DTI, lower DTI',
    h1: 'Understanding Your Debt-to-Income Ratio (DTI)',
    content: `Your Debt-to-Income (DTI) ratio is one of the most important metrics lenders use to determine your ability to manage monthly payments and repay the money you plan to borrow. It is just as crucial as your credit score when applying for a mortgage.

## What is DTI?

Your DTI is a percentage that compares your total gross monthly income (before taxes) to your total monthly debt payments. 

*DTI = (Total Monthly Debt Payments ÷ Gross Monthly Income) × 100*

## Front-End vs. Back-End DTI

Lenders actually look at two different DTI ratios:

1. **Front-End Ratio (Housing Ratio):** This calculates what percentage of your income would go toward your *new housing expenses* (the proposed mortgage payment, including principal, interest, taxes, insurance, and HOA fees).
2. **Back-End Ratio (Total Debt Ratio):** This is the more critical number. It includes your proposed housing expense PLUS all other recurring monthly debts (credit card minimums, car loans, student loans, child support, etc.). It *does not* include living expenses like groceries, utilities, or cell phone bills.

## What DTI Do Lenders Want?

Generally, the lower your DTI, the better your chances of approval and scoring a low interest rate.
- **Conventional Loans:** Most lenders prefer a back-end DTI of 36% or less, though many will go up to 43%, and sometimes up to 50% if you have excellent credit and large cash reserves.
- **FHA Loans:** Allow for higher DTI ratios, often up to 43%, and sometimes up to 50% or more with compensating factors.
- **VA Loans:** Typically prefer a DTI of 41% or lower, though they have flexible guidelines.

## How to Lower Your DTI

If your DTI is too high to qualify for the home you want, you have two options: decrease your debt or increase your income.
- Pay off high-balance credit cards or loans.
- Avoid taking on new debt (do not buy a new car or open new credit cards before buying a house!).
- Ask for a raise or take on a side job (though lenders require a track record of this income to count it).
- Consider a co-signer with strong income and low debt.`
  },
  {
    slug: 'escrow',
    title: 'Escrow Accounts — How They Work for Mortgages',
    keywords: 'escrow, escrow account, what is escrow, mortgage escrow, escrow payment, escrow shortage, how does escrow work, escrow analysis, escrow refund, remove escrow account',
    h1: 'How Mortgage Escrow Accounts Work',
    content: `If you have a mortgage, you have likely heard the term "escrow." An escrow account is essentially a savings account managed by your lender to pay your property taxes and homeowners insurance on your behalf.

## Why Do Lenders Require Escrow?

Lenders require escrow accounts to protect their investment (your home). If you fail to pay your property taxes, the government could put a lien on the house. If your house burns down and you let your insurance lapse, the lender's collateral is destroyed. By collecting these funds monthly and paying the bills themselves, lenders ensure these critical expenses are never missed.

## How Escrow Payments Are Calculated

When your lender calculates your monthly mortgage payment, they add up your estimated annual property taxes and homeowners insurance, divide that number by 12, and add it to your monthly principal and interest payment. 

*Monthly Payment = Principal + Interest + (Annual Taxes ÷ 12) + (Annual Insurance ÷ 12)*

When your tax and insurance bills are due, your lender pays them directly out of the escrow account.

## Escrow Shortages and Overage

Property taxes and insurance premiums fluctuate over time. Because of this, lenders perform an annual **escrow analysis** to ensure they are collecting the right amount.
- **Escrow Shortage:** If your taxes or insurance went up, your escrow account won't have enough money to cover the bills. The lender will pay the difference, but you will have to pay them back. Your monthly payment will increase for the next year to make up the shortage and prepare for the higher future bills.
- **Escrow Overage:** If your taxes or insurance went down, your lender collected too much money. They will send you an escrow refund check and lower your monthly payment for the upcoming year.

## Can You Opt Out of Escrow?

Sometimes. If you put down 20% or more on a conventional loan, many lenders will let you waive the escrow requirement and pay your taxes and insurance yourself. However, some lenders may charge a small fee or a slightly higher interest rate for this privilege.`
  },
  {
    slug: 'home-appraisal',
    title: 'Home Appraisal Guide — Process, Cost & What Affects Value',
    keywords: 'home appraisal, how appraisal works, appraisal cost, low appraisal, appraisal vs inspection, what is a home appraisal, who pays for appraisal, appraisal gap, challenge home appraisal',
    h1: 'The Home Appraisal Process Explained',
    content: `A home appraisal is an unbiased professional opinion of a home's fair market value. If you are using a mortgage to buy a home or refinance your current one, the lender will require an appraisal. 

## Why Lenders Require Appraisals

Lenders require appraisals because the home serves as collateral for the loan. The lender wants to ensure they aren't lending you more money than the home is actually worth. If you default on the loan and the lender has to foreclose, they need to be able to sell the property to recoup their money.

## The Appraisal Process

1. **Ordering the Appraisal:** Once you are under contract, the lender orders the appraisal through a third-party Appraisal Management Company (AMC) to ensure the appraiser is completely impartial.
2. **The Inspection:** The appraiser visits the property, measures the square footage, evaluates the condition (inside and out), and notes upgrades or deficiencies. 
3. **The Comps:** The appraiser compares the home to recently sold properties ("comps") in the same neighborhood that have similar characteristics (size, age, bed/bath count).
4. **The Report:** The appraiser issues a detailed report with the final appraised value.

## What Happens if the Appraisal is Low?

If the home appraises for the purchase price or higher, the transaction proceeds smoothly. However, if the home appraises for *less* than the agreed-upon purchase price, you have an "appraisal gap." Lenders will only finance based on the appraised value. You have a few options:

- **Renegotiate with the Seller:** Ask the seller to lower the purchase price to match the appraised value.
- **Pay the Difference:** You bring extra cash to closing to cover the gap between the loan amount and the purchase price.
- **Challenge the Appraisal:** If you and your agent find errors in the report or better comps, you can request a Reconsideration of Value (ROV).
- **Cancel the Contract:** If you have an appraisal contingency in your contract, you can walk away and keep your earnest money.`
  },
  {
    slug: 'interest-rates',
    title: 'Mortgage Interest Rates — How They Work & What Affects Yours',
    keywords: 'mortgage interest rates, how interest rates work, what affects mortgage rate, federal reserve rates, rate lock, mortgage rate vs APR, why are rates high, average mortgage rate, best mortgage rate, how to get lower rate',
    h1: 'Understanding Mortgage Interest Rates',
    content: `Your mortgage interest rate is the percentage you pay your lender to borrow money. Even a fraction of a percent difference in your rate can change your monthly payment and cost you (or save you) tens of thousands of dollars over the life of a 30-year loan.

## What Determines Daily Mortgage Rates?

National mortgage rates change daily, sometimes multiple times a day. They are driven by complex economic factors:
- **The Bond Market:** Fixed-rate mortgages are closely tied to the yield on the 10-year Treasury note. When bond yields go up, mortgage rates go up.
- **Inflation:** High inflation diminishes the purchasing power of the fixed returns investors get on mortgage bonds, so investors demand higher rates. Thus, inflation drives mortgage rates up.
- **The Federal Reserve:** The Fed does *not* set mortgage rates directly. However, the Fed sets the "federal funds rate" (the rate banks charge each other). When the Fed raises rates to fight inflation, mortgage rates usually follow suit.

## What Determines YOUR Personal Rate?

While national economic factors set the baseline, your specific interest rate is determined by your personal financial profile:
- **Credit Score:** The higher your score, the lower your rate.
- **Down Payment:** A larger down payment reduces the lender's risk, which can lead to a lower rate.
- **Loan Type:** Conventional, FHA, VA, and Jumbo loans all have different rate structures.
- **Loan Term:** 15-year mortgages almost always have lower interest rates than 30-year mortgages.
- **Property Type:** Primary residences get the best rates. Second homes and investment properties are considered riskier and carry higher rates.

## What is a Rate Lock?

Because rates fluctuate daily, lenders offer a "rate lock" once your loan is approved. This guarantees your interest rate for a specific period (usually 30, 45, or 60 days) while you finalize the closing process. If rates go up before you close, your locked rate is protected. If rates drop significantly, some lenders offer a "float down" option to capture the lower rate.`
  },
  {
    slug: 'pmi-explained',
    title: 'PMI (Private Mortgage Insurance) — Cost, Removal & Alternatives',
    keywords: 'PMI, private mortgage insurance, PMI cost, how to remove PMI, PMI vs MIP, PMI calculator, avoid PMI, cancel PMI, how much is PMI, lender paid mortgage insurance',
    h1: 'Private Mortgage Insurance (PMI) Explained',
    content: `If you buy a home with a conventional loan and put down less than 20%, your lender will require you to pay for Private Mortgage Insurance (PMI). While nobody loves paying it, PMI is the tool that makes it possible to buy a home without saving a massive 20% down payment.

## What is PMI and Who Does it Protect?

Despite the name, PMI does not protect *you*, the buyer. It protects the *lender* in the event that you stop making payments and default on the loan. Because you put down a small amount of cash, the lender considers you a higher risk. PMI mitigates that risk.

## How Much Does PMI Cost?

PMI costs vary based on your credit score, your down payment percentage, and your loan type, but it typically ranges from **0.5% to 1.5% of your original loan amount per year**. 

For a $300,000 loan, a 1% PMI premium equals $3,000 a year, or $250 added to your monthly mortgage payment. You pay this as part of your normal monthly payment to the lender.

## How to Get Rid of PMI

The best thing about PMI on a conventional loan is that it isn't permanent. You can get rid of it once you have built up enough equity in your home:
1. **Automatic Cancellation:** By law, lenders must automatically cancel your PMI when your loan balance reaches 78% of the home's *original* appraised value (usually takes about 11 years on a 30-year loan making standard payments).
2. **Request Cancellation:** You can request in writing that your lender cancel PMI when your balance hits 80% of the original value.
3. **New Appraisal:** If property values in your area have surged, or you've made major renovations, you might have reached 20% equity much faster. You can pay for a new appraisal; if it shows you have 20% equity, the lender may drop the PMI.

## PMI vs. FHA Mortgage Insurance Premium (MIP)

If you have an FHA loan instead of a conventional loan, you don't pay PMI; you pay a Mortgage Insurance Premium (MIP). MIP includes both an upfront fee at closing and an annual premium paid monthly. Crucially, if you put down less than 10% on an FHA loan, **MIP is permanent for the life of the loan**. The only way to get rid of it is to refinance into a conventional loan once you have 20% equity.`
  },
  {
    slug: 'refinancing-guide',
    title: 'Complete Refinancing Guide — When, Why & How to Refinance',
    keywords: 'refinancing, refinance mortgage, when to refinance, refinance calculator, cash out refinance, rate and term refinance, should I refinance, cost to refinance, how to refinance, refinance rules',
    h1: 'The Complete Guide to Mortgage Refinancing',
    content: `Refinancing your mortgage means paying off your existing loan and replacing it with a completely new one. Homeowners refinance for a variety of reasons, but the ultimate goal is usually to improve their financial situation.

## Types of Refinancing

- **Rate-and-Term Refinance:** The most common type. You change your interest rate, your loan term (e.g., from 30 years to 15 years), or both. You do not withdraw any cash.
- **Cash-Out Refinance:** You take out a new mortgage for more than you currently owe and pocket the difference in cash. This is a way to tap into your home equity to pay for renovations or consolidate debt.
- **Cash-In Refinance:** You bring a lump sum of cash to closing to pay down your loan balance, resulting in a smaller new loan and lower monthly payments.

## When Does it Make Sense to Refinance?

1. **To Lower Your Interest Rate:** The classic rule of thumb is that refinancing is worth it if you can lower your rate by at least 1% to 2%. However, even a 0.5% drop can save you thousands over time.
2. **To Lower Your Monthly Payment:** Lowering your rate will lower your payment. You can also lower your payment by extending your term (e.g., you are 5 years into a 30-year loan and refinance into a *new* 30-year loan), though you will pay more interest in the long run.
3. **To Get Rid of PMI:** If your home value has increased enough that you now have 20% equity, you can refinance to drop Private Mortgage Insurance.
4. **To Switch from an ARM to a Fixed-Rate:** If you have an Adjustable-Rate Mortgage and fear rates will rise, refinancing to a fixed rate provides stability.

## The Costs of Refinancing

Refinancing isn't free. Because you are taking out a new loan, you have to pay closing costs again, which typically run 2% to 5% of the loan amount. 

Before you refinance, calculate your **break-even point**. Divide your total closing costs by your monthly savings. If closing costs are $4,000 and you save $100 a month, it will take you 40 months to break even. If you plan to sell the house before 40 months pass, refinancing is a bad idea.`
  }
];

let indexLinks = '';

guides.forEach(g => {
  const fileContent = `---
import BaseLayout from '../../layouts/BaseLayout.astro';

const title = "${g.title.replace(/"/g, '\\"')}";
const description = "${g.content.substring(0, 150).replace(/\n/g, ' ').replace(/"/g, '\\"')}...";
const keywords = "${g.keywords}";
const canonicalUrl = "/guides/${g.slug}/";

const schema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": title,
  "description": description,
  "author": {
    "@type": "Organization",
    "name": "MortgageDash Team"
  },
  "datePublished": "2025-07-04"
};
---

<BaseLayout
  title={title}
  description={description}
  keywords={keywords}
  canonicalUrl={canonicalUrl}
>
  <script is:inline type="application/ld+json" set:html={JSON.stringify(schema)} />
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-lg dark:prose-invert prose-a:text-[var(--color-usa-blue)]">
    <nav class="flex text-sm text-[var(--text-muted)] mb-8 not-prose" aria-label="Breadcrumb">
      <ol class="flex items-center space-x-2">
        <li><a href="/" class="hover:text-[var(--text-primary)] transition-colors">Home</a></li>
        <li><span class="mx-2">/</span></li>
        <li><a href="/guides/" class="hover:text-[var(--text-primary)] transition-colors">Guides</a></li>
        <li><span class="mx-2">/</span></li>
        <li class="text-[var(--text-primary)] font-medium" aria-current="page">${g.h1}</li>
      </ol>
    </nav>
    <h1 class="text-4xl font-extrabold tracking-tight text-[var(--text-primary)] mb-8">${g.h1}</h1>
    
    ${g.content.split('\n\n').map(p => p.startsWith('## ') ? `<h2 class="text-2xl font-bold mt-10 mb-4">${p.replace('## ', '')}</h2>` : p.startsWith('- ') ? `<ul class="list-disc pl-6 mb-6">${p.split('\n').map(li => `<li>${li.replace('- ', '')}</li>`).join('')}</ul>` : `<p class="mb-6">${p}</p>`).join('\n')}

    <div class="mt-12 p-8 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl not-prose text-center">
      <h3 class="text-xl font-bold text-[var(--text-primary)] mb-2">Ready to see the numbers?</h3>
      <p class="text-[var(--text-muted)] mb-6">Use our free, accurate calculators to estimate your costs.</p>
      <a href="/" class="inline-block bg-[var(--color-usa-blue)] text-white font-semibold py-3 px-6 rounded-xl hover:bg-[#1e4b87] transition-colors">Go to Mortgage Calculator</a>
    </div>
  </div>
</BaseLayout>
`;

  fs.writeFileSync(path.join(guidesDir, `${g.slug}.astro`), fileContent);
  console.log('Created guide:', g.slug);
  
  indexLinks += `
    <a href="/guides/${g.slug}/" class="block p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl hover:border-[var(--color-usa-blue)] transition-all shadow-sm hover:shadow-md">
      <h2 class="text-xl font-bold text-[var(--text-primary)] mb-2">${g.h1}</h2>
      <p class="text-[var(--text-muted)]">${g.content.substring(0, 120).replace(/\n/g, ' ')}...</p>
    </a>
  `;
});

const indexContent = `---
import BaseLayout from '../../layouts/BaseLayout.astro';

const title = "Mortgage Guides & Education | MortgageDash";
const description = "Learn everything you need to know about buying a home, mortgages, interest rates, and property taxes with our comprehensive guides.";
const keywords = "mortgage guides, home buying guides, mortgage education, mortgage resources, first time home buyer guide, mortgage help";
const canonicalUrl = "/guides/";
---

<BaseLayout title={title} description={description} keywords={keywords} canonicalUrl={canonicalUrl}>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-extrabold tracking-tight text-[var(--text-primary)] mb-4">Mortgage & Homebuying Guides</h1>
      <p class="text-xl text-[var(--text-muted)] max-w-2xl mx-auto">Expert advice to help you navigate the home buying and financing process.</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      ${indexLinks}
    </div>
  </div>
</BaseLayout>
`;

fs.writeFileSync(path.join(guidesDir, 'index.astro'), indexContent);
console.log('Created guides index.');
