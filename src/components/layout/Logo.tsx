
import React from 'react';
import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <Film size={24} className="text-movie-primary" />
      <div className="flex flex-col">
        <span className="text-xl font-bold bg-gradient-to-r from-movie-primary to-movie-secondary bg-clip-text text-transparent">
          Moodies
        </span>
        <span className="text-xs text-white/60 italic">bcuz every review has a vibe</span>
      </div>
    </Link>
  );
};

export default Logo;
