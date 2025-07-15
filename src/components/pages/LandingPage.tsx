import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gavel, Users, DollarSign, Phone, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LandingPage() {
  const features = [
    {
      icon: Gavel,
      title: 'Live Auctions',
      description: 'Participate in real-time bidding with instant updates and notifications.'
    },
    {
      icon: Users,
      title: 'User Management',
      description: 'Comprehensive user profiles and activity tracking for all participants.'
    },
    {
      icon: DollarSign,
      title: 'Bid Tracking',
      description: 'Monitor all bids with detailed analytics and winning statistics.'
    },
    {
      icon: Phone,
      title: 'Call Integration',
      description: 'Seamless call logging and communication tracking with users.'
    }
  ];

  const benefits = [
    'Real-time auction monitoring',
    'Comprehensive analytics dashboard',
    'User activity tracking',
    'Secure bidding system',
    'Mobile-responsive design',
    'Professional support'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-muted-foreground ring-1 ring-border hover:ring-primary/20 transition-colors">
                Professional auction management platform.{' '}
                <Link to="/signup" className="font-semibold text-primary hover:underline">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Get started <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Auction<span className="text-primary">Hub</span>
            </h1>
            
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-xl mx-auto">
              Streamline your auction experience with real-time bidding, comprehensive analytics, 
              and professional user management tools.
            </p>
            
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" className="px-8">
                <Link to="/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" asChild>
                <Link to="/signin">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything you need to manage auctions
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful features designed for professional auction management
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2 xl:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-6">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 sm:py-32 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center">
            <div className="lg:pr-8 lg:pt-4">
              <div className="lg:max-w-lg">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Why choose AuctionHub?
                </h2>
                <p className="mt-6 text-lg leading-8 text-muted-foreground">
                  Built for professionals who demand reliability, security, and comprehensive 
                  auction management capabilities.
                </p>
                <dl className="mt-10 max-w-xl space-y-4 text-base leading-7 text-muted-foreground lg:max-w-none">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Gavel className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Ready to get started?</CardTitle>
                  <CardDescription>
                    Join thousands of professionals using AuctionHub
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button asChild className="w-full" size="lg">
                    <Link to="/signup">Create Account</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/signin">Sign In</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Gavel className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">AuctionHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 AuctionHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}