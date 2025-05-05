
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

export const useVoiceRecording = (onTranscriptionComplete: (text: string) => void) => {
  const [isRecording, setIsRecording] = useState(false);
  const [showSpeakDialog, setShowSpeakDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const recordingTimeoutRef = useRef<number | null>(null);
  
  // Effect to add a global click handler when speech dialog is open
  useEffect(() => {
    const handleClickOutside = () => {
      if (showSpeakDialog && isRecording) {
        stopRecording();
      }
    };
    
    if (showSpeakDialog) {
      // Small delay to prevent the click that started recording from stopping it
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 100);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showSpeakDialog, isRecording]);

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
      recognition.continuous = true; // Keep recording until stopped
      recognition.interimResults = true; // Get interim results
      recognition.maxAlternatives = 1;
      
      let finalTranscript = '';
      
      // Set up event handlers
      recognition.onstart = () => {
        setIsRecording(true);
        setShowSpeakDialog(true); // Show dialog once
        setIsProcessing(false);
        finalTranscript = '';
      };
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += ' ' + transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Only append final transcripts to avoid duplicate text
        if (finalTranscript.trim()) {
          onTranscriptionComplete(finalTranscript.trim());
          finalTranscript = ''; // Reset after sending
        }
      };
      
      recognition.onerror = (event: SpeechRecognitionError) => {
        console.error("Speech recognition error", event);
        if (event.error !== 'no-speech') {
          toast.error(`Error: ${event.error === 'no-speech' ? 'No speech detected' : event.error}`);
        }
      };
      
      recognition.onend = () => {
        // If this was triggered by timeout rather than stopRecording()
        const wasStopped = !isRecording;
        
        setIsRecording(false);
        setIsProcessing(false);
        
        // Only close the dialog if this wasn't part of the continuous recognition restart
        if (wasStopped) {
          setShowSpeakDialog(false);
        } else if (isRecording) {
          // Try to restart if we're still supposed to be recording
          try {
            recognition.start();
          } catch (e) {
            console.log("Could not restart recognition");
            setIsRecording(false);
            setShowSpeakDialog(false);
          }
        }
      };
      
      // Start recognition
      recognition.start();
      
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
    setShowSpeakDialog(false);
    
    // Clear any pending timeouts
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
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
