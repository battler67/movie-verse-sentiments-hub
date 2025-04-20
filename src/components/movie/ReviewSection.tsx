import { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useReviewSubmission } from '@/hooks/useReviewSubmission';
import ReviewCard from './ReviewCard';
import SentimentTag from './SentimentTag';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { getMovieReviews } from '@/services/review/getReviews';
import { submitReview } from '@/services/review/submitReview';
import { likeReview, dislikeReview } from '@/services/review/reviewInteractions';
import { ReviewData } from '@/services/review/submitReview';

interface ReviewSectionProps {
  movieId: string;
}

const ReviewSection = ({ movieId }: ReviewSectionProps) => {
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { handleSubmit, isSubmitting } = useReviewSubmission(movieId);

  useEffect(() => {
    const loadReviews = async () => {
      setIsLoading(true);
      try {
        const reviewData = await getMovieReviews(movieId);
        console.log("Loaded reviews:", reviewData);
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

  const onSubmitReview = async () => {
    if (!user) {
      toast.error("Please log in to submit a review");
      return;
    }

    if (userRating === 0) {
      toast.error("Please add a rating");
      return;
    }

    if (reviewText.trim() === "") {
      toast.error("Please write your review");
      return;
    }

    try {
      const reviewData: ReviewData = {
        movie_id: movieId,
        stars: userRating,
        review_text: reviewText,
        username: user.email || 'Anonymous',
      };

      const success = await submitReview(reviewData);
      
      if (success) {
        const newReview = {
          id: Date.now(),
          movie_id: movieId,
          stars: userRating,
          review_text: reviewText,
          username: user.email || 'Anonymous',
          created_at: new Date().toISOString(),
          sentiment: 'neutral',
          user_id: user.id,
          user_likes: 0,
          user_dislikes: 0
        };
        
        setReviews(prevReviews => [newReview, ...prevReviews]);
        setUserRating(0);
        setReviewText("");
        
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
        {user ? (
          <>
            <h3 className="text-lg font-medium mb-4">Write a Review</h3>
            <div className="flex items-center space-x-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  size={24} 
                  className={`cursor-pointer ${
                    i < userRating ? "text-yellow-400" : "text-white/20 hover:text-yellow-400"
                  }`}
                  onClick={() => setUserRating(i + 1)}
                />
              ))}
            </div>
            <Textarea 
              placeholder="Share your thoughts on this movie..." 
              className="bg-movie-darker border-white/10 mb-4" 
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <Button 
              className="bg-movie-primary hover:bg-movie-primary/90"
              onClick={onSubmitReview}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </>
        ) : (
          <div className="text-center py-6">
            <h3 className="text-lg font-medium mb-2">Want to share your thoughts?</h3>
            <p className="text-white/60 mb-4">Sign in to write a review and join the conversation.</p>
            <Link to="/login">
              <Button className="bg-movie-primary hover:bg-movie-primary/90">
                Sign In to Review
              </Button>
            </Link>
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-white/5 rounded-lg bg-movie-dark p-6 animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-white/10"></div>
                <div className="flex-1">
                  <div className="h-4 bg-white/10 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-white/10 rounded w-16"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-white/10 rounded w-full"></div>
                <div className="h-3 bg-white/10 rounded w-full"></div>
                <div className="h-3 bg-white/10 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 border border-white/5 rounded-lg bg-movie-dark">
          <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
          <p className="text-white/60">Be the first to share your thoughts on this movie!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border border-white/5 rounded-lg bg-movie-dark p-4 md:p-6">
              <div className="flex items-start justify-between">
                <ReviewCard 
                  username={review.username || "Anonymous"}
                  date={new Date(review.created_at).toLocaleDateString()}
                  rating={review.stars}
                  comment={review.review_text}
                  sentiment={review.sentiment || "neutral"}
                />
              </div>
              <div className="mt-4 flex items-center space-x-4">
                <button 
                  className="flex items-center space-x-1 text-white/60 hover:text-white"
                  onClick={() => handleLikeReview(review.id)}
                >
                  <ThumbsUp size={16} />
                  <span>{review.user_likes || 0}</span>
                </button>
                <button 
                  className="flex items-center space-x-1 text-white/60 hover:text-white"
                  onClick={() => handleDislikeReview(review.id)}
                >
                  <ThumbsDown size={16} />
                  <span>{review.user_dislikes || 0}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
