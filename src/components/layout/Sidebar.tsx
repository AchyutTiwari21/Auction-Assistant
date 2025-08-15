import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Gavel,
  DollarSign,
  Users,
  Phone,
  Menu,
  X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { Label } from '@/components/ui/label';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Auctions', href: '/auctions', icon: Gavel },
  { name: 'Bids', href: '/bids', icon: DollarSign },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Call Logs', href: '/call-logs', icon: Phone },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const user = useSelector((state: any) => state.auth.userData);

  const currentPathname = location.pathname;

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        className="fixed top-4 right-4 z-50 md:hidden h-8 w-8 p-0"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 z-40 h-full md:h-auto w-64 transform bg-card border-r border-border transition-transform duration-200 ease-in-out md:relative md:translate-x-0 md:flex md:flex-col',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        <div className="flex h-full flex-col justify-between">
          {/* Logo */}
          <div className={`flex ${currentPathname === '/profile' ? "h-[78px]": "h-20"} items-center justify-center border-b border-border px-6`}>
            <div className="flex items-center space-x-2">
              <Gavel className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">AuctionHub</span>
            </div>
          </div>

         <div className='h-full p-2 flex flex-col justify-between'>
          {/* Navigation */}
          <div>
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    'flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground'
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          </div>
          
          <div className='flex flex-col justify-center items-start'>
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

          {/* Footer */}
          <div className="border-t border-border p-4">
            <div className="text-xs text-muted-foreground">
              © 2025 AuctionHub
            </div>
          </div>
        </div>
      </div>
    </>
  );
}