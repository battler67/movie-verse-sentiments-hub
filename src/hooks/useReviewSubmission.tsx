
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { submitReview, ReviewData } from '@/services/review/submitReview';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useSpamDetection } from '@/hooks/useSpamDetection';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export const useReviewSubmission = (movieId: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [spamDialogOpen, setSpamDialogOpen] = useState(false);
  const [spamWords, setSpamWords] = useState<string[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { detectSpam } = useSpamDetection();

  const handleSubmit = async (stars: number, reviewText: string): Promise<boolean> => {
    if (!user) {
      toast.error('Please log in to submit a review');
      navigate('/login');
      return false;
    }

    setIsSubmitting(true);
    try {
      // Check for spam/abusive content before submitting
      const { isAbusive, foundWords } = await detectSpam(reviewText);
      
      if (isAbusive) {
        setSpamWords(foundWords);
        setSpamDialogOpen(true);
        return false;
      }

      const reviewData: ReviewData = {
        movie_id: movieId,
        stars,
        review_text: reviewText
      };

      const success = await submitReview(reviewData);
      return success;
    } finally {
      setIsSubmitting(false);
    }
  };

  const SpamDialog = () => (
    <AlertDialog open={spamDialogOpen} onOpenChange={setSpamDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Inappropriate Content Detected</AlertDialogTitle>
          <AlertDialogDescription>
            Your review contains inappropriate words or phrases that are not allowed:
            <ul className="list-disc pl-5 mt-2">
              {spamWords.map((word, index) => (
                <li key={index} className="text-red-500">{word}</li>
              ))}
            </ul>
            <p className="mt-2">Please revise your review to maintain a respectful community.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => setSpamDialogOpen(false)}>
            I'll Revise My Review
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { handleSubmit, isSubmitting, SpamDialog, spamDialogOpen };
};
