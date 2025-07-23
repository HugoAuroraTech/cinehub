import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { AppContextType, UserRating } from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [userRatings, setUserRatings] = useState<UserRating[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('cinehub-favorites');
    const savedTheme = localStorage.getItem('cinehub-theme') as 'dark' | 'light';
    const savedRatings = localStorage.getItem('cinehub-ratings');
    
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    if (savedTheme) {
      setTheme(savedTheme);
    }

    if (savedRatings) {
      setUserRatings(JSON.parse(savedRatings));
    }
  }, []);

  // Save to localStorage when favorites change
  useEffect(() => {
    localStorage.setItem('cinehub-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save to localStorage when ratings change
  useEffect(() => {
    localStorage.setItem('cinehub-ratings', JSON.stringify(userRatings));
  }, [userRatings]);

  // Save to localStorage and update theme when theme changes
  useEffect(() => {
    localStorage.setItem('cinehub-theme', theme);
    
    // Update document class and body class for theme
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    if (theme === 'dark') {
      htmlElement.classList.add('dark');
      bodyElement.classList.remove('light');
      bodyElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
      bodyElement.classList.remove('dark');
      bodyElement.classList.add('light');
    }
  }, [theme]);

  const toggleFavorite = (movieId: number) => {
    setFavorites(prev => 
      prev.includes(movieId)
        ? prev.filter(id => id !== movieId)
        : [...prev, movieId]
    );
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const isFavorite = (movieId: number) => {
    return favorites.includes(movieId);
  };

  const rateMovie = (movieId: number, rating: number, review?: string) => {
    const newRating: UserRating = {
      movieId,
      rating,
      review,
      timestamp: Date.now(),
    };

    setUserRatings(prev => {
      const existingIndex = prev.findIndex(r => r.movieId === movieId);
      if (existingIndex >= 0) {
        // Update existing rating
        const updated = [...prev];
        updated[existingIndex] = newRating;
        return updated;
      } else {
        // Add new rating
        return [...prev, newRating];
      }
    });
  };

  const getUserRating = (movieId: number): UserRating | null => {
    return userRatings.find(r => r.movieId === movieId) || null;
  };

  const removeRating = (movieId: number) => {
    setUserRatings(prev => prev.filter(r => r.movieId !== movieId));
  };

  const value: AppContextType = {
    favorites,
    theme,
    userRatings,
    toggleFavorite,
    toggleTheme,
    isFavorite,
    rateMovie,
    getUserRating,
    removeRating,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 