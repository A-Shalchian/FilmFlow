'use client';

import React, { useState } from 'react';
import { SwipeInterface } from './SwipeInterface';
import { LikedMovies } from './LikedMovies';
import { useMovies } from '@/contexts/MovieContext';
import { Heart, Home, Film } from 'lucide-react';

export function MoviePickerApp() {
  const [activeTab, setActiveTab] = useState<'swipe' | 'liked'>('swipe');
  const { state } = useMovies();

  return (
    <div className="h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2">
            <Film className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">MoviePicker</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-md mx-auto w-full overflow-hidden">
        {activeTab === 'swipe' ? <SwipeInterface /> : <LikedMovies />}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t shadow-lg">
        <div className="max-w-md mx-auto px-4">
          <div className="flex justify-around py-2">
            <button
              onClick={() => setActiveTab('swipe')}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                activeTab === 'swipe'
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <Home className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Discover</span>
            </button>

            <button
              onClick={() => setActiveTab('liked')}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors relative ${
                activeTab === 'liked'
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <Heart className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">My List</span>
              {state.likedMovies.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {state.likedMovies.length > 99 ? '99+' : state.likedMovies.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
