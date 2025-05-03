
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface TranslationResult {
  translatedText: string;
  isLoading: boolean;
  error: string | null;
}

export const useTranslation = (text: string, targetLanguage: string) => {
  const [result, setResult] = useState<TranslationResult>({
    translatedText: '',
    isLoading: false,
    error: null
  });

  useEffect(() => {
    if (!text || !targetLanguage) return;

    const translateText = async () => {
      setResult(prev => ({ ...prev, isLoading: true, error: null }));
      try {
        // For demo purposes, we're simulating translation
        // In a real app, you would call an external translation API or a Supabase Edge Function
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockTranslations: Record<string, string> = {
          'es': '¡Esta película fue increíble! La cinematografía y la actuación fueron excelentes.',
          'fr': 'Ce film était incroyable! La cinématographie et le jeu d\'acteur étaient excellents.',
          'de': 'Dieser Film war unglaublich! Die Kameraführung und das Schauspiel waren ausgezeichnet.',
          'it': 'Questo film è stato incredibile! La cinematografia e la recitazione sono state eccellenti.',
          'zh': '这部电影太棒了！摄影和表演都很出色。',
          'ja': 'この映画は素晴らしかった！撮影と演技は素晴らしかった。',
          'ko': '이 영화는 놀라웠어요! 촬영과 연기가 훌륭했어요.',
          'ar': 'كان هذا الفيلم مذهلاً! كانت التصوير السينمائي والتمثيل ممتازين.',
          'hi': 'यह फिल्म अद्भुत थी! सिनेमैटोग्राफी और अभिनय उत्कृष्ट थे।',
          'ru': 'Этот фильм был потрясающим! Кинематография и актерская игра были превосходны.'
        };
        
        const result = mockTranslations[targetLanguage] || text;
        setResult({
          translatedText: result,
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.error("Translation error:", error);
        toast.error("Failed to translate text");
        setResult({
          translatedText: "",
          isLoading: false,
          error: "Failed to translate text"
        });
      }
    };

    translateText();
  }, [text, targetLanguage]);

  return result;
};
