
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

interface ReviewSectionProps {
  movieId: string;
}

const SENTIMENTS: Array<'positive' | 'negative' | 'neutral'> = ['positive', 'neutral', 'negative'];

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

  const onSubmitReview = async (reviewData: ReviewData) => {
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
      const success = await likeReview(reviewId);
      if (success) {
        const updatedReviews = await getMovieReviews(movieId);
        setReviews(updatedReviews);
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
        setReviews(updatedReviews);
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
