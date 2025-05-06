
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWatchlist } from '@/contexts/WatchlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserMenu: React.FC = () => {
  const { watchlist } = useWatchlist();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return (
      <Link to="/login">
        <Button variant="ghost" size="sm" className="text-white/80 hover:text-white">
          Sign In
        </Button>
      </Link>
    );
  }

  return (
    <>
      <Link 
        to="/watchlist"
        className="relative p-2 text-white/70 hover:text-white focus:outline-none"
      >
        <Bookmark size={20} />
        {watchlist.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-movie-primary rounded-full">
            {watchlist.length}
          </span>
        )}
      </Link>
      
      <Link to="/profile">
        <Button variant="ghost" size="sm" className="text-white/80 hover:text-white">
          <User size={16} className="mr-1" />
          Profile
        </Button>
      </Link>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="focus:outline-none">
            <Avatar className="h-8 w-8 border border-white/10">
              <AvatarImage src="" />
              <AvatarFallback className="bg-movie-primary/20 text-movie-primary">
                {user.email && user.email[0] ? user.email[0].toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-movie-dark border-white/10">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile')}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/dashboard')}>
            <User className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/watchlist')}>
            <Bookmark className="mr-2 h-4 w-4" />
            <span>Watchlist</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem className="cursor-pointer text-red-500" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserMenu;
