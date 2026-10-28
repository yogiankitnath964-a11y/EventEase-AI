import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  Globe, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  DollarSign,
  Tag,
  Info
} from 'lucide-react';
import { BookingStatus, Vendor, VendorCategory } from '../../types/vendor';
import { CurrencyCode, EventDetails } from '../../types/event';
import { formatCurrency } from '../../utils/formatters';
import { VENDOR_CATEGORY_LABELS, VendorModal } from './VendorModal';

interface VendorTrackerProps {
  event: EventDetails;
  vendors: Vendor[];
  onSaveVendor: (vendor: Vendor) => void;
  onDeleteVendor: (id: string) => void;
}

export const VendorTracker: React.FC<VendorTrackerProps> = ({
  event,
  vendors,
  onSaveVendor,
  onDeleteVendor,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const totalVendors = vendors.length;
  const bookedCount = vendors.filter((v) => v.bookingStatus === 'booked').length;
  const quotedCount = vendors.filter((v) => v.bookingStatus === 'quoted').length;
  const totalCommitted = vendors.reduce((acc, v) => acc + (v.actualCost || v.estimatedCost || 0), 0);

  const filtered = vendors.filter((v) => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.contactPerson && v.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (v.notes && v.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || v.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || v.bookingStatus === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingVendor(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (v: Vendor) => {
    setEditingVendor(v);
    setModalOpen(true);
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'booked':
        return (
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Booked & Confirmed
          </span>
        );
      case 'quoted':
        return (
          <span className="text-[11px] font-bold text-brand-800 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
            Quoted
          </span>
        );
      case 'shortlisted':
        return (
          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            Shortlisted
          </span>
        );
      case 'inquiry':
        return (
          <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            Initial Inquiry
          </span>
        );
      case 'completed':
        return (
          <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
            Service Completed
          </span>
        );
      case 'declined':
      default:
        return (
          <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            Declined
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner & Metrics */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-soft-purple space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
              Procurement & Vendor Coordination
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Vendor Directory Tracker
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Centralized contact sheet, quotes, contracts, and payment statuses for "{event.name}"
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white gradient-brand hover:opacity-95 shadow-md shadow-brand-500/20 transition active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vendor Record</span>
          </button>
        </div>

        {/* Quick KPI row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100">
            <span className="text-[10px] font-bold uppercase text-slate-400">Total Partners</span>
            <div className="text-lg font-black text-slate-900">{totalVendors}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100">
            <span className="text-[10px] font-bold uppercase text-slate-400">Booked & Locked</span>
            <div className="text-lg font-black text-emerald-700">{bookedCount}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100">
            <span className="text-[10px] font-bold uppercase text-slate-400">Under Review / Quoted</span>
            <div className="text-lg font-black text-brand-800">{quotedCount}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100">
            <span className="text-[10px] font-bold uppercase text-slate-400">Committed Value</span>
            <div className="text-lg font-black text-slate-900">
              {formatCurrency(totalCommitted, event.currency)}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-purple-50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search vendor name, contact, notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter vendors by category"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="all">All Service Categories</option>
              {(Object.keys(VENDOR_CATEGORY_LABELS) as VendorCategory[]).map((cat) => (
                <option key={cat} value={cat}>
                  {VENDOR_CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label="Filter vendors by booking status"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="all">All Booking Statuses</option>
              <option value="inquiry">Inquiry</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="quoted">Quoted</option>
              <option value="booked">Booked</option>
              <option value="completed">Completed</option>
              <option value="declined">Declined</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transparency Note */}
      <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200/60 flex items-center gap-2.5 text-xs text-slate-500">
        <Info className="w-4 h-4 text-brand-600 shrink-0" />
        <span>
          Illustrative vendor profiles generated by AI or preloaded templates are tagged with "Sample Profile". Real vendor relationships, quotes, and contract terms can be entered and modified directly by you.
        </span>
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((vendor) => (
          <div
            key={vendor.id}
            className="p-6 rounded-3xl bg-white border border-purple-100 shadow-soft-purple hover:border-purple-300 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header with Title & Status */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold text-brand-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {VENDOR_CATEGORY_LABELS[vendor.category] || vendor.category}
                    </span>
                    {vendor.isSample && (
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        Sample Profile
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1.5">
                    {vendor.name}
                  </h3>
                  {vendor.contactPerson && (
                    <p className="text-xs text-slate-500">Contact: {vendor.contactPerson}</p>
                  )}
                </div>

                <div className="shrink-0">{getStatusBadge(vendor.bookingStatus)}</div>
              </div>

              {/* Financial snapshot */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-surface-lavender/50 border border-purple-100 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Estimated / Quoted
                  </span>
                  <span className="font-semibold text-slate-800">
                    {formatCurrency(vendor.estimatedCost, event.currency)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Contracted / Actual
                  </span>
                  <span className="font-bold text-brand-900">
                    {vendor.actualCost > 0
                      ? formatCurrency(vendor.actualCost, event.currency)
                      : 'Pending contract'}
                  </span>
                </div>
              </div>

              {/* Contact Links */}
              <div className="space-y-1.5 text-xs text-slate-600">
                {vendor.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                    <a
                      href={`mailto:${vendor.email}`}
                      className="hover:text-brand-700 underline truncate"
                    >
                      {vendor.email}
                    </a>
                  </div>
                )}
                {vendor.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                    <a
                      href={`tel:${vendor.phone}`}
                      className="hover:text-brand-700 underline"
                    >
                      {vendor.phone}
                    </a>
                  </div>
                )}
              </div>

              {vendor.notes && (
                <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                  "{vendor.notes}"
                </p>
              )}
            </div>

            {/* Actions Footer */}
            <div className="pt-3 border-t border-purple-50 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                Payment: <strong className="text-slate-700 capitalize">{vendor.paymentStatus.replace('_', ' ')}</strong>
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(vendor)}
                  aria-label={`Edit ${vendor.name}`}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-brand-700 hover:bg-purple-50 transition"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteVendor(vendor.id)}
                  aria-label={`Delete ${vendor.name}`}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full p-12 text-center bg-white rounded-3xl border border-purple-100 space-y-3">
            <HeartHandshake className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No matching vendor records found</h4>
            <p className="text-xs text-slate-400">
              Adjust your filters or add a new vendor partner to track their quotes and contracts.
            </p>
          </div>
        )}
      </div>

      {/* Vendor Modal */}
      <VendorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={onSaveVendor}
        eventId={event.id}
        currency={event.currency}
        initialData={editingVendor}
      />

    </div>
  );
};

