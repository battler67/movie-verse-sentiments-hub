
import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ReviewData } from '@/services/review/submitReview';

interface ReviewFormProps {
  movieId: string;
  onSubmit: (reviewData: ReviewData) => Promise<void>;
  isSubmitting: boolean;
}

const ReviewForm = ({ movieId, onSubmit, isSubmitting }: ReviewFormProps) => {
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!user) return;

    const reviewData: ReviewData = {
      movie_id: movieId,
      stars: userRating,
      review_text: reviewText,
      username: user.email || 'Anonymous',
    };

    await onSubmit(reviewData);
    setUserRating(0);
    setReviewText("");
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

  return (
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
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </>
  );
};

export default ReviewForm;
