import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { DollarSign, TrendingUp, Clock } from 'lucide-react';
import type { Bids, AuctionDetails } from '@/types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store';
import { useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import service from '@/services/configuration';
import { setBids } from '@/app/features';

export function Bids() {
  const bids: Bids[] = useSelector((state: RootState) => state.bids.bids);

  const dispatch = useDispatch();

  useEffect(() => {
    NProgress.configure({showSpinner: false});
    // Fetch dashboard data from the backend API
    const fetchBidData = async () => {
      NProgress.start();
      try {
        const bidResponse = await service.getAllBids();
        if(bidResponse) {
          dispatch(setBids(bidResponse));
        } else {
          throw new Error("No bids found");
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        NProgress.done();
      }
    };

    fetchBidData();
  }, [dispatch]);

  const totalBidValue = bids.reduce((sum, bid) => sum + bid.amount, 0);
  const averageBid = totalBidValue / bids.length;

  function getStatusBadge(auction: AuctionDetails) {
    const now = new Date();
    const startTime = new Date(auction.startTime);
    const endTime = new Date(auction.endTime);

    if (now < startTime) return <Badge variant="outline">Upcoming</Badge>;
    if (now >= startTime && now <= endTime) return <Badge variant="default">Active</Badge>;
    return <Badge variant="secondary">Completed</Badge>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Bids</h2>
        <p className="text-muted-foreground">
          Monitor all bidding activity across auctions
        </p>
      </div>

      {/* Bid Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bid Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBidValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all auctions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Bid</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Math.round(averageBid).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Per bid placed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bids.length}</div>
            <p className="text-xs text-muted-foreground">
              Total bids placed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bids Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Bids</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow>
                <TableHead>Bidder</TableHead>
                <TableHead>Auction</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden sm:table-cell">Date & Time</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bids.map((bid) => (
                <TableRow key={bid.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={bid?.user?.picture || '/placeholder.svg'}
                        alt={bid?.user?.name || 'User Avatar'}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
                      />
                      <div>
                        <p className="font-medium max-w-[100px] truncate sm:max-w-xs">{bid?.user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[100px] sm:max-w-xs">{bid?.user?.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={bid?.auction?.product?.imageUrl || '/placeholder.svg'}
                        alt={bid?.auction?.product?.name || 'Auction Product'}
                        className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium max-w-[100px] truncate sm:max-w-xs">{bid?.auction?.product?.name || 'Unknown Product'}</p>
                        <span className="hidden sm:inline">{getStatusBadge(bid?.auction)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-green-600">
                    ${bid?.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div>
                      <p className="text-xs">{format(bid?.createdAt, 'MMM dd, yyyy')}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {format(bid?.createdAt, 'HH:mm:ss')}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge
                      variant={bid?.amount === bid?.auction?.currentBid?.amount ? 'default' : 'secondary'}
                    >
                      {bid?.amount === bid?.auction?.currentBid?.amount ? 'Winning' : 'Outbid'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}