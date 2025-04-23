
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const abusiveWords = [
  'spam', 'scam', 'idiot', 'stupid', 'hate',
  // Add more words as needed
];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    const lowercaseText = text.toLowerCase();
    
    // Check for abusive words
    const foundAbusiveWords = abusiveWords.filter(word => 
      lowercaseText.includes(word.toLowerCase())
    );

    const isAbusive = foundAbusiveWords.length > 0;

    return new Response(
      JSON.stringify({ 
        isAbusive,
        foundWords: foundAbusiveWords 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
