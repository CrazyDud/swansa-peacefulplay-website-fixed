
'use client';

import { motion } from 'framer-motion';
import { ChevronDown, Users, Trophy, Zap, Activity } from 'lucide-react';
import { AnimatedCounter } from './animated-counter';
import { STUDIO_STATS, COMPANY_INFO } from '@/lib/constants';
import { useEffect, useState } from 'react';
import HeroCarousel from './hero-carousel';
import { RobloxGameData } from '@/lib/roblox-api';

export function HeroSection() {
  const [games, setGames] = useState<RobloxGameData[]>([]);
  const [totalActiveUsers, setTotalActiveUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/api/games');
        const data = await response.json();
        
        if (data.success && data.games) {
          setGames(data.games);
          // Calculate total active users (sum of all CCU)
          const totalCCU = data.games.reduce((sum: number, game: RobloxGameData) => sum + (game.ccu || 0), 0);
          setTotalActiveUsers(totalCCU);
        }
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const scrollToGames = () => {
    document.getElementById('games')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero Carousel Section */}
      <section id="home" className="relative">
        <HeroCarousel games={games} />
      </section>

      {/* Studio Stats & Company Info Section */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Company Partnership Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                The Perfect Partnership
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Where technical excellence meets creative innovation to deliver exceptional Roblox gaming experiences.
            </p>

            {/* Company Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">S</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{COMPANY_INFO.swansa.name}</h3>
                <p className="text-purple-300 font-semibold mb-4">{COMPANY_INFO.swansa.role}</p>
                <p className="text-gray-300 mb-4">{COMPANY_INFO.swansa.description}</p>
                <p className="text-sm text-gray-400">{COMPANY_INFO.swansa.focus}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">P</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{COMPANY_INFO.peacefulplay.name}</h3>
                <p className="text-blue-300 font-semibold mb-4">{COMPANY_INFO.peacefulplay.role}</p>
                <p className="text-gray-300 mb-4">{COMPANY_INFO.peacefulplay.description}</p>
                <p className="text-sm text-gray-400">{COMPANY_INFO.peacefulplay.focus}</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 text-center">
              <Trophy className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">
                <AnimatedCounter end={STUDIO_STATS.totalProjects} />
              </div>
              <div className="text-sm text-gray-400">Total Projects</div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20 text-center">
              <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">
                <AnimatedCounter end={STUDIO_STATS.totalVisits / 1000000} suffix="M" />+
              </div>
              <div className="text-sm text-gray-400">Total Visits</div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-green-500/20 text-center">
              <Activity className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">
                <AnimatedCounter end={totalActiveUsers || STUDIO_STATS.totalActiveUsers} />+
              </div>
              <div className="text-sm text-gray-400">Total Active Users</div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-pink-500/20 text-center">
              <Zap className="h-8 w-8 text-pink-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">
                <AnimatedCounter end={STUDIO_STATS.clientSatisfaction} suffix="%" />
              </div>
              <div className="text-sm text-gray-400">Client Satisfaction</div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
          >
            <button
              onClick={scrollToGames}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105"
            >
              Explore Our Games
            </button>
            <button
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              View Services
            </button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            viewport={{ once: true }}
            className="flex justify-center mt-16"
          >
            <button
              onClick={scrollToGames}
              className="cursor-pointer group"
            >
              <ChevronDown className="h-8 w-8 text-gray-400 animate-bounce group-hover:text-purple-400 transition-colors" />
            </button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
