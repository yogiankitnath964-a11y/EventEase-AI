export type TaskPriority = 'high' | 'medium' | 'low';

export type TaskPhase = 
  | 'concept_and_venue'    // 6-12 months before
  | 'vendors_and_styling'  // 3-5 months before
  | 'invites_and_details'  // 1-2 months before
  | 'final_prep'           // 1-2 weeks before
  | 'event_day';           // Day of event

export interface TimelineTask {
  id: string;
  eventId: string;
  title: string;
  description?: string;
  phase: TaskPhase;
  dueDate: string; // YYYY-MM-DD
  priority: TaskPriority;
  isCompleted: boolean;
  completedAt?: string;
  assignedCategory?: string;
}

export interface PhaseGroup {
  phase: TaskPhase;
  phaseLabel: string;
  timeframeDescription: string;
  tasks: TimelineTask[];
  completedCount: number;
  totalCount: number;
}

