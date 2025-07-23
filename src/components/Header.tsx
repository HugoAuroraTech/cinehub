import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Moon, Sun, Heart, Home, Film } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { useApp } from '../lib/context';

export function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme, favorites } = useApp();

  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(debouncedSearchTerm)}`);
    }
  }, [debouncedSearchTerm, navigate]);

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-900/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-700/50 dark:border-gray-700/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  🎬
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-20 rounded-full blur-xl transition-opacity duration-300"></div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                CineHub
              </h1>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                  isActiveRoute('/')
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-gray-300 hover:text-blue-400 hover:bg-gray-800/50'
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Início</span>
              </Link>

              <Link
                to="/discover"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                  isActiveRoute('/discover')
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-gray-300 hover:text-blue-400 hover:bg-gray-800/50'
                }`}
              >
                <Film className="h-4 w-4" />
                <span>Descobrir</span>
              </Link>

              <Link
                to="/favorites"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 relative ${
                  isActiveRoute('/favorites')
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'text-gray-300 hover:text-red-400 hover:bg-gray-800/50'
                }`}
              >
                <Heart className="h-4 w-4" />
                <span>Favoritos</span>
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>
            </nav>
          </div>

          {/* Search and Controls */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Buscar filmes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 bg-gray-800/50 dark:bg-gray-800/50 border border-gray-600/50 dark:border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 dark:text-gray-100 placeholder-gray-400 backdrop-blur-sm transition-all duration-300 focus:w-72"
              />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-800/50 dark:bg-gray-800/50 border border-gray-600/50 dark:border-gray-600/50 text-gray-300 hover:text-yellow-400 hover:bg-gray-700/50 transition-all duration-300 hover:scale-105"
              title={`Mudar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 