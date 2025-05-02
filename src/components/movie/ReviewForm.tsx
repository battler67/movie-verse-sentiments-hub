
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from 'lucide-react';

export interface ReviewData {
  stars: number;
  review_text: string;
}

interface ReviewFormProps {
  movieId: string;
  onSubmit: (reviewData: ReviewData) => Promise<void>;
  isSubmitting: boolean;
}

const ReviewForm = ({ movieId, onSubmit, isSubmitting }: ReviewFormProps) => {
  const [stars, setStars] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const { user } = useAuth();
  
  const handleStarClick = (rating: number) => {
    setStars(rating);
  };
  
  const handleStarHover = (rating: number) => {
    setHoveredStar(rating);
  };
  
  const handleStarLeave = () => {
    setHoveredStar(0);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stars || !reviewText.trim()) return;
    
    await onSubmit({
      stars,
      review_text: reviewText,
    });
    
    setStars(0);
    setReviewText('');
  };
  
  if (!user) {
    return (
      <div className="text-center py-6">
        <p className="text-white/70 mb-3">Please sign in to leave a review</p>
        <Button asChild variant="outline">
          <a href="/login">Sign In</a>
        </Button>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-lg font-medium mb-4">Write a Review</h3>
      
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <span className="text-sm text-white/70 mr-2">Your Rating:</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Star
                key={rating}
                className={`h-5 w-5 cursor-pointer ${
                  rating <= (hoveredStar || stars) 
                    ? 'text-yellow-400 fill-yellow-400' 
                    : 'text-gray-400'
                }`}
                onClick={() => handleStarClick(rating)}
                onMouseEnter={() => handleStarHover(rating)}
                onMouseLeave={handleStarLeave}
              />
            ))}
          </div>
        </div>
      </div>
      
      <Textarea
        placeholder="Share your thoughts about this movie..."
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        className="bg-movie-darker border-white/10 min-h-[100px] mb-4"
      />
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting || !stars || !reviewText.trim()} 
          className="bg-movie-primary hover:bg-movie-primary/90"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;
