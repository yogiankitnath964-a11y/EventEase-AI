import { EventDetails, EventPlan } from '../types/event';
import { ExpenseItem } from '../types/budget';
import { TimelineTask } from '../types/timeline';
import { Vendor } from '../types/vendor';
import { FullEventData, SAMPLE_EVENTS } from '../data/initialEvents';

const STORAGE_KEYS = {
  EVENTS: 'eventease_events_v1',
  ACTIVE_EVENT_ID: 'eventease_active_id_v1',
  EXPENSES: 'eventease_expenses_v1',
  TASKS: 'eventease_tasks_v1',
  VENDORS: 'eventease_vendors_v1',
  PLANS: 'eventease_plans_v1',
};

// Initialize default data if not already present
export function initializeStorage(): void {
  try {
    const existingEvents = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!existingEvents) {
      resetToSampleData();
    }
  } catch (err) {
    console.error('Storage initialization failed:', err);
  }
}

export function resetToSampleData(): void {
  const events = SAMPLE_EVENTS.map(s => s.event);
  const expenses = SAMPLE_EVENTS.flatMap(s => s.expenses);
  const tasks = SAMPLE_EVENTS.flatMap(s => s.tasks);
  const vendors = SAMPLE_EVENTS.flatMap(s => s.vendors);
  const plansRecord: Record<string, EventPlan> = {};
  
  for (const s of SAMPLE_EVENTS) {
    plansRecord[s.event.id] = s.plan;
  }

  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  localStorage.setItem(STORAGE_KEYS.ACTIVE_EVENT_ID, events[0].id);
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(vendors));
  localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plansRecord));
}

// Events CRUD
export function getStoredEvents(): EventDetails[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveEvent(event: EventDetails): void {
  const events = getStoredEvents();
  const existingIdx = events.findIndex(e => e.id === event.id);
  if (existingIdx >= 0) {
    events[existingIdx] = { ...event, updatedAt: new Date().toISOString() };
  } else {
    events.push({ ...event, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
}

export function deleteStoredEvent(eventId: string): void {
  const events = getStoredEvents().filter(e => e.id !== eventId);
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));

  // Also remove associated data
  const expenses = getStoredExpenses().filter(e => e.eventId !== eventId);
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));

  const tasks = getStoredTasks().filter(t => t.eventId !== eventId);
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));

  const vendors = getStoredVendors().filter(v => v.eventId !== eventId);
  localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(vendors));

  const plans = getStoredPlans();
  delete plans[eventId];
  localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));

  // If deleted event was active, switch to first available
  const activeId = getActiveEventId();
  if (activeId === eventId && events.length > 0) {
    setActiveEventId(events[0].id);
  }
}

export function getActiveEventId(): string | null {
  return localStorage.getItem(STORAGE_KEYS.ACTIVE_EVENT_ID);
}

export function setActiveEventId(id: string): void {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_EVENT_ID, id);
}

// Plans
export function getStoredPlans(): Record<string, EventPlan> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PLANS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveEventPlan(eventId: string, plan: EventPlan): void {
  const plans = getStoredPlans();
  plans[eventId] = plan;
  localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
}

// Expenses CRUD
export function getStoredExpenses(): ExpenseItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveExpense(expense: ExpenseItem): void {
  const list = getStoredExpenses();
  const idx = list.findIndex(e => e.id === expense.id);
  if (idx >= 0) {
    list[idx] = expense;
  } else {
    list.push(expense);
  }
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(list));
}

export function deleteStoredExpense(expenseId: string): void {
  const list = getStoredExpenses().filter(e => e.id !== expenseId);
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(list));
}

export function bulkAddExpenses(expenses: ExpenseItem[]): void {
  const list = getStoredExpenses();
  list.push(...expenses);
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(list));
}

// Tasks CRUD
export function getStoredTasks(): TimelineTask[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTask(task: TimelineTask): void {
  const list = getStoredTasks();
  const idx = list.findIndex(t => t.id === task.id);
  if (idx >= 0) {
    list[idx] = task;
  } else {
    list.push(task);
  }
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(list));
}

export function deleteStoredTask(taskId: string): void {
  const list = getStoredTasks().filter(t => t.id !== taskId);
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(list));
}

export function bulkAddTasks(tasks: TimelineTask[]): void {
  const list = getStoredTasks();
  list.push(...tasks);
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(list));
}

// Vendors CRUD
export function getStoredVendors(): Vendor[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VENDORS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveVendor(vendor: Vendor): void {
  const list = getStoredVendors();
  const idx = list.findIndex(v => v.id === vendor.id);
  if (idx >= 0) {
    list[idx] = vendor;
  } else {
    list.push(vendor);
  }
  localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(list));
}

export function deleteStoredVendor(vendorId: string): void {
  const list = getStoredVendors().filter(v => v.id !== vendorId);
  localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(list));
}

export function bulkAddVendors(vendors: Vendor[]): void {
  const list = getStoredVendors();
  list.push(...vendors);
  localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(list));
}

