
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ExternalLink, Users, TrendingUp, Eye, Gamepad2, Crown, Star, Trophy, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatedCounter } from './animated-counter';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RobloxGameData, formatNumber } from '@/lib/roblox-api';

export function GamesSection() {
  const [games, setGames] = useState<RobloxGameData[]>([]);
  const [featuredGames, setFeaturedGames] = useState<RobloxGameData[]>([]);
  const [topSuccessGames, setTopSuccessGames] = useState<RobloxGameData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Games per slide for "All Our Games" section
  const GAMES_PER_SLIDE = 4;

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/api/games');
        const data = await response.json();
        
        if (data.success && data.games) {
          const allGames = data.games;
          setGames(allGames);
          
          // Sort by CCU for featured games (top 3)
          const sortedByCCU = [...allGames].sort((a, b) => (b.ccu || 0) - (a.ccu || 0));
          setFeaturedGames(sortedByCCU.slice(0, 3));
          
          // Sort by visits for top success (top 3)
          const sortedByVisits = [...allGames].sort((a, b) => (b.visits || 0) - (a.visits || 0));
          setTopSuccessGames(sortedByVisits.slice(0, 3));
        } else {
          setError(data.message || 'Failed to fetch games');
        }
      } catch (error) {
        console.error('Error fetching games:', error);
        setError('Failed to load games');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Navigation functions for "All Our Games" carousel
  const totalSlides = Math.ceil(games.length / GAMES_PER_SLIDE);
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };
  
  // Get games for current slide
  const getCurrentSlideGames = () => {
    const startIndex = currentSlide * GAMES_PER_SLIDE;
    return games.slice(startIndex, startIndex + GAMES_PER_SLIDE);
  };

  const GameCard = ({ game, index, rank, type }: { 
    game: RobloxGameData; 
    index: number; 
    rank?: number;
    type?: 'featured' | 'success' | 'regular';
  }) => (
    <motion.div
      key={game.id}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
    >
      {/* Rank Badge for top games */}
      {rank && rank <= 3 && (
        <div className="absolute -top-3 -left-3 z-20 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
          {rank}
        </div>
      )}
      
      <div className={`bg-slate-800/40 backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
        type === 'featured' ? 'border-2 border-purple-500/40 hover:border-purple-500/60' :
        type === 'success' ? 'border-2 border-yellow-500/40 hover:border-yellow-500/60' :
        'border border-purple-500/20 hover:border-purple-500/40'
      } ${
        type === 'featured' ? 'hover:shadow-purple-500/20' :
        type === 'success' ? 'hover:shadow-yellow-500/20' :
        'hover:shadow-purple-500/10'
      }`}>
        {/* Game Image */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={game.thumbnailPath || '/groweggs.webp'}
            alt={game.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
          
          {/* Type Badge */}
          {type === 'featured' && (
            <div className="absolute top-4 left-4 bg-purple-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
              <Crown className="h-3 w-3 mr-1" />
              Featured
            </div>
          )}
          {type === 'success' && (
            <div className="absolute top-4 left-4 bg-yellow-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
              <Trophy className="h-3 w-3 mr-1" />
              Top Success
            </div>
          )}
          
          {/* Stats Badge */}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
            {type === 'featured' ? (
              <>
                <Activity className="h-3 w-3 mr-1" />
                {formatNumber(game.ccu || 0)} CCU
              </>
            ) : (
              <>
                <Eye className="h-3 w-3 mr-1" />
                {formatNumber(game.visits || 0)}
              </>
            )}
          </div>
          
          {/* Rating Badge */}
          <div className="absolute bottom-4 left-4 bg-green-600/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
            <Star className="h-3 w-3 mr-1" />
            {game.rating?.toFixed(1) || '85.0'}%
          </div>
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <a
              href={`https://www.roblox.com/games/${game.rootPlaceId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/90 hover:bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold flex items-center transition-all duration-300 hover:scale-105"
            >
              Play Now <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Game Info - Simplified without descriptions */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
            {game.name}
          </h3>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-700/40 rounded-lg p-3 text-center">
              <Eye className="h-4 w-4 text-purple-400 mx-auto mb-1" />
              <div className="text-white font-bold text-lg">
                {formatNumber(game.visits || 0)}
              </div>
              <div className="text-xs text-gray-400">Total Visits</div>
            </div>
            <div className="bg-slate-700/40 rounded-lg p-3 text-center">
              <Users className="h-4 w-4 text-green-400 mx-auto mb-1" />
              <div className="text-white font-bold text-lg">
                {formatNumber(game.ccu || 0)}
              </div>
              <div className="text-xs text-gray-400">Playing Now</div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full mr-2 bg-green-400" />
              <span className="text-sm font-medium text-green-400">Active</span>
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <Star className="h-3 w-3 mr-1" />
              {game.rating?.toFixed(1) || '85.0'}%
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <section id="games" className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Our Games
              </span>
            </h2>
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
              <span className="ml-3 text-gray-300">Loading real game data...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="games" className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Our Games
              </span>
            </h2>
            <div className="text-red-400">
              <p className="mb-4">Failed to load game data: {error}</p>
              <p className="text-gray-400">Please try again later.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="games" className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Our Game Portfolio
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover our collection of successful Roblox experiences, from trending simulators to engaging adventures.
          </p>
        </motion.div>

        {/* Featured Games Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <div className="flex items-center justify-center mb-8">
            <Crown className="h-8 w-8 text-purple-400 mr-3" />
            <h3 className="text-3xl font-bold text-white">Featured Games</h3>
            <span className="ml-3 bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm">
              Top by CCU
            </span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredGames.map((game, index) => (
              <GameCard 
                key={`featured-${game.id}`} 
                game={game} 
                index={index} 
                rank={index + 1}
                type="featured"
              />
            ))}
          </div>
        </motion.div>

        {/* Top Success Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20"
        >
          <div className="flex items-center justify-center mb-8">
            <Trophy className="h-8 w-8 text-yellow-400 mr-3" />
            <h3 className="text-3xl font-bold text-white">Top Success</h3>
            <span className="ml-3 bg-yellow-600/20 text-yellow-300 px-3 py-1 rounded-full text-sm">
              Most Visited
            </span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topSuccessGames.map((game, index) => (
              <GameCard 
                key={`success-${game.id}`} 
                game={game} 
                index={index} 
                rank={index + 1}
                type="success"
              />
            ))}
          </div>
        </motion.div>

        {/* All Games Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center justify-center flex-1">
              <Gamepad2 className="h-8 w-8 text-blue-400 mr-3" />
              <h3 className="text-3xl font-bold text-white">All Our Games</h3>
              <span className="ml-3 bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                {games.length} Games
              </span>
            </div>
            
            {/* Navigation arrows - only show if there are multiple slides */}
            {totalSlides > 1 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={prevSlide}
                  className="bg-slate-800/50 hover:bg-slate-700/50 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
                  disabled={totalSlides <= 1}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-gray-400 text-sm px-2">
                  {currentSlide + 1} / {totalSlides}
                </span>
                <button
                  onClick={nextSlide}
                  className="bg-slate-800/50 hover:bg-slate-700/50 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
                  disabled={totalSlides <= 1}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getCurrentSlideGames().map((game, index) => (
              <GameCard 
                key={`all-${game.id}-${currentSlide}`} 
                game={game} 
                index={index} 
                type="regular"
              />
            ))}
          </div>
        </motion.div>

        {/* Games CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <p className="text-gray-300 text-lg mb-8">
            Ready to explore all our games and detailed performance metrics?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/games"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105 inline-flex items-center justify-center"
            >
              <Gamepad2 className="mr-2 h-5 w-5" />
              View All {games.length} Games
            </Link>
            <button
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Explore Our Services
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
