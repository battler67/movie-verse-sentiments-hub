
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

    console.log("Analyzing text:", text.substring(0, 50) + "...");
    
    // Set a timeout for the fetch request - 180 seconds (3 minutes)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180000); // 180 second timeout
    
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
    
    // Extract result from the API response format
    if (data && data.result && data.result.length > 0) {
      const resultItem = data.result[0];
      
      // Normalize sentiment
      let sentiment = 'neutral';
      if (resultItem.label === 'POSITIVE') {
        sentiment = 'positive';
      } else if (resultItem.label === 'NEGATIVE') {
        sentiment = 'negative';
      }

      // Convert confidence score to percentage
      const confidence = resultItem.score 
        ? parseFloat((resultItem.score * 100).toFixed(2)) 
        : 0;
      
      console.log(`Sentiment: ${sentiment}, Confidence: ${confidence}%`);
      
      return new Response(
        JSON.stringify({ sentiment, confidence }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      throw new Error("Invalid API response format");
    }
  } catch (error) {
    console.error("Error in sentiment-analysis function:", error);
    return new Response(
      JSON.stringify({ error: error.message, sentiment: 'neutral', confidence: 0 }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
