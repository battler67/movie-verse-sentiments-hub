
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "sonner";
import Index from '@/pages/Index';
import MovieDetail from '@/pages/MovieDetail';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import NotFound from '@/pages/NotFound';
import About from '@/pages/About';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import Watchlist from '@/pages/Watchlist';
import UserDashboard from '@/pages/UserDashboard';
import LandingPage from '@/pages/LandingPage';
import { AuthProvider } from '@/contexts/AuthContext';
import { WatchlistProvider } from '@/contexts/WatchlistContext';
import { useAuth } from '@/contexts/AuthContext';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Guest only route (redirect to home if logged in)
const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return (
    <Routes>
      {/* Public landing page for guests */}
      <Route path="/" element={!user ? <LandingPage /> : <Index />} />
      
      {/* Auth routes - only for guests */}
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/signup" element={<GuestRoute><SignUp /></GuestRoute>} />
      
      {/* Public routes */}
      <Route path="/movie/:id" element={<MovieDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      
      {/* Protected routes */}
      <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
      
      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <WatchlistProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
        <Toaster />
      </WatchlistProvider>
    </AuthProvider>
  );
};

export default App;
