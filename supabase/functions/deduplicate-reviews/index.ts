import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { movieId } = await req.json();
    
    if (!movieId) {
      return new Response(
        JSON.stringify({ error: "Missing movieId parameter" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get all reviews for this movie
    const { data: reviews, error: fetchError } = await supabase
      .from('reviews')
      .select('*')
      .eq('movie_id', movieId)
      .order('created_at', { ascending: false });

    if (fetchError) {
      throw fetchError;
    }

    // Group reviews by user_id
    const reviewsByUser: Record<string, any[]> = {};
    reviews?.forEach(review => {
      if (review.user_id) {
        if (!reviewsByUser[review.user_id]) {
          reviewsByUser[review.user_id] = [];
        }
        reviewsByUser[review.user_id].push(review);
      }
    });

    // Find duplicate reviews (more than one review per user)
    const duplicates: number[] = [];
    Object.values(reviewsByUser).forEach(userReviews => {
      if (userReviews.length > 1) {
        // Keep the most recent review, mark others as duplicates
        const [mostRecent, ...older] = userReviews;
        older.forEach(review => {
          duplicates.push(review.id);
        });
      }
    });

    // Delete duplicate reviews if any found
    let result = { removed: 0 };
    if (duplicates.length > 0) {
      const { error: deleteError, count } = await supabase
        .from('reviews')
        .delete({ count: 'exact' })
        .in('id', duplicates);

      if (deleteError) {
        throw deleteError;
      }
      
      result.removed = count || 0;
      console.log(`Removed ${result.removed} duplicate reviews`);
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in deduplicate-reviews function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
