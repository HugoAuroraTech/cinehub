import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/axios';
import type { Movie, PaginatedResponse, FilterOptions } from '../types';
import { MovieCard } from '../components/MovieCard';
import { FilterBar } from '../components/FilterBar';
import { GridSkeleton } from '../components/Skeleton';
import { TrendingUp, Zap, Award } from 'lucide-react';

export function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'popular' | 'top_rated' | 'upcoming'>('popular');

  const fetchMovies = useCallback(async (page: number = 1, reset: boolean = true) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      let endpoint = `/movie/${activeCategory}`;
      const params: any = { page };

      // Apply filters
      if (filters.genre) {
        endpoint = '/discover/movie';
        params.with_genres = filters.genre;
      }
      if (filters.year) {
        params.year = filters.year;
      }
      if (filters.rating) {
        params['vote_average.gte'] = filters.rating;
      }
      if (filters.sortBy) {
        params.sort_by = filters.sortBy;
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
      setError('Erro ao carregar filmes');
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [activeCategory, filters]);

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
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: 'popular' | 'top_rated' | 'upcoming') => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'popular':
        return { title: 'Filmes Populares', icon: TrendingUp, description: 'Os filmes mais populares do momento' };
      case 'top_rated':
        return { title: 'Mais Bem Avaliados', icon: Award, description: 'Os filmes com as melhores avaliações' };
      case 'upcoming':
        return { title: 'Em Breve', icon: Zap, description: 'Próximos lançamentos' };
      default:
        return { title: 'Filmes', icon: TrendingUp, description: '' };
    }
  };

  const categoryInfo = getCategoryInfo(activeCategory);
  const IconComponent = categoryInfo.icon;

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
      <div className="text-center py-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl border border-blue-500/20">
        <div className="flex justify-center mb-4">
          <IconComponent className="h-12 w-12 text-blue-400" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
          {categoryInfo.title}
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          {categoryInfo.description}
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-4 justify-center">
        {[
          { key: 'popular', label: 'Populares', icon: TrendingUp },
          { key: 'top_rated', label: 'Melhores', icon: Award },
          { key: 'upcoming', label: 'Em Breve', icon: Zap },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => handleCategoryChange(key as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeCategory === key
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center">
        <FilterBar
          onFiltersChange={handleFiltersChange}
          isVisible={showFilters}
          onToggle={() => setShowFilters(!showFilters)}
        />
        
        <div className="text-sm text-gray-400">
          {movies.length} filmes encontrados
        </div>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Load More */}
      {currentPage < totalPages && (
        <div className="text-center py-8">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
          >
            {loadingMore ? 'Carregando...' : 'Carregar mais filmes'}
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