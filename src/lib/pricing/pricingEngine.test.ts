/**
 * Yugark Digital Studio V2 — Automated Unit Tests for Pricing Engine
 * Verifies all 15 scenarios specified in Section 16 of Step 3.
 */

import {
  calculateCustomQuote,
  defaultDiscountRules,
  DiscountRuleConfig,
} from './pricingEngine';
import { pricingCalculatorItemsData } from '../../data/studioData';

function assert(condition: boolean, testName: string, detail?: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName} - ${detail || ''}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${testName}`);
  }
}

console.log('\n--- STARTING 15 MANDATORY PRICING ENGINE TESTS ---\n');

// Mock catalog reference items:
// Frontend Website: price 9999, originalPrice 15999
// Starter Social: price 9999, monthly
// Growth Social: price 14999, originalPrice 19999, monthly
// Graphic Post: price 500, one-time

// TEST 1: Website only. Expected: No extra 10% Website + Service combo discount.
{
  const result = calculateCustomQuote(
    [{ id: 'calc-frontend-web', quantity: 1 }],
    pricingCalculatorItemsData,
    'one-time'
  );
  assert(
    result.isComboEligible === false,
    'TEST 1: Website only - isComboEligible must be false'
  );
  assert(
    result.comboSavings === 0,
    'TEST 1: Website only - comboSavings must be 0'
  );
  assert(
    result.finalEstimatedTotal === 9999,
    'TEST 1: Website only - final total must equal ₹9,999 launch price',
    `Received: ${result.finalEstimatedTotal}`
  );
}

// TEST 2: Website + eligible additional service. Expected: Combo eligibility true; apply 10% only to configured discount basis.
{
  const result = calculateCustomQuote(
    [
      { id: 'calc-frontend-web', quantity: 1 },
      { id: 'calc-starter-plan', quantity: 1 },
    ],
    pricingCalculatorItemsData,
    'one-time'
  );
  assert(
    result.isComboEligible === true,
    'TEST 2: Website + Social - isComboEligible must be true'
  );
  // Default combo basis is 'additional_services': 10% of Starter Plan (₹9,999) = ₹1,000
  const expectedComboSavings = Math.round(9999 * 0.1);
  assert(
    result.comboSavings === expectedComboSavings,
    'TEST 2: Combo savings applied to additional service amount',
    `Expected ${expectedComboSavings}, got ${result.comboSavings}`
  );
  assert(
    result.finalEstimatedTotal === 9999 + 9999 - expectedComboSavings,
    'TEST 2: Final total correctly subtracts combo savings'
  );
}

// TEST 3: Website + ineligible service (e.g. empty or non-existent). Expected: No combo discount.
{
  const result = calculateCustomQuote(
    [
      { id: 'calc-frontend-web', quantity: 1 },
      { id: 'non-existent-service', quantity: 1 },
    ],
    pricingCalculatorItemsData,
    'one-time'
  );
  assert(
    result.isComboEligible === false,
    'TEST 3: Ineligible service does not trigger combo'
  );
  assert(
    result.comboSavings === 0,
    'TEST 3: Combo savings remains 0'
  );
}

// TEST 4: Two Websites. Expected: Quantity offer only if configured; do not falsely trigger Website + Service combo.
{
  const result = calculateCustomQuote(
    [
      { id: 'calc-frontend-web', quantity: 2 },
    ],
    pricingCalculatorItemsData,
    'one-time'
  );
  assert(
    result.isComboEligible === false,
    'TEST 4: Two websites without additional service MUST NOT trigger combo discount'
  );
  assert(
    result.multiWebsiteEligible === true,
    'TEST 4: Two websites correctly qualifies for multi-website bulk evaluation'
  );
  assert(
    result.multiWebsiteSavings > 0,
    'TEST 4: Multi-website savings applied for quantity >= 2'
  );
}

// TEST 5: Social Media only. Expected: No Website combo discount.
{
  const result = calculateCustomQuote(
    [{ id: 'calc-growth-plan', quantity: 1 }],
    pricingCalculatorItemsData,
    'one-time'
  );
  assert(
    result.isComboEligible === false,
    'TEST 5: Social Media only MUST NOT trigger website combo discount'
  );
  assert(
    result.comboSavings === 0,
    'TEST 5: Combo savings is 0'
  );
}

// TEST 6: Six-month subscription. Expected: Correct recurring subtotal and verified duration discount.
{
  const result = calculateCustomQuote(
    [{ id: 'calc-starter-plan', quantity: 1 }],
    pricingCalculatorItemsData,
    '6months'
  );
  // Starter is ₹9,999/mo * 6 = ₹59,994. 6-Month discount is 15% = Math.round(59994 * 0.15) = 8999.
  const expectedGross = 9999 * 6;
  const expectedDurationSavings = Math.round(expectedGross * 0.15);
  assert(
    result.recurringGrossSubtotal === expectedGross,
    'TEST 6: 6-Month recurring gross is correctly 6x monthly rate',
    `Expected ${expectedGross}, got ${result.recurringGrossSubtotal}`
  );
  assert(
    result.durationSavings === expectedDurationSavings,
    'TEST 6: 15% duration discount correctly calculated',
    `Expected ${expectedDurationSavings}, got ${result.durationSavings}`
  );
  assert(
    result.finalEstimatedTotal === expectedGross - expectedDurationSavings,
    'TEST 6: Final amount accurately reflects duration discount'
  );
}

// TEST 7: Twelve-month subscription. Expected: Correct recurring subtotal and verified annual discount.
{
  const result = calculateCustomQuote(
    [{ id: 'calc-starter-plan', quantity: 1 }],
    pricingCalculatorItemsData,
    '1year'
  );
  // Starter is ₹9,999/mo * 12 = ₹119,988. 1-Year discount is 25% = Math.round(119988 * 0.25) = 29997.
  const expectedGross = 9999 * 12;
  const expectedDurationSavings = Math.round(expectedGross * 0.25);
  assert(
    result.recurringGrossSubtotal === expectedGross,
    'TEST 7: 1-Year recurring gross is correctly 12x monthly rate'
  );
  assert(
    result.durationSavings === expectedDurationSavings,
    'TEST 7: 25% annual discount correctly calculated',
    `Expected ${expectedDurationSavings}, got ${result.durationSavings}`
  );
}

// TEST 8: Website + 12-month social plan. Expected: Website charged once, subscription correctly calculated, eligible discounts applied in configured order.
{
  const result = calculateCustomQuote(
    [
      { id: 'calc-frontend-web', quantity: 1 },
      { id: 'calc-starter-plan', quantity: 1 },
    ],
    pricingCalculatorItemsData,
    '1year'
  );
  // Website: ₹9,999 (one-time, not multiplied by 12!)
  // Social: ₹9,999 * 12 = ₹119,988.
  // Duration savings: 25% of ₹119,988 = ₹29,997. Net social = ₹89,991.
  // Combo savings (10% on additional services net): 10% of ₹89,991 = ₹8,999.
  assert(
    result.oneTimeSubtotal === 9999,
    'TEST 8: One-time website is charged once and NEVER multiplied by 12 months'
  );
  assert(
    result.recurringGrossSubtotal === 9999 * 12,
    'TEST 8: Subscription correctly multiplied by 12'
  );
  assert(
    result.durationSavings === Math.round(9999 * 12 * 0.25),
    'TEST 8: Duration discount accurately applied to recurring subtotal'
  );
  assert(
    result.isComboEligible === true,
    'TEST 8: Website + Social package combo eligibility is true'
  );
  assert(
    result.comboSavings === Math.round((9999 * 12 - Math.round(9999 * 12 * 0.25)) * 0.1),
    'TEST 8: 10% combo discount applied on net recurring service amount'
  );
}

// TEST 9: Stacking disabled. Expected: Ineligible discount combinations cannot stack.
{
  const result = calculateCustomQuote(
    [
      { id: 'calc-frontend-web', quantity: 1 },
      { id: 'calc-starter-plan', quantity: 1 },
    ],
    pricingCalculatorItemsData,
    '6months',
    defaultDiscountRules,
    { allowStacking: false }
  );
  // When stacking is disabled, combo rule should not apply if duration discount is already applied
  assert(
    result.durationSavings > 0,
    'TEST 9: Primary duration discount applies first'
  );
  assert(
    result.comboSavings === 0,
    'TEST 9: Secondary combo discount does not stack when allowStacking is false'
  );
}

// TEST 10: Unverified discount rule. Expected: Not applied to public quote.
{
  const unverifiedRules: DiscountRuleConfig[] = defaultDiscountRules.map((r) =>
    r.type === 'website_combo' ? { ...r, verified: false } : r
  );
  const result = calculateCustomQuote(
    [
      { id: 'calc-frontend-web', quantity: 1 },
      { id: 'calc-starter-plan', quantity: 1 },
    ],
    pricingCalculatorItemsData,
    'one-time',
    unverifiedRules
  );
  assert(
    result.comboSavings === 0,
    'TEST 10: Unverified discount rule MUST NOT be applied'
  );
}

// TEST 11: Expired discount. Expected: Not applied.
{
  const expiredRules: DiscountRuleConfig[] = defaultDiscountRules.map((r) =>
    r.type === 'website_combo'
      ? { ...r, endDate: '2025-01-01T00:00:00Z' }
      : r
  );
  const result = calculateCustomQuote(
    [
      { id: 'calc-frontend-web', quantity: 1 },
      { id: 'calc-starter-plan', quantity: 1 },
    ],
    pricingCalculatorItemsData,
    'one-time',
    expiredRules,
    { currentDate: new Date('2026-06-01T00:00:00Z') }
  );
  assert(
    result.comboSavings === 0,
    'TEST 11: Expired discount rule is filtered out'
  );
}

// TEST 12: Discount savings. Expected: Original total minus valid discounts equals final total.
{
  const result = calculateCustomQuote(
    [
      { id: 'calc-frontend-web', quantity: 1 },
      { id: 'calc-growth-plan', quantity: 1 },
    ],
    pricingCalculatorItemsData,
    '6months'
  );
  const computedFinal = result.offerSubtotal - result.totalDirectDiscounts;
  assert(
    result.finalEstimatedTotal === computedFinal,
    'TEST 12: Subtotal minus discounts precisely matches final estimated total',
    `Expected ${computedFinal}, got ${result.finalEstimatedTotal}`
  );
}

// TEST 13: Quantity changes. Expected: Price updates immediately and correctly.
{
  const result1 = calculateCustomQuote(
    [{ id: 'calc-single-post', quantity: 1 }],
    pricingCalculatorItemsData,
    'one-time'
  );
  const result5 = calculateCustomQuote(
    [{ id: 'calc-single-post', quantity: 5 }],
    pricingCalculatorItemsData,
    'one-time'
  );
  assert(
    result1.finalEstimatedTotal === 500,
    'TEST 13: 1 post = ₹500'
  );
  assert(
    result5.finalEstimatedTotal === 2500,
    'TEST 13: 5 posts = ₹2,500'
  );
}

// TEST 14: Missing pricing information. Expected: Handled gracefully without invented numbers.
{
  const result = calculateCustomQuote(
    [{ id: 'nonexistent-item-id', quantity: 1 }],
    pricingCalculatorItemsData,
    'one-time'
  );
  assert(
    result.selectedItemCount === 0,
    'TEST 14: Unmatched catalog item results in 0 selected items'
  );
  assert(
    result.finalEstimatedTotal === 0,
    'TEST 14: No invented pricing numbers'
  );
}

// TEST 15: Invalid prices or negative amounts. Expected: Correct validation rejection.
{
  const corruptCatalog = [
    {
      id: 'corrupt-item',
      title: 'Corrupt',
      price: -5000,
      unit: 'item',
      category: 'website',
      billingType: 'one-time' as const,
      deliveryTime: 'immediate',
      description: 'invalid',
      features: [],
    },
  ];
  const result = calculateCustomQuote(
    [{ id: 'corrupt-item', quantity: 1 }],
    corruptCatalog,
    'one-time'
  );
  assert(
    result.isValid === false,
    'TEST 15: Negative pricing correctly rejected by validation'
  );
  assert(
    Boolean(result.validationError),
    'TEST 15: Clear error message provided'
  );
}

console.log('\n🎉 ALL 15 AUTOMATED PRICING TESTS COMPLETED SUCCESSFULLY!\n');
