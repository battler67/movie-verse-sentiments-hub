
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Film, Mail, Lock, User, Github } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from '@/contexts/AuthContext';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const { resendConfirmationEmail } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        throw error;
      }
      
      setShowConfirmationDialog(true);
    } catch (error: any) {
      if (error.message.includes('already registered')) {
        toast.error('This email is already registered. Please try logging in instead.');
      } else {
        toast.error(error.message || 'Error creating account');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignUp = async () => {
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
      toast.error(error.message || 'Error signing up with GitHub');
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
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-white/60">
            Enter your information to create an account and start reviewing movies
          </p>
        </div>
        
        <div className="grid gap-6">
          <form onSubmit={handleSignUp}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    placeholder="johndoe"
                    type="text"
                    className="pl-10 bg-movie-dark border-white/10"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>
              
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
                <Label htmlFor="password">Password</Label>
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
                {loading ? 'Creating Account...' : 'Sign Up'}
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
            onClick={handleGithubSignUp}
            disabled={loading}
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </div>
        
        <p className="mt-6 text-center text-sm text-white/60">
          Already have an account?{" "}
          <Link to="/login" className="text-movie-primary hover:text-movie-primary/90 font-medium">
            Sign In
          </Link>
        </p>
      </div>

      <Dialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Check your email</DialogTitle>
            <DialogDescription>
              We've sent a confirmation link to <span className="font-medium">{email}</span>. 
              Click the link in the email to activate your account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              If you don't see the email in your inbox, check your spam folder.
            </p>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => navigate('/login')}>
                Go to Login
              </Button>
              <Button onClick={handleResendEmail}>
                Resend Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SignUp;
