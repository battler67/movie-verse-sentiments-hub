
import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Mic, Translate } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import TranslationModal from './TranslationModal';

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
  const [isRecording, setIsRecording] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const { user } = useAuth();
  
  // For recording audio
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        
        // Stop all tracks to turn off the microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.info("Recording started... Speak now");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.info("Processing speech...");
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result?.toString().split(',')[1];
        
        if (base64Audio) {
          const { data, error } = await supabase.functions.invoke('speech-to-text', {
            body: { audio: base64Audio }
          });

          if (error) {
            throw error;
          }

          if (data && data.text) {
            setReviewText(prev => prev ? `${prev} ${data.text}` : data.text);
            toast.success("Speech converted to text!");
          }
        }
      };
    } catch (error) {
      console.error("Error processing speech:", error);
      toast.error("Failed to convert speech to text");
    }
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
      
      <div className="relative">
        <Textarea
          placeholder="Share your thoughts about this movie..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="bg-movie-darker border-white/10 min-h-[100px] mb-4"
        />
        
        <div className="absolute bottom-2 right-2 flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className={`p-1 ${isRecording ? 'bg-red-500/20 text-red-400' : ''}`}
            onClick={isRecording ? stopRecording : startRecording}
            title={isRecording ? "Stop recording" : "Record your review"}
          >
            <Mic size={14} className={isRecording ? "animate-pulse" : ""} />
          </Button>
          
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="p-1"
            onClick={() => setShowTranslation(true)}
            disabled={!reviewText.trim()}
            title="Translate"
          >
            <Translate size={14} />
          </Button>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting || !stars || !reviewText.trim()} 
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
