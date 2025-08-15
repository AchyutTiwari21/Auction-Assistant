import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Gavel, DollarSign, Phone, TrendingUp, Award, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { RootState } from '@/app/store';
import { Bids, Auction, UsersType, CallLog } from '@/types';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import service from '@/services/configuration';
import bidService from '@/services/bidService';
import { setAuctions, setBids, setCallLogs, setUsers } from '@/app/features';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

interface UserBid {
  id: string;
  amount: number;
  createdAt: string;
  auction: {
    id: string;
    endTime: string;
    product: {
      name: string;
      imageUrl: string | null;
    };
    currentBid: {
      id: string
    }
  };
  isWinning: boolean
}

export function Dashboard() {
  const users: UsersType[] | null = useSelector((state: RootState) => state.users.users);
  const auctions: Auction[] | null = useSelector((state: RootState) => state.auctions.auctions);
  const bids: Bids[] | null = useSelector((state: RootState) => state.bids.bids);
  const callLogs: CallLog[] | null = useSelector((state: RootState) => state.callLogs.callLogs);

  const [winningBids, setWinningBids] = useState<UserBid[]>([]);
  const [isLoadingWinningBids, setIsLoadingWinningBids] = useState(false);

  const dispatch = useDispatch();

  NProgress.configure({showSpinner: false});

  const fetchWinningBids = async () => {
    setIsLoadingWinningBids(true);
    try {
      const bids = await bidService.getWinningBids();
      setWinningBids(bids);
    } catch (error) {
      console.error('Error fetching winning bids:', error);
    } finally {
      setIsLoadingWinningBids(false);
    }
  };

  useEffect(() => {
    // Fetch dashboard data from the backend API
    const fetchDashboardData = async () => {
      NProgress.start();
      try {
        const usersResponse = await service.getAllUsers();
        if(usersResponse) {
          dispatch(setUsers(usersResponse));
        } else {
          throw new Error('No users found!');
        }

        const auctionsResponse = await service.getAuctions();
        if(auctionsResponse) {   
          dispatch(setAuctions(auctionsResponse));
        } else {
          throw new Error('No auctions found');
        }

        const bidResponse = await service.getAllBids();
        if(bidResponse) {
          dispatch(setBids(bidResponse));
        } else {
          throw new Error("No bids found");
        }

        const callLogs = await service.getCallLogs();
        if(callLogs) {
          dispatch(setCallLogs(callLogs));
        } else {
          throw new Error("No Call logs found!");
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        NProgress.done();
      }
    };

    fetchDashboardData();
    fetchWinningBids();
  }, [dispatch]);

  const recentBids = bids.slice(0, 5);

  const activeAuctions = auctions.filter(a => {
    const now = new Date();
    const startTime = new Date(a.startTime);
    const endTime = new Date(a.endTime);
    return now >= startTime && now <= endTime;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to your auction management dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Auctions</CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auctions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bids</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bids.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Call Logs</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{callLogs.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className='grid md:grid-cols-2 gap-6'>

      <div>
        {/* Active Auctions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Active Auctions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeAuctions.map((auction) => (
                <div key={auction.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{auction?.product?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Ends {format(auction.endTime, 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">
                      ${auction?.currentBid?.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
      {/* Recent Bids */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bids</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBids.map((bid) => (
              <div key={bid.id} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{bid.user.name}</p>
                    <p className="text-xs text-muted-foreground">{bid.auction.product.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">${bid.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(bid.createdAt, 'MMM dd, HH:mm')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>

      </div>

      <div>
        {/* Winning Bids Section */}
      {winningBids.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Award className="h-5 w-5" />
              Winning Bids - Payment Required
            </CardTitle>
            <CardDescription className="text-green-700">
              Congratulations! You have winning bids that require payment
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingWinningBids ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span className="ml-2">Loading winning bids...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {winningBids.map((bid) => (
                  <div
                    key={bid.id}
                    className="flex items-center justify-between p-4 border border-green-200 rounded-lg bg-white"
                  >
                    <div className="flex items-center space-x-3">
                      {bid.auction.product.imageUrl && (
                        <img
                          src={bid.auction.product.imageUrl}
                          alt={bid.auction.product.name}
                          className="h-12 w-12 rounded object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-green-900">{bid.auction.product.name}</p>
                        <p className="text-sm text-green-700">
                          Winning Bid: {formatCurrency(bid.amount)}
                        </p>
                        <p className="text-sm text-green-600">
                          Won on: {formatDate(bid.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default" className="bg-green-600">
                        <Award className="h-3 w-3 mr-1" />
                        Winner
                      </Badge>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pay Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
      </div>
      
    </div>
  );
}