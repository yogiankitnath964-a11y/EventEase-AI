import { describe, it, expect } from 'vitest';
import { generateDeterministicPlan, generateDeterministicIdeas } from '../src/services/deterministicAi';
import { EventDetails } from '../src/types/event';

describe('Deterministic AI Planning Engine', () => {
  const sampleEvent: EventDetails = {
    id: 'test-event-1',
    name: 'Chloe & Mark Wedding',
    type: 'wedding',
    date: '2027-06-15',
    city: 'Seattle',
    guestCount: 120,
    totalBudget: 25000,
    currency: 'USD',
    theme: 'Pacific Botanical Romance',
    setting: 'hybrid',
    dietaryRequirements: ['Vegetarian', 'Gluten-Free'],
    additionalInstructions: 'Focus on local seasonal ingredients and ambient fairy lighting.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('generates a complete structured event plan matching budget and guest count', () => {
    const result = generateDeterministicPlan(sampleEvent);

    expect(result.success).toBe(true);
    expect(result.plan).toBeDefined();
    expect(result.plan.concept).toContain('Chloe & Mark Wedding');
    expect(result.plan.colorPalette.length).toBeGreaterThanOrEqual(4);
    expect(result.plan.venueRecommendations.length).toBeGreaterThan(0);
    expect(result.plan.cateringSuggestions.perGuestEstimate).toBeGreaterThan(0);
    expect(result.plan.budgetSavingAlternatives.length).toBeGreaterThan(0);
    expect(result.plan.contingencyPlans.length).toBeGreaterThan(0);
  });

  it('generates suggested expenses approximately matching total budget', () => {
    const result = generateDeterministicPlan(sampleEvent);
    expect(result.suggestedExpenses.length).toBeGreaterThan(0);

    const sumExpenses = result.suggestedExpenses.reduce((acc, exp) => acc + exp.estimatedCost, 0);
    // Should be close to $25,000 (within 10%)
    expect(sumExpenses).toBeGreaterThanOrEqual(23000);
    expect(sumExpenses).toBeLessThanOrEqual(27000);
  });

  it('generates date-aware tasks with valid due dates', () => {
    const result = generateDeterministicPlan(sampleEvent);
    expect(result.suggestedTasks.length).toBeGreaterThan(0);

    for (const task of result.suggestedTasks) {
      expect(task.title).toBeTruthy();
      expect(task.dueDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('generates creative ideas across diverse categories', () => {
    const inviteIdeas = generateDeterministicIdeas('invitation_text', 'wedding', 'Botanical Romance');
    expect(inviteIdeas.length).toBeGreaterThan(0);
    expect(inviteIdeas[0].title).toBeTruthy();
    expect(inviteIdeas[0].content).toBeTruthy();

    const ecoIdeas = generateDeterministicIdeas('sustainable_hacks', 'community');
    expect(ecoIdeas.length).toBeGreaterThan(0);
    expect(ecoIdeas[0].tags.length).toBeGreaterThan(0);
  });
});

