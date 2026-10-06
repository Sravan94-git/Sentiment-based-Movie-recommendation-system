import React, { useState, useEffect } from "react";
import { 
  Loader2, ArrowRight, Brain, TrendingUp, Zap, Info, Play, Ticket, Sparkles, ChevronRight, ChevronLeft
} from "lucide-react";

import { getAnalysisAndRecommendations, fetchSecureMovies } from "./api";
import { MovieAutocomplete, MovieCarousel, SentimentIcon } from "./components/UIComponents";
import { ThemeProvider } from "./components/ThemeContext";
import TrailerModal from "./components/TrailerModal";
import MovieDetailsModal from "./components/MovieDetailsModal";
import spidermanBg from "./assets/spiderman-bg.png";

// --- NAVBAR ---
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#050505]/95 backdrop-blur-md border-b border-[#222222]' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
        <div onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-xl font-bold text-white tracking-tighter hover:text-stone-300 transition-colors cursor-pointer relative z-10">
          CineSense
        </div>
        
        {/* Centered Navigation Links */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <button onClick={() => scrollTo('recommend')} className="text-[10px] font-semibold text-stone-300 hover:text-white uppercase tracking-widest transition-colors">
            Get Recommendations
          </button>
          <button onClick={() => scrollTo('discover')} className="text-[10px] font-semibold text-stone-300 hover:text-white uppercase tracking-widest transition-colors">
            Discover
          </button>
          <button onClick={() => scrollTo('about')} className="text-[10px] font-semibold text-stone-300 hover:text-white uppercase tracking-widest transition-colors">
            About the Model
          </button>
        </div>
      </div>
    </nav>
  );
};

// --- HOME COMPONENTS ---
const HeroSlideshow = ({ movies, onWatchTrailer, onMoreInfo }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!movies || movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(movies.length, 5));
    }, 6000);
    return () => clearInterval(interval);
  }, [movies]);

  if (!movies || movies.length === 0) return <div className="h-screen bg-[#050505] animate-pulse"></div>;

  const movie = movies[currentIndex];

  return (
    <div className="relative w-full h-screen bg-[#050505] flex items-center overflow-hidden">
      {/* Background Images */}
      {movies.slice(0, 5).map((m, idx) => (
        <div 
          key={m.id} 
          className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentIndex ? 'opacity-100 z-0' : 'opacity-0 z-[-1]'}`}
        >
          <img 
            src={`https://image.tmdb.org/t/p/original${m.backdrop_path || m.poster_path}`} 
            alt={m.title} 
            className="w-full h-full object-cover scale-105"
            style={{ transform: idx === currentIndex ? 'scale(1)' : 'scale(1.05)', transition: 'transform 6s ease-out' }}
          />
        </div>
      ))}
      
      {/* Gradients */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />

      {/* Content */}
      <div className="container mx-auto px-6 md:px-12 relative z-10 pt-32 md:pt-40 mt-12 md:mt-16">
        <div className="max-w-2xl transition-all duration-700 transform translate-y-0 opacity-100" key={movie.id}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 mb-6 text-xs text-white uppercase tracking-widest font-medium">
             Featured Selection
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold text-white mb-6 tracking-tighter leading-[1.1]">
            {movie.title}
          </h1>
          <p className="text-stone-300 text-base md:text-lg line-clamp-3 leading-relaxed mb-10 font-light max-w-xl">
            {movie.overview}
          </p>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onWatchTrailer(movie.id, movie.title)}
              className="flex items-center gap-2 px-7 py-3.5 bg-red-600 text-white font-bold uppercase tracking-widest text-sm hover:bg-red-700 transition-colors shadow-xl shadow-red-900/40"
            >
              <Play className="w-4 h-4 fill-current" />
              Watch Trailer
            </button>
            <button 
              onClick={() => onMoreInfo(movie)}
              className="flex items-center gap-2 px-7 py-3.5 bg-blue-950/40 backdrop-blur-md text-blue-100 border border-blue-500/30 font-semibold uppercase tracking-widest text-sm hover:bg-blue-900/50 transition-colors shadow-xl shadow-blue-900/20"
            >
              <Info className="w-4 h-4" />
              Details
            </button>
          </div>
        </div>
      </div>
      
      {/* Slide Indicators */}
      <div className="absolute bottom-10 right-10 z-20 flex gap-2">
        {movies.slice(0, 5).map((_, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1 transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-white' : 'w-4 bg-white/30 hover:bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
};

// --- RECOMMENDER COMPONENTS ---
const HeroAnalyzer = ({ onAnalyze, isLoading }) => {
  const [movie, setMovie] = useState("");
  const [review, setReview] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!movie.trim() || !review.trim()) return;
    onAnalyze(movie, review);
  };

  return (
    <section id="recommend" className="py-24 relative flex flex-col items-center justify-center bg-black border-t border-[#222222] overflow-hidden">
      {/* Spider-Man Cinema Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img 
          src={spidermanBg} 
          alt="Spider-Man in Cinema" 
          className="w-full h-full object-cover object-center opacity-70 filter brightness-95 contrast-105" 
        />
        {/* Subtle cinematic gradient vignette to keep focus on form while making Spider-Man vibrant */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-[#050505]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-[#050505]/80" />
      </div>

      <div className="container mx-auto px-4 relative z-10 w-full">
        <div className="text-center mb-10 space-y-4 max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tighter leading-tight drop-shadow-md">
            Discover your next <br/> cinematic obsession.
          </h2>
          <p className="text-lg text-stone-300 font-light max-w-xl mx-auto mt-4 drop-shadow">
            Describe a film that moved you, and our algorithm will perfectly align your emotional resonance with the global archive.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8 relative">
            <div className="bg-[#0f0f0f]/85 backdrop-blur-xl p-8 md:p-10 rounded-2xl border border-white/10 shadow-2xl">
              <div className="space-y-4">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">
                  01. Reference Film
                </label>
                <MovieAutocomplete value={movie} onChange={setMovie} onSelect={setMovie} />
              </div>
              
              <div className="h-px w-full bg-white/10 my-8"></div>

              <div className="space-y-4">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">
                  02. Emotional Critique
                </label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="How did the cinematography, pacing, and story make you feel?"
                  rows={4}
                  className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-stone-500 text-lg md:text-xl font-light focus:outline-none resize-none p-0"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading || !movie || !review}
              className="w-full py-5 bg-red-600 text-white uppercase tracking-widest text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-3 rounded-xl shadow-xl shadow-red-900/40 border border-red-500/50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Curating matches...</span>
                </>
              ) : (
                <>
                  <span>Reveal Matches</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

const AnalysisResult = ({ data, onWatchTrailer, onMoreInfo }) => {
  return (
    <div id="results" className="py-24 px-4 bg-[#050505] border-t border-[#222222]">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-20 p-10 md:p-16 rounded-3xl bg-[#0f0f0f] border border-[#222222] flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="text-stone-500 mb-6 uppercase tracking-widest text-xs font-semibold">
            Analysis Complete
          </div>
          
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-10 tracking-tight">
            {data.reviewed_movie_title}
          </h3>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-3 px-6 py-3 bg-[#0a0a0a] border border-blue-900/50 shadow-inner shadow-blue-900/20 rounded-full">
              <SentimentIcon sentiment={data.sentiment} className="w-5 h-5" />
              <span className="font-semibold text-blue-200 uppercase text-xs tracking-widest">
                {data.sentiment}
              </span>
            </div>
            <div className="px-6 py-3 bg-red-950/40 border border-red-900/50 text-red-200 font-bold uppercase tracking-widest text-xs rounded-full shadow-inner shadow-red-900/20">
              {Number(data.confidence * 100).toFixed(0)}% Match Confidence
            </div>
          </div>
        </div>

        <div>
          <MovieCarousel 
            title="Curated Matches" 
            movies={data.recommendations} 
            isResult 
            onSelectMovie={onMoreInfo}
            onWatchTrailer={(title) => {
              const m = data.recommendations.find(x => x.title === title);
              if(m) onWatchTrailer(m.id, title);
            }}
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="p-10 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] hover:border-red-900/30 transition-colors shadow-2xl">
    <div className="w-12 h-12 bg-red-950/30 border border-red-900/50 rounded-xl flex items-center justify-center mb-8 text-red-500 shadow-inner shadow-red-900/20">
      <Icon className="h-5 w-5" />
    </div>
    <h3 className="text-xl font-bold text-white mb-4 tracking-tight">{title}</h3>
    <p className="text-stone-400 font-light leading-relaxed">{desc}</p>
  </div>
);

const AboutSection = () => (
  <section id="about" className="py-32 bg-[#050505] border-t border-[#222222]">
    <div className="container mx-auto px-6 max-w-6xl">
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">The Architecture</h2>
        <p className="text-stone-400 font-light max-w-xl">A sophisticated pipeline translating human emotion into precise cinematic coordinates.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard 
          icon={Brain} 
          title="NLP Processing" 
          desc="Your critique is processed through a finely tuned Linear SVC model, classifying sentiment into precise emotional quadrants."
        />
        <FeatureCard 
          icon={TrendingUp} 
          title="Vector Mapping" 
          desc="The emotional vector is cross-referenced in real-time against an extensive, dynamically updated global film repository."
        />
        <FeatureCard 
          icon={Zap} 
          title="Instant Curation" 
          desc="A hyper-personalized, ranked collection is synthesized and delivered directly to you with zero latency."
        />
      </div>
    </div>
  </section>
);

// --- APP & ROUTING ---
const Footer = () => (
  <footer className="py-12 bg-[#050505] border-t border-[#222222]">
    <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-2">
        <span className="font-bold text-lg text-white tracking-tighter">CineSense</span>
      </div>
      <p className="text-[10px] font-semibold text-stone-600 uppercase tracking-widest">
        © 2024 CineSense
      </p>
    </div>
  </footer>
);

const MainApp = () => {
  const [movies, setMovies] = useState({ trending: [], tvShows: [], animated: [], popular: [] });
  const [trailerData, setTrailerData] = useState({ isOpen: false, id: null, title: null });
  const [infoData, setInfoData] = useState({ isOpen: false, movie: null });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiResult, setApiResult] = useState(null);
  const [error, setError] = useState(null);
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [trending, tvShows, animated, popular] = await Promise.all([
          fetchSecureMovies('/tmdb/trending'),
          fetchSecureMovies('/tmdb/tv/trending'),
          fetchSecureMovies('/tmdb/discover', { type: 'animated' }),
          fetchSecureMovies('/tmdb/discover', { type: 'popular' }),
        ]);
        setMovies({ trending, tvShows, animated, popular });
      } catch (e) { 
        console.error("Error loading movies:", e); 
      } finally {
        setIsAppLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAnalyze = async (movie, review) => {
    setIsAnalyzing(true);
    setError(null);
    setApiResult(null);
    try {
      const res = await getAnalysisAndRecommendations(movie, review);
      setApiResult(res);
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onWatchTrailer = (id, title) => setTrailerData({ isOpen: true, id, title });
  const onMoreInfo = (movie) => setInfoData({ isOpen: true, movie });

  if (isAppLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white space-y-6">
        <Loader2 className="w-12 h-12 animate-spin text-red-600" />
        <div className="text-xl font-medium tracking-widest uppercase">Connecting to Backend...</div>
        <div className="text-sm text-stone-500 font-light max-w-md text-center">Waking up the analysis engine. This may take a few seconds on first load.</div>
      </div>
    );
  }

  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans selection:bg-white selection:text-black">
      <Navbar />
      
      {/* 1. Movie Slideshow */}
      <HeroSlideshow 
        movies={movies.trending} 
        onWatchTrailer={onWatchTrailer} 
        onMoreInfo={onMoreInfo}
      />

      {/* 2. Recommender Box */}
      <HeroAnalyzer onAnalyze={handleAnalyze} isLoading={isAnalyzing} />
      
      {error && (
        <div className="container mx-auto px-6 py-8">
          <div className="p-4 border border-[#333333] bg-[#0f0f0f] text-stone-300 font-medium text-sm text-center uppercase tracking-widest rounded-xl">
            {error}
          </div>
        </div>
      )}
      
      {apiResult && <AnalysisResult data={apiResult} onWatchTrailer={onWatchTrailer} onMoreInfo={onMoreInfo} />}

      {/* 3. Movie Listings */}
      <section id="discover" className="relative z-20 container mx-auto px-4 md:px-8 space-y-16 py-20 border-t border-[#222222]">
        <MovieCarousel 
          title="Trending Now" 
          movies={movies.trending} 
          onSelectMovie={onMoreInfo}
          onWatchTrailer={(title) => {
            const m = movies.trending.find(x => x.title === title);
            if(m) onWatchTrailer(m.id, title);
          }}
        />
        <MovieCarousel 
          title="Critically Acclaimed" 
          movies={movies.popular} 
          onSelectMovie={onMoreInfo}
          onWatchTrailer={(title) => {
             const m = movies.popular.find(x => x.title === title);
             if(m) onWatchTrailer(m.id, title);
          }}
        />
        <MovieCarousel 
          title="Top TV Shows" 
          movies={movies.tvShows} 
          onSelectMovie={onMoreInfo}
          onWatchTrailer={(title) => {
             const m = movies.tvShows.find(x => x.title === title);
             if(m) onWatchTrailer(m.id, title);
          }}
        />
        <MovieCarousel 
          title="Animated Masterpieces" 
          movies={movies.animated} 
          onSelectMovie={onMoreInfo}
          onWatchTrailer={(title) => {
             const m = movies.animated.find(x => x.title === title);
             if(m) onWatchTrailer(m.id, title);
          }}
        />
      </section>

      {/* 4. How it works */}
      <AboutSection />

      <Footer />

      <TrailerModal 
        isOpen={trailerData.isOpen}
        movieId={trailerData.id}
        movieTitle={trailerData.title}
        onClose={() => setTrailerData({ isOpen: false, id: null, title: null })}
      />
      <MovieDetailsModal
        isOpen={infoData.isOpen}
        movie={infoData.movie}
        onClose={() => setInfoData({ isOpen: false, movie: null })}
      />
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <MainApp />
  </ThemeProvider>
);

export default App;