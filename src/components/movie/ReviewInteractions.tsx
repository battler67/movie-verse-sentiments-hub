
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface ReviewInteractionsProps {
  reviewId: number;
  likes: number;
  dislikes: number;
  onLike: (reviewId: number) => Promise<void>;
  onDislike: (reviewId: number) => Promise<void>;
  isProcessing?: boolean;
}

const ReviewInteractions = ({
  reviewId,
  likes,
  dislikes,
  onLike,
  onDislike,
  isProcessing = false
}: ReviewInteractionsProps) => {
  return (
    <div className="flex items-center space-x-4">
      <button
        className="flex items-center space-x-1 text-white/60 hover:text-white transition-colors disabled:opacity-50"
        onClick={() => onLike(reviewId)}
        disabled={isProcessing}
      >
        <ThumbsUp size={16} />
        <span>{likes || 0}</span>
      </button>
      <button
        className="flex items-center space-x-1 text-white/60 hover:text-white transition-colors disabled:opacity-50"
        onClick={() => onDislike(reviewId)}
        disabled={isProcessing}
      >
        <ThumbsDown size={16} />
        <span>{dislikes || 0}</span>
      </button>
    </div>
  );
};

export default ReviewInteractions;
