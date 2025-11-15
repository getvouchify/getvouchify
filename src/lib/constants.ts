// Deal Categories - Must match database constraint exactly
export const DEAL_CATEGORIES = [
  'Food & Drink',
  'Beauty & Spa',
  'Health & Fitness',
  'Things to Do',
  'Retail',
  'Electronics',
  'Home & Lifestyle'
] as const;

export type DealCategory = typeof DEAL_CATEGORIES[number];

// Business Categories for Merchant Onboarding
export const BUSINESS_CATEGORIES = [
  'Food & Drink',
  'Beauty & Spa',
  'Health & Fitness',
  'Things to Do',
  'Retail',
  'Electronics',
  'Home & Lifestyle'
] as const;

export type BusinessCategory = typeof BUSINESS_CATEGORIES[number];
