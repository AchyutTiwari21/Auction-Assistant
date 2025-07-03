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
import { mockBids } from '@/data/mockData';
import { format } from 'date-fns';
import { DollarSign, TrendingUp, Clock } from 'lucide-react';

export function Bids() {
  const sortedBids = mockBids.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  const totalBidValue = mockBids.reduce((sum, bid) => sum + bid.amount, 0);
  const averageBid = totalBidValue / mockBids.length;

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
            <div className="text-2xl font-bold">{mockBids.length}</div>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bidder</TableHead>
                <TableHead>Auction</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedBids.map((bid) => (
                <TableRow key={bid.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={bid.user.avatar}
                        alt={bid.user.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{bid.user.name}</p>
                        <p className="text-sm text-muted-foreground">{bid.user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={bid.auction.image}
                        alt={bid.auction.title}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{bid.auction.title}</p>
                        <Badge variant="outline" className="text-xs">
                          {bid.auction.status}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-green-600">
                    ${bid.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{format(bid.timestamp, 'MMM dd, yyyy')}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(bid.timestamp, 'HH:mm:ss')}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={bid.amount === bid.auction.currentBid ? 'default' : 'secondary'}
                    >
                      {bid.amount === bid.auction.currentBid ? 'Winning' : 'Outbid'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}