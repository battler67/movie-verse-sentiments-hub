
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// List of profane words to filter
const profaneWords = [
  "ass", "asshole", "bitch", "bastard", "cunt", "damn", "douchebag", "dick", "dyke", "fag", "faggot", 
  "fuck", "fucking", "motherfucker", "nigger", "nigga", "piss", "pussy", "shit", "slut", 
  "whore", "retard", "retarded", "twat", "wanker"
];

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

    // Create regex pattern from profane words
    const pattern = new RegExp('\\b(' + profaneWords.join('|') + ')\\b', 'gi');
    
    // Check if the text contains profanity
    const containsProfanity = pattern.test(text);
    
    // Get all matches
    const foundWords = [];
    let match;
    const patternForMatches = new RegExp('\\b(' + profaneWords.join('|') + ')\\b', 'gi');
    while ((match = patternForMatches.exec(text)) !== null) {
      foundWords.push(match[0]);
    }
    
    // Clean the text by replacing profane words with asterisks
    const cleanedText = text.replace(pattern, match => '*'.repeat(match.length));
    
    return new Response(
      JSON.stringify({ 
        containsProfanity, 
        foundWords: containsProfanity ? [...new Set(foundWords)] : [],
        cleanedText 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in moderate-review function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
