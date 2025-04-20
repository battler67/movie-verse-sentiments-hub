
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

export const likeReview = async (reviewId: number) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Fixed: Using update with direct increment instead of rpc
    const { error } = await supabase
      .from('reviews')
      .update({ user_likes: supabase.rpc('get_sentiment', { review_text: '' }) + 1 })
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

    // Fixed: Using update with direct increment instead of rpc
    const { error } = await supabase
      .from('reviews')
      .update({ user_dislikes: supabase.rpc('get_sentiment', { review_text: '' }) + 1 })
      .eq('id', reviewId);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error disliking review:', error);
    toast.error('Failed to dislike review');
    return false;
  }
};

export const getUserReviewStats = async (userId: string) => {
  try {
    // Get reviews from both tables
    const { data: mainReviews, error: mainError } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userId);

    if (mainError) throw mainError;

    const { data: previousReviews, error: previousError } = await supabase
      .from('previous user reviews of a particular movie')
      .select('*')
      .eq('user id', userId);

    if (previousError) throw previousError;

    // Convert previous reviews to a compatible format
    const convertedPreviousReviews = previousReviews.map(prev => ({
      stars: prev.user_stars,
      created_at: prev.created_at
    }));

    // Combine the reviews with proper types
    const reviews = [
      ...mainReviews,
      ...convertedPreviousReviews
    ];

    if (!reviews || reviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        reviewsByMonth: [],
        ratingDistribution: Array(5).fill(0)
      };
    }

    // Calculate total reviews
    const totalReviews = reviews.length;

    // Calculate average rating - fixed by checking proper property
    const totalStars = reviews.reduce((sum, review) => {
      return sum + (review.stars || 0);
    }, 0);
    
    const averageRating = totalReviews > 0 ? totalStars / totalReviews : 0;

    // Group reviews by month
    const reviewsByMonth: { month: string; count: number }[] = [];
    const monthsMap = new Map<string, number>();

    reviews.forEach(review => {
      const date = new Date(review.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const count = monthsMap.get(monthKey) || 0;
      monthsMap.set(monthKey, count + 1);
    });

    Array.from(monthsMap.entries()).forEach(([month, count]) => {
      reviewsByMonth.push({ month, count });
    });

    // Sort reviewsByMonth by date
    reviewsByMonth.sort((a, b) => a.month.localeCompare(b.month));

    // Calculate rating distribution - fixed by checking proper property
    const ratingDistribution = Array(5).fill(0);
    reviews.forEach(review => {
      const stars = review.stars;
      if (stars && stars > 0 && stars <= 5) {
        ratingDistribution[Math.floor(stars) - 1]++;
      }
    });

    return {
      totalReviews,
      averageRating,
      reviewsByMonth,
      ratingDistribution
    };
  } catch (error) {
    console.error('Error fetching user review stats:', error);
    toast.error('Failed to load review statistics');
    return null;
  }
};
