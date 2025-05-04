
import React, { useState, useEffect } from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export interface Language {
  code: string;
  name: string;
}

export const LANGUAGES: Language[] = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'fr-FR', name: 'French' },
  { code: 'de-DE', name: 'German' },
  { code: 'it-IT', name: 'Italian' },
  { code: 'zh-CN', name: 'Chinese' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'ko-KR', name: 'Korean' },
  { code: 'ru-RU', name: 'Russian' },
  { code: 'pt-BR', name: 'Portuguese' },
  { code: 'ar-SA', name: 'Arabic' },
  { code: 'hi-IN', name: 'Hindi' }
];

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  speechSynthesisMode?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  value, 
  onChange,
  className,
  speechSynthesisMode = false
}) => {
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>(LANGUAGES);
  const [availableVoices, setAvailableVoices] = useState<{ [key: string]: SpeechSynthesisVoice[] }>({});
  const [loading, setLoading] = useState(true);

  // Initialize and load available speech synthesis voices
  useEffect(() => {
    if (!speechSynthesisMode || !window.speechSynthesis) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return;
      
      // Map of language codes to voice objects
      const voicesMap: { [key: string]: SpeechSynthesisVoice[] } = {};
      
      // Process all available voices
      voices.forEach(voice => {
        if (!voicesMap[voice.lang]) {
          voicesMap[voice.lang] = [];
        }
        voicesMap[voice.lang].push(voice);
      });
      
      // Get unique language codes that have available voices
      const availableLangs = Object.keys(voicesMap);
      
      // Filter LANGUAGES to only include those with available voices
      const filteredLanguages = LANGUAGES.filter(lang => {
        // Check if this language or a similar one is available
        return availableLangs.some(available => 
          available === lang.code || 
          available.startsWith(lang.code.split('-')[0])
        );
      });

      setAvailableLanguages(filteredLanguages.length > 0 ? filteredLanguages : LANGUAGES);
      setAvailableVoices(voicesMap);
      setLoading(false);

      // Set default if needed
      if (speechSynthesisMode && !value && filteredLanguages.length > 0) {
        onChange(filteredLanguages[0].code);
      }
    };

    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    // Initial load attempt (works in Safari and sometimes in Firefox)
    loadVoices();
  }, [speechSynthesisMode, onChange, value]);

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={speechSynthesisMode && loading}
    >
      <SelectTrigger className={`bg-movie-darker border-white/10 ${className || ''}`}>
        <SelectValue placeholder={loading ? "Loading voices..." : "Select language"} />
      </SelectTrigger>
      <SelectContent className="bg-movie-darker border-white/10 max-h-[300px]">
        {availableLanguages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
