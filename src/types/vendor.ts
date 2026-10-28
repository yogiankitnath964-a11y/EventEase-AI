export type VendorCategory = 
  | 'venue' 
  | 'catering' 
  | 'decor_florals' 
  | 'photography_videography' 
  | 'music_dj_entertainment' 
  | 'planner_coordinator' 
  | 'hair_makeup_attire' 
  | 'cake_dessert' 
  | 'rentals_lighting' 
  | 'stationery_invites'
  | 'other';

export type BookingStatus = 'inquiry' | 'shortlisted' | 'quoted' | 'booked' | 'completed' | 'declined';
export type VendorPaymentStatus = 'pending' | 'deposit_paid' | 'paid_in_full';

export interface Vendor {
  id: string;
  eventId: string;
  name: string;
  category: VendorCategory;
  contactPerson?: string;
  email?: string;
  phone?: string;
  website?: string;
  estimatedCost: number;
  actualCost: number;
  bookingStatus: BookingStatus;
  paymentStatus: VendorPaymentStatus;
  notes?: string;
  isSample: boolean; // Transparency: indicates sample illustrative data vs user-entered vendor
}

