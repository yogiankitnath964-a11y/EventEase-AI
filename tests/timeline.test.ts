import { describe, it, expect } from 'vitest';
import { calculateDateWithOffset, groupTasksByPhase, isTaskOverdue } from '../src/utils/timelineCalculations';
import { TimelineTask } from '../src/types/timeline';

describe('Timeline & Date-Aware Task Calculations', () => {
  it('calculates dynamic due dates based on event date and day offset', () => {
    const eventDate = '2026-12-15';
    const sixtyDaysBefore = calculateDateWithOffset(eventDate, -60);
    expect(sixtyDaysBefore).toBe('2026-10-16');

    const dayOf = calculateDateWithOffset(eventDate, 0);
    expect(dayOf).toBe('2026-12-15');
  });

  it('detects overdue tasks when due date is in the past and task is incomplete', () => {
    const pastTask: TimelineTask = {
      id: 't-1',
      eventId: 'e-1',
      title: 'Book Photographer',
      phase: 'concept_and_venue',
      dueDate: '2020-01-01',
      priority: 'high',
      isCompleted: false,
    };

    expect(isTaskOverdue(pastTask)).toBe(true);

    const completedPastTask: TimelineTask = {
      ...pastTask,
      isCompleted: true,
    };
    expect(isTaskOverdue(completedPastTask)).toBe(false);

    const futureTask: TimelineTask = {
      ...pastTask,
      dueDate: '2099-01-01',
      isCompleted: false,
    };
    expect(isTaskOverdue(futureTask)).toBe(false);
  });

  it('correctly groups tasks into structured event phases and tracks completion counts', () => {
    const tasks: TimelineTask[] = [
      {
        id: 't-1',
        eventId: 'e-1',
        title: 'Lock In Venue',
        phase: 'concept_and_venue',
        dueDate: '2026-06-01',
        priority: 'high',
        isCompleted: true,
      },
      {
        id: 't-2',
        eventId: 'e-1',
        title: 'Interview Caterers',
        phase: 'concept_and_venue',
        dueDate: '2026-06-15',
        priority: 'medium',
        isCompleted: false,
      },
      {
        id: 't-3',
        eventId: 'e-1',
        title: 'Send Invitations',
        phase: 'invites_and_details',
        dueDate: '2026-09-01',
        priority: 'high',
        isCompleted: false,
      },
    ];

    const groups = groupTasksByPhase(tasks);
    expect(groups.length).toBe(5);

    const phase1 = groups.find(g => g.phase === 'concept_and_venue');
    expect(phase1?.tasks.length).toBe(2);
    expect(phase1?.completedCount).toBe(1);
    expect(phase1?.totalCount).toBe(2);

    const phase3 = groups.find(g => g.phase === 'invites_and_details');
    expect(phase3?.tasks.length).toBe(1);
    expect(phase3?.completedCount).toBe(0);
  });
});

