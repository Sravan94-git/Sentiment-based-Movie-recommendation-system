import React, { useEffect, useState } from 'react';
import { X, Clock, Calendar, DollarSign, Globe, Users, Film, Tv, Play, Building2, Loader2, Star } from 'lucide-react';
import { fetchSecureMovies } from '../api';

export const MovieDetailsModal = ({ isOpen, onClose, movie }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen && movie) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      
      const getDetails = async () => {
        setLoading(true);
        try {
          const mediaType = movie.media_type || "movie";
          const data = await fetchSecureMovies(`/tmdb/title/${mediaType}/${movie.id}/details`);
          setDetails(data);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      getDetails();
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
      setDetails(null);
    };
  }, [isOpen, movie, onClose]);

  if (!isOpen || !movie) return null;

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : (movie.poster_path ? `https://image.tmdb.org/t/p/w1280${movie.poster_path}` : '');

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const isTV = movie.media_type === "tv";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]">
        
        {/* Header / Hero */}
        <div className="relative w-full h-64 md:h-80 shrink-0 bg-black">
          {backdropUrl && (
            <img src={backdropUrl} alt={movie.title} className="w-full h-full object-cover opacity-60" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 bg-black/50 hover:bg-black/80 border border-white/10 backdrop-blur-md rounded-full text-white transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-6 md:px-12 pb-12 -mt-24 relative z-20 overflow-y-auto scrollbar-hide flex-1">
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* Left Col: Poster */}
            <div className="hidden md:block w-48 shrink-0">
              {movie.poster_path ? (
                <img 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                  alt={movie.title} 
                  className="w-full rounded-xl shadow-2xl border border-white/10"
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-[#111] rounded-xl flex items-center justify-center border border-white/10">
                  <Film className="w-12 h-12 text-stone-700" />
                </div>
              )}
            </div>

            {/* Right Col: Details */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-red-600 text-white text-[10px] uppercase font-bold tracking-widest rounded-full">
                  {isTV ? 'TV Series' : 'Movie'}
                </span>
                {details?.status && (
                  <span className="px-3 py-1 bg-[#1a1a1a] text-stone-300 text-[10px] uppercase font-bold tracking-widest rounded-full border border-white/10">
                    {details.status}
                  </span>
                )}
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                {movie.title}
              </h2>
              
              {details?.tagline && (
                <p className="text-xl text-stone-400 font-light italic mb-4">
                  "{details.tagline}"
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-stone-400 mb-6 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {movie.release_date?.substring(0, 4) || 'N/A'}</span>
                
                {details?.runtime > 0 && (
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {details.runtime} min</span>
                )}
                {details?.number_of_seasons > 0 && (
                  <span className="flex items-center gap-1.5"><Tv className="w-4 h-4" /> {details.number_of_seasons} Season{details.number_of_seasons > 1 ? 's' : ''}</span>
                )}
                
                {movie.vote_average > 0 && (
                  <span className="flex items-center gap-1.5 text-yellow-500"><Star className="w-4 h-4 fill-current" /> {movie.vote_average.toFixed(1)}</span>
                )}
              </div>

              {details?.genres && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {details.genres.map(g => (
                    <span key={g.id} className="px-3 py-1 bg-[#111] text-stone-300 text-xs rounded-lg border border-white/5">
                      {g.name}
                    </span>
                  ))}
                </div>
              )}
              
              <p className="text-stone-300 text-base md:text-lg leading-relaxed font-light mb-8 max-w-3xl">
                {movie.overview || "No description available."}
              </p>

              {loading ? (
                <div className="flex items-center gap-3 text-stone-500 py-4">
                  <Loader2 className="w-5 h-5 animate-spin" /> Fetching detailed database records...
                </div>
              ) : details ? (
                <div className="pt-6 border-t border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    
                    {/* Left extended column */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-red-500" /> Top Cast</h4>
                        {details.credits?.cast?.length > 0 ? (
                          <div className="space-y-3">
                            {details.credits.cast.slice(0, 5).map(person => (
                              <div key={person.id} className="flex items-center gap-3">
                                {person.profile_path ? (
                                  <img src={`https://image.tmdb.org/t/p/w200${person.profile_path}`} alt={person.name} className="w-10 h-10 rounded-full object-cover" />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center text-xs text-stone-500">N/A</div>
                                )}
                                <div className="text-sm">
                                  <div className="text-stone-200 font-medium">{person.name}</div>
                                  <div className="text-stone-500 text-xs">{person.character}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : <div className="text-stone-500 text-sm">Cast information unavailable.</div>}
                      </div>
                    </div>

                    {/* Right extended column */}
                    <div className="space-y-6">
                      {!isTV && (details.budget > 0 || details.revenue > 0) && (
                        <div>
                          <h4 className="text-white font-semibold mb-3 flex items-center gap-2"><DollarSign className="w-4 h-4 text-green-500" /> Financials</h4>
                          <div className="bg-[#111] p-4 rounded-xl space-y-2 text-sm border border-white/5">
                            {details.budget > 0 && <div className="flex justify-between"><span className="text-stone-500">Budget</span> <span className="text-stone-300">{formatCurrency(details.budget)}</span></div>}
                            {details.revenue > 0 && <div className="flex justify-between"><span className="text-stone-500">Revenue</span> <span className="text-stone-300">{formatCurrency(details.revenue)}</span></div>}
                          </div>
                        </div>
                      )}

                      {details.production_companies?.length > 0 && (
                        <div>
                          <h4 className="text-white font-semibold mb-3 flex items-center gap-2"><Building2 className="w-4 h-4 text-blue-500" /> Production</h4>
                          <div className="flex flex-wrap gap-2">
                            {details.production_companies.map(c => (
                              <span key={c.id} className="text-xs text-stone-400 bg-[#111] px-2 py-1 rounded border border-white/5">{c.name}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Full width section for Where to Watch */}
                  {details['watch/providers']?.results?.US && (
                    <div className="pt-6 border-t border-white/10">
                      <h4 className="text-white font-semibold mb-4 flex items-center gap-2"><Play className="w-4 h-4 text-purple-500" /> Where to Watch (US)</h4>
                      <div className="flex flex-wrap gap-4">
                        {['flatrate', 'rent', 'buy'].map(type => {
                          const providers = details['watch/providers'].results.US[type];
                          if (!providers) return null;
                          return (
                            <div key={type} className="flex flex-col gap-2">
                              <span className="text-[10px] uppercase tracking-widest text-stone-500">{type === 'flatrate' ? 'Stream' : type}</span>
                              <div className="flex gap-2">
                                {providers.slice(0, 4).map(p => (
                                  <img 
                                    key={`${type}-${p.provider_id}`} 
                                    src={`https://image.tmdb.org/t/p/w200${p.logo_path}`} 
                                    alt={p.provider_name} 
                                    title={`${p.provider_name} (${type})`}
                                    className="w-10 h-10 rounded-xl shadow-lg border border-white/10 hover:scale-110 transition-transform" 
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsModal;
