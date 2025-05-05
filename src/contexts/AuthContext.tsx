
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInAnonymously: () => Promise<void>;
  signInWithSpecialKeyword: (email: string, keyword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  signInAnonymously: async () => {},
  signInWithSpecialKeyword: async () => false,
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

  // New function to sign in anonymously
  const signInAnonymously = async () => {
    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      
      if (error) {
        throw error;
      }
      
      // Create user profile for anonymous user
      if (data.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert({
            id: data.user.id,
            username: `guest_${Math.floor(Math.random() * 10000)}`,
            email: `anonymous_${Math.floor(Math.random() * 10000)}@guest.com`
          });
          
        if (profileError) {
          console.error('Error creating anonymous profile:', profileError);
        }
        
        toast.success('Signed in anonymously!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error signing in anonymously');
    }
  };

  // New function to sign in with special keyword
  const signInWithSpecialKeyword = async (email: string, keyword: string): Promise<boolean> => {
    try {
      // First check if the user exists and the special keyword matches
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, special_keyword')
        .eq('email', email)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        throw new Error('Error verifying special keyword');
      }

      // If no user found with that email
      if (!userProfile) {
        toast.error('No account found with this email');
        return false;
      }

      // If special keyword doesn't match
      if (userProfile.special_keyword !== keyword) {
        toast.error('Invalid special keyword');
        return false;
      }

      // If special keyword matches, sign in the user
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: keyword, // Using the special keyword as password
      });

      if (error) {
        // If standard login fails, try to create a new password for the user with the keyword
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
        
        if (resetError) {
          toast.error('Failed to reset password');
          return false;
        }
        
        toast.success('Password reset link sent to your email');
        return true;
      }

      toast.success('Signed in with special keyword!');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Error using special keyword');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signOut,
      signInAnonymously,
      signInWithSpecialKeyword
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
