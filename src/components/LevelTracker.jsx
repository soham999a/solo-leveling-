import React from 'react';
import { motion } from 'framer-motion';
import useXPStore from '../store/xpStore';
import useAuthStore from '../store/authStore';

const LevelTracker = ({ className = '', variant = 'default' }) => {
  const { 
    level, 
    currentXP, 
    xpToNextLevel, 
    totalXP,
    achievements,
    getXPProgress 
  } = useXPStore();
  
  const { profile } = useAuthStore();
  const progress = getXPProgress();

  const getLevelTitle = (level) => {
    if (level >= 100) return 'Legendary Master';
    if (level >= 75) return 'Epic Champion';
    if (level >= 50) return 'Elite Hunter';
    if (level >= 25) return 'Skilled Warrior';
    if (level >= 10) return 'Rising Hero';
    if (level >= 5) return 'Apprentice';
    return 'Novice Hunter';
  };

  const getLevelColor = (level) => {
    if (level >= 100) return 'from-yellow-400 to-orange-500';
    if (level >= 75) return 'from-purple-400 to-pink-500';
    if (level >= 50) return 'from-blue-400 to-cyan-500';
    if (level >= 25) return 'from-green-400 to-blue-500';
    if (level >= 10) return 'from-primary-400 to-accent-500';
    return 'from-gray-400 to-gray-600';
  };

  const getAvatarGlow = (level) => {
    if (level >= 50) return 'shadow-2xl shadow-purple-500/50';
    if (level >= 25) return 'shadow-xl shadow-blue-500/50';
    if (level >= 10) return 'shadow-lg shadow-green-500/50';
    return 'shadow-md shadow-primary-500/30';
  };

  if (variant === 'compact') {
    return (
      <div className={`card p-4 ${className}`}>
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className={`relative w-12 h-12 rounded-full bg-gradient-to-br ${getLevelColor(level)} p-0.5 ${getAvatarGlow(level)}`}>
            <div className="w-full h-full rounded-full bg-dark-800 flex items-center justify-center text-xl">
              👤
            </div>
            <div className="absolute -bottom-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {level}
            </div>
          </div>
          
          {/* Info */}
          <div className="flex-1">
            <div className="font-gaming font-bold text-white">
              {profile?.displayName || 'Hunter'}
            </div>
            <div className="text-sm text-gray-400">
              {getLevelTitle(level)}
            </div>
          </div>
          
          {/* XP */}
          <div className="text-right">
            <div className="text-sm font-bold text-primary-400">
              {currentXP} XP
            </div>
            <div className="text-xs text-gray-500">
              {xpToNextLevel} to next
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'avatar') {
    return (
      <div className={`text-center ${className}`}>
        {/* Large Avatar */}
        <motion.div 
          className={`relative mx-auto w-32 h-32 rounded-full bg-gradient-to-br ${getLevelColor(level)} p-1 ${getAvatarGlow(level)}`}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="w-full h-full rounded-full bg-dark-800 flex items-center justify-center text-6xl">
            👤
          </div>
          
          {/* Level badge */}
          <motion.div 
            className="absolute -bottom-2 -right-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-gaming font-bold rounded-full w-12 h-12 flex items-center justify-center text-lg shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          >
            {level}
          </motion.div>
          
          {/* Floating particles effect */}
          {level >= 10 && (
            <div className="absolute inset-0 rounded-full overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-accent-400 rounded-full"
                  animate={{
                    x: [0, Math.random() * 100 - 50],
                    y: [0, Math.random() * 100 - 50],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
        
        {/* Name and title */}
        <div className="mt-4">
          <h2 className="text-xl font-gaming font-bold text-white">
            {profile?.displayName || 'Hunter'}
          </h2>
          <p className={`text-sm font-medium bg-gradient-to-r ${getLevelColor(level)} bg-clip-text text-transparent`}>
            {getLevelTitle(level)}
          </p>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`card-glow p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-gaming font-bold text-gradient">
          HUNTER PROFILE
        </h3>
        <div className="flex items-center space-x-2">
          {achievements.slice(0, 3).map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs"
              title={achievement.name}
            >
              {achievement.icon}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-6">
        {/* Avatar */}
        <motion.div 
          className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${getLevelColor(level)} p-0.5 ${getAvatarGlow(level)}`}
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-full h-full rounded-full bg-dark-800 flex items-center justify-center text-3xl">
            👤
          </div>
          <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-gaming font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm">
            {level}
          </div>
        </motion.div>
        
        {/* Stats */}
        <div className="flex-1">
          <div className="mb-2">
            <h4 className="text-lg font-bold text-white">
              {profile?.displayName || 'Hunter'}
            </h4>
            <p className={`text-sm font-medium bg-gradient-to-r ${getLevelColor(level)} bg-clip-text text-transparent`}>
              {getLevelTitle(level)}
            </p>
          </div>
          
          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-primary-400">{level}</div>
              <div className="text-xs text-gray-400">Level</div>
            </div>
            <div>
              <div className="text-lg font-bold text-accent-400">{totalXP.toLocaleString()}</div>
              <div className="text-xs text-gray-400">Total XP</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-400">{achievements.length}</div>
              <div className="text-xs text-gray-400">Achievements</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress to next level */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Progress to Level {level + 1}</span>
          <span>{currentXP} / {currentXP + xpToNextLevel} XP</span>
        </div>
        
        <div className="w-full bg-dark-700 rounded-full h-3 overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${getLevelColor(level)} relative`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatDelay: 3,
                ease: "easeInOut" 
              }}
            />
          </motion.div>
        </div>
        
        <div className="text-center mt-2">
          <span className="text-xs text-gray-500">
            {xpToNextLevel} XP needed for next level
          </span>
        </div>
      </div>
    </div>
  );
};

export default LevelTracker;
