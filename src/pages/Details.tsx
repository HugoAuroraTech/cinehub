import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star } from 'lucide-react';
import { format } from 'date-fns';
import { api } from '../lib/axios';
import type { Movie } from '../types';

export function Details() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMovieDetails() {
      if (!id) return;

      try {
        setLoading(true);
        const response = await api.get<Movie>(`/movie/${id}`);
        setMovie(response.data);
      } catch (err) {
        setError('Erro ao carregar detalhes do filme');
        console.error('Error fetching movie details:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="text-center text-red-400 py-8">
        <p>{error || 'Filme não encontrado'}</p>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750/374151/9ca3af?text=Sem+Poster';

  const releaseYear = movie.release_date
    ? format(new Date(movie.release_date), 'yyyy')
    : 'N/A';

  const rating = movie.vote_average.toFixed(1);

  return (
    <div className="relative">
      {/* Backdrop */}
      {backdropUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        />
      )}
      
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Poster */}
          <div className="lg:w-1/3">
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full max-w-md mx-auto lg:mx-0 rounded-lg shadow-lg"
            />
          </div>

          {/* Details */}
          <div className="lg:w-2/3">
            <h1 className="text-4xl font-bold text-gray-100 mb-4">
              {movie.title}
            </h1>

            <div className="flex items-center gap-4 mb-4">
              <span className="text-gray-400">{releaseYear}</span>
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="text-gray-100 font-semibold">
                  {rating}/10
                </span>
              </div>
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Synopsis */}
            <div>
              <h2 className="text-xl font-semibold text-gray-100 mb-3">
                Sinopse
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {movie.overview || 'Sinopse não disponível.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 