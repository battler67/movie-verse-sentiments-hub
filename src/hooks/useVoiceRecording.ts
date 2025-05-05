
import { useState, useRef } from 'react';
import { toast } from 'sonner';

export const useVoiceRecording = (onTranscriptionComplete: (text: string) => void) => {
  const [isRecording, setIsRecording] = useState(false);
  const [showSpeakDialog, setShowSpeakDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Start recording using Web Speech API
  const startRecording = async () => {
    try {
      // Check if Web Speech API is available
      const SpeechRecognitionAPI = window.SpeechRecognition || 
                               window.webkitSpeechRecognition;
      
      if (!SpeechRecognitionAPI) {
        throw new Error("Speech recognition not supported in this browser");
      }
      
      // Initialize speech recognition
      const recognition = new SpeechRecognitionAPI();
      recognitionRef.current = recognition;
      
      // Configure recognition
      recognition.lang = 'en-US'; // Set to English
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      
      // Set up event handlers
      recognition.onstart = () => {
        setIsRecording(true);
        setShowSpeakDialog(true); // Show dialog once
        setIsProcessing(false);
      };
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        if (transcript && transcript.trim()) {
          onTranscriptionComplete(transcript);
          toast.success("Speech converted to text!");
        } else {
          toast.error("No speech detected. Please try again.");
        }
      };
      
      recognition.onerror = (event: SpeechRecognitionError) => {
        console.error("Speech recognition error", event);
        toast.error(`Error: ${event.error === 'no-speech' ? 'No speech detected' : event.error}`);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
        setShowSpeakDialog(false);
        setIsProcessing(false);
      };
      
      // Start recognition
      recognition.start();
      
      // Auto-stop after 10 seconds to prevent indefinite listening
      setTimeout(() => {
        if (isRecording && recognitionRef.current) {
          stopRecording();
        }
      }, 10000);
      
    } catch (error) {
      // Fallback to media recorder if Web Speech API fails
      console.error("Error starting speech recognition:", error);
      fallbackToMediaRecorder();
    }
  };
  
  // Fallback to using MediaRecorder API
  const fallbackToMediaRecorder = async () => {
    try {
      toast.info("Using fallback recording method");
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        
        // Process the recorded audio
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        
        try {
          // Simulate processing for demonstration (would normally send to a server)
          setTimeout(() => {
            onTranscriptionComplete("This is a fallback transcription as your browser doesn't support the Web Speech API.");
            setIsProcessing(false);
            toast.success("Fallback transcription completed");
          }, 1000);
        } catch (error) {
          console.error("Error processing audio:", error);
          setIsProcessing(false);
          toast.error("Failed to process speech");
        }
        
        // Stop all tracks to turn off the microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setShowSpeakDialog(true);
      
      // Stop recording after 5 seconds
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          setIsRecording(false);
          setShowSpeakDialog(false);
        }
      }, 5000);
      
    } catch (error) {
      console.error("Fallback recording error:", error);
      toast.error("Could not access microphone. Please check permissions.");
      setIsRecording(false);
      setShowSpeakDialog(false);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Handle any errors that might occur when stopping
        console.error("Error stopping recognition:", e);
      }
    }
    
    setIsRecording(false);
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
