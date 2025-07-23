import { useState } from 'react';
import { Star, X, Save, Trash2 } from 'lucide-react';
import { useApp } from '../lib/context';

interface RatingModalProps {
  movieId: number;
  movieTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function RatingModal({ movieId, movieTitle, isOpen, onClose }: RatingModalProps) {
  const { rateMovie, getUserRating, removeRating } = useApp();
  const existingRating = getUserRating(movieId);
  
  const [rating, setRating] = useState(existingRating?.rating || 0);
  const [review, setReview] = useState(existingRating?.review || '');
  const [hoveredStar, setHoveredStar] = useState(0);

  if (!isOpen) return null;

  const handleSave = () => {
    if (rating > 0) {
      rateMovie(movieId, rating, review.trim() || undefined);
      onClose();
    }
  };

  const handleRemove = () => {
    removeRating(movieId);
    onClose();
  };

  const handleStarClick = (starValue: number) => {
    setRating(starValue);
  };

  const handleStarHover = (starValue: number) => {
    setHoveredStar(starValue);
  };

  const displayRating = hoveredStar || rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 max-w-md w-full mx-4 border border-gray-700/50 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-100">
            Avaliar Filme
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Movie Title */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-200 mb-2">
            {movieTitle}
          </h4>
        </div>

        {/* Star Rating */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Sua avaliação
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => handleStarHover(star)}
                onMouseLeave={() => setHoveredStar(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star 
                  className={`h-6 w-6 transition-colors ${
                    star <= displayRating 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-600'
                  }`} 
                />
              </button>
            ))}
            <span className="ml-3 text-lg font-semibold text-gray-200">
              {displayRating}/10
            </span>
          </div>
          {displayRating > 0 && (
            <div className="mt-2 text-sm text-gray-400">
              {displayRating <= 3 && "Não gostei"}
              {displayRating >= 4 && displayRating <= 6 && "Foi OK"}
              {displayRating >= 7 && displayRating <= 8 && "Gostei"}
              {displayRating >= 9 && "Amei!"}
            </div>
          )}
        </div>

        {/* Review (Optional) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Sua resenha (opcional)
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Compartilhe sua opinião sobre o filme..."
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            maxLength={500}
          />
          <div className="text-xs text-gray-500 mt-1">
            {review.length}/500 caracteres
          </div>
        </div>

        {/* Existing Rating Info */}
        {existingRating && (
          <div className="mb-6 p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg">
            <div className="text-sm text-blue-400">
              Você já avaliou este filme com {existingRating.rating}/10
            </div>
            {existingRating.review && (
              <div className="text-sm text-gray-300 mt-1">
                "{existingRating.review}"
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={rating === 0}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            {existingRating ? 'Atualizar' : 'Salvar'}
          </button>
          
          {existingRating && (
            <button
              onClick={handleRemove}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Remover
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 