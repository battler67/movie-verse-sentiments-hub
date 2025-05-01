
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

    // First try the BERT sentiment API
    try {
      console.log("Analyzing text:", text.substring(0, 50) + "...");
      
      // Set a timeout for the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch("https://bert-sentiment-api.onrender.com/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
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
      // Fallback to enhanced sentiment analysis when external API fails
      const enhancedSentimentAnalysis = performEnhancedSentimentAnalysis(text);
      return new Response(
        JSON.stringify(enhancedSentimentAnalysis),
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

// Enhanced sentiment analysis with confidence
function performEnhancedSentimentAnalysis(text: string) {
  const positiveWords = [
    "amazing", "awesome", "excellent", "fantastic", "great", "good", "superb", "wonderful", 
    "outstanding", "perfect", "brilliant", "impressive", "stunning", "flawless", "enjoyable", 
    "inspiring", "creative", "hilarious", "beautiful", "captivating", "touching", "emotional", 
    "thrilling", "exciting", "memorable", "authentic", "powerful", "engaging", "delightful", 
    "charming", "clever", "witty", "well-made", "smart", "thought-provoking", "informative", 
    "satisfying", "relatable", "original", "top-notch", "entertaining", "masterpiece", "favorite", 
    "pleasant", "lovable", "worth-watching", "must-watch", "heartwarming", "smooth", "genius", 
    "refreshing"
  ];

  const negativeWords = [
    "boring", "terrible", "awful", "bad", "poor", "disappointing", "unwatchable", "annoying", 
    "frustrating", "predictable", "lame", "confusing", "cringe", "dumb", "silly", "mediocre", 
    "bland", "slow", "weak", "dull", "incoherent", "messy", "cliched", "unfunny", "flat", 
    "repetitive", "unoriginal", "painful", "unbearable", "overrated", "forgettable", "underwhelming", 
    "ridiculous", "tedious", "sloppy", "uninteresting", "shallow", "lazy", "derivative", "fake", 
    "noisy", "awkward", "rushed", "forced", "emotionless", "uninspired", "lifeless", "terrible"
  ];

  const neutralWords = [
    "movie", "acting", "direction", "storyline", "plot", "cast", "characters", "scenes", "script", 
    "visuals", "cinematography", "performance", "time", "length", "music", "background", "role", 
    "voice", "editing", "pace", "theme", "message", "idea", "part", "dialogue", "camera", "drama", 
    "moment", "episode", "genre", "tone", "ending", "beginning", "sequence", "frame", "perspective", 
    "flow", "timing", "location", "content", "production", "setup", "twist", "mood", "story", 
    "experience", "style", "setting", "structure", "soundtrack"
  ];

  const wordsInText = text.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;

  wordsInText.forEach(word => {
    if (positiveWords.includes(word)) {
      positiveCount++;
    } else if (negativeWords.includes(word)) {
      negativeCount++;
    } else if (neutralWords.includes(word)) {
      neutralCount++;
    }
  });

  const totalSentimentWords = positiveCount + negativeCount + neutralCount;
  const totalWords = wordsInText.length;

  let sentiment = 'neutral';
  if (positiveCount > negativeCount) {
    sentiment = 'positive';
  } else if (negativeCount > positiveCount) {
    sentiment = 'negative';
  }

  // Confidence = ratio of sentiment words to total words + sentiment dominance
  let baseConfidence = totalSentimentWords / totalWords;
  let sentimentDominance = Math.abs(positiveCount - negativeCount) / (positiveCount + negativeCount + 1); // +1 to avoid div by zero
  let confidence = Math.min(1, baseConfidence * 0.5 + sentimentDominance * 0.5); // weighted average
  const confidencePercent = Math.round(confidence * 100);

  console.log(`Enhanced sentiment analysis: ${sentiment}, Confidence: ${confidencePercent}%, Positive words: ${positiveCount}, Negative words: ${negativeCount}, Neutral words: ${neutralCount}`);

  return {
    sentiment,
    confidence: confidencePercent,
    positiveCount,
    negativeCount,
    neutralCount
  };
}
