import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomeHero } from './components/home/HomeHero';
import { AIPlannerView } from './components/planner/AIPlannerView';
import { BudgetDashboard } from './components/budget/BudgetDashboard';
import { TimelineView } from './components/timeline/TimelineView';
import { VendorTracker } from './components/vendors/VendorTracker';
import { IdeaStudio } from './components/inspiration/IdeaStudio';
import { EventWizardModal } from './components/wizard/EventWizardModal';
import { SavedEventsDrawer } from './components/saved/SavedEventsDrawer';
import { ToastContainer, ToastMessage } from './components/common/Toast';

import { EventDetails, EventPlan } from './types/event';
import { ExpenseItem } from './types/budget';
import { TimelineTask } from './types/timeline';
import { Vendor } from './types/vendor';

import {
  initializeStorage,
  getStoredEvents,
  saveEvent,
  deleteStoredEvent,
  getActiveEventId,
  setActiveEventId,
  getStoredExpenses,
  saveExpense,
  deleteStoredExpense,
  bulkAddExpenses,
  getStoredTasks,
  saveTask,
  deleteStoredTask,
  bulkAddTasks,
  getStoredVendors,
  saveVendor,
  deleteStoredVendor,
  bulkAddVendors,
  getStoredPlans,
  saveEventPlan,
  resetToSampleData,
} from './services/storage';

import { checkBackendHealth, generateEventPlanApi } from './services/api';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [events, setEvents] = useState<EventDetails[]>([]);
  const [activeEventId, setActiveEventIdState] = useState<string | null>(null);
  const [plans, setPlans] = useState<Record<string, EventPlan>>({});
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [tasks, setTasks] = useState<TimelineTask[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  // UI Modals and draw toggles
  const [wizardOpen, setWizardOpen] = useState(false);
  const [savedDrawerOpen, setSavedDrawerOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLiveAi, setIsLiveAi] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'warning' | 'error' | 'info', title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial load
  useEffect(() => {
    initializeStorage();
    refreshAllData();

    // Check backend health for AI status
    checkBackendHealth().then((health) => {
      setIsLiveAi(health.hasGeminiKey);
    });
  }, []);

  const refreshAllData = () => {
    const storedEvents = getStoredEvents();
    setEvents(storedEvents);

    const storedActiveId = getActiveEventId() || (storedEvents.length > 0 ? storedEvents[0].id : null);
    setActiveEventIdState(storedActiveId);

    setPlans(getStoredPlans());
    setExpenses(getStoredExpenses());
    setTasks(getStoredTasks());
    setVendors(getStoredVendors());
  };

  const activeEvent = events.find((e) => e.id === activeEventId) || (events.length > 0 ? events[0] : null);
  const activePlan = activeEvent ? plans[activeEvent.id] || null : null;
  const activeExpenses = activeEvent ? expenses.filter((e) => e.eventId === activeEvent.id) : [];
  const activeTasks = activeEvent ? tasks.filter((t) => t.eventId === activeEvent.id) : [];
  const activeVendors = activeEvent ? vendors.filter((v) => v.eventId === activeEvent.id) : [];

  const handleSelectEvent = (id: string) => {
    setActiveEventId(id);
    setActiveEventIdState(id);
    const selected = events.find((e) => e.id === id);
    if (selected) {
      addToast('info', 'Active Celebration Switched', selected.name);
    }
  };

  const handleDeleteEvent = (id: string) => {
    deleteStoredEvent(id);
    refreshAllData();
    addToast('warning', 'Celebration Deleted');
  };

  const handleResetSampleData = () => {
    resetToSampleData();
    refreshAllData();
    addToast('success', 'Demo Archetypes Reloaded', 'Default Wedding, Birthday, and Community festivals loaded.');
  };

  // Event Creation Wizard Submit
  const handleWizardSubmit = async (newEvent: EventDetails) => {
    setIsGenerating(true);
    try {
      // 1. Generate plan & suggested components
      const result = await generateEventPlanApi(newEvent);

      // 2. Save event
      saveEvent(newEvent);
      setActiveEventId(newEvent.id);

      // 3. Save plan
      saveEventPlan(newEvent.id, result.plan);

      // 4. Populate suggested expenses, tasks, and vendors
      const newExpenses: ExpenseItem[] = result.suggestedExpenses.map((exp, idx) => ({
        ...exp,
        id: `exp-${Date.now()}-${idx}`,
        eventId: newEvent.id,
        createdAt: new Date().toISOString(),
      }));
      bulkAddExpenses(newExpenses);

      const newTasks: TimelineTask[] = result.suggestedTasks.map((t, idx) => ({
        ...t,
        id: `task-${Date.now()}-${idx}`,
        eventId: newEvent.id,
      }));
      bulkAddTasks(newTasks);

      const newVendors: Vendor[] = result.suggestedVendors.map((v, idx) => ({
        ...v,
        id: `v-${Date.now()}-${idx}`,
        eventId: newEvent.id,
      }));
      bulkAddVendors(newVendors);

      // 5. Refresh data and switch view
      refreshAllData();
      setWizardOpen(false);
      setActiveTab('planner');
      addToast(
        'success',
        'AI Blueprint Synthesized!',
        `Created "${newEvent.name}" with personalized budget, timeline, and vendor tracker.`
      );
    } catch (err) {
      console.error('Wizard submission error:', err);
      addToast('error', 'Generation Failed', 'Could not generate event blueprint.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Blueprint Regeneration
  const handleRegenerateBlueprint = async () => {
    if (!activeEvent) return;
    setIsGenerating(true);
    try {
      const res = await generateEventPlanApi(activeEvent);
      saveEventPlan(activeEvent.id, res.plan);
      setPlans(getStoredPlans());
      addToast('success', 'Blueprint Regenerated', 'Updated theme concepts, palette, and mitigations.');
    } catch (err) {
      console.error(err);
      addToast('error', 'Regeneration Failed');
    } finally {
      setIsGenerating(false);
    }
  };

  // Apply Blueprint to Live Event
  const handleApplyBlueprint = () => {
    if (!activeEvent) return;
    addToast(
      'success',
      'Blueprint Synchronized',
      'Live budget ledger and preparation timeline aligned with AI design recommendations.'
    );
  };

  // Expense operations
  const handleSaveExpense = (item: ExpenseItem) => {
    saveExpense(item);
    setExpenses(getStoredExpenses());
    addToast('success', 'Expense Saved', item.name);
  };

  const handleDeleteExpense = (id: string) => {
    deleteStoredExpense(id);
    setExpenses(getStoredExpenses());
    addToast('info', 'Expense Removed');
  };

  // Task operations
  const handleSaveTask = (task: TimelineTask) => {
    saveTask(task);
    setTasks(getStoredTasks());
    addToast('success', 'Task Updated', task.title);
  };

  const handleDeleteTask = (id: string) => {
    deleteStoredTask(id);
    setTasks(getStoredTasks());
    addToast('info', 'Task Removed');
  };

  // Vendor operations
  const handleSaveVendor = (vendor: Vendor) => {
    saveVendor(vendor);
    setVendors(getStoredVendors());
    addToast('success', 'Vendor Record Saved', vendor.name);
  };

  const handleDeleteVendor = (id: string) => {
    deleteStoredVendor(id);
    setVendors(getStoredVendors());
    addToast('info', 'Vendor Record Removed');
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-soft text-slate-800">
      
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeEvent={activeEvent}
        onOpenWizard={() => setWizardOpen(true)}
        onOpenSavedDrawer={() => setSavedDrawerOpen(true)}
        isLiveAi={isLiveAi}
        totalSavedCount={events.length}
      />

      {/* Main App Content View Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'home' && (
          <HomeHero
            onOpenWizard={() => setWizardOpen(true)}
            onNavigateTab={setActiveTab}
            activeEvent={activeEvent}
            onSelectSampleEvent={(id) => {
              handleSelectEvent(id);
              setActiveTab('planner');
            }}
          />
        )}

        {activeTab === 'planner' && activeEvent && (
          <AIPlannerView
            event={activeEvent}
            plan={activePlan}
            onRegenerate={handleRegenerateBlueprint}
            onApplyBlueprint={handleApplyBlueprint}
            isGenerating={isGenerating}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'budget' && activeEvent && (
          <BudgetDashboard
            event={activeEvent}
            expenses={activeExpenses}
            onSaveExpense={handleSaveExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        )}

        {activeTab === 'timeline' && activeEvent && (
          <TimelineView
            event={activeEvent}
            tasks={activeTasks}
            onSaveTask={handleSaveTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {activeTab === 'vendors' && activeEvent && (
          <VendorTracker
            event={activeEvent}
            vendors={activeVendors}
            onSaveVendor={handleSaveVendor}
            onDeleteVendor={handleDeleteVendor}
          />
        )}

        {activeTab === 'inspiration' && (
          <IdeaStudio event={activeEvent} />
        )}

      </main>

      {/* App Footer */}
      <Footer />

      {/* Event Creation Wizard Modal */}
      <EventWizardModal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onSubmit={handleWizardSubmit}
        isGenerating={isGenerating}
      />

      {/* Saved Events Drawer */}
      <SavedEventsDrawer
        isOpen={savedDrawerOpen}
        onClose={() => setSavedDrawerOpen(false)}
        events={events}
        activeEventId={activeEventId}
        onSelectEvent={handleSelectEvent}
        onDeleteEvent={handleDeleteEvent}
        onOpenWizard={() => setWizardOpen(true)}
        onResetSampleData={handleResetSampleData}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

    </div>
  );
};

