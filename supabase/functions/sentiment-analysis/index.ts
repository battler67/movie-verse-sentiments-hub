
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    const { text } = await req.json();
    
    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ error: "Missing or invalid 'text' parameter" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call BERT sentiment API as fallback
    try {
      console.log("Analyzing text:", text.substring(0, 50) + "...");
      const response = await fetch("https://bert-sentiment-api.onrender.com/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      // Process the response
      const data = await response.json();
      const result = data[0];
      
      // Normalize sentiment
      let sentiment = 'neutral';
      if (result && result.label) {
        if (result.label.toLowerCase().includes('positive')) {
          sentiment = 'positive';
        } else if (result.label.toLowerCase().includes('negative')) {
          sentiment = 'negative';
        }
      }

      // Convert confidence score to percentage
      const confidence = result && typeof result.score === 'number' 
        ? Math.round(result.score * 100)
        : 50;
      
      console.log(`Sentiment: ${sentiment}, Confidence: ${confidence}%`);
      
      return new Response(
        JSON.stringify({ sentiment, confidence }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error("Error calling BERT API:", error);
      // Fallback to simplified sentiment analysis when external API fails
      const simpleSentimentAnalysis = performSimpleSentimentAnalysis(text);
      return new Response(
        JSON.stringify(simpleSentimentAnalysis),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error("Error in sentiment-analysis function:", error);
    return new Response(
      JSON.stringify({ error: error.message, sentiment: 'neutral', confidence: 50 }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Simple sentiment analysis as a fallback
function performSimpleSentimentAnalysis(text: string) {
  const positiveWords = ["good", "great", "excellent", "amazing", "wonderful", "love", "best", "fantastic", "enjoyed", "happy"];
  const negativeWords = ["bad", "terrible", "awful", "worst", "hate", "dislike", "poor", "boring", "disappointing", "waste"];
  
  const words = text.toLowerCase().match(/\b(\w+)\b/g) || [];
  
  let score = 0;
  let positiveCount = 0;
  let negativeCount = 0;
  
  for (const word of words) {
    if (positiveWords.includes(word)) {
      score += 1;
      positiveCount++;
    } else if (negativeWords.includes(word)) {
      score -= 1;
      negativeCount++;
    }
  }
  
  let sentiment = 'neutral';
  if (score > 0) sentiment = 'positive';
  else if (score < 0) sentiment = 'negative';
  
  // Calculate confidence based on the ratio of sentiment words to total words
  const totalSentimentWords = positiveCount + negativeCount;
  const confidence = totalSentimentWords > 0 
    ? Math.min(Math.round((totalSentimentWords / words.length) * 100), 100)
    : 50;
  
  return { sentiment, confidence };
}
