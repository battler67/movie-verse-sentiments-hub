
import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Languages } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ReviewActionsProps {
  isRecording: boolean;
  hasText: boolean;
  onRecordToggle: () => void;
  onTranslateClick: () => void;
  showSpeakDialog: boolean;
  onSpeakDialogClose: () => void;
}

const ReviewActions: React.FC<ReviewActionsProps> = ({ 
  isRecording, 
  hasText, 
  onRecordToggle, 
  onTranslateClick,
  showSpeakDialog,
  onSpeakDialogClose
}) => {
  return (
    <>
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

      <Dialog open={showSpeakDialog} onOpenChange={onSpeakDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recording your review</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-white/80">
              Please speak your review now. Click the microphone button again when you're done.
            </p>
            <div className="mt-4 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                <Mic size={32} className="text-red-500 animate-pulse" />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReviewActions;
