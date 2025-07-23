import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Heart, Star, Calendar, TrendingUp, StarIcon } from 'lucide-react';
import type { Movie } from '../types';
import { useApp } from '../lib/context';
import { RatingModal } from './RatingModal';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const { isFavorite, toggleFavorite, getUserRating } = useApp();
  const [showRatingModal, setShowRatingModal] = useState(false);
  
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : 'https://via.placeholder.com/342x513/374151/9ca3af?text=Sem+Poster';

  const releaseYear = movie.release_date
    ? format(new Date(movie.release_date), 'yyyy')
    : 'N/A';

  const rating = movie.vote_average.toFixed(1);
  const isLiked = isFavorite(movie.id);
  const userRating = getUserRating(movie.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(movie.id);
  };

  const handleRatingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowRatingModal(true);
  };

  return (
    <>
      <div className="group relative">
        <Link
          to={`/movie/${movie.id}`}
          className="block transition-all duration-300 hover:scale-105 hover:-translate-y-2"
        >
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700/50 dark:border-gray-700/50">
            {/* Poster Container */}
            <div className="relative overflow-hidden">
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* TMDb Rating Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs font-medium">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="text-white">{rating}</span>
              </div>

              {/* User Rating Badge */}
              {userRating && (
                <div className="absolute top-3 left-16 flex items-center gap-1 px-2 py-1 bg-blue-600/80 backdrop-blur-sm rounded-full text-xs font-medium">
                  <StarIcon className="h-3 w-3 text-white fill-current" />
                  <span className="text-white">{userRating.rating}</span>
                </div>
              )}

              {/* Popularity Badge */}
              {movie.popularity && movie.popularity > 1000 && (
                <div className="absolute top-3 right-16 flex items-center gap-1 px-2 py-1 bg-red-500/80 backdrop-blur-sm rounded-full text-xs font-medium">
                  <TrendingUp className="h-3 w-3 text-white" />
                  <span className="text-white">HOT</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                {/* Favorite Button */}
                <button
                  onClick={handleFavoriteClick}
                  className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 ${
                    isLiked 
                      ? 'bg-red-500/80 text-white' 
                      : 'bg-black/50 text-gray-300 hover:bg-red-500/50 hover:text-white'
                  }`}
                  title={isLiked ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>

                {/* Rating Button */}
                <button
                  onClick={handleRatingClick}
                  className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 ${
                    userRating
                      ? 'bg-blue-500/80 text-white'
                      : 'bg-black/50 text-gray-300 hover:bg-blue-500/50 hover:text-white'
                  }`}
                  title={userRating ? 'Editar avaliação' : 'Avaliar filme'}
                >
                  <StarIcon className={`h-4 w-4 ${userRating ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Movie Info */}
            <div className="p-4">
              <h3 className="font-bold text-gray-100 dark:text-gray-100 truncate mb-2 group-hover:text-blue-400 transition-colors duration-300">
                {movie.title}
              </h3>
              
              <div className="flex items-center justify-between text-sm text-gray-400 dark:text-gray-400 mb-2">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{releaseYear}</span>
                </div>
                
                {movie.vote_count && (
                  <span className="text-xs">
                    {movie.vote_count.toLocaleString()} votos
                  </span>
                )}
              </div>

              {/* User Review Preview */}
              {userRating?.review && (
                <div className="text-xs text-blue-400 italic truncate mb-2">
                  "Minha resenha: {userRating.review}"
                </div>
              )}

              {/* Genres Preview */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {movie.genres.slice(0, 2).map((genre) => (
                    <span
                      key={genre.id}
                      className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* Rating Modal */}
      <RatingModal
        movieId={movie.id}
        movieTitle={movie.title}
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
      />
    </>
  );
} 