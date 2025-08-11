import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Gavel, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import authService from '@/services/auth';
import { useDispatch } from 'react-redux';
import { loginUser } from '@/app/features/authSlice';

const signupSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  username: z.string().min(5, 'Username must be at least 5 characters'),
  dob: z.string().min(1, 'Date of birth is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignupForm = z.infer<typeof signupSchema>;

export function SignupPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [isEmailVerified, setIsEmailVerified] = useState(false);
  // const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  // const emailValue = watch('email');

  // const handleEmailVerification = async () => {
  //   if (!emailValue || errors.email) return;
    
  //   setIsVerifyingEmail(true);
  //   // Simulate email verification
  //   setTimeout(() => {
  //     setIsEmailVerified(true);
  //     setIsVerifyingEmail(false);
  //   }, 2000);
  // };

  const onSubmit = async (data: SignupForm) => {
    // if (!isEmailVerified) {
    //   setSubmitError('Please verify your email address first');
    //   return;
    // }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const userData = await authService.createAccount(data);
     
      if(userData) {
        dispatch(loginUser(userData));
        navigate('/dashboard');
      }
    } catch (error: any) {
      setSubmitError(error.mesasge || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Gavel className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            Join AuctionHub to start Buying and Selling Antique and Valuable Products
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                {...register('name')}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Email with Verification */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex space-x-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register('email')}
                  className={`flex-1 ${errors.email ? 'border-destructive' : ''}`}
                />
                
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
              {/* {isEmailVerified && (
                <p className="text-sm text-green-600 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Email verified successfully
                </p>
              )} */}
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Create a username"
                {...register('username')}
                className={errors.username ? 'border-destructive' : ''}
              />
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username.message}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register('dob')}
                className={errors.dob ? 'border-destructive' : ''}
              />
              {errors.dob && (
                <p className="text-sm text-destructive">{errors.dob.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                {...register('password')}
                className={errors.password ? 'border-destructive' : ''}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Error Alert */}
            {submitError && (
              <Alert variant="destructive">
                <div className='flex items-center gap-2'>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{submitError}</AlertDescription>
                </div>
              </Alert>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/signin" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

{/* <Button
  type="button"
  variant="outline"
  size="sm"
  onClick={handleEmailVerification}
  disabled={!emailValue || !!errors.email || isEmailVerified || isVerifyingEmail}
  className="px-3"
>
  {isVerifyingEmail ? (
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
  ) : isEmailVerified ? (
    <CheckCircle className="h-4 w-4 text-green-600" />
  ) : (
    <Mail className="h-4 w-4" />
  )}
</Button> */}