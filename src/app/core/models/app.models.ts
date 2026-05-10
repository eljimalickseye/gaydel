export type UserRole = 'SUPER_ADMIN' | 'STOCK_MANAGER' | 'SALES_AGENT' | 'SELLER';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  phoneNumber?: string;
  createdAt: any;
  lastLogin?: any;
  status: 'active' | 'inactive' | 'pending';
}

export interface Stock {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  warehouseId: string;
  lastUpdated: any;
  minThreshold: number;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  managerId: string;
}

export interface Sale {
  id: string;
  sellerId: string;
  items: SaleItem[];
  totalAmount: number;
  timestamp: any;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Prospect {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  assignedTo: string;
  notes: string[];
  location?: {
    latitude: number;
    longitude: number;
  };
  createdAt: any;
}

export interface UserLocation {
  userId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: any;
  isActive: boolean;
}

export interface QRCodeData {
  userId: string;
  token: string;
  expiresAt?: any;
}
