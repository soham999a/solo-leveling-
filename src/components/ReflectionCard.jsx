import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/authStore';
import useXPStore from '../store/xpStore';
import useHabitStore from '../store/habitStore';
import { generateDailyReflection, generateMotivationalQuote } from '../services/gemini';

const ReflectionCard = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [journalEntry, setJournalEntry] = useState('');
  const [aiReflection, setAiReflection] = useState('');
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastReflectionDate, setLastReflectionDate] = useState(null);

  const { user, profile } = useAuthStore();
  const { level } = useXPStore();
  const { getTodaysCompletedHabits } = useHabitStore();

  // Load motivational quote on component mount
  useEffect(() => {
    loadMotivationalQuote();
  }, [level]);

  const loadMotivationalQuote = async () => {
    try {
      const timeOfDay = getTimeOfDay();
      const result = await generateMotivationalQuote(level, 0, timeOfDay);
      if (result.quote) {
        setMotivationalQuote(result.quote);
      }
    } catch (error) {
      console.error('Error loading motivational quote:', error);
    }
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  };

  const handleGenerateReflection = async () => {
    if (!journalEntry.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const completedHabits = getTodaysCompletedHabits();
      const result = await generateDailyReflection(
        journalEntry,
        level,
        completedHabits
      );

      if (result.reflection) {
        setAiReflection(result.reflection);
        setLastReflectionDate(new Date().toISOString().split('T')[0]);
      }
    } catch (error) {
      console.error('Error generating reflection:', error);
      setAiReflection('Thank you for sharing your thoughts! Every reflection is a step toward greater self-awareness and growth. Keep up the amazing work!');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearReflection = () => {
    setJournalEntry('');
    setAiReflection('');
  };

  const today = new Date().toISOString().split('T')[0];
  const hasReflectedToday = lastReflectionDate === today;

  if (!isExpanded) {
    return (
      <motion.div
        className={`card cursor-pointer ${className}`}
        whileHover={{ scale: 1.02 }}
        onClick={() => setIsExpanded(true)}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-gaming font-bold text-gradient">
              DAILY REFLECTION
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              {hasReflectedToday ? 'Reflection completed today' : 'Share your thoughts and get AI insights'}
            </p>
          </div>
          <div className="text-2xl">
            {hasReflectedToday ? '✅' : '💭'}
          </div>
        </div>
        
        {motivationalQuote && (
          <div className="mt-4 p-3 bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-lg border border-primary-500/30">
            <p className="text-white italic text-sm">"{motivationalQuote}"</p>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ height: 'auto' }}
      animate={{ height: 'auto' }}
      className={`card-glow ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-gaming font-bold text-gradient">
          DAILY REFLECTION
        </h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Motivational Quote */}
      {motivationalQuote && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-lg border border-primary-500/30"
        >
          <p className="text-white italic text-sm">"{motivationalQuote}"</p>
        </motion.div>
      )}

      {/* Journal Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          How was your day? What did you learn or accomplish?
        </label>
        <textarea
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          placeholder="Share your thoughts, challenges, wins, or anything on your mind..."
          className="w-full h-32 px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 resize-none"
          disabled={isGenerating}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 mb-4">
        <motion.button
          onClick={handleGenerateReflection}
          disabled={!journalEntry.trim() || isGenerating}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 btn-primary py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Generating Insights...</span>
            </div>
          ) : (
            'Get AI Reflection'
          )}
        </motion.button>
        
        {(journalEntry || aiReflection) && (
          <motion.button
            onClick={handleClearReflection}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-secondary px-4 py-2"
          >
            Clear
          </motion.button>
        )}
      </div>

      {/* AI Reflection */}
      <AnimatePresence>
        {aiReflection && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-accent-500/10 to-primary-500/10 rounded-lg border border-accent-500/30 p-4"
          >
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">AI</span>
              </div>
              <h4 className="font-semibold text-white">Your Personal Growth Coach</h4>
            </div>
            
            <div className="text-gray-200 whitespace-pre-line leading-relaxed">
              {aiReflection}
            </div>
            
            <div className="mt-3 pt-3 border-t border-accent-500/20">
              <p className="text-xs text-gray-400">
                Generated on {new Date().toLocaleDateString()} • Powered by Gemini AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reflection History Hint */}
      {hasReflectedToday && !aiReflection && (
        <div className="text-center py-4">
          <div className="text-green-400 text-2xl mb-2">✅</div>
          <p className="text-green-400 font-medium">Reflection completed today!</p>
          <p className="text-gray-400 text-sm">Come back tomorrow for new insights</p>
        </div>
      )}

      {/* Tips */}
      {!journalEntry && !aiReflection && (
        <div className="bg-dark-700/30 rounded-lg p-3 mt-4">
          <h5 className="text-sm font-semibold text-gray-300 mb-2">💡 Reflection Tips:</h5>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• What went well today?</li>
            <li>• What challenges did you face?</li>
            <li>• What did you learn about yourself?</li>
            <li>• How do you feel about your progress?</li>
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default ReflectionCard;
