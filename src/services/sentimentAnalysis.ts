
import { toast } from "sonner";

interface SentimentResult {
  label: string;
  score: number;
}

export interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number; // 0-100 percentage
}

export const analyzeSentiment = async (text: string): Promise<SentimentAnalysis> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minute timeout

  try {
    const response = await fetch("https://bert-sentiment-api.onrender.com/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      signal: controller.signal,
      body: JSON.stringify({ text })
    });

    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error("API Error");
    }

    const data = await response.json();
    const result = data[0] as SentimentResult;
    
    // Normalize sentiment
    let sentiment: 'positive' | 'negative' | 'neutral';
    if (result && result.label) {
      if (result.label.toLowerCase().includes('positive')) {
        sentiment = 'positive';
      } else if (result.label.toLowerCase().includes('negative')) {
        sentiment = 'negative';
      } else {
        sentiment = 'neutral';
      }
    } else {
      sentiment = 'neutral';
    }

    // Convert confidence score to percentage
    const confidence = result && typeof result.score === 'number' 
      ? Math.round(result.score * 100)
      : 45;

    return { sentiment, confidence };
  } catch (error) {
    console.error("Sentiment API error or timeout:", error);
    // Default values if API fails
    return { sentiment: 'neutral', confidence: 45 };
  }
};
