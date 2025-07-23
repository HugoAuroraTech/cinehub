export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genres: { id: number; name: string }[];
  runtime?: number;
  status?: string;
  budget?: number;
  revenue?: number;
  original_language?: string;
  popularity?: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface UserRating {
  movieId: number;
  rating: number;
  review?: string;
  timestamp: number;
}

export interface AppContextType {
  favorites: number[];
  theme: 'dark' | 'light';
  userRatings: UserRating[];
  toggleFavorite: (movieId: number) => void;
  toggleTheme: () => void;
  isFavorite: (movieId: number) => boolean;
  rateMovie: (movieId: number, rating: number, review?: string) => void;
  getUserRating: (movieId: number) => UserRating | null;
  removeRating: (movieId: number) => void;
}

export interface FilterOptions {
  genre?: string;
  year?: string;
  rating?: string;
  sortBy?: 'popularity.desc' | 'vote_average.desc' | 'release_date.desc';
} 