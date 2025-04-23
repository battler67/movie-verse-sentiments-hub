
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
import { ReviewData } from '@/services/review/submitReview';
import { analyzeSentiment } from '@/services/sentimentAnalysis';

interface ReviewSectionProps {
  movieId: string;
}

const SENTIMENTS: Array<'positive' | 'negative' | 'neutral'> = ['positive', 'neutral', 'negative'];

// Google Ads conversion tracking
const trackConversion = () => {
  if (window.gtag) {
    window.gtag('event', 'ads_conversion_Sign_up_1', {});
  }
};

const ReviewSection = ({ movieId }: ReviewSectionProps) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { handleSubmit, isSubmitting } = useReviewSubmission(movieId);
  const [selectedSentiment, setSelectedSentiment] = useState<'positive' | 'neutral' | 'negative' | null>(null);

  useEffect(() => {
    const loadReviews = async () => {
      setIsLoading(true);
      try {
        const reviewData = await getMovieReviews(movieId);
        
        // Mark reviews as analyzing initially
        const reviewsWithAnalysis = reviewData.map(review => ({
          ...review,
          isAnalyzing: true
        }));
        
        setReviews(reviewsWithAnalysis);
        
        // Process each review for sentiment analysis
        reviewsWithAnalysis.forEach(async (review, index) => {
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

  const onSubmitReview = async (reviewData: ReviewData) => {
    if (!user) {
      toast.error("Please log in to submit a review");
      return;
    }

    try {
      const success = await handleSubmit(reviewData.stars, reviewData.review_text);
      if (success) {
        // Track conversion
        trackConversion();
        
        // Reload reviews after successful submission
        const updatedReviews = await getMovieReviews(movieId);
        
        // Add analyzing state to the new review (which should be the latest one)
        const newReviewWithAnalysis = updatedReviews.map((review, index) => {
          // If it's a new review (not in previous list), mark as analyzing
          const isNewReview = !reviews.some(r => r.id === review.id);
          return {
            ...review,
            isAnalyzing: isNewReview
          };
        });
        
        setReviews(newReviewWithAnalysis);
        
        // Analyze sentiment for the newly added review (which should be the latest)
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

  const handleLikeReview = async (reviewId: number) => {
    if (!user) {
      toast.error("Please log in to like a review");
      return;
    }
    try {
      const success = await likeReview(reviewId);
      if (success) {
        const updatedReviews = await getMovieReviews(movieId);
        
        // Preserve sentiment analysis data when updating reviews
        const mergedReviews = updatedReviews.map(updatedReview => {
          const existingReview = reviews.find(r => r.id === updatedReview.id);
          return {
            ...updatedReview,
            sentiment: existingReview?.sentiment || 'neutral',
            confidence: existingReview?.confidence || 45,
            isAnalyzing: existingReview?.isAnalyzing || false
          };
        });
        
        setReviews(mergedReviews);
      }
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
      const success = await dislikeReview(reviewId);
      if (success) {
        const updatedReviews = await getMovieReviews(movieId);
        
        // Preserve sentiment analysis data when updating reviews
        const mergedReviews = updatedReviews.map(updatedReview => {
          const existingReview = reviews.find(r => r.id === updatedReview.id);
          return {
            ...updatedReview,
            sentiment: existingReview?.sentiment || 'neutral',
            confidence: existingReview?.confidence || 45,
            isAnalyzing: existingReview?.isAnalyzing || false
          };
        });
        
        setReviews(mergedReviews);
      }
    } catch (error) {
      console.error("Error disliking review:", error);
      toast.error("Failed to dislike review");
    }
  };

  // Filter reviews based on selected sentiment (or show all if not selected)
  const filteredReviews = selectedSentiment
    ? reviews.filter(r => r.sentiment === selectedSentiment)
    : reviews;

  return (
    <div className="mt-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        <h2 className="text-xl font-bold">Reviews</h2>
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
          {/* Display sentiment tags as filter buttons */}
          <div className="flex items-center space-x-2">
            {SENTIMENTS.map(sentiment => (
              <button
                key={sentiment}
                type="button"
                className={`
                  border border-white/5 rounded 
                  px-2 py-1
                  transition
                  ${selectedSentiment === sentiment ? 'bg-movie-primary/70' : 'bg-movie-dark'}
                  hover:bg-movie-primary/40
                  focus:outline-none
                `}
                onClick={() => setSelectedSentiment(s => s === sentiment ? null : sentiment)}
              >
                <SentimentTag sentiment={sentiment} />
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-white/10"
            onClick={() => setSelectedSentiment(null)}
            disabled={!selectedSentiment}
          >
            Reset Filter
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
          reviews={filteredReviews}
          onLike={handleLikeReview}
          onDislike={handleDislikeReview}
        />
      )}
    </div>
  );
};

export default ReviewSection;
