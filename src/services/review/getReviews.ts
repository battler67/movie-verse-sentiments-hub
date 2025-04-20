
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const getMovieReviews = async (movieId: string) => {
  try {
    // First get reviews from the main reviews table
    const { data: mainReviews, error: mainError } = await supabase
      .from('reviews')
      .select('*')
      .eq('movie_id', movieId)
      .order('created_at', { ascending: false });

    if (mainError) throw mainError;

    // Then get reviews from the "previous user reviews" table
    const { data: previousReviews, error: previousError } = await supabase
      .from('previous user reviews of a particular movie')
      .select('*')
      .eq('movie id', parseInt(movieId))
      .order('created_at', { ascending: false });

    if (previousError) throw previousError;

    // Convert previous reviews to match the format of main reviews
    const formattedPreviousReviews = previousReviews.map(prev => ({
      id: prev.created_at + prev['user id'], // Create a unique ID
      movie_id: prev['movie id'].toString(),
      stars: prev.user_stars,
      review_text: prev.review,
      sentiment: prev.user_sentiment,
      username: prev['user id'],
      created_at: prev.created_at,
      user_id: prev['user id'],
      user_likes: prev.user_likes || 0,
      user_dislikes: prev.user_dislikes || 0
    }));

    // Combine both sets of reviews
    const allReviews = [...mainReviews, ...formattedPreviousReviews];
    
    // Sort by creation date, newest first
    allReviews.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return allReviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    toast.error('Failed to load reviews');
    return [];
  }
};

export const getUserReviews = async (userId: string) => {
  try {
    // Get reviews from main reviews table
    const { data: mainReviews, error: mainError } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (mainError) throw mainError;

    // Get reviews from previous reviews table
    const { data: previousReviews, error: previousError } = await supabase
      .from('previous user reviews of a particular movie')
      .select('*')
      .eq('user id', userId)
      .order('created_at', { ascending: false });

    if (previousError) throw previousError;

    // Convert previous reviews to match the format of main reviews
    const formattedPreviousReviews = previousReviews.map(prev => ({
      id: prev.created_at + prev['user id'], // Create a unique ID
      movie_id: prev['movie id'].toString(),
      stars: prev.user_stars,
      review_text: prev.review,
      sentiment: prev.user_sentiment,
      username: prev['user id'],
      created_at: prev.created_at,
      user_id: prev['user id'],
      user_likes: prev.user_likes || 0,
      user_dislikes: prev.user_dislikes || 0
    }));

    // Combine both sets of reviews
    const allReviews = [...mainReviews, ...formattedPreviousReviews];
    
    // Sort by creation date, newest first
    allReviews.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return allReviews;
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    toast.error('Failed to load your reviews');
    return [];
  }
};
