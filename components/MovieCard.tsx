'use client';

import React from 'react';
import Image from 'next/image';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { Movie } from '@/types/movie';
import { movieService } from '@/lib/movieService';
import { Star, Calendar, Heart, X } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  onSwipe: (direction: 'left' | 'right') => void;
  isTop?: boolean;
  style?: React.CSSProperties;
}

export function MovieCard({ movie, onSwipe, isTop = false, style }: MovieCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-30, 30]);
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 150;
    
    if (Math.abs(info.offset.x) > threshold) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      onSwipe(direction);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  const getGenreNames = () => {
    return movieService.getGenreNames(movie.genre_ids).slice(0, 3);
  };

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{
        x,
        rotate,
        opacity,
        zIndex: isTop ? 10 : 1,
        ...style,
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05 }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Movie Poster */}
        <div className="relative h-3/5 overflow-hidden">
          <Image
            src={movieService.getImageUrl(movie.poster_path)}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-movie.svg';
            }}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Rating badge */}
          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-white text-sm font-medium">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>

          {/* Swipe indicators */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              opacity: useTransform(x, [0, 150], [0, 1]),
            }}
          >
            <div className="bg-green-500 text-white px-6 py-3 rounded-full font-bold text-xl flex items-center gap-2 rotate-12">
              <Heart className="w-6 h-6" />
              LIKE
            </div>
          </motion.div>

          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              opacity: useTransform(x, [-150, 0], [1, 0]),
            }}
          >
            <div className="bg-red-500 text-white px-6 py-3 rounded-full font-bold text-xl flex items-center gap-2 -rotate-12">
              <X className="w-6 h-6" />
              PASS
            </div>
          </motion.div>
        </div>

        {/* Movie Details */}
        <div className="h-2/5 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
              {movie.title}
            </h2>
            
            <div className="flex items-center gap-4 mb-3 text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{formatDate(movie.release_date)}</span>
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-3">
              {getGenreNames().map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Overview */}
            <p className="text-gray-700 text-sm line-clamp-3 leading-relaxed">
              {movie.overview}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
