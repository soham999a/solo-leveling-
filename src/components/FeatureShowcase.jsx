import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagicParticles } from './ParticleSystem';
import { useEpicSounds } from '../hooks/useEpicSounds';

const FeatureShowcase = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const { sounds } = useEpicSounds();

  const features = [
    {
      id: 'ai-coach',
      name: '🤖 Ultimate AI Coach',
      description: 'Advanced AI-powered productivity coaching with multiple personalities',
      status: 'active',
      highlights: [
        'Multiple AI personalities (Motivational, Analytical, Supportive)',
        'Real-time habit analysis and suggestions',
        'Personalized coaching based on your progress',
        'Smart goal optimization and recommendations'
      ],
      color: 'from-blue-500 to-purple-500'
    },
    {
      id: '3d-world',
      name: '🌍 3D Productivity Worlds',
      description: 'Immersive 3D environments where habits become buildings',
      status: 'active',
      highlights: [
        '5 unique themed worlds (Castle, Forest, City, Space, Temple)',
        'Interactive 3D habit buildings that grow with streaks',
        'VR/AR ready architecture',
        'Physics-based rewards and visual feedback'
      ],
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 'smart-habits',
      name: '🧠 Smart Habit Generator',
      description: 'AI-powered personalized habit creation based on your goals',
      status: 'active',
      highlights: [
        'AI analyzes your goals and existing habits',
        '8 focus areas with specialized recommendations',
        'Difficulty-based progressive habit suggestions',
        'Science-backed habit formation principles'
      ],
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'social-hub',
      name: '👥 Advanced Social Hub',
      description: 'Complete social ecosystem with guilds, challenges, and mentorship',
      status: 'active',
      highlights: [
        'Global leaderboards and competitions',
        'Guild system with specialized communities',
        'Expert mentorship program',
        'Community challenges and tournaments'
      ],
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'sound-system',
      name: '🎵 Epic Sound System',
      description: 'Immersive audio experience with Solo Leveling-inspired effects',
      status: 'active',
      highlights: [
        'Synthesized Solo Leveling-style sound effects',
        'Dynamic audio feedback for all interactions',
        'Customizable sound profiles and volume control',
        'Epic level-up and achievement fanfares'
      ],
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 'real-world',
      name: '🌐 Real-World Integration',
      description: 'Connect with IoT devices, smart home, and real-world systems',
      status: 'beta',
      highlights: [
        'Smart phone sensor integration (motion, battery)',
        'Location-based habit triggers',
        'Smart home device control (lights, thermostat)',
        'Spotify and music service integration'
      ],
      color: 'from-emerald-500 to-cyan-500'
    },
    {
      id: 'predictive-ai',
      name: '🔮 Predictive Analytics',
      description: 'AI predicts optimal productivity times and patterns',
      status: 'beta',
      highlights: [
        'Productivity DNA analysis and profiling',
        'Optimal timing predictions for habits',
        'Burnout risk assessment and prevention',
        'Performance optimization suggestions'
      ],
      color: 'from-violet-500 to-purple-500'
    },
    {
      id: 'enterprise',
      name: '🏢 Enterprise Solutions',
      description: 'Team productivity management and business integration',
      status: 'coming-soon',
      highlights: [
        'Team dashboards and analytics',
        'Company-wide productivity challenges',
        'ROI tracking and business metrics',
        'Integration with business tools and APIs'
      ],
      color: 'from-gray-500 to-slate-500'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'beta': return 'bg-yellow-500';
      case 'coming-soon': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return '✅ Active';
      case 'beta': return '🧪 Beta';
      case 'coming-soon': return '🚧 Coming Soon';
      default: return 'Unknown';
    }
  };

  return (
    <>
      {/* Feature Showcase Button */}
      <motion.button
        onClick={() => {
          setIsOpen(!isOpen);
          sounds.powerUp();
        }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className="fixed top-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white flex items-center justify-center text-2xl shadow-lg"
        style={{
          boxShadow: '0 0 30px rgba(251, 191, 36, 0.6)'
        }}
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          ⭐
        </motion.div>
      </motion.button>

      {/* Feature Showcase Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute inset-4 bg-gray-900 rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <MagicParticles particleCount={30} size="medium" />
              
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-yellow-600 to-orange-600">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-gaming font-bold text-white">
                      ⭐ ULTIMATE PRODUCTIVITY PLATFORM
                    </h2>
                    <p className="text-white/80 text-lg">
                      The most advanced productivity system ever created
                    </p>
                  </div>
                  
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-white hover:text-red-300 text-2xl"
                  >
                    ✕
                  </motion.button>
                </div>
              </div>

              {/* Features Grid */}
              <div className="p-6 overflow-y-auto h-[calc(100%-120px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-500 transition-all cursor-pointer"
                      onClick={() => {
                        setSelectedFeature(feature);
                        sounds.cardHover();
                      }}
                      whileHover={{ scale: 1.02, y: -5 }}
                    >
                      {/* Status Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(feature.status)}`}>
                          {getStatusText(feature.status)}
                        </span>
                      </div>

                      {/* Feature Info */}
                      <h3 className="text-xl font-bold text-white mb-2">
                        {feature.name}
                      </h3>
                      <p className="text-gray-300 text-sm mb-4">
                        {feature.description}
                      </p>

                      {/* Highlights Preview */}
                      <div className="space-y-1">
                        {feature.highlights.slice(0, 2).map((highlight, idx) => (
                          <div key={idx} className="text-xs text-gray-400 flex items-center">
                            <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                            {highlight}
                          </div>
                        ))}
                        {feature.highlights.length > 2 && (
                          <div className="text-xs text-blue-400 font-medium">
                            +{feature.highlights.length - 2} more features...
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <motion.div
                        className={`mt-4 w-full py-2 rounded-lg text-center text-white font-medium bg-gradient-to-r ${feature.color}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {feature.status === 'active' ? '🚀 Explore' : 
                         feature.status === 'beta' ? '🧪 Try Beta' : 
                         '📅 Coming Soon'}
                      </motion.div>
                    </motion.div>
                  ))}
                </div>

                {/* Stats Section */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">8</div>
                    <div className="text-gray-400 text-sm">Epic Features</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">6</div>
                    <div className="text-gray-400 text-sm">Active Systems</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">∞</div>
                    <div className="text-gray-400 text-sm">Possibilities</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">100%</div>
                    <div className="text-gray-400 text-sm">Epic Level</div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="mt-8 text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    🎉 Welcome to the Future of Productivity!
                  </h3>
                  <p className="text-gray-300 mb-6">
                    You now have access to the most advanced productivity platform ever created. 
                    Every feature is designed to help you become the best version of yourself.
                  </p>
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-lg font-bold text-lg"
                  >
                    🚀 Start Your Epic Journey
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feature Detail Modal */}
      <AnimatePresence>
        {selectedFeature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedFeature(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900 rounded-xl max-w-2xl w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  {selectedFeature.name}
                </h3>
                <motion.button
                  onClick={() => setSelectedFeature(null)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ✕
                </motion.button>
              </div>

              <p className="text-gray-300 mb-6">
                {selectedFeature.description}
              </p>

              <div className="space-y-3">
                <h4 className="text-lg font-bold text-white">✨ Key Features:</h4>
                {selectedFeature.highlights.map((highlight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center text-gray-300"
                  >
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                    {highlight}
                  </motion.div>
                ))}
              </div>

              <motion.button
                onClick={() => setSelectedFeature(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`mt-6 w-full py-3 rounded-lg text-white font-bold bg-gradient-to-r ${selectedFeature.color}`}
              >
                {selectedFeature.status === 'active' ? '🚀 Start Using' : 
                 selectedFeature.status === 'beta' ? '🧪 Join Beta' : 
                 '📅 Get Notified'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeatureShowcase;
