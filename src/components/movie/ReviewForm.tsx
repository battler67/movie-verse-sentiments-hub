
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ReviewData, submitReview } from '@/services/review/submitReview';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ReviewFormProps {
  movieId: string;
  onSubmit: (reviewData: ReviewData) => Promise<void>;
  isSubmitting: boolean;
}

const ReviewForm = ({ movieId, onSubmit, isSubmitting }: ReviewFormProps) => {
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isCheckingReview, setIsCheckingReview] = useState(true);
  const [username, setUsername] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const checkExistingReview = async () => {
      if (!user) {
        setIsCheckingReview(false);
        return;
      }

      setIsCheckingReview(true);
      try {
        const { data: existingReviews, error } = await supabase
          .from('reviews')
          .select('id')
          .eq('movie_id', movieId)
          .eq('user_id', user.id);

        if (error) throw error;

        // Also check profile for name
        const { data: profile } = await supabase
          .from("user profile details")
          .select("username")
          .eq("user_id", parseInt(user.id))
          .maybeSingle();
        if (profile && profile.username) setUsername(profile.username);

        // Also check the previous reviews table
        const { data: previousReviews, error: prevError } = await supabase
          .from('previous user reviews of a particular movie')
          .select('*')
          .eq('movie id', parseInt(movieId))
          .eq('user id', user.id);

        if (prevError) throw prevError;

        setHasReviewed(
          (existingReviews && existingReviews.length > 0) || 
          (previousReviews && previousReviews.length > 0)
        );
      } catch (error) {
        console.error('Error checking existing review:', error);
      } finally {
        setIsCheckingReview(false);
      }
    };

    checkExistingReview();
  }, [user, movieId]);

  const handleSubmit = async () => {
    if (!user) return;
    if (hasReviewed) {
      toast.error('You have already reviewed this movie');
      return;
    }
    if (userRating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (reviewText.trim() === '') {
      toast.error('Please enter a review comment');
      return;
    }
    // Use the username state (from profile), don't pass username from email
    const reviewData: ReviewData = {
      movie_id: movieId,
      stars: userRating,
      review_text: reviewText,
    };
    await onSubmit(reviewData);
    setUserRating(0);
    setReviewText("");
    setHasReviewed(true);
  };

  if (!user) {
    return (
      <div className="text-center py-6">
        <h3 className="text-lg font-medium mb-2">Want to share your thoughts?</h3>
        <p className="text-white/60 mb-4">Sign in to write a review and join the conversation.</p>
        <Link to="/login">
          <Button className="bg-movie-primary hover:bg-movie-primary/90">
            Sign In to Review
          </Button>
        </Link>
      </div>
    );
  }

  if (isCheckingReview) {
    return (
      <div className="text-center py-6">
        <p className="text-white/60">Loading...</p>
      </div>
    );
  }

  if (hasReviewed) {
    return (
      <div className="text-center py-6">
        <h3 className="text-lg font-medium mb-2">Thank you for your review!</h3>
        <p className="text-white/60 mb-4">You have already reviewed this movie.</p>
      </div>
    );
  }

  return (
    <>
      <h3 className="text-lg font-medium mb-4">Write a Review {username && <span className="font-normal text-white/60">as {username}</span>}</h3>
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
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </>
  );
};

export default ReviewForm;
