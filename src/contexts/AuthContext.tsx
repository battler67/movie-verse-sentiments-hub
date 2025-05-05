
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<void>;
  sendCustomConfirmationEmail: (email: string, token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  resendConfirmationEmail: async () => {},
  sendCustomConfirmationEmail: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (event === 'SIGNED_IN' && session) {
          console.log('User signed in:', session.user);
          toast.success('Signed in successfully!');
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        } else if (event === 'USER_UPDATED') {
          console.log('User updated:', session?.user);
        } else if (event === 'PASSWORD_RECOVERY') {
          // Handle password recovery event
          console.log('Password recovery requested');
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
    }
  };

  const resendConfirmationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Confirmation email sent! Please check your inbox and spam folder.');
    } catch (error: any) {
      toast.error(error.message || 'Error sending confirmation email');
    }
  };

  const sendCustomConfirmationEmail = async (email: string, token: string) => {
    try {
      // Create the confirmation URL that will be sent in the email
      const baseUrl = window.location.origin;
      const confirmationUrl = `${baseUrl}?confirmation_token=${token}&redirect_to=https://movie-verse-sentiments-hub.lovable.app/`;
      
      // Call our custom edge function to send a formatted email
      const response = await supabase.functions.invoke('send-confirmation-email', {
        body: {
          email,
          confirmationUrl
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to send confirmation email');
      }
      
      toast.success('Confirmation email sent! Please check your inbox and spam folder.');
    } catch (error: any) {
      console.error('Error sending custom confirmation email:', error);
      toast.error(error.message || 'Error sending confirmation email');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signOut, 
      resendConfirmationEmail,
      sendCustomConfirmationEmail 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
