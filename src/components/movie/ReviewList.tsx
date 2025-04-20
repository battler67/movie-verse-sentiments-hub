
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import ReviewCard from './ReviewCard';

interface Review {
  id: number;
  username: string;
  created_at: string;
  stars: number;
  review_text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  user_likes: number;
  user_dislikes: number;
}

interface ReviewListProps {
  reviews: Review[];
  onLike: (reviewId: number) => Promise<void>;
  onDislike: (reviewId: number) => Promise<void>;
}

const ReviewList = ({ reviews, onLike, onDislike }: ReviewListProps) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 border border-white/5 rounded-lg bg-movie-dark">
        <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
        <p className="text-white/60">Be the first to share your thoughts on this movie!</p>
      </div>
    );
  }

  return (
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
            />
          </div>
          <div className="mt-4 flex items-center space-x-4">
            <button 
              className="flex items-center space-x-1 text-white/60 hover:text-white"
              onClick={() => onLike(review.id)}
            >
              <ThumbsUp size={16} />
              <span>{review.user_likes || 0}</span>
            </button>
            <button 
              className="flex items-center space-x-1 text-white/60 hover:text-white"
              onClick={() => onDislike(review.id)}
            >
              <ThumbsDown size={16} />
              <span>{review.user_dislikes || 0}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
