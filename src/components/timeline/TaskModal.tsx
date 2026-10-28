import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { TaskPhase, TaskPriority, TimelineTask } from '../../types/timeline';
import { PHASE_CONFIG } from '../../utils/timelineCalculations';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: TimelineTask) => void;
  eventId: string;
  eventDate: string;
  initialData?: TimelineTask | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  eventId,
  eventDate,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [phase, setPhase] = useState<TaskPhase>('concept_and_venue');
  const [dueDate, setDueDate] = useState(eventDate || '');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assignedCategory, setAssignedCategory] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setPhase(initialData.phase);
      setDueDate(initialData.dueDate);
      setPriority(initialData.priority);
      setAssignedCategory(initialData.assignedCategory || '');
    } else {
      setTitle('');
      setDescription('');
      setPhase('concept_and_venue');
      setDueDate(eventDate || '');
      setPriority('medium');
      setAssignedCategory('General');
    }
    setError('');
  }, [initialData, isOpen, eventDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }
    if (!dueDate) {
      setError('Due date is required.');
      return;
    }

    const task: TimelineTask = {
      id: initialData?.id || `task-${Date.now()}`,
      eventId,
      title: title.trim(),
      description: description.trim(),
      phase,
      dueDate,
      priority,
      isCompleted: initialData ? initialData.isCompleted : false,
      completedAt: initialData?.completedAt,
      assignedCategory: assignedCategory.trim() || 'General',
    };

    onSave(task);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Preparation Task' : 'Add Preparation Task'}
      subtitle="Organize deadlines, assignments, and critical event milestones"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="task-title" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Task Milestone Title *
          </label>
          <input
            id="task-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Schedule final floral walkthrough with lead designer"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="task-phase" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Event Planning Phase
            </label>
            <select
              id="task-phase"
              value={phase}
              onChange={(e) => setPhase(e.target.value as TaskPhase)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              {(Object.keys(PHASE_CONFIG) as TaskPhase[]).map((p) => (
                <option key={p} value={p}>
                  {PHASE_CONFIG[p].label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="task-due-date" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Due Date *
            </label>
            <input
              id="task-due-date"
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="task-priority" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Priority Level
            </label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          <div>
            <label htmlFor="task-category" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Assigned Category
            </label>
            <input
              id="task-category"
              type="text"
              value={assignedCategory}
              onChange={(e) => setAssignedCategory(e.target.value)}
              placeholder="e.g. Catering, Venue, Decor"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="task-description" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Details & Instructions (Optional)
          </label>
          <textarea
            id="task-description"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Contract reference, checklist notes, contact persons..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-purple-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-xs font-bold text-white gradient-brand hover:opacity-95 shadow-md shadow-brand-500/20 transition active:scale-95"
          >
            {initialData ? 'Update Task' : 'Add Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

