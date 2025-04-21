
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

    // Convert previous reviews to match main review format
    const convertedPreviousReviews = previousReviews.map(prev => ({
      stars: prev.user_stars,
      created_at: prev.created_at
    }));

    // Combine the reviews
    const reviews = [
      ...mainReviews,
      ...convertedPreviousReviews
    ];

    if (!reviews || reviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        reviewsByMonth: [],
        reviewsByDay: [],
        ratingDistribution: Array(5).fill(0)
      };
    }

    // Calculate total reviews
    const totalReviews = reviews.length;

    // Calculate average rating
    const totalStars = reviews.reduce((sum, review) => {
      return sum + (review.stars || 0);
    }, 0);
    
    const averageRating = totalReviews > 0 ? totalStars / totalReviews : 0;

    // Group reviews by month
    const reviewsByMonth: { month: string; count: number }[] = [];
    const monthsMap = new Map<string, number>();

    // Group reviews by day
    const reviewsByDay: { day: string; count: number }[] = [];
    const daysMap = new Map<string, number>();

    reviews.forEach(review => {
      // By month
      const date = new Date(review.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const currentMonthCount = monthsMap.get(monthKey) || 0;
      monthsMap.set(monthKey, currentMonthCount + 1);
      // By day
      const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const currentDayCount = daysMap.get(dayKey) || 0;
      daysMap.set(dayKey, currentDayCount + 1);
    });

    Array.from(monthsMap.entries()).forEach(([month, count]) => {
      reviewsByMonth.push({ month, count });
    });

    Array.from(daysMap.entries()).forEach(([day, count]) => {
      reviewsByDay.push({ day, count });
    });

    // Sort
    reviewsByMonth.sort((a, b) => a.month.localeCompare(b.month));
    reviewsByDay.sort((a, b) => a.day.localeCompare(b.day));

    // Calculate rating distribution
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
      reviewsByDay,
      ratingDistribution
    };
  } catch (error) {
    console.error('Error fetching user review stats:', error);
    toast.error('Failed to load review statistics');
    return null;
  }
};
