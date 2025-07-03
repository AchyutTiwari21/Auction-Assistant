import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col min-h-screen w-full">
        <Header />
        <main className="flex-1 w-full p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}