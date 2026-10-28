import React, { useState } from 'react';
import { 
  CalendarClock, 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Edit3, 
  Trash2, 
  Filter, 
  ChevronRight,
  CalendarDays,
  Tag
} from 'lucide-react';
import { EventDetails } from '../../types/event';
import { TaskPhase, TaskPriority, TimelineTask } from '../../types/timeline';
import { groupTasksByPhase, isTaskOverdue, PHASE_CONFIG } from '../../utils/timelineCalculations';
import { formatDate, getDaysRemaining, getRelativeDateBadge } from '../../utils/formatters';
import { TaskModal } from './TaskModal';

interface TimelineViewProps {
  event: EventDetails;
  tasks: TimelineTask[];
  onSaveTask: (task: TimelineTask) => void;
  onDeleteTask: (id: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  event,
  tasks,
  onSaveTask,
  onDeleteTask,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TimelineTask | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all');

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const overdueCount = tasks.filter((t) => isTaskOverdue(t)).length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggleComplete = (task: TimelineTask) => {
    const updated: TimelineTask = {
      ...task,
      isCompleted: !task.isCompleted,
      completedAt: !task.isCompleted ? new Date().toISOString() : undefined,
    };
    onSaveTask(updated);
  };

  const handleOpenAdd = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (task: TimelineTask) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (statusFilter === 'completed' && !t.isCompleted) return false;
    if (statusFilter === 'pending' && t.isCompleted) return false;
    if (statusFilter === 'overdue' && !isTaskOverdue(t)) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    return true;
  });

  const phaseGroups = groupTasksByPhase(filteredTasks);

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case 'high':
        return (
          <span className="text-[10px] font-bold uppercase text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            High Priority
          </span>
        );
      case 'medium':
        return (
          <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            Medium
          </span>
        );
      case 'low':
      default:
        return (
          <span className="text-[10px] font-bold uppercase text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            Low
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header and Progress Snapshot */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-soft-purple space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
              Date-Aware Milestones & Deadlines
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Preparation Timeline
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Automated deadlines relative to event date: <span className="font-semibold text-slate-800">{formatDate(event.date)}</span>
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white gradient-brand hover:opacity-95 shadow-md shadow-brand-500/20 transition active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Task</span>
          </button>
        </div>

        {/* Progress Bar & Badges */}
        <div className="space-y-2 bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">
              Milestone Completion: {completedCount} of {totalCount} completed ({percentage}%)
            </span>
            {overdueCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 animate-pulse">
                <AlertTriangle className="w-3 h-3 text-rose-600" />
                {overdueCount} {overdueCount === 1 ? 'task overdue' : 'tasks overdue'}
              </span>
            )}
          </div>

          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-brand-600 h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-purple-50">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: `All Tasks (${totalCount})` },
              { id: 'pending', label: `Pending (${totalCount - completedCount})` },
              { id: 'completed', label: `Completed (${completedCount})` },
              { id: 'overdue', label: `Overdue (${overdueCount})` },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  statusFilter === f.id
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-purple-100 text-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Phase Groups List */}
      <div className="space-y-6">
        {phaseGroups.map((group) => {
          if (group.tasks.length === 0) return null;

          return (
            <div key={group.phase} className="bg-white rounded-3xl border border-purple-100 shadow-soft-purple overflow-hidden">
              {/* Phase Header */}
              <div className="bg-surface-lavender/60 px-6 py-4 border-b border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{group.phaseLabel}</h3>
                  <p className="text-xs text-slate-500">{group.timeframeDescription}</p>
                </div>
                <span className="text-xs font-bold text-brand-800 bg-white px-2.5 py-1 rounded-full border border-purple-200 self-start sm:self-auto">
                  {group.completedCount} / {group.totalCount} completed
                </span>
              </div>

              {/* Tasks in Phase */}
              <div className="divide-y divide-purple-50">
                {group.tasks.map((task) => {
                  const overdue = isTaskOverdue(task);
                  const dateBadge = getRelativeDateBadge(task.dueDate);

                  return (
                    <div
                      key={task.id}
                      className={`p-4 sm:p-5 flex items-start gap-4 transition hover:bg-purple-50/30 ${
                        task.isCompleted ? 'bg-slate-50/50 opacity-75' : ''
                      }`}
                    >
                      {/* Checkbox toggle */}
                      <button
                        onClick={() => handleToggleComplete(task)}
                        aria-label={task.isCompleted ? 'Mark task as pending' : 'Mark task as completed'}
                        className="mt-0.5 text-slate-300 hover:text-brand-600 transition shrink-0 focus:outline-none"
                      >
                        {task.isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4
                            className={`text-sm font-bold text-slate-900 ${
                              task.isCompleted ? 'line-through text-slate-400' : ''
                            }`}
                          >
                            {task.title}
                          </h4>
                          {getPriorityBadge(task.priority)}
                          {task.assignedCategory && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              <Tag className="w-2.5 h-2.5" />
                              {task.assignedCategory}
                            </span>
                          )}
                        </div>

                        {task.description && (
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        {/* Date details */}
                        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                          <span className="flex items-center gap-1 font-medium text-slate-600">
                            <CalendarDays className="w-3.5 h-3.5 text-brand-600" />
                            Due: {formatDate(task.dueDate)}
                          </span>

                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${dateBadge.colorClass}`}
                          >
                            {overdue ? 'Overdue!' : dateBadge.label}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleOpenEdit(task)}
                          aria-label={`Edit ${task.title}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-700 hover:bg-purple-50 transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          aria-label={`Delete ${task.title}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="p-12 text-center bg-white rounded-3xl border border-purple-100 space-y-3">
            <CalendarClock className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No matching timeline tasks</h4>
            <p className="text-xs text-slate-400">
              Try switching your filter or add a new custom milestone for this celebration.
            </p>
          </div>
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={onSaveTask}
        eventId={event.id}
        eventDate={event.date}
        initialData={editingTask}
      />

    </div>
  );
};

