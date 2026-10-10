/**
 * Yugark Digital Studio V2 — Centralized Deterministic Pricing Engine
 * 
 * Strict deterministic financial logic for:
 * 1. Base / Regular Price vs Launch Offer calculation
 * 2. Subscription Duration Discounts (applied exclusively to recurring services)
 * 3. Multi-Website Quantity-based Bulk Discounts
 * 4. Conditional 10% Website + Service Combo Discount
 * 5. Deterministic stacking, integer/INR rounding, and zero negative sums
 */

import { PricingCalculatorItem } from '../../types/content';

export type DurationTerm = 'one-time' | '1month' | '6months' | '1year';

export interface BasketItemSelection {
  id: string;
  quantity?: number;
}

export type ComboDiscountBasis = 'additional_services' | 'website' | 'combined_subtotal';

export interface DiscountRuleConfig {
  id: string;
  name: string;
  type: 'launch' | 'duration' | 'multi_website' | 'website_combo';
  discountPct: number;
  active: boolean;
  verified: boolean;
  startDate?: string;
  endDate?: string;
  comboBasis?: ComboDiscountBasis;
  minWebsiteQuantity?: number;
}

export interface CalculationLineItem {
  item: PricingCalculatorItem;
  quantity: number;
  isMonthly: boolean;
  monthsMultiplier: number;
  unitPrice: number;
  originalUnitPrice: number;
  baseTotal: number;
  offerTotal: number;
  launchSavings: number;
}

export interface AppliedDiscountDetail {
  id: string;
  name: string;
  discountPct: number;
  eligibleAmount: number;
  savings: number;
  description: string;
}

export interface PricingCalculationResult {
  lineItems: CalculationLineItem[];
  selectedItemCount: number;
  totalWebsites: number;
  totalEligibleAdditionalServices: number;
  durationTerm: DurationTerm;
  termMonths: number;

  // Monetary Breakdown (in INR)
  originalBaseTotal: number;       // Base catalog price before all offers
  offerSubtotal: number;           // Subtotal at launch offer rates
  launchOfferSavings: number;      // Savings from catalog launch offer

  // Separated Subtotals
  oneTimeSubtotal: number;         // All one-time deliverables (websites, single videos/posts)
  recurringGrossSubtotal: number;  // All recurring monthly deliverables before duration discounts
  websiteSubtotal: number;         // Total website package charges

  // Rule-based Discounts
  durationSavings: number;
  durationDiscountPct: number;
  durationDiscountApplied: boolean;

  multiWebsiteSavings: number;
  multiWebsiteEligible: boolean;

  isComboEligible: boolean;
  comboSavings: number;
  comboDiscountBasis: ComboDiscountBasis;
  comboEligibleAmount: number;

  // Final Aggregation
  totalDirectDiscounts: number;    // Duration + Multi-website + Combo
  totalAllSavings: number;         // Launch Savings + Direct Discounts
  finalEstimatedTotal: number;     // Final payable estimate

  // Status & Metadata
  appliedDiscounts: AppliedDiscountDetail[];
  taxNotice: string;
  isValid: boolean;
  validationError?: string;
}

// ============================================================================
// VERIFIED DEFAULT DISCOUNT RULES
// ============================================================================
export const defaultDiscountRules: DiscountRuleConfig[] = [
  {
    id: 'rule-duration-1m',
    name: '1 Month Commitment Discount',
    type: 'duration',
    discountPct: 10,
    active: true,
    verified: true,
  },
  {
    id: 'rule-duration-6m',
    name: '6 Months Commitment Discount',
    type: 'duration',
    discountPct: 15,
    active: true,
    verified: true,
  },
  {
    id: 'rule-duration-1y',
    name: '1 Year Annual Commitment Discount',
    type: 'duration',
    discountPct: 25,
    active: true,
    verified: true,
  },
  {
    id: 'rule-website-combo',
    name: 'Website + Service 10% Combo Offer',
    type: 'website_combo',
    discountPct: 10,
    active: true,
    verified: true,
    comboBasis: 'additional_services', // Default approved standard
  },
  {
    id: 'rule-multi-website',
    name: 'Multi-Website Studio Benefit',
    type: 'multi_website',
    discountPct: 10,
    active: true,
    verified: true,
    minWebsiteQuantity: 2,
  },
];

// Duration option definitions
export const DURATION_OPTIONS = [
  { id: 'one-time' as DurationTerm, label: 'ONE-TIME', termMonths: 1, discountPct: 0, subLabel: 'Standard one-time pricing' },
  { id: '1month' as DurationTerm, label: '1 MONTH', termMonths: 1, discountPct: 10, subLabel: '10% commitment discount' },
  { id: '6months' as DurationTerm, label: '6 MONTHS', termMonths: 6, discountPct: 15, subLabel: '15% duration discount' },
  { id: '1year' as DurationTerm, label: '1 YEAR', termMonths: 12, discountPct: 25, subLabel: '25% duration discount' },
];

/**
 * Validates rule validity based on active state, verification state, and dates.
 */
export function isRuleActiveAndValid(rule: DiscountRuleConfig, currentDate = new Date()): boolean {
  if (!rule.active || !rule.verified) return false;
  if (rule.discountPct < 0 || rule.discountPct > 100) return false;

  if (rule.startDate) {
    const start = new Date(rule.startDate);
    if (currentDate < start) return false;
  }
  if (rule.endDate) {
    const end = new Date(rule.endDate);
    if (currentDate > end) return false;
  }
  return true;
}

/**
 * Main Deterministic Calculation Function
 */
export function calculateCustomQuote(
  selectedItems: BasketItemSelection[],
  catalog: PricingCalculatorItem[],
  durationTerm: DurationTerm = 'one-time',
  customRules: DiscountRuleConfig[] = defaultDiscountRules,
  options?: {
    allowStacking?: boolean;
    currentDate?: Date;
  }
): PricingCalculationResult {
  const allowStacking = options?.allowStacking ?? true;
  const currentDate = options?.currentDate ?? new Date();

  const durationOption = DURATION_OPTIONS.find((d) => d.id === durationTerm) || DURATION_OPTIONS[0];
  const termMonths = durationOption.termMonths;

  // 1. Input Sanity & Line Items Construction
  const lineItems: CalculationLineItem[] = [];
  let totalWebsites = 0;
  let totalEligibleAdditionalServices = 0;

  for (const sel of selectedItems) {
    const quantity = Math.max(1, Math.floor(sel.quantity ?? 1));
    const catalogItem = catalog.find((c) => c.id === sel.id);
    if (!catalogItem) continue;

    // Numerical sanity check
    if (catalogItem.price < 0 || (catalogItem.originalPrice !== undefined && catalogItem.originalPrice < 0)) {
      return createErrorResult(durationTerm, 'Invalid catalog price: Negative amounts are not permitted.');
    }

    const isMonthly = catalogItem.billingType === 'monthly';
    const isWebsite = catalogItem.category === 'website' || catalogItem.id.includes('web');

    // Section 5 & 7 Rule: Never multiply one-time website development fees by subscription duration!
    const monthsMultiplier = isMonthly && durationTerm !== 'one-time' ? termMonths : 1;

    const unitPrice = catalogItem.price;
    const originalUnitPrice = catalogItem.originalPrice || catalogItem.price;

    const baseTotal = originalUnitPrice * quantity * monthsMultiplier;
    const offerTotal = unitPrice * quantity * monthsMultiplier;
    const launchSavings = Math.max(0, baseTotal - offerTotal);

    if (isWebsite) {
      totalWebsites += quantity;
    } else {
      totalEligibleAdditionalServices += quantity;
    }

    lineItems.push({
      item: catalogItem,
      quantity,
      isMonthly,
      monthsMultiplier,
      unitPrice,
      originalUnitPrice,
      baseTotal,
      offerTotal,
      launchSavings,
    });
  }

  if (lineItems.length === 0) {
    return createEmptyResult(durationTerm);
  }

  // 2. Aggregate Base Totals
  let originalBaseTotal = 0;
  let offerSubtotal = 0;
  let launchOfferSavings = 0;
  let oneTimeSubtotal = 0;
  let recurringGrossSubtotal = 0;
  let websiteSubtotal = 0;
  let nonWebsiteOneTimeSubtotal = 0;

  for (const line of lineItems) {
    originalBaseTotal += line.baseTotal;
    offerSubtotal += line.offerTotal;
    launchOfferSavings += line.launchSavings;

    const isWebsite = line.item.category === 'website' || line.item.id.includes('web');

    if (line.isMonthly) {
      recurringGrossSubtotal += line.offerTotal;
    } else {
      oneTimeSubtotal += line.offerTotal;
      if (isWebsite) {
        websiteSubtotal += line.offerTotal;
      } else {
        nonWebsiteOneTimeSubtotal += line.offerTotal;
      }
    }
  }

  const appliedDiscounts: AppliedDiscountDetail[] = [];

  // 3. Stage 1: Duration Discount (Exclusively applies to recurring monthly services)
  let durationSavings = 0;
  let durationDiscountPct = 0;
  let durationDiscountApplied = false;

  if (recurringGrossSubtotal > 0 && durationTerm !== 'one-time') {
    const durationRule = customRules.find(
      (r) => r.type === 'duration' && r.name.toLowerCase().includes(durationOption.label.toLowerCase())
    ) || {
      id: `duration-${durationTerm}`,
      name: `${durationOption.label} Duration Discount`,
      type: 'duration',
      discountPct: durationOption.discountPct,
      active: true,
      verified: true,
    };

    if (isRuleActiveAndValid(durationRule, currentDate) && durationRule.discountPct > 0) {
      durationDiscountPct = durationRule.discountPct;
      durationSavings = Math.round(recurringGrossSubtotal * (durationDiscountPct / 100));
      durationDiscountApplied = true;

      appliedDiscounts.push({
        id: durationRule.id,
        name: durationRule.name,
        discountPct: durationDiscountPct,
        eligibleAmount: recurringGrossSubtotal,
        savings: durationSavings,
        description: `${durationDiscountPct}% duration savings applied across ${termMonths} months of recurring services`,
      });
    }
  }

  const netRecurringAfterDuration = Math.max(0, recurringGrossSubtotal - durationSavings);

  // 4. Stage 2: Multi-Website Bulk Discount (Quantity-based: 2+ websites)
  let multiWebsiteSavings = 0;
  const multiWebsiteEligible = totalWebsites >= 2;

  if (multiWebsiteEligible) {
    const multiWebRule = customRules.find((r) => r.type === 'multi_website');
    if (multiWebRule && isRuleActiveAndValid(multiWebRule, currentDate) && multiWebRule.discountPct > 0) {
      // Calculate bulk discount on website subtotal
      multiWebsiteSavings = Math.round(websiteSubtotal * (multiWebRule.discountPct / 100));

      appliedDiscounts.push({
        id: multiWebRule.id,
        name: multiWebRule.name,
        discountPct: multiWebRule.discountPct,
        eligibleAmount: websiteSubtotal,
        savings: multiWebsiteSavings,
        description: `${multiWebRule.discountPct}% bulk benefit for multiple business websites`,
      });
    }
  }

  const netWebsiteAfterBulk = Math.max(0, websiteSubtotal - multiWebsiteSavings);

  // 5. Stage 3: Critical 10% Website + Service Combo Discount
  // Strict rule: Triggers IF AND ONLY IF (Websites >= 1) AND (Eligible Non-Website Services >= 1)
  // Does NOT apply to Website only, Service only, or 2 Websites without other services.
  const isComboEligible = totalWebsites >= 1 && totalEligibleAdditionalServices >= 1;
  let comboSavings = 0;
  let comboEligibleAmount = 0;
  let comboBasis: ComboDiscountBasis = 'additional_services';

  const comboRule = customRules.find((r) => r.type === 'website_combo');

  if (isComboEligible && comboRule && isRuleActiveAndValid(comboRule, currentDate) && comboRule.discountPct > 0) {
    comboBasis = comboRule.comboBasis || 'additional_services';

    // Check stacking restrictions
    const canApplyCombo = allowStacking || appliedDiscounts.length === 0;

    if (canApplyCombo) {
      if (comboBasis === 'additional_services') {
        // Applied to additional services net amount (recurring net + non-website one-time)
        comboEligibleAmount = netRecurringAfterDuration + nonWebsiteOneTimeSubtotal;
      } else if (comboBasis === 'website') {
        // Applied to website net amount
        comboEligibleAmount = netWebsiteAfterBulk;
      } else {
        // Applied to combined net subtotal
        comboEligibleAmount = netWebsiteAfterBulk + netRecurringAfterDuration + nonWebsiteOneTimeSubtotal;
      }

      comboSavings = Math.round(comboEligibleAmount * (comboRule.discountPct / 100));

      appliedDiscounts.push({
        id: comboRule.id,
        name: comboRule.name,
        discountPct: comboRule.discountPct,
        eligibleAmount: comboEligibleAmount,
        savings: comboSavings,
        description: `${comboRule.discountPct}% combo savings for bundling website with dedicated growth services`,
      });
    }
  }

  // 6. Final Calculation & Clamp Verification
  const totalDirectDiscounts = durationSavings + multiWebsiteSavings + comboSavings;
  const totalAllSavings = launchOfferSavings + totalDirectDiscounts;
  const finalEstimatedTotal = Math.max(0, offerSubtotal - totalDirectDiscounts);

  return {
    lineItems,
    selectedItemCount: lineItems.length,
    totalWebsites,
    totalEligibleAdditionalServices,
    durationTerm,
    termMonths,

    originalBaseTotal,
    offerSubtotal,
    launchOfferSavings,

    oneTimeSubtotal,
    recurringGrossSubtotal,
    websiteSubtotal,

    durationSavings,
    durationDiscountPct,
    durationDiscountApplied,

    multiWebsiteSavings,
    multiWebsiteEligible,

    isComboEligible,
    comboSavings,
    comboDiscountBasis: comboBasis,
    comboEligibleAmount,

    totalDirectDiscounts,
    totalAllSavings,
    finalEstimatedTotal,

    appliedDiscounts,
    taxNotice: 'Exclusive of applicable taxes. Final itemized quote confirmed upon scope validation.',
    isValid: true,
  };
}

function createEmptyResult(durationTerm: DurationTerm): PricingCalculationResult {
  return {
    lineItems: [],
    selectedItemCount: 0,
    totalWebsites: 0,
    totalEligibleAdditionalServices: 0,
    durationTerm,
    termMonths: 1,
    originalBaseTotal: 0,
    offerSubtotal: 0,
    launchOfferSavings: 0,
    oneTimeSubtotal: 0,
    recurringGrossSubtotal: 0,
    websiteSubtotal: 0,
    durationSavings: 0,
    durationDiscountPct: 0,
    durationDiscountApplied: false,
    multiWebsiteSavings: 0,
    multiWebsiteEligible: false,
    isComboEligible: false,
    comboSavings: 0,
    comboDiscountBasis: 'additional_services',
    comboEligibleAmount: 0,
    totalDirectDiscounts: 0,
    totalAllSavings: 0,
    finalEstimatedTotal: 0,
    appliedDiscounts: [],
    taxNotice: 'Exclusive of applicable taxes. Final itemized quote confirmed upon scope validation.',
    isValid: true,
  };
}

function createErrorResult(durationTerm: DurationTerm, message: string): PricingCalculationResult {
  const empty = createEmptyResult(durationTerm);
  return {
    ...empty,
    isValid: false,
    validationError: message,
  };
}
