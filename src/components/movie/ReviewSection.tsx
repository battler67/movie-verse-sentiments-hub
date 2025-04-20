
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useReviewSubmission } from '@/hooks/useReviewSubmission';
import SentimentTag from './SentimentTag';
import { toast } from 'sonner';
import { getMovieReviews } from '@/services/review/getReviews';
import { likeReview, dislikeReview } from '@/services/review/reviewInteractions';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import ReviewSkeleton from './ReviewSkeleton';

interface ReviewSectionProps {
  movieId: string;
}

const ReviewSection = ({ movieId }: ReviewSectionProps) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { handleSubmit, isSubmitting } = useReviewSubmission(movieId);

  useEffect(() => {
    const loadReviews = async () => {
      setIsLoading(true);
      try {
        const reviewData = await getMovieReviews(movieId);
        setReviews(reviewData);
      } catch (error) {
        console.error("Error loading reviews:", error);
        toast.error("Failed to load reviews");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadReviews();
  }, [movieId]);

  const onSubmitReview = async (reviewData: any) => {
    if (!user) {
      toast.error("Please log in to submit a review");
      return;
    }

    try {
      const success = await handleSubmit(reviewData.stars, reviewData.review_text);
      
      if (success) {
        const updatedReviews = await getMovieReviews(movieId);
        setReviews(updatedReviews);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    }
  };

  const handleLikeReview = async (reviewId: number) => {
    if (!user) {
      toast.error("Please log in to like a review");
      return;
    }
    
    try {
      await likeReview(reviewId);
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === reviewId 
            ? { ...review, user_likes: (review.user_likes || 0) + 1 } 
            : review
        )
      );
    } catch (error) {
      console.error("Error liking review:", error);
      toast.error("Failed to like review");
    }
  };

  const handleDislikeReview = async (reviewId: number) => {
    if (!user) {
      toast.error("Please log in to dislike a review");
      return;
    }
    
    try {
      await dislikeReview(reviewId);
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === reviewId 
            ? { ...review, user_dislikes: (review.user_dislikes || 0) + 1 } 
            : review
        )
      );
    } catch (error) {
      console.error("Error disliking review:", error);
      toast.error("Failed to dislike review");
    }
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Reviews</h2>
        <div className="flex items-center space-x-3">
          <SentimentTag sentiment="positive" className="border border-white/5" />
          <SentimentTag sentiment="negative" className="border border-white/5" />
          <SentimentTag sentiment="neutral" className="border border-white/5" />
          <Button variant="outline" size="sm" className="border-white/10">
            Filter
          </Button>
        </div>
      </div>
      
      <div className="border border-white/5 rounded-lg bg-movie-dark p-4 md:p-6 mb-6">
        <ReviewForm 
          movieId={movieId}
          onSubmit={onSubmitReview}
          isSubmitting={isSubmitting}
        />
      </div>
      
      {isLoading ? (
        <ReviewSkeleton />
      ) : (
        <ReviewList 
          reviews={reviews}
          onLike={handleLikeReview}
          onDislike={handleDislikeReview}
        />
      )}
    </div>
  );
};

export default ReviewSection;
