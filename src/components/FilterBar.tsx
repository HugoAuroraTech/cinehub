import { useState, useEffect } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { api } from '../lib/axios';
import type { Genre, FilterOptions } from '../types';

interface FilterBarProps {
  onFiltersChange: (filters: FilterOptions) => void;
  isVisible: boolean;
  onToggle: () => void;
}

export function FilterBar({ onFiltersChange, isVisible, onToggle }: FilterBarProps) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({});

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

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 dark:bg-gray-800 text-gray-100 dark:text-gray-100 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors"
      >
        <Filter className="h-4 w-4" />
        Filtros
        {hasActiveFilters && (
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
        )}
        <ChevronDown className={`h-4 w-4 transition-transform ${isVisible ? 'rotate-180' : ''}`} />
      </button>

      {/* Filter Panel */}
      {isVisible && (
        <div className="absolute top-full left-0 right-0 mt-2 p-6 bg-gray-800 dark:bg-gray-800 rounded-lg shadow-xl border border-gray-700 dark:border-gray-700 z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
                Gênero
              </label>
              <select
                value={filters.genre || ''}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 dark:bg-gray-700 border border-gray-600 dark:border-gray-600 rounded-md text-gray-100 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos os gêneros</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
                Ano
              </label>
              <select
                value={filters.year || ''}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 dark:bg-gray-700 border border-gray-600 dark:border-gray-600 rounded-md text-gray-100 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos os anos</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
                Avaliação Mínima
              </label>
              <select
                value={filters.rating || ''}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 dark:bg-gray-700 border border-gray-600 dark:border-gray-600 rounded-md text-gray-100 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Qualquer avaliação</option>
                <option value="9">9+ ⭐</option>
                <option value="8">8+ ⭐</option>
                <option value="7">7+ ⭐</option>
                <option value="6">6+ ⭐</option>
                <option value="5">5+ ⭐</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
                Ordenar por
              </label>
              <select
                value={filters.sortBy || 'popularity.desc'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 dark:bg-gray-700 border border-gray-600 dark:border-gray-600 rounded-md text-gray-100 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="popularity.desc">Popularidade</option>
                <option value="vote_average.desc">Avaliação</option>
                <option value="release_date.desc">Mais Recentes</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-700 dark:border-gray-700">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-3 py-1 text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                <X className="h-4 w-4" />
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 