
import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import ReviewCard from '@/components/movie/ReviewCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface UserReviewsProps {
  reviews: any[];
}

export const UserReviews = ({ reviews }: UserReviewsProps) => {
  const navigate = useNavigate();

  return (
    <>
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border border-white/5 rounded-lg bg-movie-dark p-4 md:p-6">
              <ReviewCard 
                key={review.id}
                username={review.username || "Anonymous"}
                date={new Date(review.created_at).toLocaleDateString()}
                rating={review.stars}
                comment={review.review_text}
                sentiment={review.sentiment || "neutral"}
                confidence={review.confidence || 45}
                isAnalyzing={review.isAnalyzing || false}
              />
              <div className="mt-4 flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-white/60">
                  <ThumbsUp size={16} />
                  <span>{review.user_likes || 0}</span>
                </div>
                <div className="flex items-center space-x-1 text-white/60">
                  <ThumbsDown size={16} />
                  <span>{review.user_dislikes || 0}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-auto text-movie-primary hover:text-movie-primary/90"
                  onClick={() => navigate(`/movie/${review.movie_id}`)}
                >
                  View Movie
                </Button>
              </div>
            </div>
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
    </>
  );
};

export default UserReviews;
