
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
        profiles:user_id(username, avatar_url)
      `)
      .eq('movie_id', movieId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    toast.error('Failed to load reviews');
    return [];
  }
};

export const getUserReviews = async (userId: string) => {
  try {
    // Modified this query to not use the foreign key relationship
    // and instead just select all columns from reviews
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    toast.error('Failed to load your reviews');
    return [];
  }
};

export const getUserReviewStats = async (userId: string) => {
  try {
    // Get all reviews for the user
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

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

    // Calculate average rating
    const totalStars = reviews.reduce((sum, review) => sum + (review.stars || 0), 0);
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

    // Calculate rating distribution (how many 1-star, 2-star, etc.)
    const ratingDistribution = Array(5).fill(0);
    reviews.forEach(review => {
      if (review.stars && review.stars > 0 && review.stars <= 5) {
        ratingDistribution[review.stars - 1]++;
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
