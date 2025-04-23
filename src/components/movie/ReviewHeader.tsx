
import ReviewFilterControls from './ReviewFilterControls';

interface ReviewHeaderProps {
  selectedSentiment: 'positive' | 'negative' | 'neutral' | null;
  onSentimentSelect: (sentiment: 'positive' | 'negative' | 'neutral' | null) => void;
  onReset: () => void;
}

const ReviewHeader = ({
  selectedSentiment,
  onSentimentSelect,
  onReset
}: ReviewHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
      <h2 className="text-xl font-bold">Reviews</h2>
      <ReviewFilterControls
        selectedSentiment={selectedSentiment}
        onSentimentSelect={onSentimentSelect}
        onReset={onReset}
      />
    </div>
  );
};

export default ReviewHeader;
