export type EventType = 'wedding' | 'birthday' | 'community' | 'corporate' | 'custom';

export type SettingType = 'indoor' | 'outdoor' | 'hybrid';

export type CurrencyCode = 'USD' | 'INR' | 'EUR' | 'GBP' | 'CAD' | 'AUD';

export interface EventDetails {
  id: string;
  name: string;
  type: EventType;
  date: string; // YYYY-MM-DD
  city: string;
  guestCount: number;
  totalBudget: number;
  currency: CurrencyCode;
  theme: string;
  setting: SettingType;
  dietaryRequirements: string[];
  additionalInstructions: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventPlan {
  concept: string;
  themeDescription: string;
  colorPalette: {
    name: string;
    hex: string;
  }[];
  venueRecommendations: {
    nameType: string;
    suitability: string;
    estimatedCostRange: string;
  }[];
  cateringSuggestions: {
    menuStyle: string;
    dietaryAccommodations: string;
    perGuestEstimate: number;
  };
  entertainmentAndActivities: string[];
  budgetSavingAlternatives: string[];
  contingencyPlans: {
    risk: string;
    solution: string;
  }[];
  generatedAt: string;
  isAiGenerated: boolean;
  provider: 'gemini' | 'deterministic-demo';
}

