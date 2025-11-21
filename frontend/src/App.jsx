import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { 
  Loader2, ArrowRight, Brain, TrendingUp, Moon, Sun, Ticket, Zap, Activity
} from "lucide-react";

import { getAnalysisAndRecommendations, fetchSecureMovies } from "./api";
import { MovieAutocomplete, MovieCarousel, SentimentIcon } from "./components/UIComponents";
import { ThemeProvider, useTheme } from "./components/ThemeContext";

// --- Components ---

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button 
      onClick={toggleTheme}
      className="p-2 text-stone-500 hover:text-indigo-600 dark:text-stone-400 dark:hover:text-indigo-400 transition-colors"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

const Navbar = () => {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if(el) {
      window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-indigo-50 dark:border-stone-800 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => scrollToSection('hero')}>
          <div className="bg-indigo-950 dark:bg-white p-1.5 rounded">
            <Ticket className="h-5 w-5 text-white dark:text-indigo-950" />
          </div>
          <span className="text-xl font-bold text-stone-900 dark:text-white font-serif tracking-tight group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
            CineSense.
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600 dark:text-stone-400">
            <button onClick={() => scrollToSection('popular')} className="hover:text-indigo-700 dark:hover:text-white transition-colors font-sans uppercase tracking-widest text-xs">Trending</button>
            <button onClick={() => scrollToSection('about')} className="hover:text-indigo-700 dark:hover:text-white transition-colors font-sans uppercase tracking-widest text-xs">About</button>
          </div>
          
          <div className="w-px h-4 bg-stone-300 dark:bg-stone-700 hidden md:block"></div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

const Hero = ({ onAnalyze, isLoading }) => {
  const [movie, setMovie] = useState("");
  const [review, setReview] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!movie.trim() || !review.trim()) return;
    onAnalyze(movie, review);
  };

  return (
    <section id="hero" className="relative pt-32 pb-20 min-h-[90vh] flex items-center justify-center transition-colors duration-300 bg-gradient-to-b from-indigo-50 to-white dark:from-slate-950 dark:to-stone-950 overflow-hidden">
      
      {/* Ambient Glow - Royal Indigo */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 dark:bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Centered Text Section */}
        <div className="text-center mb-10 space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-stone-900 border border-indigo-100 dark:border-slate-800 shadow-sm mb-2">
            <Activity className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-widest font-sans">
              AI Powered Curation
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold text-stone-900 dark:text-white leading-[0.9] font-serif">
            The Cinema <br/> 
            <span className="italic font-light text-indigo-900/80 dark:text-indigo-200/80">Matchmaker</span>
          </h1>
          
          <p className="text-xl text-stone-600 dark:text-stone-400 max-w-xl mx-auto font-serif italic pt-4">
            "Tell us how a film made you feel, and we shall find your next masterpiece."
          </p>
        </div>

        {/* Analysis Form - Centered Below */}
        <div id="analyze" className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6 relative">
            <div className="space-y-6 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-indigo-100 dark:border-slate-700 shadow-xl shadow-indigo-900/5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 font-sans flex items-center gap-2">
                  <Ticket className="h-4 w-4 text-indigo-500" /> 01. The Film
                </label>
                <MovieAutocomplete value={movie} onChange={setMovie} onSelect={setMovie} />
              </div>
              
              <div className="h-px w-full bg-indigo-50 dark:bg-slate-700"></div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 font-sans flex items-center gap-2">
                  <Brain className="h-4 w-4 text-indigo-500" /> 02. The Critique
                </label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Describe the acting, the atmosphere, the story..."
                  rows={3}
                  className="w-full px-0 py-4 bg-transparent border-none focus:ring-0 text-stone-900 dark:text-white placeholder-stone-400 text-lg font-serif focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Strong Action Button - Royal Indigo */}
            <button 
              type="submit"
              disabled={isLoading || !movie || !review}
              className="w-full py-5 bg-indigo-900 dark:bg-indigo-600 text-white font-sans uppercase tracking-widest text-sm font-bold hover:bg-indigo-800 dark:hover:bg-indigo-500 transition-all disabled:opacity-50 flex items-center justify-center gap-4 rounded-xl shadow-lg shadow-indigo-900/20 hover:-translate-y-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Reveal Recommendations</span>
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

const AnalysisResult = ({ data }) => {
  return (
    <div className="py-20 px-4 bg-stone-100 dark:bg-stone-900 border-y border-stone-200 dark:border-stone-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 font-sans">The Verdict</span>
          <h3 className="text-4xl md:text-5xl font-serif text-stone-900 dark:text-white mt-4 mb-2">
            {data.reviewed_movie_title}
          </h3>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-sm rounded-full">
              <SentimentIcon sentiment={data.sentiment} />
              <span className="font-sans font-bold text-stone-900 dark:text-white uppercase text-xs tracking-wide">
                {data.sentiment}
              </span>
            </div>
            {/* Confidence Badge - Gold for Prestige */}
            <div className="px-4 py-2 bg-amber-500 text-white font-sans text-xs font-bold uppercase tracking-wide shadow-md rounded-full">
              Confidence: {(data.confidence * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Gap Reduced Here */}
        <div className="pt-2 mt-8 border-t border-stone-200 dark:border-slate-800">
          <MovieCarousel title="Curated Selections" movies={data.recommendations} isResult />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="group relative p-8 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 shadow-sm hover:shadow-xl transition-all duration-500">
    <div className="w-14 h-14 rounded-2xl bg-stone-100 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:bg-indigo-900 dark:group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 text-stone-900 dark:text-white">
      <Icon className="h-7 w-7" />
    </div>
    
    <h3 className="text-2xl font-serif text-stone-900 dark:text-white mb-4">
      {title}
    </h3>
    <p className="text-stone-600 dark:text-stone-400 font-serif leading-relaxed italic">
      {desc}
    </p>
  </div>
);

const AboutSection = () => (
  <section id="about" className="py-24 bg-white dark:bg-stone-950 relative">
    <div className="container mx-auto px-4 md:px-6 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-serif font-bold text-stone-900 dark:text-white mb-4">How It Works</h2>
        {/* Gold Divider */}
        <div className="w-12 h-1 bg-amber-500 mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <FeatureCard 
          icon={Brain} 
          title="The Analysis" 
          desc="A Linear SVC model dissects your review into 5 distinct emotional classes using advanced NLP."
        />
        <FeatureCard 
          icon={TrendingUp} 
          title="The Matching" 
          desc="We cross-reference your unique sentiment profile with the global TMDB archive to find fits."
        />
        <FeatureCard 
          icon={Zap} 
          title="The Result" 
          desc="A bespoke list of cinema tailored specifically to your current mood, delivered instantly."
        />
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-12 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800">
    <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-2">
         <div className="bg-indigo-950 dark:bg-white p-1 rounded-md">
            <Ticket className="h-4 w-4 text-white dark:text-indigo-950" />
          </div>
        <span className="font-serif text-xl font-bold text-stone-900 dark:text-white">CineSense.</span>
      </div>
      <p className="text-xs font-sans text-stone-500 uppercase tracking-widest">
        © 2024 CineSense / AI Movie Discovery
      </p>
    </div>
  </footer>
);

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiResult, setApiResult] = useState(null);
  const [error, setError] = useState(null);
  const [movies, setMovies] = useState({ trending: [], animated: [], popular: [] });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [trending, animated, popular] = await Promise.all([
          fetchSecureMovies('/tmdb/trending'),
          fetchSecureMovies('/tmdb/discover', { type: 'animated' }),
          fetchSecureMovies('/tmdb/discover', { type: 'popular' }),
        ]);
        setMovies({ trending, animated, popular });
      } catch (e) { 
        console.error("Error loading movies:", e); 
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

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
      <Navbar />
      <main>
        <Hero onAnalyze={handleAnalyze} isLoading={isAnalyzing} />
        
        <div id="results">
          {error && (
            <div className="container mx-auto px-4 py-8">
              <div className="p-4 border border-red-200 bg-red-50 text-red-800 font-sans text-sm text-center uppercase tracking-wide rounded-xl">
                Error: {error}
              </div>
            </div>
          )}
          {apiResult && <AnalysisResult data={apiResult} />}
        </div>

        <section id="popular" className="py-20 container mx-auto px-4">
          <MovieCarousel title="Trending Worldwide" movies={movies.trending} />
          <MovieCarousel title="Critics Choice" movies={movies.popular} />
          <MovieCarousel title="Animated Features" movies={movies.animated} />
        </section>

        <AboutSection />
      </main>
      <Footer />
    </div>
  );
};

// Wrap in ThemeProvider
const App = () => (
  <ThemeProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;