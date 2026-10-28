import { EventDetails, EventPlan } from './event';
import { ExpenseItem } from './budget';
import { TimelineTask } from './timeline';
import { Vendor } from './vendor';

export interface GeneratePlanRequest {
  event: EventDetails;
}

export interface GeneratePlanResponse {
  success: boolean;
  isAiGenerated: boolean;
  provider: 'gemini' | 'deterministic-demo';
  plan: EventPlan;
  suggestedExpenses: Omit<ExpenseItem, 'id' | 'eventId' | 'createdAt'>[];
  suggestedTasks: Omit<TimelineTask, 'id' | 'eventId'>[];
  suggestedVendors: Omit<Vendor, 'id' | 'eventId'>[];
  message?: string;
}

export type IdeaCategory = 
  | 'invitation_text' 
  | 'decor_concepts' 
  | 'birthday_themes' 
  | 'wedding_elements' 
  | 'community_activities' 
  | 'sustainable_hacks';

export interface GenerateIdeasRequest {
  eventType: string;
  category: IdeaCategory;
  theme?: string;
  guestCount?: number;
  city?: string;
  additionalPrompt?: string;
}

export interface GeneratedIdeaItem {
  title: string;
  content: string;
  tags: string[];
  tips?: string;
}

export interface GenerateIdeasResponse {
  success: boolean;
  isAiGenerated: boolean;
  provider: 'gemini' | 'deterministic-demo';
  ideas: GeneratedIdeaItem[];
}

