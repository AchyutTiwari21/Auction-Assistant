import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { Eye, Clock, Users, DollarSign, AlertCircle, CheckCircle, X } from 'lucide-react';
import type { Auction } from '@/types';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/app/store';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import service from '@/services/configuration';
import bidService from '@/services/bidService';
import { setAuctions } from '@/app/features';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Bid form schema
const bidSchema = z.object({
  amount: z.number().min(1, 'Bid amount must be at least $1'),
});

type BidForm = z.infer<typeof bidSchema>;

export function Auctions() {
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [showBidDialog, setShowBidDialog] = useState(false);
  const [biddingAuction, setBiddingAuction] = useState<Auction | null>(null);
  const [bidMessage, setBidMessage] = useState('');
  const [isBidding, setIsBidding] = useState(false);
  const [isCancellingBid, setIsCancellingBid] = useState<string | null>(null);
  const [bidToCancel, setBidToCancel] = useState<string | null>(null);

  const auctions: Auction[] | null = useSelector((state: RootState) => state.auctions.auctions);
  const userData: any = useSelector((state: RootState) => state.auth.userData);

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BidForm>({
    resolver: zodResolver(bidSchema),
  });

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

  const handleBidClick = (auction: Auction) => {
    setBiddingAuction(auction);
    setShowBidDialog(true);
    // Set minimum bid amount (current bid + 1 or $1 if no current bid)
    const minBid = auction.currentBid ? auction.currentBid.amount + 1 : 1;
    setValue('amount', minBid);
    setBidMessage('');
  };

  const handleBidSubmit = async (data: BidForm) => {
    if (!biddingAuction) return;

    setIsBidding(true);
    setBidMessage('');

    // Validate bid amount
    const currentBidAmount = biddingAuction.currentBid?.amount || 0;
    if (data.amount <= currentBidAmount) {
      setBidMessage('Bid amount must be higher than the current bid.');
      setIsBidding(false);
      return;
    }

    NProgress.start();
    try {
      await bidService.placeBid({auctionId: biddingAuction.id, userId: userData.id, bidAmount: data.amount});
      
      // Refresh auction data
      const auctionsResponse = await service.getAuctions();
      if (auctionsResponse) {
        dispatch(setAuctions(auctionsResponse));
      }
      
      setShowBidDialog(false);
      setBiddingAuction(null);
      reset();
      setBidMessage('Bid placed successfully!');
      setTimeout(() => setBidMessage(''), 3000);
    } catch (error: any) {
      setBidMessage(error.message || 'Failed to place bid. Please try again.');
    } finally {
      setIsBidding(false);
      NProgress.done();
    }
  };

  const handleBidCancel = () => {
    setShowBidDialog(false);
    setBiddingAuction(null);
    reset();
    setBidMessage('');
  };

  // const handleCancelBidClick = (bidId: string) => {
  //   setBidToCancel(bidId);
  // };

  const handleCancelBidConfirm = async () => {
    if (!bidToCancel) return;
    
    setIsCancellingBid(bidToCancel);
    setBidMessage('');

    NProgress.start();
    try {
      await bidService.cancelBid(bidToCancel);
      
      // Refresh auction data
      const auctionsResponse = await service.getAuctions();
      if (auctionsResponse) {
        dispatch(setAuctions(auctionsResponse));
      }
      
      setBidMessage('Bid cancelled successfully!');
      setTimeout(() => setBidMessage(''), 3000);
    } catch (error: any) {
      setBidMessage(error.message || 'Failed to cancel bid. Please try again.');
    } finally {
      setIsCancellingBid(null);
      setBidToCancel(null);
      NProgress.done();
    }
  };

  const handleCancelBidCancel = () => {
    setBidToCancel(null);
  };

  const isAuctionActive = (auction: Auction) => {
    const now = new Date();
    const startTime = new Date(auction.startTime);
    const endTime = new Date(auction.endTime);
    return now >= startTime && now <= endTime;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const canCancelBid = (bid: { user: { id: string } }) => {
    // Check if the bid belongs to the current user and the auction is still active
    const isUserBid = bid.user?.id === userData?.id;
    const isAuctionStillActive = selectedAuction ? isAuctionActive(selectedAuction) : false;
    return isUserBid && isAuctionStillActive && userData !== null;
  };
  
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
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedAuction(auction)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      {isAuctionActive(auction) && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleBidClick(auction)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <DollarSign className="h-4 w-4 mr-2" />
                          Bid
                        </Button>
                      )}
                    </div>
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

                  {isAuctionActive(selectedAuction) && (
                    <div className="pt-4">
                      <Button
                        onClick={() => handleBidClick(selectedAuction)}
                        className="w-full bg-green-600 hover:bg-green-700"
                        size="lg"
                      >
                        <DollarSign className="h-5 w-5 mr-2" />
                        Place Bid
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        Current bid: {formatCurrency(selectedAuction.currentBid?.amount || 0)}
                      </p>
                    </div>
                  )}
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
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <p className="text-sm font-bold">${bid?.amount.toLocaleString()}</p>
                          </div>
                          {canCancelBid(bid) && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={isCancellingBid === bid.id}
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  {isCancellingBid === bid.id ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                  ) : (
                                    <X className="h-4 w-4" />
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Cancel Bid</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to cancel your bid of ${bid.amount.toLocaleString()}? 
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={handleCancelBidCancel}>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={handleCancelBidConfirm} className="bg-red-600 hover:bg-red-700">
                                    Yes, Cancel Bid
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
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

      {/* Bid Dialog */}
      <Dialog open={showBidDialog} onOpenChange={setShowBidDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Place Your Bid</DialogTitle>
            <DialogDescription>
              Enter your bid amount for {biddingAuction?.product?.name}
            </DialogDescription>
          </DialogHeader>

          {bidMessage && (
            <Alert className={bidMessage.includes('successfully') ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'}>
              {bidMessage.includes('successfully') ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{bidMessage}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(handleBidSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Bid Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min={biddingAuction?.currentBid ? biddingAuction.currentBid.amount + 1 : 1}
                placeholder="Enter bid amount"
                {...register('amount', { valueAsNumber: true })}
                className={errors.amount ? 'border-destructive' : ''}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Minimum bid: {formatCurrency(biddingAuction?.currentBid ? biddingAuction.currentBid.amount + 1 : 1)}
              </p>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button 
                type="submit" 
                disabled={isBidding}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isBidding ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Placing Bid...
                  </>
                ) : (
                  <>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Place Bid
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleBidCancel}
                disabled={isBidding}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}