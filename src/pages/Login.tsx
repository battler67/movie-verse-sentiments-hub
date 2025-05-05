
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Film, Mail, Lock, Github } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const { resendConfirmationEmail } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          setShowConfirmationDialog(true);
        } else {
          throw error;
        }
        return;
      }
      
      toast.success('Signed in successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Error signing in');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast.error(error.message || 'Error signing in with GitHub');
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    await resendConfirmationEmail(email);
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
        
        <div className="grid gap-6">
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
              
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-xs text-movie-primary hover:text-movie-primary/90">
                    Forgot password?
                  </Link>
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
              
              <Button 
                type="submit" 
                className="w-full bg-movie-primary hover:bg-movie-primary/90"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </div>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-movie-darker px-2 text-white/60">
                Or continue with
              </span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="border-white/10"
            onClick={handleGithubSignIn}
            disabled={loading}
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </div>
        
        <p className="mt-6 text-center text-sm text-white/60">
          Don't have an account?{" "}
          <Link to="/signup" className="text-movie-primary hover:text-movie-primary/90 font-medium">
            Sign Up
          </Link>
        </p>
      </div>

      <Dialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Email not confirmed</DialogTitle>
            <DialogDescription>
              Your account needs to be activated. We've sent a confirmation link to <span className="font-medium">{email}</span>.
              Click the link in the email to activate your account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              If you don't see the email in your inbox, check your spam folder or click below to resend.
            </p>
            <div className="flex justify-end">
              <Button onClick={handleResendEmail}>
                Resend Confirmation Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
