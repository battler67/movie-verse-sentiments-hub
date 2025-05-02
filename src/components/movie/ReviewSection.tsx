
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
import { Button } from '@/components/ui/button';

interface ReviewSectionProps {
  movieId: string;
}

const ReviewSection = ({ movieId }: ReviewSectionProps) => {
  const { user } = useAuth();
  const { handleSubmit, isSubmitting } = useReviewSubmission(movieId);
  const { reviews, setReviews, isLoading } = useReviewManagement(movieId);
  const { selectedSentiment, setSelectedSentiment, filteredReviews, resetFilter } = useReviewFilters(reviews);
  const { handleLikeReview, handleDislikeReview, isProcessing } = useReviewInteractions(movieId, setReviews);

  // Sample test reviews
  const testReviews = [
    { 
      type: 'positive', 
      text: 'This movie was absolutely amazing! The cinematography, acting, and storyline were all excellent. I would definitely recommend it to anyone who enjoys this genre.', 
      stars: 5
    },
    { 
      type: 'negative', 
      text: 'Terrible movie with poor acting and a confusing plot. The special effects were underwhelming and the dialogue was cringeworthy. Would not recommend.', 
      stars: 1
    },
    { 
      type: 'neutral', 
      text: 'This movie had some good moments, but overall it was just average. The acting was decent but the storyline could have been better developed.', 
      stars: 3
    }
  ];

  const submitTestReview = async (review: typeof testReviews[0]) => {
    if (!user) {
      toast.error("Please log in to submit a test review");
      return;
    }

    try {
      const success = await handleSubmit(review.stars, review.text);
      if (success) {
        toast.success(`Test ${review.type} review submitted!`);
        const updatedReviews = await getMovieReviews(movieId);
        setReviews(updatedReviews);
      }
    } catch (error) {
      console.error("Error submitting test review:", error);
      toast.error("Failed to submit test review");
    }
  };

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

      {user && (
        <div className="mb-6 p-4 border border-white/5 rounded-lg bg-movie-dark">
          <h4 className="text-sm font-semibold mb-3">Test Reviews</h4>
          <div className="flex flex-wrap gap-2">
            {testReviews.map((review, idx) => (
              <Button 
                key={idx}
                variant="outline" 
                size="sm"
                onClick={() => submitTestReview(review)} 
                disabled={isSubmitting}
                className={`text-xs ${
                  review.type === 'positive' 
                    ? 'bg-green-500/10 hover:bg-green-500/20 text-green-400' 
                    : review.type === 'negative' 
                      ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
                      : 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400'
                }`}
              >
                Add {review.type} review
              </Button>
            ))}
          </div>
          <p className="text-xs text-white/40 mt-2">
            Click any button above to add a sample review for testing sentiment analysis
          </p>
        </div>
      )}

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
