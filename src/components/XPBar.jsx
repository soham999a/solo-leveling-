import React from 'react';
import { motion } from 'framer-motion';
import useXPStore from '../store/xpStore';

const XPBar = ({ className = '', showDetails = true, size = 'normal' }) => {
  const { 
    level, 
    currentXP, 
    xpToNextLevel, 
    getXPProgress,
    showXPGainAnimation,
    lastXPGain 
  } = useXPStore();

  const progress = getXPProgress();
  const totalXPForLevel = currentXP + xpToNextLevel;

  const sizeClasses = {
    small: 'h-2',
    normal: 'h-3',
    large: 'h-4'
  };

  const textSizeClasses = {
    small: 'text-xs',
    normal: 'text-sm',
    large: 'text-base'
  };

  return (
    <div className={`relative ${className}`}>
      {/* XP Gain Animation */}
      {showXPGainAnimation && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.8 }}
          animate={{ opacity: 1, y: -30, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            +{lastXPGain} XP
          </div>
        </motion.div>
      )}

      {/* Level and XP Info */}
      {showDetails && (
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <span className={`font-gaming font-bold text-primary-400 ${textSizeClasses[size]}`}>
              LEVEL {level}
            </span>
          </div>
          <span className={`text-gray-400 ${textSizeClasses[size]}`}>
            {currentXP} / {totalXPForLevel} XP
          </span>
        </div>
      )}

      {/* XP Bar Container */}
      <div className={`xp-bar ${sizeClasses[size]} relative overflow-hidden`}>
        {/* Background */}
        <div className="absolute inset-0 bg-dark-700 rounded-full" />
        
        {/* XP Fill */}
        <motion.div
          className="xp-fill relative"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Animated shine effect */}
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

        {/* Glow effect */}
        <div 
          className="absolute inset-0 rounded-full opacity-50"
          style={{
            background: `linear-gradient(90deg, transparent 0%, rgba(14, 165, 233, 0.3) ${progress}%, transparent ${progress + 10}%)`,
            filter: 'blur(4px)'
          }}
        />
      </div>

      {/* Progress percentage (optional) */}
      {showDetails && size !== 'small' && (
        <div className="text-center mt-1">
          <span className="text-xs text-gray-500">
            {Math.round(progress)}% to next level
          </span>
        </div>
      )}
    </div>
  );
};

// Compact XP Bar for smaller spaces
export const CompactXPBar = ({ className = '' }) => {
  return (
    <XPBar 
      className={className}
      showDetails={false}
      size="small"
    />
  );
};

// Large XP Bar for dashboard
export const DashboardXPBar = ({ className = '' }) => {
  const { level, currentXP, xpToNextLevel } = useXPStore();
  
  return (
    <div className={`card-glow p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-gaming font-bold text-gradient">
          EXPERIENCE POINTS
        </h3>
        <div className="text-right">
          <div className="text-2xl font-gaming font-bold text-primary-400">
            LEVEL {level}
          </div>
          <div className="text-sm text-gray-400">
            {xpToNextLevel} XP to next level
          </div>
        </div>
      </div>
      
      <XPBar size="large" showDetails={true} />
      
      {/* Level milestone indicator */}
      <div className="mt-4 flex justify-between text-xs text-gray-500">
        <span>Level {level}</span>
        <span>Level {level + 1}</span>
      </div>
    </div>
  );
};

export default XPBar;
