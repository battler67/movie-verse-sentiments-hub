
import React from 'react';
import { Link } from 'react-router-dom';
import { Film, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="container text-center max-w-md mx-auto px-4">
        <div className="flex justify-center mb-6">
          <Film size={48} className="text-movie-primary" />
        </div>
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-white/60 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button className="bg-movie-primary hover:bg-movie-primary/90">
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
