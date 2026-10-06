import React, { useEffect, useState } from 'react';
import { X, Film, Loader2 } from 'lucide-react';
import { fetchSecureMovies } from '../api';

const TrailerModal = ({ isOpen, movieId, movieTitle, onClose }) => {
  const [videoKey, setVideoKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrailer = async () => {
      if (isOpen && movieId) {
        setLoading(true);
        setError(null);
        setVideoKey(null);
        try {
          const videos = await fetchSecureMovies(`/tmdb/movie/${movieId}/videos`);
          const officialTrailer = videos.find(
            (v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official
          ) || videos.find(
            (v) => v.site === 'YouTube' && v.type === 'Trailer'
          ) || videos.find(
            (v) => v.site === 'YouTube'
          );

          if (officialTrailer) {
            setVideoKey(officialTrailer.key);
          } else {
            setError("No official trailer available.");
          }
        } catch (err) {
          setError("Failed to load trailer.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTrailer();
  }, [isOpen, movieId]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-5xl bg-[#0a0a0a] border border-[#222222] rounded-xl overflow-hidden shadow-2xl z-10 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222222]">
          <div className="flex items-center gap-3">
            <Film className="w-5 h-5 text-stone-400" />
            <h3 className="font-semibold text-lg text-white tracking-tight truncate max-w-md">
              {movieTitle || 'Trailer'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-white hover:bg-[#111111] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-3 text-stone-500">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm tracking-widest uppercase font-semibold">Loading Feed...</p>
            </div>
          ) : error ? (
            <div className="text-stone-500 flex flex-col items-center gap-2">
              <Film className="w-12 h-12 mb-2 opacity-50" />
              <p className="font-medium tracking-wide">{error}</p>
            </div>
          ) : videoKey ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1`}
              title={`${movieTitle} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-none"
            ></iframe>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
