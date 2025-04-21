
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const likeReview = async (reviewId: number) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // First, check if the user has already liked or disliked this review
    // We'll store this information in the reviews table itself
    const { data: reviewData, error: fetchError } = await supabase
      .from('reviews')
      .select('user_likes, user_dislikes, liked_by, disliked_by')
      .eq('id', reviewId)
      .single();

    if (fetchError) throw fetchError;

    // Check if user has already interacted with this review
    const likedByArray = reviewData.liked_by || [];
    const dislikedByArray = reviewData.disliked_by || [];
    
    if (likedByArray.includes(user.id) || dislikedByArray.includes(user.id)) {
      toast.error('You have already interacted with this review');
      return false;
    }

    // Then increment like count and add user to liked_by array
    const { error } = await supabase
      .from('reviews')
      .update({ 
        user_likes: (reviewData.user_likes || 0) + 1,
        liked_by: [...likedByArray, user.id]
      })
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

    // First, check if the user has already liked or disliked this review
    const { data: reviewData, error: fetchError } = await supabase
      .from('reviews')
      .select('user_likes, user_dislikes, liked_by, disliked_by')
      .eq('id', reviewId)
      .single();

    if (fetchError) throw fetchError;

    // Check if user has already interacted with this review
    const likedByArray = reviewData.liked_by || [];
    const dislikedByArray = reviewData.disliked_by || [];
    
    if (likedByArray.includes(user.id) || dislikedByArray.includes(user.id)) {
      toast.error('You have already interacted with this review');
      return false;
    }

    // Then increment dislike count and add user to disliked_by array
    const { error } = await supabase
      .from('reviews')
      .update({ 
        user_dislikes: (reviewData.user_dislikes || 0) + 1,
        disliked_by: [...dislikedByArray, user.id]
      })
      .eq('id', reviewId);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error disliking review:', error);
    toast.error('Failed to dislike review');
    return false;
  }
};
