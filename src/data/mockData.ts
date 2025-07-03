import { User, Auction, Bid, CallLog, DashboardStats } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    totalBids: 15,
    registeredAt: new Date('2024-01-15'),
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 234-5678',
    totalBids: 23,
    registeredAt: new Date('2024-02-10'),
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    phone: '+1 (555) 345-6789',
    totalBids: 8,
    registeredAt: new Date('2024-03-05'),
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    phone: '+1 (555) 456-7890',
    totalBids: 31,
    registeredAt: new Date('2024-01-20'),
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.brown@example.com',
    phone: '+1 (555) 567-8901',
    totalBids: 12,
    registeredAt: new Date('2024-02-28'),
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
];

export const mockAuctions: Auction[] = [
  {
    id: '1',
    title: 'Vintage Rolex Submariner',
    description: 'Rare 1960s Rolex Submariner in excellent condition. Original papers and box included.',
    startDate: new Date('2024-12-01'),
    endDate: new Date('2024-12-31'),
    currentBid: 15000,
    minBid: 10000,
    status: 'active',
    image: 'https://images.pexels.com/photos/125779/pexels-photo-125779.jpeg?auto=compress&cs=tinysrgb&w=400',
    bidsCount: 23
  },
  {
    id: '2',
    title: 'Antique Persian Rug',
    description: 'Beautiful hand-woven Persian rug from the 19th century. Museum quality piece.',
    startDate: new Date('2024-11-15'),
    endDate: new Date('2024-12-15'),
    currentBid: 8500,
    minBid: 5000,
    status: 'active',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
    bidsCount: 18
  },
  {
    id: '3',
    title: 'Classic 1967 Mustang',
    description: 'Fully restored Ford Mustang Fastback. Numbers matching, pristine condition.',
    startDate: new Date('2024-10-01'),
    endDate: new Date('2024-11-30'),
    currentBid: 45000,
    minBid: 35000,
    status: 'completed',
    image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=400',
    bidsCount: 42
  },
  {
    id: '4',
    title: 'Original Picasso Sketch',
    description: 'Authenticated Pablo Picasso pencil sketch from his Blue Period.',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-01-31'),
    currentBid: 0,
    minBid: 25000,
    status: 'upcoming',
    image: 'https://images.pexels.com/photos/1539581/pexels-photo-1539581.jpeg?auto=compress&cs=tinysrgb&w=400',
    bidsCount: 0
  },
  {
    id: '5',
    title: 'Diamond Tennis Bracelet',
    description: 'Stunning 18K white gold tennis bracelet with 5 carats of VS1 diamonds.',
    startDate: new Date('2024-12-10'),
    endDate: new Date('2024-12-25'),
    currentBid: 12000,
    minBid: 8000,
    status: 'active',
    image: 'https://images.pexels.com/photos/1927258/pexels-photo-1927258.jpeg?auto=compress&cs=tinysrgb&w=400',
    bidsCount: 15
  }
];

export const mockBids: Bid[] = [
  {
    id: '1',
    auctionId: '1',
    userId: '1',
    amount: 15000,
    timestamp: new Date('2024-12-20T10:30:00'),
    user: mockUsers[0],
    auction: mockAuctions[0]
  },
  {
    id: '2',
    auctionId: '1',
    userId: '2',
    amount: 14500,
    timestamp: new Date('2024-12-20T09:15:00'),
    user: mockUsers[1],
    auction: mockAuctions[0]
  },
  {
    id: '3',
    auctionId: '2',
    userId: '3',
    amount: 8500,
    timestamp: new Date('2024-12-19T16:45:00'),
    user: mockUsers[2],
    auction: mockAuctions[1]
  },
  {
    id: '4',
    auctionId: '2',
    userId: '4',
    amount: 8000,
    timestamp: new Date('2024-12-19T14:20:00'),
    user: mockUsers[3],
    auction: mockAuctions[1]
  },
  {
    id: '5',
    auctionId: '5',
    userId: '5',
    amount: 12000,
    timestamp: new Date('2024-12-18T11:30:00'),
    user: mockUsers[4],
    auction: mockAuctions[4]
  }
];

export const mockCallLogs: CallLog[] = [
  {
    id: '1',
    userId: '1',
    user: mockUsers[0],
    startedAt: new Date('2024-12-20T14:30:00'),
    endedAt: new Date('2024-12-20T14:45:00'),
    duration: 15,
    status: 'answered',
    phoneNumber: '+1 (555) 123-4567'
  },
  {
    id: '2',
    userId: '2',
    user: mockUsers[1],
    startedAt: new Date('2024-12-20T12:15:00'),
    endedAt: undefined,
    duration: undefined,
    status: 'missed',
    phoneNumber: '+1 (555) 234-5678'
  },
  {
    id: '3',
    userId: '3',
    user: mockUsers[2],
    startedAt: new Date('2024-12-20T09:45:00'),
    endedAt: new Date('2024-12-20T10:12:00'),
    duration: 27,
    status: 'answered',
    phoneNumber: '+1 (555) 345-6789'
  },
  {
    id: '4',
    userId: '4',
    user: mockUsers[3],
    startedAt: new Date('2024-12-19T16:20:00'),
    endedAt: undefined,
    duration: undefined,
    status: 'busy',
    phoneNumber: '+1 (555) 456-7890'
  },
  {
    id: '5',
    userId: '5',
    user: mockUsers[4],
    startedAt: new Date('2024-12-20T15:00:00'),
    endedAt: undefined,
    duration: undefined,
    status: 'ongoing',
    phoneNumber: '+1 (555) 567-8901'
  }
];

export const dashboardStats: DashboardStats = {
  totalUsers: mockUsers.length,
  totalAuctions: mockAuctions.length,
  activeAuctions: mockAuctions.filter(a => a.status === 'active').length,
  totalBids: mockBids.length,
  totalCallLogs: mockCallLogs.length,
  recentActivity: [
    'New bid placed on Vintage Rolex Submariner',
    'User John Doe registered',
    'Auction ended: Classic 1967 Mustang',
    'Call answered from Jane Smith',
    'New auction created: Diamond Tennis Bracelet'
  ]
};