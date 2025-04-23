
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { likeReview, dislikeReview } from '@/services/review/reviewInteractions';
import { getMovieReviews } from '@/services/review/getReviews';
import { toast } from 'sonner';

export const useReviewInteractions = (movieId: string, onReviewsUpdate: (updatedReviews: any[]) => void) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  const handleLikeReview = async (reviewId: number) => {
    if (!user) {
      toast.error("Please log in to like a review");
      return;
    }

    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const success = await likeReview(reviewId);
      if (success) {
        const updatedReviews = await getMovieReviews(movieId);
        onReviewsUpdate(updatedReviews);
      }
    } catch (error) {
      console.error("Error liking review:", error);
      toast.error("Failed to like review");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDislikeReview = async (reviewId: number) => {
    if (!user) {
      toast.error("Please log in to dislike a review");
      return;
    }

    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const success = await dislikeReview(reviewId);
      if (success) {
        const updatedReviews = await getMovieReviews(movieId);
        onReviewsUpdate(updatedReviews);
      }
    } catch (error) {
      console.error("Error disliking review:", error);
      toast.error("Failed to dislike review");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleLikeReview,
    handleDislikeReview,
    isProcessing
  };
};
