
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number; // 0-100 percentage
}

export const analyzeSentiment = async (text: string): Promise<SentimentAnalysis> => {
  try {
    // Call our Supabase Edge Function for sentiment analysis
    const { data, error } = await supabase.functions.invoke('sentiment-analysis', {
      body: { text }
    });

    if (error) {
      console.error("Supabase Edge Function error:", error);
      throw error;
    }
    
    return {
      sentiment: data.sentiment || 'neutral',
      confidence: data.confidence || 0
    };
  } catch (error) {
    console.error("Sentiment analysis error:", error);
    toast.error("Failed to analyze sentiment");
    // Default values if API fails
    return { sentiment: 'neutral', confidence: 0 };
  }
};

// Function to deduplicate reviews for a movie
export const deduplicateReviews = async (movieId: string): Promise<number> => {
  try {
    const { data, error } = await supabase.functions.invoke('deduplicate-reviews', {
      body: { movieId }
    });

    if (error) {
      console.error("Deduplication error:", error);
      throw error;
    }

    return data?.removed || 0;
  } catch (error) {
    console.error("Failed to deduplicate reviews:", error);
    return 0;
  }
};
