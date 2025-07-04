// XP and Level calculation utilities

export const XP_CONSTANTS = {
  BASE_XP_PER_LEVEL: 100,
  XP_MULTIPLIER: 1.1,
  MAX_LEVEL: 100
};

/**
 * Calculate the total XP required to reach a specific level
 * @param {number} level - Target level
 * @returns {number} Total XP required
 */
export const calculateTotalXPForLevel = (level) => {
  if (level <= 1) return 0;
  
  let totalXP = 0;
  for (let i = 1; i < level; i++) {
    totalXP += Math.floor(XP_CONSTANTS.BASE_XP_PER_LEVEL * Math.pow(XP_CONSTANTS.XP_MULTIPLIER, i - 1));
  }
  return totalXP;
};

/**
 * Calculate the XP required for the next level from current level
 * @param {number} currentLevel - Current level
 * @returns {number} XP required for next level
 */
export const calculateXPForNextLevel = (currentLevel) => {
  return Math.floor(XP_CONSTANTS.BASE_XP_PER_LEVEL * Math.pow(XP_CONSTANTS.XP_MULTIPLIER, currentLevel - 1));
};

/**
 * Calculate level from total XP
 * @param {number} totalXP - Total XP accumulated
 * @returns {number} Current level
 */
export const calculateLevelFromTotalXP = (totalXP) => {
  if (totalXP <= 0) return 1;
  
  let level = 1;
  let xpRequired = 0;
  
  while (level <= XP_CONSTANTS.MAX_LEVEL) {
    const xpForThisLevel = calculateXPForNextLevel(level);
    if (xpRequired + xpForThisLevel > totalXP) {
      break;
    }
    xpRequired += xpForThisLevel;
    level++;
  }
  
  return level;
};

/**
 * Calculate current XP within the current level
 * @param {number} totalXP - Total XP accumulated
 * @param {number} currentLevel - Current level
 * @returns {number} XP within current level
 */
export const calculateCurrentLevelXP = (totalXP, currentLevel) => {
  const xpForPreviousLevels = calculateTotalXPForLevel(currentLevel);
  return totalXP - xpForPreviousLevels;
};

/**
 * Calculate XP progress percentage within current level
 * @param {number} currentLevelXP - XP within current level
 * @param {number} currentLevel - Current level
 * @returns {number} Progress percentage (0-100)
 */
export const calculateLevelProgress = (currentLevelXP, currentLevel) => {
  const xpRequiredForNextLevel = calculateXPForNextLevel(currentLevel);
  return Math.min((currentLevelXP / xpRequiredForNextLevel) * 100, 100);
};

/**
 * Get level title based on level
 * @param {number} level - Current level
 * @returns {string} Level title
 */
export const getLevelTitle = (level) => {
  if (level >= 100) return 'Legendary Master';
  if (level >= 75) return 'Epic Champion';
  if (level >= 50) return 'Elite Hunter';
  if (level >= 25) return 'Skilled Warrior';
  if (level >= 10) return 'Rising Hero';
  if (level >= 5) return 'Apprentice';
  return 'Novice Hunter';
};

/**
 * Get level color theme
 * @param {number} level - Current level
 * @returns {object} Color theme object
 */
export const getLevelTheme = (level) => {
  if (level >= 100) return {
    gradient: 'from-yellow-400 to-orange-500',
    primary: '#FFD700',
    glow: 'shadow-2xl shadow-yellow-500/50'
  };
  if (level >= 75) return {
    gradient: 'from-purple-400 to-pink-500',
    primary: '#9333EA',
    glow: 'shadow-2xl shadow-purple-500/50'
  };
  if (level >= 50) return {
    gradient: 'from-blue-400 to-cyan-500',
    primary: '#3B82F6',
    glow: 'shadow-xl shadow-blue-500/50'
  };
  if (level >= 25) return {
    gradient: 'from-green-400 to-blue-500',
    primary: '#10B981',
    glow: 'shadow-xl shadow-green-500/50'
  };
  if (level >= 10) return {
    gradient: 'from-primary-400 to-accent-500',
    primary: '#0ea5e9',
    glow: 'shadow-lg shadow-primary-500/50'
  };
  return {
    gradient: 'from-gray-400 to-gray-600',
    primary: '#6B7280',
    glow: 'shadow-md shadow-gray-500/30'
  };
};

/**
 * Calculate streak bonus XP
 * @param {number} streakDays - Number of consecutive days
 * @param {number} baseXP - Base XP for the habit
 * @returns {number} Bonus XP
 */
export const calculateStreakBonus = (streakDays, baseXP) => {
  if (streakDays < 3) return 0;
  
  const bonusMultiplier = Math.min(streakDays / 10, 0.5); // Max 50% bonus
  return Math.floor(baseXP * bonusMultiplier);
};

/**
 * Calculate daily XP goal based on level
 * @param {number} level - Current level
 * @returns {number} Recommended daily XP goal
 */
export const calculateDailyXPGoal = (level) => {
  const baseGoal = 50;
  const levelMultiplier = 1 + (level * 0.1);
  return Math.floor(baseGoal * levelMultiplier);
};

/**
 * Format XP number for display
 * @param {number} xp - XP amount
 * @returns {string} Formatted XP string
 */
export const formatXP = (xp) => {
  if (xp >= 1000000) {
    return `${(xp / 1000000).toFixed(1)}M`;
  }
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}K`;
  }
  return xp.toString();
};

/**
 * Get achievement thresholds
 * @returns {array} Array of achievement objects
 */
export const getAchievementThresholds = () => {
  return [
    { type: 'level', value: 5, name: 'Rising Star', icon: '⭐', rarity: 'common' },
    { type: 'level', value: 10, name: 'Dedicated Hunter', icon: '🎯', rarity: 'uncommon' },
    { type: 'level', value: 25, name: 'Elite Warrior', icon: '⚔️', rarity: 'rare' },
    { type: 'level', value: 50, name: 'Master Hunter', icon: '👑', rarity: 'epic' },
    { type: 'level', value: 100, name: 'Legendary Champion', icon: '🏆', rarity: 'legendary' },
    
    { type: 'xp', value: 1000, name: 'First Milestone', icon: '🚀', rarity: 'common' },
    { type: 'xp', value: 5000, name: 'XP Collector', icon: '💎', rarity: 'uncommon' },
    { type: 'xp', value: 10000, name: 'Experience Master', icon: '🌟', rarity: 'rare' },
    { type: 'xp', value: 25000, name: 'XP Legend', icon: '⚡', rarity: 'epic' },
    { type: 'xp', value: 50000, name: 'Ultimate Achiever', icon: '🔥', rarity: 'legendary' },
    
    { type: 'streak', value: 7, name: 'Week Warrior', icon: '📅', rarity: 'common' },
    { type: 'streak', value: 30, name: 'Monthly Master', icon: '🗓️', rarity: 'uncommon' },
    { type: 'streak', value: 100, name: 'Consistency King', icon: '👑', rarity: 'rare' },
    { type: 'streak', value: 365, name: 'Year-Long Legend', icon: '🎊', rarity: 'legendary' },
    
    { type: 'habits', value: 5, name: 'Habit Builder', icon: '🔨', rarity: 'common' },
    { type: 'habits', value: 10, name: 'Routine Master', icon: '⚙️', rarity: 'uncommon' },
    { type: 'habits', value: 25, name: 'Life Optimizer', icon: '🎛️', rarity: 'rare' },
    { type: 'habits', value: 50, name: 'Transformation Guru', icon: '🦋', rarity: 'epic' }
  ];
};
