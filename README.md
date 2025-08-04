# MoviePicker 🎬

A Tinder-like movie discovery app built with Next.js, TypeScript, and Tailwind CSS. Swipe through movies, build your watchlist, and get personalized recommendations!

## Features

- 🎯 **Tinder-style swiping** - Swipe right to like, left to pass
- 📱 **Mobile-first design** - Optimized for mobile devices
- 🎬 **Movie recommendations** - Get similar movies based on your likes
- 📋 **Personal watchlist** - Keep track of movies you want to watch
- 🎨 **Beautiful UI** - Modern, clean interface with smooth animations
- 🔄 **Infinite scrolling** - Never run out of movies to discover

## Setup

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd movie-picker
npm install
```

### 2. Get TMDB API Key

1. Go to [The Movie Database (TMDB)](https://www.themoviedb.org/)
2. Create a free account
3. Go to [API Settings](https://www.themoviedb.org/settings/api)
4. Request an API key (it's free!)

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start discovering movies!

## How to Use

1. **Discover Movies**: Swipe right on movies you like, left on ones you don't
2. **Build Your List**: Liked movies are automatically added to your personal list
3. **Get Recommendations**: The app learns from your preferences and suggests similar movies
4. **View Your List**: Switch to the "My List" tab to see all your liked movies

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API**: The Movie Database (TMDB)

## Contributing

Feel free to contribute to this project! Some ideas for improvements:

- Add user authentication
- Implement movie ratings
- Add more filtering options
- Create movie details modal
- Add social sharing features

## License

This project is open source and available under the [MIT License](./LICENSE).