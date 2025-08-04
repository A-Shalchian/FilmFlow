import { Movie, MovieResponse, Genre } from '@/types/movie';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export class MovieService {
  private static instance: MovieService;
  private genres: Genre[] = [];

  private constructor() {}

  public static getInstance(): MovieService {
    if (!MovieService.instance) {
      MovieService.instance = new MovieService();
    }
    return MovieService.instance;
  }

  async fetchGenres(): Promise<Genre[]> {
    if (this.genres.length > 0) {
      return this.genres;
    }

    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`
      );
      const data = await response.json();
      this.genres = data.genres;
      return this.genres;
    } catch (error) {
      console.error('Error fetching genres:', error);
      return [];
    }
  }

  async fetchPopularMovies(page: number = 1): Promise<Movie[]> {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`
      );
      const data: MovieResponse = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      return [];
    }
  }

  async fetchSimilarMovies(movieId: number): Promise<Movie[]> {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/${movieId}/similar?api_key=${TMDB_API_KEY}`
      );
      const data: MovieResponse = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching similar movies:', error);
      return [];
    }
  }

  async fetchMoviesByGenre(genreId: number, page: number = 1): Promise<Movie[]> {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&page=${page}`
      );
      const data: MovieResponse = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      return [];
    }
  }

  getImageUrl(path: string | null): string {
    if (!path) return '/placeholder-movie.svg';
    return `${IMAGE_BASE_URL}${path}`;
  }

  getGenreNames(genreIds: number[]): string[] {
    return genreIds
      .map(id => this.genres.find(genre => genre.id === id)?.name)
      .filter(Boolean) as string[];
  }
}

export const movieService = MovieService.getInstance();
