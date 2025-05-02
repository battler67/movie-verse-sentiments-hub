
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

// Function to moderate review content (check for profanity)
export const moderateReview = async (text: string): Promise<{ isClean: boolean; cleanedText: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('moderate-review', {
      body: { text }
    });

    if (error) {
      console.error("Moderation error:", error);
      throw error;
    }

    return {
      isClean: !data.containsProfanity,
      cleanedText: data.cleanedText
    };
  } catch (error) {
    console.error("Review moderation error:", error);
    // If moderation fails, assume content is safe to avoid blocking users
    return { isClean: true, cleanedText: text };
  }
};

// Function to generate a summary of a review
export const generateReviewSummary = async (text: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-review-summary', {
      body: { text }
    });

    if (error) {
      console.error("Summary generation error:", error);
      throw error;
    }

    return data.summary || '';
  } catch (error) {
    console.error("Review summary generation error:", error);
    // If summary generation fails, return a truncated version of the original text
    return text.length > 100 ? text.substring(0, 100) + '...' : text;
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
