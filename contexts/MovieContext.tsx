'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Movie, SwipeAction } from '@/types/movie';
import { movieService } from '@/lib/movieService';

interface MovieState {
  currentMovies: Movie[];
  likedMovies: Movie[];
  dislikedMovies: Movie[];
  currentIndex: number;
  loading: boolean;
  error: string | null;
}

type MovieAction =
  | { type: 'SET_MOVIES'; payload: Movie[] }
  | { type: 'SWIPE_MOVIE'; payload: SwipeAction }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_MORE_MOVIES'; payload: Movie[] }
  | { type: 'RESET_STACK' };

const initialState: MovieState = {
  currentMovies: [],
  likedMovies: [],
  dislikedMovies: [],
  currentIndex: 0,
  loading: false,
  error: null,
};

function movieReducer(state: MovieState, action: MovieAction): MovieState {
  switch (action.type) {
    case 'SET_MOVIES':
      return {
        ...state,
        currentMovies: action.payload,
        currentIndex: 0,
        loading: false,
        error: null,
      };
    
    case 'SWIPE_MOVIE':
      const movie = state.currentMovies[state.currentIndex];
      if (!movie) return state;

      const newState = {
        ...state,
        currentIndex: state.currentIndex + 1,
      };

      if (action.payload.direction === 'right') {
        newState.likedMovies = [...state.likedMovies, movie];
      } else {
        newState.dislikedMovies = [...state.dislikedMovies, movie];
      }

      return newState;
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'LOAD_MORE_MOVIES':
      return {
        ...state,
        currentMovies: [...state.currentMovies, ...action.payload],
        loading: false,
      };
    
    case 'RESET_STACK':
      return {
        ...state,
        currentIndex: 0,
      };
    
    default:
      return state;
  }
}

interface MovieContextType {
  state: MovieState;
  swipeMovie: (direction: 'left' | 'right') => void;
  loadMoreMovies: () => Promise<void>;
  getCurrentMovie: () => Movie | null;
  getUpcomingMovies: () => Movie[];
  resetStack: () => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export function MovieProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(movieReducer, initialState);

  useEffect(() => {
    loadInitialMovies();
  }, []);

  const loadInitialMovies = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const movies = await movieService.fetchPopularMovies(1);
      dispatch({ type: 'SET_MOVIES', payload: movies });
    } catch (error) {
      console.error('Error loading initial movies:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load movies' });
    }
  };

  const swipeMovie = async (direction: 'left' | 'right') => {
    const currentMovie = getCurrentMovie();
    if (!currentMovie) return;

    const swipeAction: SwipeAction = {
      movieId: currentMovie.id,
      direction,
      timestamp: Date.now(),
    };

    dispatch({ type: 'SWIPE_MOVIE', payload: swipeAction });

    // If user liked the movie, fetch similar movies for better recommendations
    if (direction === 'right') {
      try {
        const similarMovies = await movieService.fetchSimilarMovies(currentMovie.id);
        if (similarMovies.length > 0) {
          // Add some similar movies to the stack
          const newMovies = similarMovies.slice(0, 5).filter(
            movie => !state.currentMovies.some(existing => existing.id === movie.id)
          );
          if (newMovies.length > 0) {
            dispatch({ type: 'LOAD_MORE_MOVIES', payload: newMovies });
          }
        }
      } catch (error) {
        console.error('Error fetching similar movies:', error);
      }
    }

    // Load more movies if we're running low
    if (state.currentIndex >= state.currentMovies.length - 3) {
      await loadMoreMovies();
    }
  };

  const loadMoreMovies = async () => {
    if (state.loading) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const page = Math.floor(state.currentMovies.length / 20) + 1;
      const newMovies = await movieService.fetchPopularMovies(page);
      dispatch({ type: 'LOAD_MORE_MOVIES', payload: newMovies });
    } catch (error) {
      console.error('Error loading more movies:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load more movies' });
    }
  };

  const getCurrentMovie = (): Movie | null => {
    return state.currentMovies[state.currentIndex] || null;
  };

  const getUpcomingMovies = (): Movie[] => {
    return state.currentMovies.slice(state.currentIndex + 1, state.currentIndex + 4);
  };

  const resetStack = () => {
    dispatch({ type: 'RESET_STACK' });
  };

  return (
    <MovieContext.Provider
      value={{
        state,
        swipeMovie,
        loadMoreMovies,
        getCurrentMovie,
        getUpcomingMovies,
        resetStack,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export function useMovies() {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
}
