import React, { useState, useEffect, useRef } from 'react';
import { Star, Film, ThumbsUp, Smile, Meh, Frown, ThumbsDown } from 'lucide-react';
import { fetchSecureMovies } from '../api';

// --- Icon Helper ---
export const SentimentIcon = ({ sentiment }) => {
  const icons = {
    'Positive': <ThumbsUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
    'Somewhat Positive': <Smile className="h-5 w-5 text-teal-500 dark:text-teal-400" />,
    'Neutral': <Meh className="h-5 w-5 text-indigo-400 dark:text-indigo-300" />, 
    'Somewhat Negative': <Frown className="h-5 w-5 text-amber-500 dark:text-amber-400" />, // Gold for negative-ish
    'Negative': <ThumbsDown className="h-5 w-5 text-red-600 dark:text-red-400" />
  };
  return icons[sentiment] || <Meh className="h-5 w-5 text-stone-400" />;
};

// --- Autocomplete ---
export const MovieAutocomplete = ({ onSelect, value, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const debounceTimer = useRef(null);
  const wrapperRef = useRef(null);
  const skipSearch = useRef(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (skipSearch.current) {
      skipSearch.current = false;
      return;
    }
    if (value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      try {
        const data = await fetchSecureMovies("/tmdb/search", { query: value });
        const formatted = data.map(m => ({
          id: m.id, 
          title: m.title, 
          year: m.release_date ? new Date(m.release_date).getFullYear().toString() : "N/A",
        }));
        setSuggestions(formatted);
        setShowSuggestions(true);
      } catch (error) { 
        setSuggestions([]); 
      }
    }, 300);
  }, [value]);

  const handleSelect = (title) => {
    skipSearch.current = true;
    onChange(title);
    onSelect(title);
    setShowSuggestions(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full group z-30">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => value.length >= 2 && !skipSearch.current && setShowSuggestions(true)}
        placeholder="Which movie did you watch recently?"
        className="w-full px-0 py-4 bg-transparent border-b-2 border-stone-200 dark:border-stone-700 focus:border-indigo-600 dark:focus:border-indigo-400 transition-colors text-stone-900 dark:text-white placeholder-stone-400 text-lg font-serif focus:outline-none"
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden max-h-60 overflow-y-auto rounded-xl">
          {suggestions.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleSelect(s.title)}
              className="w-full px-4 py-3 text-left hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors flex items-center justify-between border-b border-stone-100 dark:border-slate-800 last:border-0 group"
            >
              <span className="font-serif text-stone-800 dark:text-stone-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 truncate mr-2">
                {s.title}
              </span>
              <span className="text-xs text-stone-500 font-sans">
                {s.year}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Movie Card (Gold & Indigo Mix) ---
export const MovieCard = ({ movie, isResult = false }) => {
  const imageUrl = movie.poster_path
    ? (movie.poster_path.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`)
    : "https://via.placeholder.com/300x450/1e293b/FFFFFF?text=No+Poster";
  
  return (
    <div className={`flex-shrink-0 ${isResult ? 'w-36 sm:w-44 md:w-56' : 'w-32 sm:w-40 md:w-48'} group relative cursor-pointer`}>
      <div className="relative overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 shadow-md transition-all duration-500 group-hover:shadow-xl group-hover:shadow-indigo-900/20 group-hover:-translate-y-1">
        <img
          src={imageUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Indigo Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Rating Badge - GOLD (Amber-500) */}
        <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 text-xs font-bold font-serif rounded shadow-lg group-hover:scale-110 transition-transform flex items-center gap-1">
          <Star size={10} fill="currentColor" className="text-white" />
          {movie.vote_average?.toFixed(1)}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          {/* Border Accent - GOLD */}
          <h3 className="text-white font-bold text-sm md:text-base leading-tight mb-1 font-serif line-clamp-2 border-l-2 border-amber-500 pl-2">
            {movie.title}
          </h3>
          <span className="text-xs text-indigo-200 font-sans pl-2">
            {new Date(movie.release_date).getFullYear()}
          </span>
        </div>
      </div>
    </div>
  );
};

// --- Movie Carousel ---
export const MovieCarousel = ({ title, movies, isResult = false }) => {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      const amount = window.innerWidth < 768 ? 280 : 450;
      scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className={`relative ${isResult ? 'mt-8 md:mt-12' : 'mb-16 md:mb-20'}`}>
      <div className="flex items-center justify-between mb-6 md:mb-8 px-2 border-b border-stone-200 dark:border-stone-800 pb-4">
        <h2 className={`font-bold ${isResult ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'} text-stone-900 dark:text-white font-serif flex items-center gap-3`}>
          {/* Gold Accent Bar */}
          <span className="w-1 h-6 bg-amber-500"></span>
          {title}
        </h2>
        <div className="hidden md:flex gap-2">
          <button 
            onClick={() => scroll('left')} 
            className="p-2 rounded-full border border-stone-200 dark:border-slate-700 hover:bg-indigo-50 hover:border-indigo-200 dark:hover:bg-indigo-900/30 dark:hover:border-indigo-700 transition-all text-stone-600 dark:text-stone-400 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={() => scroll('right')} 
            className="p-2 rounded-full border border-stone-200 dark:border-slate-700 hover:bg-indigo-50 hover:border-indigo-200 dark:hover:bg-indigo-900/30 dark:hover:border-indigo-700 transition-all text-stone-600 dark:text-stone-400 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollRef} 
        className="flex gap-4 md:gap-6 overflow-x-auto pb-8 px-2 scrollbar-hide scroll-smooth snap-x snap-mandatory"
      >
        {movies.map((movie) => (
          <div key={movie.id} className="snap-start">
            <MovieCard movie={movie} isResult={isResult} />
          </div>
        ))}
      </div>
    </div>
  );
};