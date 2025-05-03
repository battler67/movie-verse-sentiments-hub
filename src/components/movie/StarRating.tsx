
import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ value, onChange }) => {
  const [hoveredStar, setHoveredStar] = useState(0);
  
  const handleStarHover = (rating: number) => {
    setHoveredStar(rating);
  };
  
  const handleStarLeave = () => {
    setHoveredStar(0);
  };

  return (
    <div className="flex items-center mb-2">
      <span className="text-sm text-white/70 mr-2">Your Rating:</span>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((rating) => (
          <Star
            key={rating}
            className={`h-5 w-5 cursor-pointer ${
              rating <= (hoveredStar || value) 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-400'
            }`}
            onClick={() => onChange(rating)}
            onMouseEnter={() => handleStarHover(rating)}
            onMouseLeave={handleStarLeave}
          />
        ))}
      </div>
    </div>
  );
};

export default StarRating;
