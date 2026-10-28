import { EventDetails } from '../types/event';
import { GeneratePlanResponse, GenerateIdeasResponse, IdeaCategory } from '../types/ai';
import { generateDeterministicPlan, generateDeterministicIdeas } from './deterministicAi';

export interface HealthCheckResponse {
  status: string;
  hasGeminiKey: boolean;
  model: string;
}

export async function checkBackendHealth(): Promise<HealthCheckResponse> {
  try {
    const res = await fetch('/api/health', { method: 'GET' });
    if (!res.ok) throw new Error(`Health check failed with status: ${res.status}`);
    return await res.json();
  } catch {
    return {
      status: 'offline_or_demo',
      hasGeminiKey: false,
      model: 'deterministic-demo-engine',
    };
  }
}

export async function generateEventPlanApi(event: EventDetails): Promise<GeneratePlanResponse> {
  try {
    const res = await fetch('/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event }),
    });

    if (res.ok) {
      const data: GeneratePlanResponse = await res.json();
      if (data && data.plan) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Backend API unavailable or error occurred, using deterministic demo planner:', err);
  }

  // Graceful deterministic fallback
  return generateDeterministicPlan(event);
}

export async function generateIdeasApi(
  category: IdeaCategory,
  eventType: string,
  theme?: string,
  guestCount?: number,
  city?: string,
  additionalPrompt?: string
): Promise<GenerateIdeasResponse> {
  try {
    const res = await fetch('/api/ideas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category,
        eventType,
        theme,
        guestCount,
        city,
        additionalPrompt,
      }),
    });

    if (res.ok) {
      const data: GenerateIdeasResponse = await res.json();
      if (data && data.ideas && data.ideas.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Backend Ideas API unavailable, using deterministic demo ideas:', err);
  }

  const ideas = generateDeterministicIdeas(category, eventType, theme);
  return {
    success: true,
    isAiGenerated: false,
    provider: 'deterministic-demo',
    ideas,
  };
}

