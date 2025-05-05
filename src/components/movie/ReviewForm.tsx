
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import StarRating from './StarRating';
import ReviewActions from './ReviewActions';
import TranslationModal from './TranslationModal';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  const [showTranslation, setShowTranslation] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isCheckingReviews, setIsCheckingReviews] = useState(true);
  const { user } = useAuth();
  
  const { 
    isRecording, 
    isProcessing,
    startRecording, 
    stopRecording, 
    showSpeakDialog,
    setShowSpeakDialog
  } = useVoiceRecording((text) => {
    setReviewText(prev => prev ? `${prev} ${text}` : text);
  });

  // Check browser support for audio recording
  const [microphoneSupported, setMicrophoneSupported] = useState(true);
  
  useEffect(() => {
    // Check if the browser supports getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicrophoneSupported(false);
    }
  }, []);
  
  // Check if user has already reviewed this movie
  useEffect(() => {
    const checkUserReviews = async () => {
      if (!user) {
        setIsCheckingReviews(false);
        return;
      }
      
      try {
        setIsCheckingReviews(true);
        
        // Check in the main reviews table
        const { data: mainReviews, error: mainError } = await supabase
          .from('reviews')
          .select('id')
          .eq('movie_id', movieId)
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (mainError) throw mainError;
        
        // Check in the legacy reviews table
        const { data: legacyReviews, error: legacyError } = await supabase
          .from('previous user reviews of a particular movie')
          .select('id')
          .eq('movie id', parseInt(movieId))
          .eq('user id', user.id)
          .maybeSingle();
          
        if (legacyError) throw legacyError;
        
        // User has reviewed if they exist in either table
        setHasReviewed(!!mainReviews || !!legacyReviews);
        
      } catch (error) {
        console.error('Error checking user reviews:', error);
      } finally {
        setIsCheckingReviews(false);
      }
    };
    
    checkUserReviews();
  }, [user, movieId]);
  
  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleCloseSpeakDialog = () => {
    setShowSpeakDialog(false);
    if (isRecording) {
      stopRecording();
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stars || !reviewText.trim()) {
      toast.error('Please provide both a star rating and review text');
      return;
    }
    
    // Double check that user hasn't already submitted a review
    if (hasReviewed) {
      toast.error('You have already reviewed this movie');
      return;
    }
    
    await onSubmit({
      stars,
      review_text: reviewText,
    });
    
    // After submission, update local state to prevent more reviews
    setHasReviewed(true);
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
  
  if (isCheckingReviews) {
    return (
      <div className="text-center py-6">
        <p className="text-white/70 animate-pulse">Checking previous reviews...</p>
      </div>
    );
  }
  
  if (hasReviewed) {
    return (
      <div className="text-center py-6 border border-white/10 rounded-md bg-movie-darker p-4">
        <p className="text-white/70 mb-3">You have already reviewed this movie.</p>
        <p className="text-white/50 text-sm">Each user can submit only one review per movie.</p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium mb-4">Write a Review</h3>
      
      <div className="mb-4">
        <StarRating value={stars} onChange={setStars} />
      </div>
      
      <div className="relative">
        <Textarea
          placeholder="Share your thoughts about this movie..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="bg-movie-darker border-white/10 min-h-[100px] mb-4"
          aria-label="Review text"
        />
        
        <ReviewActions 
          isRecording={isRecording}
          isProcessing={isProcessing}
          hasText={!!reviewText.trim()}
          onRecordToggle={handleToggleRecording}
          onTranslateClick={() => setShowTranslation(true)}
          showSpeakDialog={showSpeakDialog}
          onSpeakDialogClose={handleCloseSpeakDialog}
          microphoneSupported={microphoneSupported}
        />
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting || !stars || !reviewText.trim() || isRecording || isProcessing} 
          className="bg-movie-primary hover:bg-movie-primary/90"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>

      {showTranslation && reviewText.trim() && (
        <TranslationModal
          text={reviewText}
          onClose={() => setShowTranslation(false)}
          onSelect={(translatedText) => setReviewText(translatedText)}
        />
      )}
    </form>
  );
};

export default ReviewForm;
