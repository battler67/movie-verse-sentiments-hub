
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { analyzeSentiment, moderateReview, generateReviewSummary } from '@/services/sentimentAnalysis';

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

    // Moderate review content for profanity
    const { isClean, cleanedText } = await moderateReview(reviewData.review_text);
    if (!isClean) {
      toast.warning('Your review contained inappropriate language and has been modified.');
    }
    
    // Use the cleaned text for all operations
    const finalReviewText = isClean ? reviewData.review_text : cleanedText;

    // Analyze sentiment
    const sentimentResult = await analyzeSentiment(finalReviewText);
    
    // Generate summary for longer reviews
    let reviewSummary = '';
    if (finalReviewText.length > 200) {
      reviewSummary = await generateReviewSummary(finalReviewText);
    }

    // Insert review
    const { error } = await supabase
      .from('reviews')
      .insert({
        movie_id: reviewData.movie_id,
        stars: reviewData.stars,
        review_text: finalReviewText,
        review_summary: reviewSummary,
        username: username,
        user_id: user.id,
        user_likes: 0,
        user_dislikes: 0,
        sentiment: sentimentResult.sentiment,
        confidence: sentimentResult.confidence
      });

    if (error) throw error;

    // Also insert into the "previous user reviews of a particular movie" table
    const { error: previousError } = await supabase
      .from('previous user reviews of a particular movie')
      .insert({
        'movie id': parseInt(reviewData.movie_id),
        'user id': user.id,
        review: finalReviewText,
        user_stars: reviewData.stars,
        user_sentiment: sentimentResult.sentiment,
        user_likes: 0,
        user_dislikes: 0
      });

    if (previousError) {
      console.error('Error inserting into previous reviews:', previousError);
    }

    toast.success('Review submitted successfully!');
    return true;
  } catch (error) {
    console.error('Error submitting review:', error);
    toast.error('Failed to submit review. Please try again.');
    return false;
  }
};
