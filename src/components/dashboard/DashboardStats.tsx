
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Film, Star, User2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardStatsProps {
  user: any;
  stats: any;
}

export const DashboardStats = ({ user, stats }: DashboardStatsProps) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    // Navigate to profile page with a hash to scroll to the profile box
    navigate('/profile#user-profile-box');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card
        className="bg-movie-dark/70 border-white/10 cursor-pointer hover:shadow-lg"
        onClick={handleProfileClick}
        tabIndex={0}
        aria-label="Go to Profile"
      >
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
  );
};
