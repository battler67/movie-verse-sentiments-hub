
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import Logo from './Logo';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';
import { ThemeToggle } from './ThemeToggle';

const Navbar = () => {
  const isMobile = useIsMobile();

  return (
    <nav className="bg-movie-darker border-b border-white/5 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Logo />
          </div>
          
          <div className="hidden md:flex flex-1 items-center justify-center px-6 relative">
            <SearchBar />
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
        
        <div className="md:hidden py-2 relative">
          <SearchBar isMobile={true} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
