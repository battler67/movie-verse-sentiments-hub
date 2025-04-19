
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getUserReviews, getUserReviewStats } from '@/services/reviewService';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ReviewCard from '@/components/movie/ReviewCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip, Legend, PieChart, Pie } from 'recharts';
import { Star, Film, User2 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

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

  const ratingColors = ['#ef4444', '#f97316', '#facc15', '#84cc16', '#22c55e'];
  
  const renderRatingDistributionChart = () => {
    if (!stats || !stats.ratingDistribution) return null;
    
    const data = stats.ratingDistribution.map((count: number, index: number) => ({
      name: `${index + 1} Star${index === 0 ? '' : 's'}`,
      value: count,
      color: ratingColors[index]
    }));

    const chartConfig = {
      rating1: { color: '#ef4444' },
      rating2: { color: '#f97316' },
      rating3: { color: '#facc15' },
      rating4: { color: '#84cc16' },
      rating5: { color: '#22c55e' },
    };

    return (
      <ChartContainer config={chartConfig}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
          >
            {data.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
        </PieChart>
      </ChartContainer>
    );
  };

  const renderReviewsOverTimeChart = () => {
    if (!stats || !stats.reviewsByMonth || stats.reviewsByMonth.length === 0) return null;
    
    const data = stats.reviewsByMonth.map((item: any) => {
      const [year, month] = item.month.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      const monthName = date.toLocaleString('default', { month: 'short' });
      return {
        name: `${monthName} ${year}`,
        reviews: item.count
      };
    });

    const chartConfig = {
      reviews: { color: '#8884d8' }
    };

    return (
      <ChartContainer config={chartConfig}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="reviews" fill="#8884d8" name="Reviews" />
        </BarChart>
      </ChartContainer>
    );
  };

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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-movie-dark/70 border-white/10">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
                <User2 size={24} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-medium mb-1">Profile</h3>
              <p className="text-white/60">{user.email}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-movie-dark/70 border-white/10">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
                <Film size={24} className="text-purple-400" />
              </div>
              <h3 className="text-lg font-medium mb-1">Reviews</h3>
              <p className="text-2xl font-bold text-white">{stats?.totalReviews || 0}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-movie-dark/70 border-white/10">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mb-3">
                <Star size={24} className="text-yellow-400" />
              </div>
              <h3 className="text-lg font-medium mb-1">Average Rating</h3>
              <p className="text-2xl font-bold text-white">
                {stats?.averageRating ? stats.averageRating.toFixed(1) : '0.0'}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="statistics" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="reviews">Your Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="statistics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-movie-dark/70 border-white/10">
                <CardContent className="p-6">
                  <h3 className="text-xl font-medium mb-4">Rating Distribution</h3>
                  {stats?.totalReviews > 0 ? (
                    renderRatingDistributionChart()
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-white/60">
                      <p>No rating data available yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-movie-dark/70 border-white/10">
                <CardContent className="p-6">
                  <h3 className="text-xl font-medium mb-4">Reviews Over Time</h3>
                  {stats?.reviewsByMonth?.length > 0 ? (
                    renderReviewsOverTimeChart()
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-white/60">
                      <p>No timeline data available yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews">
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewCard 
                    key={review.id}
                    username={review.profiles?.username || review.username || "Anonymous"}
                    date={new Date(review.created_at).toLocaleDateString()}
                    rating={review.stars}
                    comment={review.review_text}
                    sentiment={review.sentiment || "neutral"}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-white/5 rounded-lg bg-movie-dark">
                <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
                <p className="text-white/60 mb-4">You haven't written any reviews yet.</p>
                <Button onClick={() => navigate('/')} className="bg-movie-primary hover:bg-movie-primary/90">
                  Discover Movies
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserDashboard;
