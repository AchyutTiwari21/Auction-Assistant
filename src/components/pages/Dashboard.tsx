import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardStats } from '@/data/mockData';
import { Users, Gavel, DollarSign, Phone, TrendingUp, Activity } from 'lucide-react';
import { format } from 'date-fns';
import service from '@/backend-api/configuration';
import { useEffect, useState } from 'react';
import { Bid, Auction } from '@/types';

export function Dashboard() {

  const [bids, setBids] = useState<Bid[]>([]);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard data from the backend API
    const fetchDashboardData = async () => {
      try {
        const response = await service.getAllBids();
        setBids(response);

        const auctionsResponse = await service.getAuctions();
        setAuctions(auctionsResponse);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const recentBids = bids.slice(0, 5);

  const activeAuctions = auctions.filter(a => {
    const now = new Date();
    const startTime = new Date(a.startTime);
    const endTime = new Date(a.endTime);
    return now >= startTime && now <= endTime;
  });

  return loading ? (
    <div>Loading...</div>
  ) : (
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
            <div className="text-2xl font-bold">{dashboardStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Auctions</CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalAuctions}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.activeAuctions} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bids</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalBids}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Call Logs</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalCallLogs}</div>
            <p className="text-xs text-muted-foreground">
              3 ongoing calls
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
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
                      ${auction.currentBid.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardStats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{activity}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

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
  );
}