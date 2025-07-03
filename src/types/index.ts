export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBids: number;
  registeredAt: Date;
  avatar?: string;
}

export interface Auction {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  currentBid: number;
  minBid: number;
  status: 'active' | 'completed' | 'upcoming';
  image?: string;
  bidsCount: number;
}

export interface Bid {
  id: string;
  auctionId: string;
  userId: string;
  amount: number;
  timestamp: Date;
  user: User;
  auction: Auction;
}

export interface CallLog {
  id: string;
  userId: string;
  user: User;
  startedAt: Date;
  endedAt?: Date;
  duration?: number;
  status: 'answered' | 'missed' | 'busy' | 'ongoing';
  phoneNumber: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalAuctions: number;
  activeAuctions: number;
  totalBids: number;
  totalCallLogs: number;
  recentActivity: string[];
}