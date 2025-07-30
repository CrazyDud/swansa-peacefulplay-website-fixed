
'use client';

import { motion } from 'framer-motion';
import useInView from 'react-intersection-observer';
import Image from 'next/image';
import { ExternalLink, Users, TrendingUp, Eye, Gamepad2, ArrowLeft, Calendar, Crown } from 'lucide-react';
import { AnimatedCounter } from '@/components/animated-counter';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RobloxGameData, formatNumber } from '@/lib/roblox-api';

interface GameData extends RobloxGameData {
  gameUrl: string;
  isActive: boolean;
  placeId: string;
}

export default function GamesPage() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [games, setGames] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/api/games');
        const data = await response.json();
        
        if (data.success) {
          setGames(data.games || []); // Show all games
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

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj?.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    }) || 'Unknown';
  };

  const totalVisits = games?.reduce((sum, game) => sum + (game.visits || 0), 0) || 0;
  const totalPlayers = games?.reduce((sum, game) => sum + (game.ccu || 0), 0) || 0;
  const activeGames = games?.filter(game => game.isActive).length || 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2 group">
              <ArrowLeft className="h-5 w-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
              <span className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                Back to Home
              </span>
            </Link>
            <Link href="/" className="flex items-center space-x-2 group">
              <Gamepad2 className="h-8 w-8 text-purple-400 group-hover:text-purple-300 transition-colors" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Swansa x PeacefulPlay
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-10 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Our Game Portfolio
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Discover all our successful Roblox experiences with real-time statistics and performance data.
            </p>

            {/* Statistics Cards */}
            {!loading && !error && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
              >
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
                  <Gamepad2 className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-white mb-1">
                    <AnimatedCounter end={games.length} />
                  </div>
                  <div className="text-sm text-gray-400">Total Games</div>
                </div>
                
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-green-500/20">
                  <Eye className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-white mb-1">
                    <AnimatedCounter end={totalVisits} />+
                  </div>
                  <div className="text-sm text-gray-400">Total Visits</div>
                </div>
                
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20">
                  <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-white mb-1">
                    <AnimatedCounter end={totalPlayers} />
                  </div>
                  <div className="text-sm text-gray-400">Players Online</div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && (
            <div className="text-center py-20">
              <div className="flex items-center justify-center mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
              </div>
              <p className="text-gray-300">Loading all game data...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <div className="text-red-400">
                <p className="mb-4">Failed to load game data: {error}</p>
                <p className="text-gray-400">Please try again later.</p>
              </div>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {games?.map((game, index) => (
                <motion.div
                  key={game.id}
                  ref={index === 0 ? ref : undefined}
                  initial={{ opacity: 0, y: 50 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="group"
                >
                  <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:scale-105">
                    {/* Game Image */}
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={game.thumbnailPath || '/groweggs.webp'}
                        alt={game.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                      
                      {/* Top Badge - Most Active */}
                      {index === 0 && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                          <Crown className="h-3 w-3 mr-1" />
                          #1 Most Active
                        </div>
                      )}
                      
                      {/* Genre Badge */}
                      {index !== 0 && (
                        <div className="absolute top-4 left-4 bg-purple-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {game.genre}
                        </div>
                      )}
                      
                      {/* Visit Count Badge */}
                      <div className="absolute top-4 right-4 bg-green-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {formatNumber(game.visits || 0)}
                      </div>
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <a
                          href={`https://www.roblox.com/games/${game.rootPlaceId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white/90 hover:bg-white text-slate-900 px-4 py-2 rounded-lg font-semibold flex items-center transition-all duration-300 hover:scale-105"
                        >
                          Play <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </div>
                    </div>

                    {/* Game Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors line-clamp-1">
                        {game.name}
                      </h3>
                      <p className="text-gray-300 text-sm mb-3 leading-relaxed line-clamp-2">
                        {game.description}
                      </p>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                        <div className="flex items-center">
                          <Eye className="h-3 w-3 text-green-400 mr-1" />
                          <span className="text-gray-400">Visits:</span>
                          <span className="text-white font-semibold ml-1">
                            {formatNumber(game.visits || 0)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 text-blue-400 mr-1" />
                          <span className="text-gray-400">Playing:</span>
                          <span className="text-white font-semibold ml-1">
                            {formatNumber(game.ccu || 0)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 text-purple-400 mr-1" />
                          <span className="text-gray-400">Created:</span>
                          <span className="text-white font-semibold ml-1">
                            {formatDate(game.created)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-1 ${
                            game.isActive ? 'bg-green-400' : 'bg-gray-400'
                          }`} />
                          <span className={`text-xs font-medium ${
                            game.isActive ? 'text-green-400' : 'text-gray-400'
                          }`}>
                            {game.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!loading && !error && (
        <section className="pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20"
            >
              <h2 className="text-3xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Ready to Create the Next Hit?
                </span>
              </h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Join the ranks of successful game developers. Let's discuss how we can help bring your game idea to life and achieve similar success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/#contact"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105"
                >
                  Start Your Project
                </Link>
                <Link
                  href="/#services"
                  className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  View Our Services
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </main>
  );
}
