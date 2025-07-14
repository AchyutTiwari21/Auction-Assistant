import { useEffect, useState } from 'react';
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
import { format } from 'date-fns';
import { Eye, Clock, Users } from 'lucide-react';
import type { Auction } from '@/types';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/app/store';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import service from '@/services/configuration';
import { setAuctions } from '@/app/features';

export function Auctions() {
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);

  const auctions: Auction[] | null = useSelector((state: RootState) => state.auctions.auctions);

  const dispatch = useDispatch();

  useEffect(() => {
    NProgress.configure({showSpinner: false});
    // Fetch auction data from the backend API
    const fetchAuctionData = async () => {
      NProgress.start();
      try {
        const auctionsResponse = await service.getAuctions();
        if(auctionsResponse) {   
          dispatch(setAuctions(auctionsResponse));
        } else {
          throw new Error('No auctions found');
        }
      } catch (error) {
        console.error('Error fetching auction data:', error);
      } finally {
        NProgress.done();
      }
    };

    fetchAuctionData();
  }, [dispatch]);
  
  function getStatusBadge(auction: Auction) {
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
          <div className="w-full overflow-x-auto">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Start Date</TableHead>
                <TableHead className="hidden sm:table-cell">End Date</TableHead>
                <TableHead>Current Bid</TableHead>
                <TableHead className="hidden md:table-cell">Bids</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auctions?.map((auction) => (
                <TableRow key={auction.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={auction?.product?.imageUrl || '/placeholder.svg'}
                        alt={auction?.product?.name || 'Unknown Product'}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium max-w-[120px] truncate sm:max-w-xs">{auction?.product?.name || 'Unknown Product'}</p>
                        <p className="hidden lg:block text-xs text-muted-foreground truncate max-w-xs">
                          {auction?.product?.description || 'No description available'}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(auction)}</TableCell>
                  <TableCell className="hidden sm:table-cell">{format(auction.startTime, 'MMM dd, yyyy')}</TableCell>
                  <TableCell className="hidden sm:table-cell">{format(auction.endTime, 'MMM dd, yyyy')}</TableCell>
                  <TableCell className="font-medium">
                    ${auction?.currentBid?.amount.toLocaleString() || 'No bids yet'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {auction?.bids?.length ?? 0}
                  </TableCell>
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
          </div>
        </CardContent>
      </Card>

      {/* Auction Detail Dialog */}
      <Dialog open={!!selectedAuction} onOpenChange={() => setSelectedAuction(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedAuction && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedAuction?.product?.name}</DialogTitle>
              </DialogHeader>
              
              <div className="grid gap-6 md:grid-cols-2">
                {/* Auction Details */}
                <div className="space-y-4">
                  <img
                    src={selectedAuction?.product?.imageUrl || '/placeholder.svg'}
                    alt={selectedAuction?.product?.name || 'Unknown Product'}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status:</span>
                      {getStatusBadge(selectedAuction)}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Current Bid:</span>
                      <span className="text-lg font-bold text-green-600">
                        ${selectedAuction?.currentBid?.amount.toLocaleString() || 'No bids yet'}
                      </span>
                    </div>    

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Ends {format(selectedAuction.endTime, 'MMM dd, yyyy HH:mm')}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {selectedAuction?.bids?.length} bids
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedAuction?.product?.description || 'No description available'}
                    </p>
                  </div>
                </div>

                {/* Bidding History */}
                <div>
                  <h4 className="font-medium mb-4">Bidding History</h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedAuction?.bids?.map((bid) => (
                      <div key={bid.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img
                            src={bid.user.picture || '/placeholder.svg'}
                            alt={bid.user.name || 'Unknown User'}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="text-sm font-medium">{bid?.user?.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(bid.createdAt, 'MMM dd, HH:mm')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">${bid?.amount.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}

                    {selectedAuction?.bids?.length === 0 && (
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