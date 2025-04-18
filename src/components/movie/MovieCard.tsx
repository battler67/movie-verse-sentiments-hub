
import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string;
  year: string;
  rating: number;
}

const MovieCard = ({ id, title, posterPath, year, rating }: MovieCardProps) => {
  return (
    <Link to={`/movie/${id}`}>
      <div className="movie-card">
        <div className="relative aspect-[2/3] overflow-hidden">
          {posterPath ? (
            <img 
              src={posterPath} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-movie-dark flex items-center justify-center">
              <span className="text-white/40">No Image</span>
            </div>
          )}
          <div className="absolute top-2 right-2 flex items-center space-x-1 bg-black/60 px-2 py-1 rounded-full text-xs font-medium">
            <Star size={12} className="text-yellow-400" />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium line-clamp-1">{title}</h3>
          <p className="text-xs text-white/60 mt-1">{year}</p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
