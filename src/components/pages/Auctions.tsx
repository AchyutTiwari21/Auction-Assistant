import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { mockAuctions, mockBids } from '@/data/mockData';
import { format } from 'date-fns';
import { Eye, Clock, Users } from 'lucide-react';
import type { Auction } from '@/types';

export function Auctions() {
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      case 'upcoming':
        return <Badge variant="outline">Upcoming</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAuctionBids = (auctionId: string) => {
    return mockBids
      .filter(bid => bid.auctionId === auctionId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Auctions</h2>
        <p className="text-muted-foreground">
          Manage and monitor all auction activities
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Auctions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Current Bid</TableHead>
                <TableHead>Bids</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAuctions.map((auction) => (
                <TableRow key={auction.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={auction.image}
                        alt={auction.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{auction.title}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">
                          {auction.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(auction.status)}</TableCell>
                  <TableCell>{format(auction.startDate, 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{format(auction.endDate, 'MMM dd, yyyy')}</TableCell>
                  <TableCell className="font-medium">
                    ${auction.currentBid.toLocaleString()}
                  </TableCell>
                  <TableCell>{auction.bidsCount}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedAuction(auction)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Auction Detail Dialog */}
      <Dialog open={!!selectedAuction} onOpenChange={() => setSelectedAuction(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedAuction && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedAuction.title}</DialogTitle>
              </DialogHeader>
              
              <div className="grid gap-6 md:grid-cols-2">
                {/* Auction Details */}
                <div className="space-y-4">
                  <img
                    src={selectedAuction.image}
                    alt={selectedAuction.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status:</span>
                      {getStatusBadge(selectedAuction.status)}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Current Bid:</span>
                      <span className="text-lg font-bold text-green-600">
                        ${selectedAuction.currentBid.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Minimum Bid:</span>
                      <span>${selectedAuction.minBid.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Ends {format(selectedAuction.endDate, 'MMM dd, yyyy HH:mm')}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {selectedAuction.bidsCount} bids
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedAuction.description}
                    </p>
                  </div>
                </div>

                {/* Bidding History */}
                <div>
                  <h4 className="font-medium mb-4">Bidding History</h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {getAuctionBids(selectedAuction.id).map((bid) => (
                      <div key={bid.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img
                            src={bid.user.avatar}
                            alt={bid.user.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="text-sm font-medium">{bid.user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(bid.timestamp, 'MMM dd, HH:mm')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">${bid.amount.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                    
                    {getAuctionBids(selectedAuction.id).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No bids yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}