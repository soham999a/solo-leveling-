import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useHabitStore from '../store/habitStore';
import useAuthStore from '../store/authStore';
import useXPStore from '../store/xpStore';

const HabitItem = ({ habit, onEdit, onDelete, className = '' }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const { completeHabit, isHabitCompleted, getHabitStats } = useHabitStore();
  const { user } = useAuthStore();
  const { addXP } = useXPStore();
  
  const today = new Date().toISOString().split('T')[0];
  const isCompleted = isHabitCompleted(habit.id, today);
  const stats = getHabitStats(habit.id);

  const handleComplete = async () => {
    if (isCompleted || isCompleting || !user) return;
    
    setIsCompleting(true);
    
    try {
      const result = await completeHabit(user.uid, habit.id);
      
      if (result.success) {
        // Add XP to local store for immediate UI feedback
        addXP(result.xpGained, 'habit');
        
        // Show success feedback
        console.log(`Completed ${habit.name}! +${result.xpGained} XP`);
      } else {
        console.error('Failed to complete habit:', result.error);
      }
    } catch (error) {
      console.error('Error completing habit:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const getStreakColor = (streak) => {
    if (streak >= 30) return 'text-yellow-400';
    if (streak >= 14) return 'text-purple-400';
    if (streak >= 7) return 'text-blue-400';
    if (streak >= 3) return 'text-green-400';
    return 'text-gray-400';
  };

  const getCompletionRateColor = (rate) => {
    if (rate >= 90) return 'text-green-400';
    if (rate >= 70) return 'text-blue-400';
    if (rate >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className={`card relative overflow-hidden ${className} ${
        isCompleted ? 'bg-green-900/20 border-green-500/30' : ''
      }`}
    >
      {/* Completion overlay */}
      {isCompleted && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent pointer-events-none" />
      )}

      <div className="flex items-center justify-between">
        {/* Left side - Habit info */}
        <div className="flex items-center space-x-4 flex-1">
          {/* Habit icon and completion button */}
          <motion.button
            onClick={handleComplete}
            disabled={isCompleted || isCompleting}
            whileHover={{ scale: isCompleted ? 1 : 1.1 }}
            whileTap={{ scale: isCompleted ? 1 : 0.95 }}
            className={`
              relative w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold
              transition-all duration-200 border-2
              ${isCompleted 
                ? 'bg-green-500 border-green-400 text-white shadow-lg shadow-green-500/30' 
                : 'bg-dark-700 border-dark-600 hover:border-primary-500 hover:bg-primary-500/20 text-gray-300'
              }
              ${isCompleting ? 'animate-pulse' : ''}
            `}
            style={{ backgroundColor: isCompleted ? undefined : habit.color + '20' }}
          >
            {isCompleting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isCompleted ? (
              '✓'
            ) : (
              habit.icon || '⭐'
            )}
          </motion.button>

          {/* Habit details */}
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className={`font-semibold ${isCompleted ? 'text-green-400' : 'text-white'}`}>
                {habit.name}
              </h3>
              <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-1 rounded-full">
                {habit.category}
              </span>
            </div>
            
            {habit.description && (
              <p className="text-sm text-gray-400 mt-1">
                {habit.description}
              </p>
            )}
            
            {/* Stats row */}
            <div className="flex items-center space-x-4 mt-2 text-xs">
              <span className={`flex items-center space-x-1 ${getStreakColor(stats.currentStreak)}`}>
                <span>🔥</span>
                <span>{stats.currentStreak} day streak</span>
              </span>
              
              <span className={`${getCompletionRateColor(stats.completionRate)}`}>
                {stats.completionRate}% completion
              </span>
              
              <span className="text-accent-400">
                +{habit.xpValue} XP
              </span>
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2">
          {/* Edit button */}
          {onEdit && (
            <motion.button
              onClick={() => onEdit(habit)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </motion.button>
          )}

          {/* Delete button */}
          {onDelete && (
            <motion.button
              onClick={() => onDelete(habit)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </motion.button>
          )}
        </div>
      </div>

      {/* Progress indicator for streaks */}
      {stats.currentStreak > 0 && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Streak Progress</span>
            <span>{stats.currentStreak} days</span>
          </div>
          <div className="w-full bg-dark-700 rounded-full h-1">
            <motion.div
              className="h-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((stats.currentStreak / 30) * 100, 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Compact version for smaller spaces
export const CompactHabitItem = ({ habit, onComplete, className = '' }) => {
  const { isHabitCompleted } = useHabitStore();
  const today = new Date().toISOString().split('T')[0];
  const isCompleted = isHabitCompleted(habit.id, today);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`
        flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200
        ${isCompleted 
          ? 'bg-green-900/20 border-green-500/30' 
          : 'bg-dark-800 border-dark-700 hover:border-primary-500/50'
        }
        ${className}
      `}
    >
      <motion.button
        onClick={() => onComplete && onComplete(habit)}
        disabled={isCompleted}
        whileHover={{ scale: isCompleted ? 1 : 1.1 }}
        whileTap={{ scale: isCompleted ? 1 : 0.95 }}
        className={`
          w-8 h-8 rounded-full flex items-center justify-center text-sm
          ${isCompleted 
            ? 'bg-green-500 text-white' 
            : 'bg-dark-700 text-gray-300 hover:bg-primary-500/20'
          }
        `}
      >
        {isCompleted ? '✓' : habit.icon || '⭐'}
      </motion.button>
      
      <div className="flex-1">
        <span className={`text-sm font-medium ${isCompleted ? 'text-green-400' : 'text-white'}`}>
          {habit.name}
        </span>
      </div>
      
      <span className="text-xs text-accent-400">
        +{habit.xpValue}
      </span>
    </motion.div>
  );
};

export default HabitItem;
