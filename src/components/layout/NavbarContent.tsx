
import React from 'react';
import Logo from './Logo';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';
import { ThemeToggle } from './ThemeToggle';

const NavbarContent: React.FC = () => {
  return (
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
  );
};

export default NavbarContent;
