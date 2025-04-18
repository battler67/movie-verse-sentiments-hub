
import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useReviewSubmission } from '@/hooks/useReviewSubmission';
import ReviewCard from './ReviewCard';
import SentimentTag from './SentimentTag';
import { toast } from 'sonner';

interface ReviewSectionProps {
  movieId: string;
}

const ReviewSection = ({ movieId }: ReviewSectionProps) => {
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const { user } = useAuth();
  const { handleSubmit, isSubmitting } = useReviewSubmission(movieId);

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

    await handleSubmit(userRating, reviewText);
    setUserRating(0);
    setReviewText("");
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
      </div>
    </div>
  );
};

export default ReviewSection;
