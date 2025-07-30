
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Users, Eye, Star } from 'lucide-react';
import Image from 'next/image';
import { RobloxGameData } from '@/lib/roblox-api';
import { formatNumber } from '@/lib/roblox-api';

interface HeroCarouselProps {
  games: RobloxGameData[];
}

export default function HeroCarousel({ games }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotation
  useEffect(() => {
    if (!isAutoPlaying || games?.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % games.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, games?.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % games.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + games.length) % games.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  if (!games || games.length === 0) {
    return (
      <div className="relative h-[600px] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading games...</div>
      </div>
    );
  }

  const currentGame = games[currentIndex];

  return (
    <div className="relative h-[600px] overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Background with current game thumbnail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          {currentGame?.thumbnailPath && (
            <div className="relative w-full h-full">
              <Image
                src={currentGame.thumbnailPath}
                alt={currentGame.name}
                fill
                className="object-cover blur-sm scale-110"
                priority
              />
              <div className="absolute inset-0 bg-black/60" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-transparent to-blue-900/80" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Game info */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${currentIndex}`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
                className="text-white space-y-6"
              >
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-purple-300 text-sm font-medium uppercase tracking-wide mb-2"
                  >
                    Featured Game {currentIndex + 1} of {games.length}
                  </motion.div>
                  
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-8"
                  >
                    {currentGame?.name}
                  </motion.h1>
                </div>

                {/* Game stats - Simplified to show only key metrics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-2 gap-6 max-w-md"
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                    <Eye className="h-6 w-6 text-purple-300 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-white">{formatNumber(currentGame?.visits || 0)}</div>
                    <div className="text-sm text-gray-300 font-medium">Total Visits</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                    <Users className="h-6 w-6 text-green-300 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-white">{formatNumber(currentGame?.ccu || 0)}</div>
                    <div className="text-sm text-gray-300 font-medium">Playing Now</div>
                  </div>
                </motion.div>

                {/* Prominent Play Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-2"
                >
                  <a
                    href={`https://www.roblox.com/games/${currentGame?.rootPlaceId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl shadow-lg group"
                  >
                    <div className="bg-white/20 rounded-full p-2 mr-3 group-hover:bg-white/30 transition-colors">
                      <Play className="h-6 w-6 fill-current" />
                    </div>
                    Play Now on Roblox
                  </a>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Right side - Game thumbnail with play button overlay */}
            <div className="relative hidden lg:block">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`thumbnail-${currentIndex}`}
                  initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                  transition={{ duration: 0.6 }}
                  className="relative w-full h-80 rounded-2xl overflow-hidden shadow-2xl group cursor-pointer"
                >
                  {currentGame?.thumbnailPath && (
                    <Image
                      src={currentGame.thumbnailPath}
                      alt={currentGame.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <a
                      href={`https://www.roblox.com/games/${currentGame?.rootPlaceId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-125 group-hover:shadow-green-500/50"
                    >
                      <Play className="h-8 w-8 fill-current" />
                    </a>
                  </div>
                  
                  {/* Game Stats Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      {formatNumber(currentGame?.visits || 0)}
                    </div>
                    <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {formatNumber(currentGame?.ccu || 0)} CCU
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {games.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white scale-125'
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
            isAutoPlaying
              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
              : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
          }`}
        >
          {isAutoPlaying ? 'Auto-play ON' : 'Auto-play OFF'}
        </button>
      </div>
    </div>
  );
}
