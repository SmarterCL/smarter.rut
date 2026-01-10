// shared/types/index.ts

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName1: string;
  type: string;
  paymentStatus: string;
  expirationDate: string;
  rut?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName1: string;
  rut?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  // Add other profile fields as needed
}

export interface AuthResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface PaymentInfo {
  id: string;
  accountId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  dateCreated: string;
  dateUpdated: string;
}

export interface Subscription {
  id: string;
  userId: string;
  type: 'free' | 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'inactive' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}