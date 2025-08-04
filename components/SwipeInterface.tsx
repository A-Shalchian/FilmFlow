'use client';

import React from 'react';
import { MovieCard } from './MovieCard';
import { useMovies } from '@/contexts/MovieContext';
import { Heart, X, RotateCcw } from 'lucide-react';

export function SwipeInterface() {
  const { getCurrentMovie, getUpcomingMovies, swipeMovie, resetStack, state } = useMovies();

  const currentMovie = getCurrentMovie();
  const upcomingMovies = getUpcomingMovies();

  const handleSwipe = (direction: 'left' | 'right') => {
    swipeMovie(direction);
  };

  const handleButtonSwipe = (direction: 'left' | 'right') => {
    handleSwipe(direction);
  };

  if (state.loading && state.currentMovies.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading movies...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 mb-4">{state.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!currentMovie) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No more movies!</h2>
          <p className="text-gray-600 mb-6">You&apos;ve seen all available movies.</p>
          <button
            onClick={resetStack}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-5 h-5" />
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Card Stack Container */}
      <div className="flex-1 relative max-w-sm mx-auto w-full">
        <div className="relative h-full">
          {/* Upcoming cards (background) */}
          {upcomingMovies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSwipe={() => {}}
              style={{
                scale: 1 - (index + 1) * 0.05,
                transform: `translateY(${(index + 1) * 10}px)`,
                zIndex: upcomingMovies.length - index,
              }}
            />
          ))}

          {/* Current card (top) */}
          <MovieCard
            key={currentMovie.id}
            movie={currentMovie}
            onSwipe={handleSwipe}
            isTop={true}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center items-center gap-8 py-8">
        <button
          onClick={() => handleButtonSwipe('left')}
          className="w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label="Pass"
        >
          <X className="w-8 h-8" />
        </button>

        <button
          onClick={() => handleButtonSwipe('right')}
          className="w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label="Like"
        >
          <Heart className="w-8 h-8" />
        </button>
      </div>

      {/* Progress indicator */}
      <div className="text-center text-sm text-gray-500 pb-4">
        {state.currentIndex + 1} of {state.currentMovies.length} movies
      </div>
    </div>
  );
}
