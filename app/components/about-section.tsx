'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Heart, Target, Award, Users2 } from 'lucide-react';

export function AboutSection() {
  const features = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Strategic Partnership",
      description: "Combining PeacefulPlay's creative vision with SwansInteractives' technical expertise"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Industry Focus",
      description: "Specialized exclusively in Roblox platform development and services"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Proven Excellence",
      description: "Track record of successful projects and satisfied clients across the ecosystem"
    },
    {
      icon: <Users2 className="h-8 w-8" />,
      title: "Community Driven",
      description: "Building connections and fostering growth within the Roblox developer community"
    }
  ];

  return (
    <section id="about" className="py-20 bg-slate-800/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              About Our Studio
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Swansa x PeacefulPlay represents the union of two industry-leading companies, creating a powerhouse in Roblox game development and comprehensive studio services.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              Transforming Ideas into Interactive Experiences
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Our joint venture brings together the best of both worlds: PeacefulPlay's innovative game design and community engagement expertise, combined with SwansInteractives' technical prowess and development excellence.
            </p>
            <p className="text-gray-300 mb-8 leading-relaxed">
              With a focus on the Roblox platform, we provide end-to-end solutions for developers, studios, and investors looking to succeed in the thriving Roblox ecosystem. From initial concept to post-launch growth, we're your trusted partner in the journey.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {features?.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="bg-slate-700/30 p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-colors"
                >
                  <div className="text-purple-400 mb-3">{feature.icon}</div>
                  <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Partnership Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl overflow-hidden border border-purple-500/30">
              <Image
                src="https://thumbs.dreamstime.com/z/low-poly-handshake-illustration-network-graphic-two-hands-shake-connection-partnership-tech-industry-blue-color-scheme-low-355220110.jpg"
                alt="Strategic Partnership"
                fill
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              
              {/* Floating Elements */}
              <div className="absolute top-4 right-4 bg-purple-500/20 backdrop-blur-sm rounded-lg p-3 border border-purple-500/30">
                <div className="text-white text-sm font-semibold">PeacefulPlay</div>
                <div className="text-purple-300 text-xs">Creative Vision</div>
              </div>
              
              <div className="absolute bottom-4 left-4 bg-blue-500/20 backdrop-blur-sm rounded-lg p-3 border border-blue-500/30">
                <div className="text-white text-sm font-semibold">SwansInteractives</div>
                <div className="text-blue-300 text-xs">Technical Excellence</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}