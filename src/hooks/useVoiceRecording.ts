
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useVoiceRecording = (onTranscriptionComplete: (text: string) => void) => {
  const [isRecording, setIsRecording] = useState(false);
  const [showSpeakDialog, setShowSpeakDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  
  // Clean up media resources when component unmounts
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isRecording]);
  
  const startRecording = async () => {
    try {
      // Try using the Web Speech API for direct transcription first
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        // Use Web Speech API directly if available
        useWebSpeechAPI(onTranscriptionComplete);
        return;
      }
      
      // Fallback to MediaRecorder if Web Speech API isn't available
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        
        // Stop all tracks to turn off the microphone
        stream.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      };

      mediaRecorder.start();
      setIsRecording(true);
      setShowSpeakDialog(true); // Show the speak dialog
      toast.info("Recording started... Speak now", {
        description: "Click the microphone again to stop recording",
        duration: 5000
      });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  const useWebSpeechAPI = (callback: (text: string) => void) => {
    const SpeechRecognition = (window as any).SpeechRecognition || 
                            (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }
    
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US'; // Set language to English
      recognition.continuous = false;
      recognition.interimResults = false;
      
      setIsRecording(true);
      setShowSpeakDialog(true);
      toast.info("Listening... Speak now", {
        description: "The browser will automatically detect when you stop speaking",
        duration: 5000
      });
      
      recognition.onstart = () => {
        setIsProcessing(false);
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        callback(transcript);
        setIsRecording(false);
        setShowSpeakDialog(false);
        toast.success("Speech converted to text!");
      };
      
      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
        setShowSpeakDialog(false);
        toast.error(`Error: ${event.error}`);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
        setShowSpeakDialog(false);
      };
      
      recognition.start();
      
      // Add a timeout in case the recognition gets stuck
      setTimeout(() => {
        if (setIsRecording) {
          try {
            recognition.stop();
          } catch (e) {
            // Ignore errors on stop
          }
        }
      }, 10000);
    } catch (error) {
      console.error("Error using Web Speech API:", error);
      toast.error("Failed to start speech recognition");
      setIsRecording(false);
      setShowSpeakDialog(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      setIsProcessing(true);
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setShowSpeakDialog(false); // Hide the speak dialog
      toast.info("Processing speech...");
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Data = reader.result?.toString();
        if (!base64Data) {
          toast.error("Failed to process audio data");
          setIsProcessing(false);
          return;
        }
        
        // Remove the data URL prefix (e.g., "data:audio/webm;base64,")
        const base64Audio = base64Data.split(',')[1];
        
        if (base64Audio) {
          try {
            const { data, error } = await supabase.functions.invoke('speech-to-text', {
              body: { audio: base64Audio }
            });

            if (error) {
              throw error;
            }

            if (data && data.text) {
              onTranscriptionComplete(data.text);
              toast.success("Speech converted to text!");
            } else {
              // If no text was returned, show a message about no speech detected
              toast.error("No speech detected. Please try again.");
            }
          } catch (apiError) {
            console.error("Edge function error:", apiError);
            toast.error("Could not process speech. Please try typing your review instead.");
          }
        }
        setIsProcessing(false);
      };
    } catch (error) {
      console.error("Error processing speech:", error);
      toast.error("Failed to convert speech to text");
      setIsProcessing(false);
    }
  };
  
  return {
    isRecording,
    isProcessing,
    showSpeakDialog,
    startRecording,
    stopRecording,
    setShowSpeakDialog
  };
};
