import { useState, useEffect } from 'react';
import { Heart, Trash2, Download, Share2 } from 'lucide-react';
import { api } from '../lib/axios';
import type { Movie } from '../types';
import { MovieCard } from '../components/MovieCard';
import { GridSkeleton } from '../components/Skeleton';
import { useApp } from '../lib/context';

export function Favorites() {
  const { favorites, toggleFavorite } = useApp();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFavoriteMovies() {
      if (favorites.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch details for each favorite movie
        const moviePromises = favorites.map(id => 
          api.get<Movie>(`/movie/${id}`)
        );
        
        const responses = await Promise.allSettled(moviePromises);
        const favoriteMovies = responses
          .filter((result): result is PromiseFulfilledResult<any> => 
            result.status === 'fulfilled'
          )
          .map(result => result.value.data);
          
        setMovies(favoriteMovies);
      } catch (err) {
        setError('Erro ao carregar filmes favoritos');
        console.error('Error fetching favorite movies:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFavoriteMovies();
  }, [favorites]);

  const clearAllFavorites = () => {
    if (window.confirm('Tem certeza que deseja remover todos os favoritos?')) {
      favorites.forEach(id => toggleFavorite(id));
    }
  };

  const exportFavorites = () => {
    const favoritesList = movies.map(movie => ({
      id: movie.id,
      title: movie.title,
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A',
      rating: movie.vote_average
    }));

    const dataStr = JSON.stringify(favoritesList, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'meus-filmes-favoritos.json';
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const shareCollection = async () => {
    const movieTitles = movies.slice(0, 5).map(m => m.title).join(', ');
    const text = `Confira minha coleção de filmes favoritos no CineHub: ${movieTitles}${movies.length > 5 ? ` e mais ${movies.length - 5} filmes!` : ''}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Minha Coleção CineHub',
          text: text,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Texto copiado para a área de transferência!');
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-8 bg-gray-700/50 rounded w-64 animate-pulse"></div>
        <GridSkeleton count={8} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-red-400 text-lg mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="flex justify-center mb-6">
          <Heart className="h-24 w-24 text-gray-600 dark:text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-400 dark:text-gray-400 mb-4">
          Nenhum filme favorito ainda
        </h2>
        <p className="text-gray-500 dark:text-gray-500 mb-8 max-w-md mx-auto">
          Explore nossa coleção de filmes e adicione seus favoritos clicando no ícone de coração!
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-medium hover:from-red-700 hover:to-pink-700 transition-all duration-300"
        >
          <Heart className="h-4 w-4" />
          Descobrir Filmes
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center py-12 bg-gradient-to-r from-red-600/20 to-pink-600/20 rounded-2xl border border-red-500/20">
        <div className="flex justify-center mb-4">
          <Heart className="h-12 w-12 text-red-400 fill-current" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent mb-2">
          Meus Favoritos
        </h1>
        <p className="text-gray-400 text-lg">
          Sua coleção pessoal de {movies.length} filme{movies.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="text-sm text-gray-400">
          {movies.length} filme{movies.length !== 1 ? 's' : ''} na sua coleção
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={shareCollection}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-colors"
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Compartilhar</span>
          </button>
          
          <button
            onClick={exportFavorites}
            className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-600/30 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
          
          <button
            onClick={clearAllFavorites}
            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Limpar Tudo</span>
          </button>
        </div>
      </div>

      {/* Favorites Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Estatísticas da Coleção</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {movies.length}
            </div>
            <div className="text-sm text-gray-400">Total de Filmes</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {movies.length > 0 ? (movies.reduce((acc, movie) => acc + movie.vote_average, 0) / movies.length).toFixed(1) : '0'}
            </div>
            <div className="text-sm text-gray-400">Avaliação Média</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {Math.max(...movies.map(m => new Date(m.release_date || '').getFullYear())) || 'N/A'}
            </div>
            <div className="text-sm text-gray-400">Mais Recente</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {movies.filter(m => m.vote_average >= 8).length}
            </div>
            <div className="text-sm text-gray-400">Nota 8+</div>
          </div>
        </div>
      </div>
    </div>
  );
} 