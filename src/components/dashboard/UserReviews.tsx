
import React from 'react';
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
    </>
  );
};
