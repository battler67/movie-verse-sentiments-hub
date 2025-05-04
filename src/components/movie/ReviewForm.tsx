
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import StarRating from './StarRating';
import ReviewActions from './ReviewActions';
import TranslationModal from './TranslationModal';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';

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
