
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getUserReviews } from '@/services/review/getReviews';
import { getUserReviewStats } from '@/services/review/reviewStats';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { UserReviews } from '@/components/dashboard/UserReviews';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      setLoading(true);
      try {
        const userReviews = await getUserReviews(user.id);
        setReviews(userReviews);

        const userStats = await getUserReviewStats(user.id);
        setStats(userStats);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-48 bg-white/10 rounded mb-4"></div>
            <div className="h-4 w-64 bg-white/10 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
            <p className="text-white/60 mb-6">You need to be signed in to view your dashboard.</p>
            <Button onClick={() => navigate('/login')} className="bg-movie-primary hover:bg-movie-primary/90">
              Sign In
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Your Dashboard</h1>
        </div>
        
        <DashboardStats user={user} stats={stats} />
        
        <Tabs defaultValue="statistics" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="reviews">Your Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="statistics">
            <DashboardCharts stats={stats} />
          </TabsContent>
          
          <TabsContent value="reviews">
            <UserReviews reviews={reviews} />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default UserDashboard;
