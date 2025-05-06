
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useReviewSubmission } from '@/hooks/useReviewSubmission';
import { useReviewFilters } from '@/hooks/useReviewFilters';
import { useReviewManagement } from '@/hooks/useReviewManagement';
import { useReviewInteractions } from '@/hooks/useReviewInteractions';
import { getMovieReviews } from '@/services/review/getReviews';
import { analyzeSentiment } from '@/services/sentimentAnalysis';
import { toast } from 'sonner';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import ReviewSkeleton from './ReviewSkeleton';
import ReviewHeader from './ReviewHeader';
import { ReviewData } from '@/services/review/submitReview';

interface ReviewSectionProps {
  movieId: string;
}

const ReviewSection = ({ movieId }: ReviewSectionProps) => {
  const { user } = useAuth();
  const { handleSubmit, isSubmitting, SpamDialog } = useReviewSubmission(movieId);
  const { reviews, setReviews, isLoading } = useReviewManagement(movieId);
  const { selectedSentiment, setSelectedSentiment, filteredReviews, resetFilter } = useReviewFilters(reviews);
  const { handleLikeReview, handleDislikeReview, isProcessing } = useReviewInteractions(movieId, setReviews);
  
  // Call the deduplication function when the component mounts
  useEffect(() => {
    const deduplicateReviews = async () => {
      try {
        // Call the Supabase function to deduplicate reviews
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/deduplicate-reviews`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({ movieId })
        });
        
        const result = await response.json();
        
        if (result.removed > 0) {
          console.log(`Removed ${result.removed} duplicate reviews`);
          // Refresh reviews after deduplication
          const updatedReviews = await getMovieReviews(movieId);
          setReviews(updatedReviews);
        }
      } catch (error) {
        console.error("Error in deduplication:", error);
      }
    };
    
    deduplicateReviews();
  }, [movieId, setReviews]);

  const onSubmitReview = async (reviewData: ReviewData) => {
    if (!user) {
      toast.error("Please log in to submit a review");
      return;
    }

    try {
      const success = await handleSubmit(reviewData.stars, reviewData.review_text);
      if (success) {
        const updatedReviews = await getMovieReviews(movieId);
        const newReviewWithAnalysis = updatedReviews.map((review, index) => {
          const isNewReview = !reviews.some(r => r.id === review.id);
          return {
            ...review,
            isAnalyzing: isNewReview && !review.sentiment
          };
        });
        
        setReviews(newReviewWithAnalysis);
        
        const newReview = updatedReviews.find(review => !reviews.some(r => r.id === review.id));
        
        if (newReview && !newReview.sentiment) {
          const newReviewIndex = newReviewWithAnalysis.findIndex(r => r.id === newReview.id);
          
          try {
            const result = await analyzeSentiment(newReview.review_text);
            setReviews(prevReviews => {
              const updatedReviews = [...prevReviews];
              if (newReviewIndex !== -1) {
                updatedReviews[newReviewIndex] = {
                  ...updatedReviews[newReviewIndex],
                  sentiment: result.sentiment,
                  confidence: result.confidence,
                  isAnalyzing: false
                };
              }
              return updatedReviews;
            });
          } catch (error) {
            console.error("Error analyzing sentiment for new review:", error);
            setReviews(prevReviews => {
              const updatedReviews = [...prevReviews];
              if (newReviewIndex !== -1) {
                updatedReviews[newReviewIndex] = {
                  ...updatedReviews[newReviewIndex],
                  sentiment: 'neutral',
                  confidence: 0,
                  isAnalyzing: false
                };
              }
              return updatedReviews;
            });
          }
        }
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    }
  };

  return (
    <div className="mt-12">
      <ReviewHeader
        selectedSentiment={selectedSentiment}
        onSentimentSelect={setSelectedSentiment}
        onReset={resetFilter}
      />
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
          reviews={filteredReviews}
          onLike={handleLikeReview}
          onDislike={handleDislikeReview}
          isProcessing={isProcessing}
        />
      )}
      
      {/* Render the spam detection dialog */}
      <SpamDialog />
    </div>
  );
};

export default ReviewSection;
