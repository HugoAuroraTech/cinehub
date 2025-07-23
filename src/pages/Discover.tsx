import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/axios';
import type { Movie, PaginatedResponse, FilterOptions, Genre } from '../types';
import { MovieCard } from '../components/MovieCard';
import { FilterBar } from '../components/FilterBar';
import { GridSkeleton } from '../components/Skeleton';
import { Compass, Shuffle, TrendingUp, Calendar, Sparkles } from 'lucide-react';

export function Discover() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showFilters, setShowFilters] = useState(false);
  const [discoveryMode, setDiscoveryMode] = useState<'trending' | 'random' | 'upcoming' | 'custom'>('trending');
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    async function fetchGenres() {
      try {
        const response = await api.get('/genre/movie/list');
        setGenres(response.data.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    }
    fetchGenres();
  }, []);

  const fetchMovies = useCallback(async (page: number = 1, reset: boolean = true) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      let endpoint = '/discover/movie';
      const params: any = { 
        page,
        sort_by: 'popularity.desc',
        include_adult: false,
        include_video: false,
        'vote_count.gte': 100
      };

      // Discovery modes
      switch (discoveryMode) {
        case 'trending':
          endpoint = '/trending/movie/week';
          break;
        case 'upcoming':
          endpoint = '/movie/upcoming';
          break;
        case 'random':
          // Random discovery - mix different criteria
          params.sort_by = ['popularity.desc', 'vote_average.desc', 'release_date.desc'][Math.floor(Math.random() * 3)];
          params.page = Math.floor(Math.random() * 10) + 1;
          const randomYear = 2024 - Math.floor(Math.random() * 30);
          params.year = randomYear;
          break;
        case 'custom':
          // Apply user filters
          if (filters.genre) params.with_genres = filters.genre;
          if (filters.year) params.year = filters.year;
          if (filters.rating) params['vote_average.gte'] = filters.rating;
          if (filters.sortBy) params.sort_by = filters.sortBy;
          break;
      }

      const response = await api.get<PaginatedResponse<Movie>>(endpoint, { params });
      
      if (reset) {
        setMovies(response.data.results);
      } else {
        setMovies(prev => [...prev, ...response.data.results]);
      }
      
      setCurrentPage(response.data.page);
      setTotalPages(response.data.total_pages);
    } catch (err) {
      setError('Erro ao descobrir filmes');
      console.error('Error discovering movies:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [discoveryMode, filters]);

  useEffect(() => {
    fetchMovies(1, true);
  }, [fetchMovies]);

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loadingMore) {
      fetchMovies(currentPage + 1, false);
    }
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setDiscoveryMode('custom');
    setCurrentPage(1);
  };

  const handleDiscoveryModeChange = (mode: 'trending' | 'random' | 'upcoming' | 'custom') => {
    setDiscoveryMode(mode);
    setCurrentPage(1);
    if (mode !== 'custom') {
      setFilters({});
    }
  };

  const shuffleMovies = () => {
    const shuffled = [...movies].sort(() => Math.random() - 0.5);
    setMovies(shuffled);
  };

  const getDiscoveryInfo = (mode: string) => {
    switch (mode) {
      case 'trending':
        return { 
          title: 'Descobrir Filmes em Alta', 
          icon: TrendingUp, 
          description: 'Os filmes mais populares da semana',
          color: 'from-orange-600/20 to-red-600/20 border-orange-500/20'
        };
      case 'random':
        return { 
          title: 'Descoberta Aleatória', 
          icon: Shuffle, 
          description: 'Filmes surpresa de diferentes épocas e gêneros',
          color: 'from-purple-600/20 to-pink-600/20 border-purple-500/20'
        };
      case 'upcoming':
        return { 
          title: 'Próximos Lançamentos', 
          icon: Calendar, 
          description: 'Filmes que estão chegando aos cinemas',
          color: 'from-green-600/20 to-emerald-600/20 border-green-500/20'
        };
      case 'custom':
        return { 
          title: 'Descoberta Personalizada', 
          icon: Sparkles, 
          description: 'Filmes baseados nos seus filtros',
          color: 'from-blue-600/20 to-indigo-600/20 border-blue-500/20'
        };
      default:
        return { 
          title: 'Descobrir Filmes', 
          icon: Compass, 
          description: 'Explore o mundo do cinema',
          color: 'from-gray-600/20 to-gray-700/20 border-gray-500/20'
        };
    }
  };

  const discoveryInfo = getDiscoveryInfo(discoveryMode);
  const IconComponent = discoveryInfo.icon;

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-8 bg-gray-700/50 rounded w-64 animate-pulse"></div>
        <GridSkeleton count={20} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-red-400 text-lg mb-4">{error}</div>
        <button
          onClick={() => fetchMovies(1, true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className={`text-center py-12 bg-gradient-to-r ${discoveryInfo.color} rounded-2xl`}>
        <div className="flex justify-center mb-4">
          <IconComponent className="h-12 w-12 text-blue-400" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
          {discoveryInfo.title}
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          {discoveryInfo.description}
        </p>
      </div>

      {/* Discovery Mode Tabs */}
      <div className="flex flex-wrap gap-4 justify-center">
        {[
          { key: 'trending', label: 'Em Alta', icon: TrendingUp },
          { key: 'random', label: 'Aleatório', icon: Shuffle },
          { key: 'upcoming', label: 'Em Breve', icon: Calendar },
          { key: 'custom', label: 'Personalizado', icon: Sparkles },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => handleDiscoveryModeChange(key as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              discoveryMode === key
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex gap-4">
          <FilterBar
            onFiltersChange={handleFiltersChange}
            isVisible={showFilters}
            onToggle={() => setShowFilters(!showFilters)}
          />
          
          <button
            onClick={shuffleMovies}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-600/30 transition-colors"
          >
            <Shuffle className="h-4 w-4" />
            <span className="hidden sm:inline">Embaralhar</span>
          </button>
        </div>
        
        <div className="text-sm text-gray-400">
          {movies.length} filmes descobertos
        </div>
      </div>

      {/* Featured Genres (only for trending mode) */}
      {discoveryMode === 'trending' && genres.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-100">Gêneros Populares</h3>
          <div className="flex flex-wrap gap-2">
            {genres.slice(0, 8).map((genre) => (
              <button
                key={genre.id}
                onClick={() => {
                  setFilters({ genre: genre.id.toString() });
                  setDiscoveryMode('custom');
                }}
                className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-full hover:bg-blue-600/20 hover:text-blue-400 hover:border-blue-500/30 border border-gray-600/50 transition-all duration-300"
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Load More */}
      {currentPage < totalPages && discoveryMode !== 'random' && (
        <div className="text-center py-8">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
          >
            {loadingMore ? 'Carregando...' : 'Descobrir mais filmes'}
          </button>
        </div>
      )}

      {/* Random Mode - Shuffle Again */}
      {discoveryMode === 'random' && (
        <div className="text-center py-8">
          <button
            onClick={() => fetchMovies(1, true)}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/25"
          >
            <Shuffle className="h-4 w-4 inline mr-2" />
            Nova descoberta aleatória
          </button>
        </div>
      )}

      {/* Loading More Indicator */}
      {loadingMore && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <GridSkeleton count={10} />
        </div>
      )}
    </div>
  );
} 