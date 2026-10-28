import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { BookingStatus, Vendor, VendorCategory, VendorPaymentStatus } from '../../types/vendor';
import { CurrencyCode } from '../../types/event';
import { CURRENCY_SYMBOLS } from '../../utils/formatters';

interface VendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vendor: Vendor) => void;
  eventId: string;
  currency: CurrencyCode;
  initialData?: Vendor | null;
}

export const VENDOR_CATEGORY_LABELS: Record<VendorCategory, string> = {
  venue: 'Venue & Banquet Hall',
  catering: 'Catering & Beverages',
  decor_florals: 'Decor & Florals',
  photography_videography: 'Photography & Videography',
  music_dj_entertainment: 'Music, DJ & Entertainment',
  planner_coordinator: 'Event Planner & Day-Of Coordinator',
  hair_makeup_attire: 'Attire, Hair & Makeup Styling',
  cake_dessert: 'Cake & Artisanal Bakery',
  rentals_lighting: 'Rentals, Audio & Lighting',
  stationery_invites: 'Stationery & Invitations',
  other: 'Other Services',
};

export const VendorModal: React.FC<VendorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  eventId,
  currency,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<VendorCategory>('catering');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [estimatedCost, setEstimatedCost] = useState<number>(0);
  const [actualCost, setActualCost] = useState<number>(0);
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>('inquiry');
  const [paymentStatus, setPaymentStatus] = useState<VendorPaymentStatus>('pending');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCategory(initialData.category);
      setContactPerson(initialData.contactPerson || '');
      setEmail(initialData.email || '');
      setPhone(initialData.phone || '');
      setWebsite(initialData.website || '');
      setEstimatedCost(initialData.estimatedCost);
      setActualCost(initialData.actualCost);
      setBookingStatus(initialData.bookingStatus);
      setPaymentStatus(initialData.paymentStatus);
      setNotes(initialData.notes || '');
    } else {
      setName('');
      setCategory('catering');
      setContactPerson('');
      setEmail('');
      setPhone('');
      setWebsite('');
      setEstimatedCost(0);
      setActualCost(0);
      setBookingStatus('inquiry');
      setPaymentStatus('pending');
      setNotes('');
    }
    setError('');
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Vendor company or service name is required.');
      return;
    }

    const item: Vendor = {
      id: initialData?.id || `v-${Date.now()}`,
      eventId,
      name: name.trim(),
      category,
      contactPerson: contactPerson.trim(),
      email: email.trim(),
      phone: phone.trim(),
      website: website.trim(),
      estimatedCost: Number(estimatedCost) || 0,
      actualCost: Number(actualCost) || 0,
      bookingStatus,
      paymentStatus,
      notes: notes.trim(),
      isSample: initialData ? initialData.isSample : false,
    };

    onSave(item);
    onClose();
  };

  const symbol = CURRENCY_SYMBOLS[currency] || '$';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Vendor Record' : 'Add New Vendor'}
      subtitle="Track quotes, contacts, contracts, and booking deliverables"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="vendor-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Vendor / Business Name *
            </label>
            <input
              id="vendor-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Saffron Luxe Catering Co."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label htmlFor="vendor-category" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Service Category *
            </label>
            <select
              id="vendor-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as VendorCategory)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              {(Object.keys(VENDOR_CATEGORY_LABELS) as VendorCategory[]).map((cat) => (
                <option key={cat} value={cat}>
                  {VENDOR_CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor="vendor-contact" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Contact Person
            </label>
            <input
              id="vendor-contact"
              type="text"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="e.g. Chef Meenakshi"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label htmlFor="vendor-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Email Address
            </label>
            <input
              id="vendor-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="events@company.com"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label htmlFor="vendor-phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              id="vendor-phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 012-3456"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label htmlFor="vendor-est-cost" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Quoted ({symbol})
            </label>
            <input
              id="vendor-est-cost"
              type="number"
              min="0"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label htmlFor="vendor-act-cost" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Contracted ({symbol})
            </label>
            <input
              id="vendor-act-cost"
              type="number"
              min="0"
              value={actualCost}
              onChange={(e) => setActualCost(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label htmlFor="vendor-booking-status" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Booking Status
            </label>
            <select
              id="vendor-booking-status"
              value={bookingStatus}
              onChange={(e) => setBookingStatus(e.target.value as BookingStatus)}
              className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="inquiry">Inquiry</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="quoted">Quoted</option>
              <option value="booked">Booked</option>
              <option value="completed">Completed</option>
              <option value="declined">Declined</option>
            </select>
          </div>

          <div>
            <label htmlFor="vendor-payment-status" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Payment Status
            </label>
            <select
              id="vendor-payment-status"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as VendorPaymentStatus)}
              className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="pending">Pending</option>
              <option value="deposit_paid">Deposit Paid</option>
              <option value="paid_in_full">Paid in Full</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="vendor-notes" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Deliverables, Timelines & Agreement Notes
          </label>
          <textarea
            id="vendor-notes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. 50% deposit due on signing, load-in at 8:00 AM, includes 4 staff..."
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
            {initialData ? 'Update Vendor' : 'Save Vendor'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

