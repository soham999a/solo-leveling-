import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useXPStore from '../store/xpStore';
import { generateLevelUpMessage } from '../services/gemini';

const LevelUpModal = () => {
  const { showLevelUpModal, level, closeLevelUpModal } = useXPStore();
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);

  useEffect(() => {
    if (showLevelUpModal && level > 1) {
      // Generate AI celebration message
      setIsLoadingMessage(true);
      generateLevelUpMessage(level, level - 1, ['Daily Workout', 'Reading', 'Meditation'])
        .then(result => {
          if (result.message) {
            setCelebrationMessage(result.message);
          }
        })
        .catch(error => {
          console.error('Error generating level up message:', error);
          setCelebrationMessage(`🎉 LEVEL UP! 🎉\n\nCongratulations! You've reached Level ${level}!\n\nYour dedication to growth has unlocked new potential. Ready for the next challenge?`);
        })
        .finally(() => {
          setIsLoadingMessage(false);
        });
    }
  }, [showLevelUpModal, level]);

  const handleClose = () => {
    closeLevelUpModal();
    setCelebrationMessage('');
  };

  return (
    <AnimatePresence>
      {showLevelUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          
          {/* Celebration particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                initial={{
                  x: '50vw',
                  y: '50vh',
                  scale: 0,
                }}
                animate={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-lg bg-gradient-to-br from-dark-800 to-dark-900 rounded-2xl border-2 border-yellow-500/50 shadow-2xl overflow-hidden"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 animate-pulse" />
            
            {/* Content */}
            <div className="relative p-8 text-center">
              {/* Level badge */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                className="mx-auto w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-yellow-500/50"
              >
                <span className="text-3xl font-gaming font-bold text-white">
                  {level}
                </span>
              </motion.div>
              
              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-4xl font-gaming font-bold text-gradient mb-2"
              >
                LEVEL UP!
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-xl text-yellow-400 mb-6"
              >
                You've reached Level {level}!
              </motion.p>
              
              {/* AI Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-dark-700/50 rounded-lg p-4 mb-6 border border-yellow-500/30"
              >
                {isLoadingMessage ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-gray-300">Generating celebration message...</span>
                  </div>
                ) : (
                  <p className="text-gray-200 whitespace-pre-line leading-relaxed">
                    {celebrationMessage || `🎉 Amazing work! You've reached Level ${level}! Your consistency and dedication are paying off. Keep pushing forward!`}
                  </p>
                )}
              </motion.div>
              
              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="grid grid-cols-3 gap-4 mb-6"
              >
                <div className="bg-dark-700/30 rounded-lg p-3">
                  <div className="text-2xl font-bold text-yellow-400">{level}</div>
                  <div className="text-xs text-gray-400">Current Level</div>
                </div>
                <div className="bg-dark-700/30 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-400">+1</div>
                  <div className="text-xs text-gray-400">Level Gained</div>
                </div>
                <div className="bg-dark-700/30 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-400">∞</div>
                  <div className="text-xs text-gray-400">Potential</div>
                </div>
              </motion.div>
              
              {/* Motivational quote */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="mb-6"
              >
                <blockquote className="text-gray-300 italic">
                  "Success is not final, failure is not fatal: it is the courage to continue that counts."
                </blockquote>
                <p className="text-gray-500 text-sm mt-2">- Winston Churchill</p>
              </motion.div>
              
              {/* Continue button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                onClick={handleClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Continue Your Journey
              </motion.button>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-4 left-4 text-yellow-400 text-2xl animate-bounce">⭐</div>
            <div className="absolute top-4 right-4 text-yellow-400 text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>🎉</div>
            <div className="absolute bottom-4 left-4 text-yellow-400 text-2xl animate-bounce" style={{ animationDelay: '1s' }}>🏆</div>
            <div className="absolute bottom-4 right-4 text-yellow-400 text-2xl animate-bounce" style={{ animationDelay: '1.5s' }}>🚀</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LevelUpModal;
