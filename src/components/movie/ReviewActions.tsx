
import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Languages } from 'lucide-react';

interface ReviewActionsProps {
  isRecording: boolean;
  hasText: boolean;
  onRecordToggle: () => void;
  onTranslateClick: () => void;
}

const ReviewActions: React.FC<ReviewActionsProps> = ({ 
  isRecording, 
  hasText, 
  onRecordToggle, 
  onTranslateClick 
}) => {
  return (
    <div className="absolute bottom-2 right-2 flex gap-2">
      <Button
        type="button"
        size="sm"
        variant="outline"
        className={`p-1 ${isRecording ? 'bg-red-500/20 text-red-400' : ''}`}
        onClick={onRecordToggle}
        title={isRecording ? "Stop recording" : "Record your review"}
        aria-label={isRecording ? "Stop recording" : "Record your review with voice"}
      >
        <Mic size={14} className={isRecording ? "animate-pulse" : ""} />
      </Button>
      
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="p-1"
        onClick={onTranslateClick}
        disabled={!hasText}
        title="Translate"
        aria-label="Translate review"
      >
        <Languages size={14} />
      </Button>
    </div>
  );
};

export default ReviewActions;
