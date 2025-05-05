
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Film, Mail, Lock, Key, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [specialKeyword, setSpecialKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'credentials' | 'keyword'>('credentials');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const navigate = useNavigate();
  const { user, signInAnonymously, signInWithSpecialKeyword } = useAuth();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    
    if (loginMethod === 'credentials' && !password) {
      toast.error('Please enter your password');
      return;
    }
    
    if (loginMethod === 'keyword' && !specialKeyword) {
      toast.error('Please enter your special keyword');
      return;
    }
    
    try {
      setLoading(true);
      
      if (loginMethod === 'credentials') {
        // Attempt to sign in with email and password
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          // Track failed login attempts to suggest special keyword option
          setLoginAttempts(prev => prev + 1);
          
          if (loginAttempts >= 1) {
            // After one failure, suggest special keyword option
            setLoginMethod('keyword');
            throw new Error('Invalid login credentials. Try using your special keyword instead.');
          } else {
            throw error;
          }
        }
        
        // Reset login attempts on success
        setLoginAttempts(0);
      } else {
        // Attempt to sign in with special keyword
        const success = await signInWithSpecialKeyword(email, specialKeyword);
        
        if (!success) {
          throw new Error('Special keyword authentication failed');
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Error signing in');
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    try {
      setLoading(true);
      await signInAnonymously();
    } catch (error: any) {
      toast.error(error.message || 'Error signing in anonymously');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLoginMethod = () => {
    setLoginMethod(prev => prev === 'credentials' ? 'keyword' : 'credentials');
  };

  return (
    <div className="flex min-h-screen flex-col justify-center">
      <div className="container relative max-w-md mx-auto p-6">
        <div className="flex flex-col space-y-2 text-center mb-8">
          <Link to="/" className="mx-auto flex items-center space-x-2">
            <Film size={24} className="text-movie-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-movie-primary to-movie-secondary bg-clip-text text-transparent">
              MovieVerse
            </span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-white/60">
            Sign in to your account to continue your movie journey
          </p>
        </div>
        
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="anonymous">Anonymous</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={handleSignIn}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      className="pl-10 bg-movie-dark border-white/10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                {loginMethod === 'credentials' ? (
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <button
                        type="button"
                        onClick={handleToggleLoginMethod}
                        className="text-xs text-movie-primary hover:text-movie-primary/90"
                      >
                        Use special keyword instead
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        placeholder="••••••••"
                        type="password"
                        className="pl-10 bg-movie-dark border-white/10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="specialKeyword">Special Keyword</Label>
                      <button
                        type="button"
                        onClick={handleToggleLoginMethod}
                        className="text-xs text-movie-primary hover:text-movie-primary/90"
                      >
                        Use password instead
                      </button>
                    </div>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="specialKeyword"
                        placeholder="Your special keyword"
                        type="password"
                        className="pl-10 bg-movie-dark border-white/10"
                        value={specialKeyword}
                        onChange={(e) => setSpecialKeyword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-movie-primary hover:bg-movie-primary/90"
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="anonymous">
            <div className="text-center space-y-4">
              <User size={64} className="mx-auto text-white/50" />
              <div>
                <h3 className="text-lg font-medium">Browse as Guest</h3>
                <p className="text-sm text-white/60 mt-1">
                  Experience MovieVerse without creating an account
                </p>
              </div>
              <Button
                onClick={handleAnonymousSignIn}
                className="w-full bg-movie-primary hover:bg-movie-primary/90"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Continue as Guest'}
              </Button>
              <p className="text-xs text-white/40 mt-2">
                Some features may be limited in guest mode
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <p className="mt-6 text-center text-sm text-white/60">
          Don't have an account?{" "}
          <Link to="/signup" className="text-movie-primary hover:text-movie-primary/90 font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
