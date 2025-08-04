'use client';

import React from 'react';
import Image from 'next/image';
import { useMovies } from '@/contexts/MovieContext';
import { movieService } from '@/lib/movieService';
import { Star, Calendar, Heart } from 'lucide-react';

export function LikedMovies() {
  const { state } = useMovies();

  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  if (state.likedMovies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <Heart className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No liked movies yet</h2>
        <p className="text-gray-600">Start swiping to build your movie list!</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500" />
          Your Movie List ({state.likedMovies.length})
        </h2>

        <div className="grid gap-4">
          {state.likedMovies.map((movie) => (
            <div
              key={movie.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="flex">
                {/* Movie Poster */}
                <div className="w-24 h-36 flex-shrink-0 relative">
                  <Image
                    src={movieService.getImageUrl(movie.poster_path)}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    sizes="96px"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-movie.svg';
                    }}
                  />
                </div>

                {/* Movie Details */}
                <div className="flex-1 p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
                    {movie.title}
                  </h3>

                  <div className="flex items-center gap-4 mb-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(movie.release_date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{movie.vote_average.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {movieService.getGenreNames(movie.genre_ids).slice(0, 2).map((genre) => (
                      <span
                        key={genre}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>

                  {/* Overview */}
                  <p className="text-gray-700 text-sm line-clamp-2 leading-relaxed">
                    {movie.overview}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
