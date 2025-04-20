
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const likeReview = async (reviewId: number) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // First, get the current like count
    const { data: reviewData, error: fetchError } = await supabase
      .from('reviews')
      .select('user_likes')
      .eq('id', reviewId)
      .single();

    if (fetchError) throw fetchError;

    // Then increment it
    const { error } = await supabase
      .from('reviews')
      .update({ user_likes: (reviewData.user_likes || 0) + 1 })
      .eq('id', reviewId);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error liking review:', error);
    toast.error('Failed to like review');
    return false;
  }
};

export const dislikeReview = async (reviewId: number) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // First, get the current dislike count
    const { data: reviewData, error: fetchError } = await supabase
      .from('reviews')
      .select('user_dislikes')
      .eq('id', reviewId)
      .single();

    if (fetchError) throw fetchError;

    // Then increment it
    const { error } = await supabase
      .from('reviews')
      .update({ user_dislikes: (reviewData.user_dislikes || 0) + 1 })
      .eq('id', reviewId);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error disliking review:', error);
    toast.error('Failed to dislike review');
    return false;
  }
};
