import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Dashboard } from '@/components/pages/Dashboard';
import { Auctions } from '@/components/pages/Auctions';
import { Bids } from '@/components/pages/Bids';
import { Users } from '@/components/pages/Users';
import { CallLogs } from '@/components/pages/CallLogs';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="auction-dashboard-theme">
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/auctions" element={<Auctions />} />
            <Route path="/bids" element={<Bids />} />
            <Route path="/users" element={<Users />} />
            <Route path="/call-logs" element={<CallLogs />} />
          </Routes>
        </Layout>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;