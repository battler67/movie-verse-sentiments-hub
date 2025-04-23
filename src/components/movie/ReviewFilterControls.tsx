
import { Button } from '@/components/ui/button';
import SentimentTag from './SentimentTag';

const SENTIMENTS = ['positive', 'neutral', 'negative'] as const;

interface ReviewFilterControlsProps {
  selectedSentiment: 'positive' | 'negative' | 'neutral' | null;
  onSentimentSelect: (sentiment: 'positive' | 'negative' | 'neutral' | null) => void;
  onReset: () => void;
}

const ReviewFilterControls = ({
  selectedSentiment,
  onSentimentSelect,
  onReset
}: ReviewFilterControlsProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
      <div className="flex items-center space-x-2">
        {SENTIMENTS.map(sentiment => (
          <button
            key={sentiment}
            type="button"
            className={`
              border border-white/5 rounded 
              px-2 py-1
              transition
              ${selectedSentiment === sentiment ? 'bg-movie-primary/70' : 'bg-movie-dark'}
              hover:bg-movie-primary/40
              focus:outline-none
            `}
            onClick={() => onSentimentSelect(sentiment === selectedSentiment ? null : sentiment)}
          >
            <SentimentTag sentiment={sentiment} />
          </button>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="border-white/10"
        onClick={onReset}
        disabled={!selectedSentiment}
      >
        Reset Filter
      </Button>
    </div>
  );
};

export default ReviewFilterControls;
