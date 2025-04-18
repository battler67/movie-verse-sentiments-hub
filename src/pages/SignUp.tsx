
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Film, Mail, Lock, User, Github } from 'lucide-react';

const SignUp = () => {
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
          <form>
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
                  />
                </div>
              </div>
              
              <Button className="w-full bg-movie-primary hover:bg-movie-primary/90">
                Sign Up
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
          
          <Button variant="outline" className="border-white/10">
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
    </div>
  );
};

export default SignUp;
