import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background pb-0">
      <Sidebar />
      <div className="flex flex-1 flex-col min-h-screen w-full">
        <Header />
        <main className="flex-1 w-full p-4 md:p-6 h-auto">
          {children}
        </main>
      </div>
    </div>
  );
}