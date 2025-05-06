
import { supabase } from '@/integrations/supabase/client';

export const useSpamDetection = () => {
  const detectSpam = async (text: string): Promise<{ isAbusive: boolean; foundWords: string[] }> => {
    try {
      const { data, error } = await supabase.functions.invoke('detect-spam', {
        body: { text }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error detecting spam:', error);
      return { isAbusive: false, foundWords: [] }; // Fail open if service is unavailable
    }
  };

  return { detectSpam };
};
