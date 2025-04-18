
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ReviewData {
  movie_id: string;
  stars: number;
  review_text: string;
  username: string;
}

export const submitReview = async (reviewData: ReviewData) => {
  try {
    // First get the user session
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Then insert the review with the user_id
    const { error } = await supabase
      .from('reviews')
      .insert({
        movie_id: reviewData.movie_id,
        stars: reviewData.stars,
        review_text: reviewData.review_text,
        username: reviewData.username,
        user_id: user.id,
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

export const getMovieReviews = async (movieId: string) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles:user_id (username, avatar_url)
      `)
      .eq('movie_id', movieId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    toast.error('Failed to load reviews');
    return [];
  }
};
