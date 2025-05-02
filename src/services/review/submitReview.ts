
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { analyzeSentiment } from '@/services/sentimentAnalysis';

export interface ReviewData {
  movie_id: string;
  stars: number;
  review_text: string;
}

export const submitReview = async (reviewData: ReviewData) => {
  try {
    // Get user session
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Try to get username from profile
    let username = user.email || "Anonymous";
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("username")
      .eq("email", user.email)
      .maybeSingle();
    
    if (profile && profile.username) {
      username = profile.username;
    }
    
    // Analyze sentiment
    const sentimentResult = await analyzeSentiment(reviewData.review_text);

    // Insert review
    const { error } = await supabase
      .from('reviews')
      .insert({
        movie_id: reviewData.movie_id,
        stars: reviewData.stars,
        review_text: reviewData.review_text,
        username: username,
        user_id: user.id,
        user_likes: 0,
        user_dislikes: 0,
        sentiment: sentimentResult.sentiment,
        confidence: sentimentResult.confidence
      });

    if (error) throw error;

    toast.success('Review submitted successfully!');
    return true;
  } catch (error) {
    console.error('Error submitting review:', error);
    toast.error('Failed to submit review. Please try again.');
    return false;
  }
};
