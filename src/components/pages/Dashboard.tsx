import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Gavel, DollarSign, Phone, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { RootState } from '@/app/store';
import { Bids, Auction, UsersType, CallLog } from '@/types';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import service from '@/services/configuration';
import { setAuctions, setBids, setCallLogs, setUsers } from '@/app/features';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export function Dashboard() {
  const users: UsersType[] | null = useSelector((state: RootState) => state.users.users);
  const auctions: Auction[] | null = useSelector((state: RootState) => state.auctions.auctions);
  const bids: Bids[] | null = useSelector((state: RootState) => state.bids.bids);
  const callLogs: CallLog[] | null = useSelector((state: RootState) => state.callLogs.callLogs);

  const dispatch = useDispatch();

  NProgress.configure({showSpinner: false});

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   console.log("Token", token);

  //   window.omnidimension?.setUserContext({
  //     jwt: token,
  //   });
  // }, []);

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
  }, [dispatch]);

  const recentBids = bids.slice(0, 5);

  const activeAuctions = auctions.filter(a => {
    const now = new Date();
    const startTime = new Date(a.startTime);
    const endTime = new Date(a.endTime);
    return now >= startTime && now <= endTime;
  });

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
      
    </div>
  );
}