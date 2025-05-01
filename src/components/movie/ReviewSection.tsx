
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

const trackConversion = () => {
  if (window.gtag) {
    window.gtag('event', 'ads_conversion_Sign_up_1', {});
  }
};

const ReviewSection = ({ movieId }: ReviewSectionProps) => {
  const { user } = useAuth();
  const { handleSubmit, isSubmitting } = useReviewSubmission(movieId);
  const { reviews, setReviews, isLoading } = useReviewManagement(movieId);
  const { selectedSentiment, setSelectedSentiment, filteredReviews, resetFilter } = useReviewFilters(reviews);
  const { handleLikeReview, handleDislikeReview, isProcessing } = useReviewInteractions(movieId, setReviews);

  const onSubmitReview = async (reviewData: ReviewData) => {
    if (!user) {
      toast.error("Please log in to submit a review");
      return;
    }

    try {
      const success = await handleSubmit(reviewData.stars, reviewData.review_text);
      if (success) {
        trackConversion();
        
        const updatedReviews = await getMovieReviews(movieId);
        const newReviewWithAnalysis = updatedReviews.map((review, index) => {
          const isNewReview = !reviews.some(r => r.id === review.id);
          return {
            ...review,
            isAnalyzing: isNewReview
          };
        });
        
        setReviews(newReviewWithAnalysis);
        
        const newReview = updatedReviews.find(review => !reviews.some(r => r.id === review.id));
        
        if (newReview) {
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
                  confidence: 45,
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
    </div>
  );
};

export default ReviewSection;
