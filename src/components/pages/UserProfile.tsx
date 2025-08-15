import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
import { 
  User,
  Save, 
  Mail, 
  Calendar,
  CheckCircle,
  Camera,
  AlertCircle,
  Trash2,
  Clock,
  DollarSign,
  Award,
  Eye,
  X
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSelector, useDispatch } from 'react-redux';
import authService from '@/services/auth';
import bidService from '@/services/bidService';
import { updateUser } from '@/app/features/authSlice';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  dob: z.string().min(1, 'Date of birth is required'),
  username: z.string().min(5, 'Username must be 5 characters.')
});

// const paymentSchema = z.object({
//   cardNumber: z.string().min(16, 'Card number must be at least 16 digits'),
//   expiryDate: z.string().min(1, 'Expiry date is required'),
//   cvv: z.string().min(3, 'CVV must be at least 3 digits'),
//   cardholderName: z.string().min(2, 'Cardholder name must be at least 2 characters')
// });

type ProfileForm = z.infer<typeof profileSchema>;
// type PaymentForm = z.infer<typeof paymentSchema>;

interface UserData {
  id: string;
  name: string;
  email: string;
  dob: string;
  picture: string | null;
  username: string;
  isAuthenticated: boolean;
}

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

// interface PaymentMethod {
//   id: string;
//   cardNumber: string;
//   expiryDate: string;
//   cardholderName: string;
//   isDefault: boolean;
// }

export function UserProfile() {
  const formData = new FormData();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const userData = useSelector((state: any) => state.auth.userData);
  const isAuthenticated = useSelector((state: any) => state.auth.status);

  const [user, setUser] = useState<UserData>({...userData, isAuthenticated});
  
  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Bid history and payment states
  const [userBids, setUserBids] = useState<UserBid[]>([]);
  // const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoadingBids, setIsLoadingBids] = useState(false);
  // const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  // const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [isCancellingBid, setIsCancellingBid] = useState<string | null>(null);
  const [bidToCancel, setBidToCancel] = useState<string | null>(null);

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      dob: user.dob,
      username: user.username
    },
  });

  // const {
  //   register: registerPayment,
  //   handleSubmit: handleSubmitPayment,
  //   reset: resetPayment,
  //   formState: { errors: paymentErrors, isDirty: isPaymentDirty },
  // } = useForm<PaymentForm>({
  //   resolver: zodResolver(paymentSchema),
  // });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      formData.append('picture', file);
      NProgress.start(); 
      try {
        const imageUrl = await authService.uploadPicture(formData);
        const updatedUser = { ...user, picture: imageUrl };
        setUser(updatedUser);
        dispatch(updateUser(updatedUser));
        setSaveMessage('Profile picture updated successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } catch (error: any) {
        console.error(error.message || "Error while uploading profile picture.");
      } finally {
        NProgress.done();
      }
    }
  };

  const handleRemoveImage = async () => {
    NProgress.start();
    try {
      const isRemoved = await authService.removeUserPicture();
      if(isRemoved) {
        const updatedUser = { ...user, picture: null };
        setUser(updatedUser);
        dispatch(updateUser(updatedUser));
        setSaveMessage('Profile picture removed successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        throw new Error("Error while removing picture.")
      }
    } catch (error: any) {
      console.error(error.message || "Error while removing picture.");
    } finally {
      NProgress.done();
    }
  };

  const onSubmit = async (data: ProfileForm) => {
    setIsSaving(true);
    setSaveMessage('');

    NProgress.start();
    try {
      const isUpdated = await authService.updateUser(data); 
      if(isUpdated) {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        setIsEditing(false);
        dispatch(updateUser(updatedUser));
        setSaveMessage('Profile updated successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        throw new Error("Unable to update the user!")
      }
    } catch (error) {
      setSaveMessage('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
      NProgress.done();
    }
  };

  // Fetch user bids and payment methods on component mount
  useEffect(() => {
    if (user.id) {
      fetchUserBids();
      // fetchPaymentMethods();
    }
  }, [user.id]);

  const fetchUserBids = async () => {
    setIsLoadingBids(true);
    try {
      const bids = await bidService.getUserBids();
      setUserBids(bids);
    } catch (error) {
      console.error('Error fetching user bids:', error);
    } finally {
      setIsLoadingBids(false);
    }
  };



  // const fetchPaymentMethods = async () => {
  //   setIsLoadingPayments(true);
  //   try {
  //     const payments = await bidService.getPaymentMethods(user.id);
  //     setPaymentMethods(payments);
  //   } catch (error) {
  //     console.error('Error fetching payment methods:', error);
  //   } finally {
  //     setIsLoadingPayments(false);
  //   }
  // };

  // const handleAddPaymentMethod = async (data: PaymentForm) => {
  //   try {
  //     await bidService.addPaymentMethod(user.id, data);
  //     setShowPaymentDialog(false);
  //     resetPayment();
  //     // fetchPaymentMethods(); // Refresh payment methods
  //     setSaveMessage('Payment method added successfully!');
  //     setTimeout(() => setSaveMessage(''), 3000);
  //   } catch (error: any) {
  //     setSaveMessage('Failed to add payment method. Please try again.');
  //   }
  // };

  // const handleCancelBidClick = (bidId: string) => {
  //   setBidToCancel(bidId);
  // };

  const handleCancelBidConfirm = async () => {
    if (!bidToCancel) return;
    
    setIsCancellingBid(bidToCancel);
    setSaveMessage('');

    NProgress.start();
    try {
      await bidService.cancelBid(bidToCancel);
      fetchUserBids(); // Refresh bid history
      setSaveMessage('Bid cancelled successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error: any) {
      setSaveMessage('Failed to cancel bid. Please try again.');
    } finally {
      setIsCancellingBid(null);
      setBidToCancel(null);
      NProgress.done();
    }
  };

  const handleCancelBidCancel = () => {
    setBidToCancel(null);
  };

  const handleCancelEdit = () => {
    reset({
      name: user.name,
      email: user.email,
      dob: user.dob,
      username: user.username
    });
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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

  // const maskCardNumber = (cardNumber: string) => {
  //   return `**** **** **** ${cardNumber.slice(-4)}`;
  // };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">User Profile</h2>
        <p className="text-muted-foreground">
          Manage your account settings and personal information
        </p>
      </div>

      {/* Success/Error Messages */}
      {saveMessage && (
        <Alert className={saveMessage.includes('successfully') ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'}>
          {saveMessage.includes('successfully') ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>{saveMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Picture Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>
              Upload or change your profile picture
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src={user.picture || undefined} alt={user.name} />
              <AvatarFallback className="text-2xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-4 w-4 mr-2" />
                {user.picture ? 'Change' : 'Upload'}
              </Button>
              
              {user.picture && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveImage}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </CardContent>
        </Card>

        {/* Profile Information Card */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </CardHeader>
          
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    {...register('name')}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register('email')}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    {...register('username')}
                    className={errors.username ? 'border-destructive' : ''}
                  />
                  {errors.username && (
                    <p className="text-sm text-destructive">{errors.username.message}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    {...register('dob')}
                    className={errors.dob ? 'border-destructive' : ''}
                  />
                  {errors.dob && (
                    <p className="text-sm text-destructive">{errors.dob.message}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4">
                  <Button 
                    type="submit" 
                    disabled={!isDirty || isSaving}
                  >
                    {isSaving ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {/* Display Mode */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.name}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Date of Birth</Label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(user.dob).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="inline-flex flex-col space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">User Name</Label>
                    <span className="text-sm font-mono">{user.username}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Bid History Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Bid History
          </CardTitle>
          <CardDescription>
            View all your bids and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingBids ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span className="ml-2">Loading bid history...</span>
            </div>
          ) : userBids.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No bids found. Start bidding on auctions to see your history here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Bid Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userBids.map((bid) => (
                    <TableRow key={bid.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {bid.auction.product.imageUrl && (
                            <img
                              src={bid.auction.product.imageUrl}
                              alt={bid.auction.product.name}
                              className="h-10 w-10 rounded object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium">{bid.auction.product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Ends: {formatDate(bid.auction.endTime)}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(bid.amount)}
                      </TableCell>
                      <TableCell>{formatDate(bid.createdAt)}</TableCell>
                      <TableCell>
                        <Badge variant={bid.isWinning ? "default" : "secondary"}>
                          {bid.id === bid.auction.currentBid.id ? (
                            <>
                              <Award className="h-3 w-3 mr-1" />
                              Winning
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              Active
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          { bid.id !== bid.auction.currentBid.id && (
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
                                    Are you sure you want to cancel your bid of {formatCurrency(bid.amount)}? 
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Methods Section */}
      {/* <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Methods
            </CardTitle>
            <CardDescription>
              Manage your payment methods for winning bids
            </CardDescription>
          </div>
          <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
                <DialogDescription>
                  Add a new credit or debit card for processing payments
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitPayment(handleAddPaymentMethod)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardholderName">Cardholder Name</Label>
                  <Input
                    id="cardholderName"
                    placeholder="John Doe"
                    {...registerPayment('cardholderName')}
                    className={paymentErrors.cardholderName ? 'border-destructive' : ''}
                  />
                  {paymentErrors.cardholderName && (
                    <p className="text-sm text-destructive">{paymentErrors.cardholderName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    {...registerPayment('cardNumber')}
                    className={paymentErrors.cardNumber ? 'border-destructive' : ''}
                  />
                  {paymentErrors.cardNumber && (
                    <p className="text-sm text-destructive">{paymentErrors.cardNumber.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      {...registerPayment('expiryDate')}
                      className={paymentErrors.expiryDate ? 'border-destructive' : ''}
                    />
                    {paymentErrors.expiryDate && (
                      <p className="text-sm text-destructive">{paymentErrors.expiryDate.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      {...registerPayment('cvv')}
                      className={paymentErrors.cvv ? 'border-destructive' : ''}
                    />
                    {paymentErrors.cvv && (
                      <p className="text-sm text-destructive">{paymentErrors.cvv.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button 
                    type="submit" 
                    disabled={!isPaymentDirty}
                    className="flex-1"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Add Card
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowPaymentDialog(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoadingPayments ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span className="ml-2">Loading payment methods...</span>
            </div>
          ) : paymentMethods.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No payment methods found. Add a payment method to pay for winning bids.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{payment.cardholderName}</p>
                      <p className="text-sm text-muted-foreground">
                        {maskCardNumber(payment.cardNumber)} • Expires {payment.expiryDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {payment.isDefault && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card> */}

      <div className='flex justify-center items-start md:hidden'>
        <Card>
        <CardHeader className="text-center">
            <CardTitle>Demo Credentials</CardTitle>
            <CardDescription>
              Demo Credentials for interacting with the AI Assistant.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col justify-center items-center space-y-2'>
              <div className="inline-flex flex-col">
                <Label className="text-sm font-medium text-muted-foreground">User Name</Label>
                <span className="text-sm font-mono">{user.username}</span>
              </div>
              <div className="inline-flex flex-col">
                <Label className="text-sm font-medium text-muted-foreground">Password</Label>
                <span className="text-sm font-mono">password@123</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}