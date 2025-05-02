
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { audio } = await req.json()
    
    if (!audio) {
      throw new Error('No audio data provided')
    }

    // For demonstration purposes, we're simulating an STT API call
    // In a real app, you would use a speech recognition service like Google STT, AWS Transcribe, etc.
    
    // Simulate API call with a 1-second delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Return a sample text response
    // In a real app, this would be the actual transcribed text from the STT service
    const sampleText = "I really enjoyed this movie! The acting was superb and the plot kept me engaged throughout.";

    return new Response(
      JSON.stringify({ text: sampleText }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
