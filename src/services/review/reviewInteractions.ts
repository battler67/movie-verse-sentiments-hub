import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const likeReview = async (reviewId: number) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Fetch review data including liked_by and disliked_by (UUID arrays)
    const { data: reviewData, error: fetchError } = await supabase
      .from('reviews')
      .select('user_likes, user_dislikes, liked_by, disliked_by')
      .eq('id', reviewId)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!reviewData) {
      toast.error('Review not found');
      return false;
    }

    // These should be arrays, but let's make sure to treat them correctly
    const likedByArray = Array.isArray(reviewData.liked_by) ? reviewData.liked_by : [];
    const dislikedByArray = Array.isArray(reviewData.disliked_by) ? reviewData.disliked_by : [];

    // If user has already liked the review, remove the like (toggle)
    if (likedByArray.includes(user.id)) {
      const { error } = await supabase
        .from('reviews')
        .update({ 
          user_likes: Math.max((reviewData.user_likes || 1) - 1, 0),
          liked_by: likedByArray.filter(id => id !== user.id)
        })
        .eq('id', reviewId);

      if (error) throw error;
      toast.success('Like removed');
      return true;
    }

    // If user has already disliked the review, show message
    if (dislikedByArray.includes(user.id)) {
      toast.error('You have already disliked this review');
      return false;
    }

    // Otherwise, add a like
    const { error } = await supabase
      .from('reviews')
      .update({ 
        user_likes: (reviewData.user_likes || 0) + 1,
        liked_by: [...likedByArray, user.id]
      })
      .eq('id', reviewId);

    if (error) throw error;
    toast.success('Review liked');
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

    // Fetch review data including liked_by and disliked_by (UUID arrays)
    const { data: reviewData, error: fetchError } = await supabase
      .from('reviews')
      .select('user_likes, user_dislikes, liked_by, disliked_by')
      .eq('id', reviewId)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!reviewData) {
      toast.error('Review not found');
      return false;
    }

    const likedByArray = Array.isArray(reviewData.liked_by) ? reviewData.liked_by : [];
    const dislikedByArray = Array.isArray(reviewData.disliked_by) ? reviewData.disliked_by : [];
    
    // If user has already disliked the review, remove the dislike (toggle)
    if (dislikedByArray.includes(user.id)) {
      const { error } = await supabase
        .from('reviews')
        .update({ 
          user_dislikes: Math.max((reviewData.user_dislikes || 1) - 1, 0),
          disliked_by: dislikedByArray.filter(id => id !== user.id)
        })
        .eq('id', reviewId);

      if (error) throw error;
      toast.success('Dislike removed');
      return true;
    }

    // If user has already liked the review, show message
    if (likedByArray.includes(user.id)) {
      toast.error('You have already liked this review');
      return false;
    }

    // Otherwise, add a dislike
    const { error } = await supabase
      .from('reviews')
      .update({ 
        user_dislikes: (reviewData.user_dislikes || 0) + 1,
        disliked_by: [...dislikedByArray, user.id]
      })
      .eq('id', reviewId);

    if (error) throw error;
    toast.success('Review disliked');
    return true;
  } catch (error) {
    console.error('Error disliking review:', error);
    toast.error('Failed to dislike review');
    return false;
  }
};
