import React, { useState, useEffect, useRef } from 'react';
import { 
  Star, Film, ThumbsUp, Smile, Meh, Frown, ThumbsDown, 
  Search, X, Play, Info, ChevronLeft, ChevronRight, Sparkles 
} from 'lucide-react';
import { fetchSecureMovies } from '../api';

// --- Sentiment Icon & Visual Badges ---
export const SentimentIcon = ({ sentiment, className = "h-5 w-5" }) => {
  switch (sentiment) {
    case 'Positive': return <ThumbsUp className={`${className} text-white`} />;
    case 'Somewhat Positive': return <Smile className={`${className} text-stone-300`} />;
    case 'Neutral': return <Meh className={`${className} text-stone-500`} />;
    case 'Somewhat Negative': return <Frown className={`${className} text-stone-600`} />;
    case 'Negative': return <ThumbsDown className={`${className} text-stone-700`} />;
    default: return <Meh className={`${className} text-stone-500`} />;
  }
};

export const SentimentPill = ({ sentiment, confidence }) => {
  const configs = {
    'Positive': { label: 'Strongly Positive' },
    'Somewhat Positive': { label: 'Favorable Reaction' },
    'Neutral': { label: 'Balanced / Neutral' },
    'Somewhat Negative': { label: 'Subtle Dissatisfaction' },
    'Negative': { label: 'Critical Disapproval' }
  };
  const current = configs[sentiment] || configs['Neutral'];
  return (
    <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-red-900/40 bg-[#050505] shadow-inner shadow-red-900/20`}>
      <SentimentIcon sentiment={sentiment} className="w-4 h-4 text-red-500" />
      <span className="font-semibold text-red-100 text-xs uppercase tracking-widest">
        {current.label}
      </span>
    </div>
  );
};

// --- Movie Autocomplete ---
export const MovieAutocomplete = ({ onSelect, value, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
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
    if (skipSearch.current) { skipSearch.current = false; return; }
    if (value.length < 2) {
      setSuggestions([]); setShowSuggestions(false); return;
    }
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await fetchSecureMovies("/tmdb/search", { query: value });
        const formatted = (data || []).map(m => ({
          id: m.id, title: m.title, 
          year: m.release_date ? new Date(m.release_date).getFullYear().toString() : "N/A",
          poster: m.poster_path,
          rating: m.vote_average ? m.vote_average.toFixed(1) : null
        }));
        setSuggestions(formatted);
        setShowSuggestions(true);
      } catch (error) { setSuggestions([]); } 
      finally { setIsLoading(false); }
    }, 280);
  }, [value]);

  const handleSelect = (title) => {
    skipSearch.current = true;
    onChange(title);
    onSelect(title);
    setShowSuggestions(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full group z-30">
      <div className="relative flex items-center border-b border-[#333333] focus-within:border-white transition-colors">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => value.length >= 2 && !skipSearch.current && setShowSuggestions(true)}
          placeholder="E.g., Joker, Interstellar, The Godfather..."
          className="w-full py-4 bg-transparent text-white placeholder-stone-600 text-lg md:text-xl font-light focus:outline-none"
        />
        {value && (
          <button
            type="button"
            onClick={() => { onChange(''); setSuggestions([]); setShowSuggestions(false); }}
            className="absolute right-0 p-2 text-stone-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-[#050505] border border-[#222222] shadow-2xl overflow-hidden max-h-72 overflow-y-auto rounded-xl">
          {suggestions.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleSelect(s.title)}
              className="w-full px-4 py-3 text-left hover:bg-[#111111] transition-colors flex items-center gap-4 group border-b border-[#111111] last:border-none"
            >
              {s.poster ? (
                <img src={s.poster} alt={s.title} className="w-10 h-14 object-cover rounded shadow-sm flex-shrink-0" />
              ) : (
                <div className="w-10 h-14 bg-[#111111] rounded flex items-center justify-center flex-shrink-0 text-stone-600"><Film className="w-4 h-4" /></div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white truncate">{s.title}</div>
                <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                  <span>{s.year}</span>
                  {s.rating && <span className="flex items-center gap-1 font-medium"><Star className="w-3 h-3" /> {s.rating}</span>}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Movie Card ---
export const MovieCard = ({ movie, isResult = false, onSelectMovie, onWatchTrailer }) => {
  const imageUrl = movie.poster_path
    ? (movie.poster_path.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`)
    : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80";

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average ? Number(movie.vote_average).toFixed(1) : null;

  return (
    <div 
      className={`flex-shrink-0 ${isResult ? 'w-44 sm:w-52 md:w-64' : 'w-40 sm:w-48 md:w-56'} group relative cursor-pointer select-none`}
      onClick={() => onSelectMovie && onSelectMovie(movie)}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-[#0f0f0f] border border-[#222222] transition-all duration-300">
        <img
          src={imageUrl}
          alt={movie.title}
          className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
        
        {rating && (
          <div className="absolute top-3 right-3 bg-white text-black px-2 py-0.5 text-[10px] font-bold rounded flex items-center gap-1">
            <Star size={10} fill="currentColor" /> {rating}
          </div>
        )}

        <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); if (onWatchTrailer) onWatchTrailer(movie.title); }}
            className="p-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-900/40 transition-transform hover:scale-110"
            title="Watch Trailer"
          >
            <Play className="w-4 h-4 fill-current" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); if (onSelectMovie) onSelectMovie(movie); }}
            className="p-3.5 rounded-full bg-blue-950/80 hover:bg-blue-900 text-blue-100 border border-blue-800 shadow-xl shadow-blue-900/40 transition-transform hover:scale-110 backdrop-blur-md"
            title="View Details"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute bottom-0 inset-x-0 p-5">
          <div className="space-y-1">
            <h3 className="text-white font-semibold text-base md:text-lg leading-snug line-clamp-1 tracking-tight">
              {movie.title}
            </h3>
            <div className="text-xs text-stone-400 font-medium">
              {releaseYear}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Movie Carousel ---
export const MovieCarousel = ({ title, movies, isResult = false, onSelectMovie, onWatchTrailer }) => {
  const scrollRef = useRef(null);
  const scroll = (dir) => {
    if (scrollRef.current) {
      const amount = window.innerWidth < 768 ? 260 : 480;
      scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className={`relative ${isResult ? 'mt-4' : 'mb-12 md:mb-16'}`}>
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            {title}
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={() => scroll('left')} className="p-2 border border-[#333333] rounded-full text-stone-400 hover:text-white hover:border-white transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => scroll('right')} className="p-2 border border-[#333333] rounded-full text-stone-400 hover:text-white hover:border-white transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      <div ref={scrollRef} className="flex gap-4 md:gap-6 overflow-x-auto pb-6 scrollbar-hide scroll-smooth snap-x snap-mandatory">
        {movies.map((movie) => (
          <div key={movie.id} className="snap-start flex-shrink-0">
            <MovieCard movie={movie} isResult={isResult} onSelectMovie={onSelectMovie} onWatchTrailer={onWatchTrailer} />
          </div>
        ))}
      </div>
    </div>
  );
};