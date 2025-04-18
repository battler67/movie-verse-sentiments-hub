
import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Github, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-white/5 bg-movie-darker py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
          <div className="flex items-center space-x-2">
            <Film size={20} className="text-movie-primary" />
            <span className="text-lg font-bold bg-gradient-to-r from-movie-primary to-movie-secondary bg-clip-text text-transparent">
              MovieVerse
            </span>
          </div>
          
          <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-6 md:space-y-0">
            <Link to="/" className="text-sm text-white/60 hover:text-white">
              Home
            </Link>
            <Link to="/movies" className="text-sm text-white/60 hover:text-white">
              Movies
            </Link>
            <Link to="/about" className="text-sm text-white/60 hover:text-white">
              About
            </Link>
            <Link to="/privacy" className="text-sm text-white/60 hover:text-white">
              Privacy
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white"
            >
              <Github size={18} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white"
            >
              <Twitter size={18} />
            </a>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-white/40">
          <p>© {new Date().getFullYear()} MovieVerse. All rights reserved.</p>
          <p className="mt-1">Movie data provided by external APIs.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
