
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
        user_dislikes: 0
      });

    if (error) throw error;

    // Also insert into the "previous user reviews of a particular movie" table
    const { error: previousError } = await supabase
      .from('previous user reviews of a particular movie')
      .insert({
        'movie id': parseInt(reviewData.movie_id),
        'user id': user.id,
        review: reviewData.review_text,
        user_stars: reviewData.stars,
        user_sentiment: 'neutral', // Default until processed
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
