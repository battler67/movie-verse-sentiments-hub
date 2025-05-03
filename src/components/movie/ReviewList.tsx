
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState } from 'react';
import ReviewCard from './ReviewCard';
import ReviewInteractions from './ReviewInteractions';
import TranslationModal from './TranslationModal';

interface Review {
  id: number;
  username: string;
  created_at: string;
  stars: number;
  review_text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence?: number;
  isAnalyzing?: boolean;
  user_likes: number;
  user_dislikes: number;
  language?: string;
}

interface ReviewListProps {
  reviews: Review[];
  onLike: (reviewId: number) => Promise<void>;
  onDislike: (reviewId: number) => Promise<void>;
  isProcessing?: boolean;
}

const ReviewList = ({ reviews, onLike, onDislike, isProcessing }: ReviewListProps) => {
  // State for translation modal
  const [isTranslationOpen, setIsTranslationOpen] = useState(false);
  const [reviewToTranslate, setReviewToTranslate] = useState<Review | null>(null);
  
  // Calculate total likes and dislikes
  const totalLikes = reviews.reduce((sum, review) => sum + (review.user_likes || 0), 0);
  const totalDislikes = reviews.reduce((sum, review) => sum + (review.user_dislikes || 0), 0);

  const handleOpenTranslation = (review: Review) => {
    setReviewToTranslate(review);
    setIsTranslationOpen(true);
  };

  const handleCloseTranslation = () => {
    setIsTranslationOpen(false);
    setReviewToTranslate(null);
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 border border-white/5 rounded-lg bg-movie-dark">
        <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
        <p className="text-white/60">Be the first to share your thoughts on this movie!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 p-4 border border-white/5 rounded-lg bg-movie-dark">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-white/80 text-sm">
              Total Reviews: <span className="font-semibold text-white">{reviews.length}</span>
            </span>
          </div>
          <div className="flex space-x-6">
            <div className="flex items-center space-x-1">
              <ThumbsUp size={14} className="text-green-500" />
              <span className="text-white/80 text-sm">
                Likes: <span className="font-semibold text-white">{totalLikes}</span>
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <ThumbsDown size={14} className="text-red-500" />
              <span className="text-white/80 text-sm">
                Dislikes: <span className="font-semibold text-white">{totalDislikes}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border border-white/5 rounded-lg bg-movie-dark p-4 md:p-6">
            <div className="flex items-start justify-between">
              <ReviewCard
                username={review.username}
                date={new Date(review.created_at).toLocaleDateString()}
                rating={review.stars}
                comment={review.review_text}
                sentiment={review.sentiment}
                confidence={review.confidence}
                isAnalyzing={review.isAnalyzing}
                language={review.language || 'en'}
              />
            </div>
            <div className="mt-4 flex justify-between items-center">
              <ReviewInteractions
                reviewId={review.id}
                likes={review.user_likes}
                dislikes={review.user_dislikes}
                onLike={onLike}
                onDislike={onDislike}
                isProcessing={isProcessing}
              />
              <button
                onClick={() => handleOpenTranslation(review)}
                className="text-xs bg-movie-primary/20 hover:bg-movie-primary/30 text-movie-primary px-3 py-1 rounded transition-colors"
              >
                See Translation
              </button>
            </div>
          </div>
        ))}
      </div>

      {isTranslationOpen && reviewToTranslate && (
        <TranslationModal
          text={reviewToTranslate.review_text}
          onClose={handleCloseTranslation}
          onSelect={() => {}}
          isReadOnly={true}
        />
      )}
    </div>
  );
};

export default ReviewList;
