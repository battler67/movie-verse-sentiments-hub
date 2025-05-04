
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Process base64 in chunks to prevent memory issues
function processBase64Chunks(base64String: string, chunkSize = 32768) {
  const chunks: Uint8Array[] = [];
  let position = 0;
  
  try {
    while (position < base64String.length) {
      const chunk = base64String.slice(position, position + chunkSize);
      const binaryChunk = atob(chunk);
      const bytes = new Uint8Array(binaryChunk.length);
      
      for (let i = 0; i < binaryChunk.length; i++) {
        bytes[i] = binaryChunk.charCodeAt(i);
      }
      
      chunks.push(bytes);
      position += chunkSize;
    }

    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;

    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }

    return result;
  } catch (error) {
    console.error("Error processing base64 chunks:", error);
    throw error;
  }
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

    console.log("Received audio data, processing speech to text...");
    
    // In a production environment, you would use a speech-to-text service like OpenAI Whisper API
    // For now, we'll simulate processing and return a transcription
    
    // Wait for a moment to simulate processing
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // For real implementation, you would send audio to a service like OpenAI Whisper
    // Currently we just return a mock response for testing
    
    // Check if the audio data length is too short (likely no speech)
    const isEmptyAudio = audio.length < 1000;
    
    // Generate a demo text response (this would be the transcription in a real implementation)
    let transcribedText = "";
    if (!isEmptyAudio) {
      transcribedText = "This is your transcribed speech. In a real implementation, this would be converted from your actual voice recording.";
    }

    return new Response(
      JSON.stringify({ text: transcribedText }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error("Speech-to-text error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
