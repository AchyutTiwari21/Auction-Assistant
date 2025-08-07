import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Gavel } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';

export function LandingNavbar() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Gavel className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">AuctionHub</span>
        </Link>

        {/* Right side actions */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-8 w-8 p-0"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/signin">Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/signin">Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}