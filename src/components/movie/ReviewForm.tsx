
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { detectSpam } from '@/services/review/spamDetection';
import SentimentTag from './SentimentTag';
import { analyzeSentiment } from '@/services/sentimentAnalysis';

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
  const [showAbusiveAlert, setShowAbusiveAlert] = useState(false);
  const [liveAnalysis, setLiveAnalysis] = useState<{sentiment: 'positive' | 'negative' | 'neutral', confidence?: number} | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisTimeout, setAnalysisTimeout] = useState<NodeJS.Timeout | null>(null);
  const { user } = useAuth();
  
  // Live sentiment analysis effect
  useEffect(() => {
    if (reviewText.trim().length > 5) {
      setIsAnalyzing(true);
      
      // Clear any existing timeout
      if (analysisTimeout) {
        clearTimeout(analysisTimeout);
      }
      
      // Set a new timeout for sentiment analysis
      const timeout = setTimeout(async () => {
        try {
          const result = await analyzeSentiment(reviewText);
          setLiveAnalysis(result);
        } catch (error) {
          console.error('Error analyzing sentiment:', error);
        } finally {
          setIsAnalyzing(false);
        }
      }, 1000); // Delay analysis by 1 second after typing stops
      
      setAnalysisTimeout(timeout);
    } else {
      // Reset for very short text
      setLiveAnalysis(null);
      setIsAnalyzing(false);
      if (analysisTimeout) {
        clearTimeout(analysisTimeout);
      }
    }
    
    // Cleanup timeout on component unmount
    return () => {
      if (analysisTimeout) {
        clearTimeout(analysisTimeout);
      }
    };
  }, [reviewText]);
  
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

    const spamCheck = await detectSpam(reviewText);
    
    if (spamCheck.isAbusive) {
      setShowAbusiveAlert(true);
      return;
    }
    
    await onSubmit({
      stars,
      review_text: reviewText,
    });
    
    setStars(0);
    setReviewText('');
    setLiveAnalysis(null);
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
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Write a Review</h3>
          {isAnalyzing ? (
            <SentimentTag sentiment="neutral" isAnalyzing={true} className="border border-white/5" />
          ) : liveAnalysis ? (
            <SentimentTag 
              sentiment={liveAnalysis.sentiment} 
              confidence={liveAnalysis.confidence} 
              className="border border-white/5"
            />
          ) : (
            <SentimentTag sentiment="neutral" className="border border-white/5" />
          )}
        </div>
        
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

      <AlertDialog open={showAbusiveAlert} onOpenChange={setShowAbusiveAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Inappropriate Content Detected</AlertDialogTitle>
            <AlertDialogDescription>
              Please post non-abusive reviews. Your review contains inappropriate content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>OK</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ReviewForm;
