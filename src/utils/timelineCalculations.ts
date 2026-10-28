import { PhaseGroup, TaskPhase, TimelineTask } from '../types/timeline';

export const PHASE_CONFIG: Record<TaskPhase, { label: string; timeframe: string; defaultDaysOffset: number }> = {
  concept_and_venue: {
    label: 'Phase 1: Concept & Core Bookings',
    timeframe: '6 to 12 months before',
    defaultDaysOffset: -180,
  },
  vendors_and_styling: {
    label: 'Phase 2: Vendors & Styling',
    timeframe: '3 to 5 months before',
    defaultDaysOffset: -90,
  },
  invites_and_details: {
    label: 'Phase 3: Invitations & Guest Details',
    timeframe: '1 to 2 months before',
    defaultDaysOffset: -45,
  },
  final_prep: {
    label: 'Phase 4: Final Preparation',
    timeframe: '1 to 2 weeks before',
    defaultDaysOffset: -10,
  },
  event_day: {
    label: 'Phase 5: Event Day Execution',
    timeframe: 'Day of celebration',
    defaultDaysOffset: 0,
  },
};

export function calculateDateWithOffset(eventDateStr: string, daysOffset: number): string {
  try {
    const [year, month, day] = eventDateStr.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day + daysOffset));
    return date.toISOString().split('T')[0];
  } catch {
    return eventDateStr;
  }
}

export function isTaskOverdue(task: TimelineTask): boolean {
  if (task.isCompleted || !task.dueDate) return false;
  const todayStr = new Date().toISOString().split('T')[0];
  return task.dueDate < todayStr;
}

export function groupTasksByPhase(tasks: TimelineTask[]): PhaseGroup[] {
  const phaseOrder: TaskPhase[] = [
    'concept_and_venue',
    'vendors_and_styling',
    'invites_and_details',
    'final_prep',
    'event_day',
  ];

  return phaseOrder.map((phase) => {
    const phaseTasks = tasks.filter((t) => t.phase === phase);
    // Sort tasks by due date ascending
    phaseTasks.sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1));

    const completedCount = phaseTasks.filter((t) => t.isCompleted).length;

    return {
      phase,
      phaseLabel: PHASE_CONFIG[phase].label,
      timeframeDescription: PHASE_CONFIG[phase].timeframe,
      tasks: phaseTasks,
      completedCount,
      totalCount: phaseTasks.length,
    };
  });
}

