import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
      <div className="flex items-center space-x-3">
        <h1 className="hidden md:block text-lg font-semibold">Auction Dashboard</h1>
        <div className="flex items-center space-x-2">
          <img 
            src="/logo.png" 
            alt="Auction Dashboard Logo" 
            className="h-8 w-8 md:h-10 md:w-10 rounded-lg"
          />
          <span className="md:hidden text-sm font-semibold">AuctionHub</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="h-8 w-8 md:h-9 md:w-9 p-0 mr-12 md:mr-0"
        >
          <Sun className="h-4 w-4 md:h-5 md:w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 md:h-5 md:w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
}