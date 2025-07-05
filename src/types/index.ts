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
  productId: string;
  startTime: string;
  endTime: string;
  currentBidId: string;
  createdAt: string;
  updatedAt: string;
  product: {
    name: string;
    description: string;
    imageUrl: string | null;
  };
  currentBid: {
    id: string;
    amount: number;
    userId: string;
    auctionId: string;
    createdAt: string;
  };
  bids: Array<{
    id: string;
    amount: number;
    createdAt: string;
    user: {
      id: string;
      name: string | null;
      picture: string | null;
    };
  }>;
}

export interface AuctionDetails {
  id: string;
  startTime: string;
  endTime: string;
  product: {
    name: string | null;
    imageUrl: string | null;
  };
  currentBid: {
    amount: number;
  }
};

export interface Bid {
  id: string;
  amount: number;
  userId: string;
  auctionId: string;
  createdAt: string; // ISO string format
  user: {
    id: string;
    name: string | null;
    phone: string;
    email: string | null;
    picture: string | null;
  };
  product: {
    name: string | null;
    imageUrl: string | null;
  };
  auction: AuctionDetails;
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