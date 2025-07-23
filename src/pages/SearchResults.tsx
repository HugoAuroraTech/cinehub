import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../lib/axios';
import type { Movie, PaginatedResponse } from '../types';
import { MovieCard } from '../components/MovieCard';

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function searchMovies() {
      if (!query?.trim()) {
        setMovies([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await api.get<PaginatedResponse<Movie>>('/search/movie', {
          params: {
            query: query.trim(),
          },
        });
        setMovies(response.data.results);
      } catch (err) {
        setError('Erro ao buscar filmes');
        console.error('Error searching movies:', err);
      } finally {
        setLoading(false);
      }
    }

    searchMovies();
  }, [query]);

  if (!query?.trim()) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-lg">
          Digite algo para buscar filmes...
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-8">
        <p>{error}</p>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-lg">
          Nenhum resultado encontrado para "{query}"
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-100 mb-2">
        Resultados da busca
      </h1>
      <p className="text-gray-400 mb-8">
        {movies.length} resultado{movies.length !== 1 ? 's' : ''} para "{query}"
      </p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
} 