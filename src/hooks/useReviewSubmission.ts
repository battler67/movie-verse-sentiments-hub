
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { submitReview, ReviewData } from '@/services/review/submitReview';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useReviewSubmission = (movieId: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (stars: number, reviewText: string): Promise<boolean> => {
    if (!user) {
      toast.error('Please log in to submit a review');
      navigate('/login');
      return false;
    }

    setIsSubmitting(true);
    try {
      const reviewData: ReviewData = {
        movie_id: movieId,
        stars,
        review_text: reviewText
      };

      const success = await submitReview(reviewData);
      return success;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};
