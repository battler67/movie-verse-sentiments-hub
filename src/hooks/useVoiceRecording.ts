
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useVoiceRecording = (onTranscriptionComplete: (text: string) => void) => {
  const [isRecording, setIsRecording] = useState(false);
  const [showSpeakDialog, setShowSpeakDialog] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
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
        const base64Audio = reader.result?.toString().split(',')[1];
        
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
      };
    } catch (error) {
      console.error("Error processing speech:", error);
      toast.error("Failed to convert speech to text");
    }
  };
  
  return {
    isRecording,
    showSpeakDialog,
    startRecording,
    stopRecording,
    setShowSpeakDialog
  };
};
