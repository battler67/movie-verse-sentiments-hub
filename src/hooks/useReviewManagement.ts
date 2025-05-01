
import { useState, useEffect } from 'react';
import { getMovieReviews } from '@/services/review/getReviews';
import { analyzeSentiment } from '@/services/sentimentAnalysis';
import { toast } from 'sonner';

export const useReviewManagement = (movieId: string) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      setIsLoading(true);
      try {
        const reviewData = await getMovieReviews(movieId);
        
        // Mark reviews as analyzing initially if they don't have sentiment
        const reviewsWithAnalysis = reviewData.map(review => ({
          ...review,
          isAnalyzing: !review.sentiment
        }));
        
        setReviews(reviewsWithAnalysis);
        
        // Process reviews that don't have sentiment analysis yet
        reviewsWithAnalysis.forEach(async (review, index) => {
          if (!review.sentiment) {
            try {
              const result = await analyzeSentiment(review.review_text);
              setReviews(prevReviews => {
                const updatedReviews = [...prevReviews];
                updatedReviews[index] = {
                  ...updatedReviews[index],
                  sentiment: result.sentiment,
                  confidence: result.confidence,
                  isAnalyzing: false
                };
                return updatedReviews;
              });
            } catch (error) {
              console.error("Error analyzing sentiment:", error);
              setReviews(prevReviews => {
                const updatedReviews = [...prevReviews];
                updatedReviews[index] = {
                  ...updatedReviews[index],
                  sentiment: 'neutral',
                  confidence: 45,
                  isAnalyzing: false
                };
                return updatedReviews;
              });
            }
          }
        });
      } catch (error) {
        console.error("Error loading reviews:", error);
        toast.error("Failed to load reviews");
      } finally {
        setIsLoading(false);
      }
    };
    loadReviews();
  }, [movieId]);

  return { reviews, setReviews, isLoading };
};
