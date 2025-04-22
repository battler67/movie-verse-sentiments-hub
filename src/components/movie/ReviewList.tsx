
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
  // Calculate total likes and dislikes
  const totalLikes = reviews.reduce((sum, review) => sum + (review.user_likes || 0), 0);
  const totalDislikes = reviews.reduce((sum, review) => sum + (review.user_dislikes || 0), 0);

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
    </div>
  );
};

export default ReviewList;
