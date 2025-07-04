import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/authStore';
import useHabitStore from '../store/habitStore';
import useXPStore from '../store/xpStore';
import { generateLifeCoachAdvice } from '../services/gemini';

const AILifeCoach = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [coaching, setCoaching] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [coachingType, setCoachingType] = useState('daily');
  
  const { user, profile } = useAuthStore();
  const { habits, getTodaysCompletedHabits, getHabitStats } = useHabitStore();
  const { level, currentXP, totalXP } = useXPStore();

  const coachingTypes = [
    { id: 'daily', name: 'Daily Check-in', icon: '🌅', description: 'Get your daily motivation and focus' },
    { id: 'weekly', name: 'Weekly Review', icon: '📊', description: 'Analyze your week and plan ahead' },
    { id: 'challenge', name: 'Challenge Mode', icon: '⚔️', description: 'Push your limits with new challenges' },
    { id: 'optimization', name: 'Optimization', icon: '⚡', description: 'Optimize your habits and routines' },
    { id: 'motivation', name: 'Motivation Boost', icon: '🔥', description: 'Get pumped up and inspired' }
  ];

  const generateCoaching = async (type) => {
    setIsLoading(true);
    
    const completedHabits = getTodaysCompletedHabits();
    const habitStats = habits.map(h => getHabitStats(h.id));
    
    const userData = {
      level,
      currentXP,
      totalXP,
      completedToday: completedHabits.length,
      totalHabits: habits.length,
      habits: habits.map(h => ({ name: h.name, category: h.category })),
      habitStats,
      profileName: profile?.displayName || 'Hunter'
    };

    const result = await generateLifeCoachAdvice(type, userData);
    setCoaching(result);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen && !coaching) {
      generateCoaching(coachingType);
    }
  }, [isOpen, coachingType]);

  const CoachAvatar = () => (
    <motion.div
      className="relative"
      animate={{ 
        scale: [1, 1.05, 1],
        rotate: [0, 1, -1, 0]
      }}
      transition={{ 
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-3xl shadow-lg">
        🧙‍♂️
      </div>
      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
      </div>
    </motion.div>
  );

  return (
    <>
      {/* Floating Coach Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          boxShadow: [
            "0 0 20px rgba(147, 51, 234, 0.5)",
            "0 0 30px rgba(59, 130, 246, 0.7)",
            "0 0 20px rgba(147, 51, 234, 0.5)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="text-2xl">🧙‍♂️</div>
      </motion.button>

      {/* Coach Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-gradient-to-br from-dark-800 to-dark-900 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-purple-500/30"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <CoachAvatar />
                  <div>
                    <h2 className="text-2xl font-gaming font-bold text-gradient">
                      AI Life Coach
                    </h2>
                    <p className="text-gray-400">Your personal Jin-Woo mentor</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Coaching Type Selector */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-3">Choose Your Coaching Session:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {coachingTypes.map((type) => (
                    <motion.button
                      key={type.id}
                      onClick={() => {
                        setCoachingType(type.id);
                        setCoaching(null);
                        generateCoaching(type.id);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        coachingType === type.id
                          ? 'border-purple-500 bg-purple-900/30'
                          : 'border-gray-600 bg-gray-800/50 hover:border-purple-400'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{type.icon}</span>
                        <div>
                          <div className="font-bold text-white">{type.name}</div>
                          <div className="text-sm text-gray-400">{type.description}</div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Coaching Content */}
              <div className="bg-dark-700/50 rounded-lg p-6 border border-purple-500/20">
                {isLoading ? (
                  <div className="text-center py-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <p className="text-gray-400">Your AI coach is analyzing your progress...</p>
                  </div>
                ) : coaching ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-2xl">🧙‍♂️</span>
                      <span className="font-bold text-purple-400">Coach Jin-Woo says:</span>
                    </div>
                    
                    <div className="prose prose-invert max-w-none">
                      <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                        {coaching.advice || coaching.message || 'Keep pushing forward, Hunter! Every step counts.'}
                      </div>
                    </div>

                    {coaching.actionItems && (
                      <div className="mt-6 p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
                        <h4 className="font-bold text-purple-400 mb-3">🎯 Action Items:</h4>
                        <ul className="space-y-2">
                          {coaching.actionItems.map((item, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-purple-400 mt-1">•</span>
                              <span className="text-gray-300">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-600">
                      <button
                        onClick={() => generateCoaching(coachingType)}
                        className="btn-primary px-4 py-2"
                      >
                        🔄 Get New Advice
                      </button>
                      <div className="text-sm text-gray-400">
                        Powered by AI • Inspired by Solo Leveling
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    Select a coaching type to get started!
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AILifeCoach;
