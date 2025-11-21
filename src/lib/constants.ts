// Deal Categories - Must match database constraint exactly
export const DEAL_CATEGORIES = [
  'Food & Drink',
  'Beauty & Spa',
  'Health & Fitness',
  'Things to Do',
  'Retail'
] as const;

export type DealCategory = typeof DEAL_CATEGORIES[number];

// Business Categories for Merchant Onboarding
export const BUSINESS_CATEGORIES = [
  'Food & Drink',
  'Beauty & Spa',
  'Health & Fitness',
  'Things to Do',
  'Retail'
] as const;

export type BusinessCategory = typeof BUSINESS_CATEGORIES[number];

// Listing Types for Deal Creation
export const LISTING_TYPES = [
  {
    value: 'full_price',
    label: 'Full-Price Listing',
    description: 'Standard service at regular price',
    icon: 'tag',
    default: true
  },
  {
    value: 'loyalty_program',
    label: 'Full-Price with Merchant Loyalty',
    description: 'Regular price + your own loyalty rewards',
    icon: 'gift',
    default: false
  },
  {
    value: 'discounted_offer',
    label: 'Discounted Offer',
    description: 'Time-based promotional pricing',
    icon: 'percent',
    default: false
  }
] as const;

export type ListingType = 'full_price' | 'loyalty_program' | 'discounted_offer';
