import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { 
  Music, 
  Home, 
  Library, 
  Plus, 
  User, 
  LogOut,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { ParticleGradientBackground } from './GradientBackground';

const Layout = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  if (!isAuthenticated) {
    return <Outlet />;
  }

  return (
    <ParticleGradientBackground 
      variant="subtle" 
      className="min-h-screen"
      particleDensity="low"
    >
      {/* Navigation Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-indigo-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center animate-pulse-gentle">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Serenitune
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-full"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/dashboard" 
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/dashboard') 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>
              <Link 
                to="/library" 
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/library') 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <Library className="w-5 h-5" />
                <span>Library</span>
              </Link>
              <Link 
                to="/create-playlist" 
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/create-playlist') 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <Plus className="w-5 h-5" />
                <span>Create Playlist</span>
              </Link>
            </nav>

            {/* User Menu */}
            <div className="hidden md:flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border border-indigo-200">
                      <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                        {user?.username?.substring(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-medium">{user?.username}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="w-4 h-4 mr-2" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="w-4 h-4 mr-2" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-indigo-100 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            <Link 
              to="/dashboard" 
              className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                isActive('/dashboard') 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </Link>
            <Link 
              to="/library" 
              className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                isActive('/library') 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Library className="w-5 h-5" />
              <span className="font-medium">Library</span>
            </Link>
            <Link 
              to="/create-playlist" 
              className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                isActive('/create-playlist') 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Create Playlist</span>
            </Link>
            <div className="pt-2 mt-2 border-t border-gray-100">
              <div className="flex items-center px-3 py-3">
                <Avatar className="h-10 w-10 border border-indigo-200 mr-3">
                  <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    {user?.username?.substring(0, 2).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user?.username}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              <Link 
                to="/profile" 
                className="flex items-center space-x-3 px-3 py-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>
              <Link 
                to="/settings" 
                className="flex items-center space-x-3 px-3 py-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
              <button 
                className="w-full flex items-center space-x-3 px-3 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
              >
                <LogOut className="w-5 h-5" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-indigo-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Music className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Serenitune
              </span>
            </div>
            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Serenitune. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </ParticleGradientBackground>
  );
};

export default Layout;

