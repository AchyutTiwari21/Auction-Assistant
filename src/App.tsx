import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { LandingNavbar } from '@/components/layout/LandingNavbar';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { LandingPage } from '@/components/pages/LandingPage';
import { SignupPage } from '@/components/pages/SignupPage';
import { SigninPage } from '@/components/pages/SigninPage';
import { UserProfile } from '@/components/pages/UserProfile';
import { Dashboard } from '@/components/pages/Dashboard';
import { Auctions } from '@/components/pages/Auctions';
import { Bids } from '@/components/pages/Bids';
import { Users } from '@/components/pages/Users';
import { CallLogs } from '@/components/pages/CallLogs';
import { Toaster } from '@/components/ui/sonner';
import { useLocation } from 'react-router-dom';
import { useFavicon } from '@/hooks/useFavicon';

function AppContent() {
  const location = useLocation();
  const isLandingRoute = ['/', '/signin', '/signup'].includes(location.pathname);

  if (isLandingRoute) {
    return (
      <>
        <LandingNavbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auctions" element={<Auctions />} />
          <Route path="/bids" element={<Bids />} />
          <Route path="/users" element={<Users />} />
          <Route path="/call-logs" element={<CallLogs />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </Layout>
    </ProtectedRoute>
  );
}

function App() {
  useFavicon();
  
  return (
    <ThemeProvider defaultTheme="light" storageKey="auction-dashboard-theme">
      <Router>
        <AppContent />
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;