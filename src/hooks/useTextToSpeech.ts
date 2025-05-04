
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { LANGUAGES } from '@/components/translation/LanguageSelector';

export const useTextToSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Clean up audio URLs when component unmounts
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioUrl]);

  const speak = async (text: string, language: string = 'en') => {
    if (!text || text.trim() === '') {
      toast.error("No text to read");
      return;
    }
    
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    try {
      setIsGenerating(true);
      setIsPlaying(false);
      toast.loading("Generating speech...");
      
      // Find the language name for display in toast
      const languageName = LANGUAGES.find(lang => lang.code === language)?.name || language;
      
      // Try using the edge function first
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
          setAudioUrl(audioUrl);
          
          if (audioRef.current) {
            audioRef.current.pause();
            URL.revokeObjectURL(audioRef.current.src);
          }

          const newAudio = new Audio(audioUrl);
          audioRef.current = newAudio;
          
          newAudio.onended = () => {
            setIsPlaying(false);
          };
          
          newAudio.onerror = (e) => {
            console.error("Audio playback error:", e);
            setIsPlaying(false);
            toast.error("Failed to play audio");
            
            // Fallback to browser's speech synthesis
            useBrowserSpeechSynthesis(text, language, languageName);
          };
          
          // Try to play the audio
          try {
            const playPromise = newAudio.play();
            
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  toast.dismiss();
                  toast.success(`Playing in ${languageName}`);
                  setIsPlaying(true);
                })
                .catch(error => {
                  console.error("Audio play error:", error);
                  // Fallback to browser's speech synthesis
                  useBrowserSpeechSynthesis(text, language, languageName);
                });
            }
          } catch (playError) {
            console.error("Audio play error:", playError);
            // Fallback to browser's speech synthesis
            useBrowserSpeechSynthesis(text, language, languageName);
          }
        }
      } catch (error) {
        console.error("Text-to-speech API error:", error);
        // Fallback to browser's speech synthesis
        useBrowserSpeechSynthesis(text, language, languageName);
      }
    } catch (error) {
      console.error("Text-to-speech error:", error);
      toast.dismiss();
      toast.error("Failed to generate speech");
    } finally {
      setIsGenerating(false);
    }
  };

  const useBrowserSpeechSynthesis = (text: string, language: string, languageName: string) => {
    if ('speechSynthesis' in window) {
      console.log("Using browser speech synthesis");
      speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      
      // Try to find a matching voice for the language
      const voices = speechSynthesis.getVoices();
      const matchingVoice = voices.find(voice => voice.lang.startsWith(language));
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
      
      utterance.onerror = (e) => {
        console.error("Speech synthesis error:", e);
        setIsPlaying(false);
        toast.error("Failed to play speech");
      };
      
      // Create downloadable audio from browser synthesis (if possible)
      try {
        // This is a workaround to create a downloadable audio file
        // from the browser's speech synthesis
        // Safely check for AudioContext with proper typing
        const audioContext = new (window.AudioContext || 
          // Use a type assertion for webkitAudioContext
          (window as any).webkitAudioContext as typeof AudioContext)();
          
        if (!audioContext) {
          throw new Error("AudioContext not supported in this browser");
        }
        
        const source = audioContext.createBufferSource();
        const destination = audioContext.createMediaStreamDestination();
        source.connect(destination);
        
        const mediaRecorder = new MediaRecorder(destination.stream);
        const chunks: BlobPart[] = [];
        
        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };
        
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/mp3' });
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
        };
        
        mediaRecorder.start();
        speechSynthesis.speak(utterance);
        
        // Stop recording after utterance ends
        utterance.onend = () => {
          mediaRecorder.stop();
          setIsPlaying(false);
        };
        
        setIsPlaying(true);
        toast.dismiss();
        toast.success(`Playing in ${languageName}`);
      } catch (recordError) {
        // Fallback if recording doesn't work
        console.error("Failed to record speech:", recordError);
        speechSynthesis.speak(utterance);
        setIsPlaying(true);
        toast.dismiss();
        toast.success(`Playing in ${languageName} (download unavailable)`);
      }
    } else {
      toast.error("Your browser doesn't support speech synthesis");
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    
    // Also stop browser speech synthesis if active
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  };

  // Helper function to convert base64 to Blob
  const base64ToBlob = (base64: string, mimeType: string) => {
    try {
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
    } catch (error) {
      console.error("Error converting base64 to blob:", error);
      // Return a minimal valid audio blob as fallback
      return new Blob([""], { type: mimeType });
    }
  };

  return { isPlaying, isGenerating, speak, stopSpeaking, audioUrl };
};
