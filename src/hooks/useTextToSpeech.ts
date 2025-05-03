
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useTextToSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = async (text: string, language: string = 'en') => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    try {
      setIsPlaying(true);
      toast.loading("Generating speech...");
      
      try {
        const { data, error } = await supabase.functions.invoke("text-to-speech", {
          body: { 
            text: text,
            language: language
          }
        });

        if (error) throw error;

        if (data && data.audioContent) {
          // Create audio from base64
          const audioBlob = base64ToBlob(data.audioContent, 'audio/mp3');
          const audioUrl = URL.createObjectURL(audioBlob);
          
          if (audioRef.current) {
            audioRef.current.pause();
            URL.revokeObjectURL(audioRef.current.src);
          }

          const newAudio = new Audio(audioUrl);
          audioRef.current = newAudio;
          
          newAudio.onended = () => {
            setIsPlaying(false);
          };
          
          newAudio.play();
          toast.dismiss();
          toast.success("Playing audio");
        }
      } catch (error) {
        console.error("Text-to-speech API error:", error);
        
        // Fallback to browser's speech synthesis
        if ('speechSynthesis' in window) {
          speechSynthesis.cancel(); // Cancel any ongoing speech
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = language;
          
          utterance.onend = () => {
            setIsPlaying(false);
          };
          
          speechSynthesis.speak(utterance);
          toast.dismiss();
        } else {
          toast.error("Your browser doesn't support speech synthesis");
          setIsPlaying(false);
        }
      }
    } catch (error) {
      console.error("Text-to-speech error:", error);
      setIsPlaying(false);
      toast.dismiss();
      toast.error("Failed to generate speech");
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Helper function to convert base64 to Blob
  const base64ToBlob = (base64: string, mimeType: string) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let i = 0; i < byteCharacters.length; i += 512) {
      const slice = byteCharacters.slice(i, i + 512);
      const byteNumbers = new Array(slice.length);
      for (let j = 0; j < slice.length; j++) {
        byteNumbers[j] = slice.charCodeAt(j);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: mimeType });
  };

  return { isPlaying, speak, stopSpeaking };
};
