export interface UsersType {
  id: string;
  name: string | null;
  email: string | null;
  phone: string;
  picture: string | null;
  bids: Array<{
    id: string;
    amount: number;
  }>;
  createdAt: string; // ISO string format
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

export interface Bids {
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
  phone: string;
  auctionId: string;
  startedAt: string;   // ISO timestamp (you can convert to Date if needed)
  endedAt: string;     // ISO timestamp
  status: 'completed' | 'missed' | string; // add more literal types if known
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    picture: string | null;
    email: string | null;
  };
}

export interface DashboardStats {
  totalUsers: number;
  totalAuctions: number;
  activeAuctions: number;
  totalBids: number;
  totalCallLogs: number;
  recentActivity: string[];
}