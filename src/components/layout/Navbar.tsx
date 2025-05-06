
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import NavbarContent from './NavbarContent';
import MobileSearch from './MobileSearch';

const Navbar = () => {
  const isMobile = useIsMobile();

  return (
    <nav className="bg-movie-darker border-b border-white/5 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <NavbarContent />
        <MobileSearch isMobile={isMobile} />
      </div>
    </nav>
  );
};

export default Navbar;
