
import React from 'react';
import SearchBar from './SearchBar';

interface MobileSearchProps {
  isMobile: boolean;
}

const MobileSearch: React.FC<MobileSearchProps> = ({ isMobile }) => {
  if (!isMobile) return null;
  
  return (
    <div className="md:hidden py-2 relative">
      <SearchBar isMobile={true} />
    </div>
  );
};

export default MobileSearch;
