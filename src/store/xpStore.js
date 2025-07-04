import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import soundManager from '../utils/soundManager';

const useXPStore = create(
  persist(
    (set, get) => ({
      // State
      level: 1,
      currentXP: 0,
      totalXP: 0,
      xpToNextLevel: 100,
      recentXPGains: [],
      achievements: [],
      showLevelUpModal: false,
      showXPGainAnimation: false,
      lastXPGain: 0,

      // XP calculation constants
      BASE_XP_PER_LEVEL: 100,
      XP_MULTIPLIER: 1.1,

      // Actions
      setLevel: (level) => set({ level }),
      
      setCurrentXP: (currentXP) => set({ currentXP }),
      
      setTotalXP: (totalXP) => set({ totalXP }),

      // Calculate XP required for next level
      calculateXPToNextLevel: (level) => {
        const { BASE_XP_PER_LEVEL, XP_MULTIPLIER } = get();
        return Math.floor(BASE_XP_PER_LEVEL * Math.pow(XP_MULTIPLIER, level - 1));
      },

      // Calculate level from total XP
      calculateLevelFromXP: (totalXP) => {
        const { BASE_XP_PER_LEVEL, XP_MULTIPLIER } = get();
        let level = 1;
        let xpUsed = 0;

        while (true) {
          const xpForThisLevel = Math.floor(BASE_XP_PER_LEVEL * Math.pow(XP_MULTIPLIER, level - 1));
          if (xpUsed + xpForThisLevel > totalXP) {
            break;
          }
          xpUsed += xpForThisLevel;
          level++;
        }

        return level;
      },

      // Add XP
      addXP: (xpAmount, source = 'habit') => {
        const { 
          level, 
          currentXP, 
          totalXP, 
          calculateXPToNextLevel, 
          calculateLevelFromXP,
          recentXPGains 
        } = get();
        
        const newTotalXP = totalXP + xpAmount;
        const newLevel = calculateLevelFromXP(newTotalXP);
        const leveledUp = newLevel > level;
        
        // Calculate current XP within the level
        let xpUsedForPreviousLevels = 0;
        for (let i = 1; i < newLevel; i++) {
          const xpForLevel = calculateXPToNextLevel(i);
          xpUsedForPreviousLevels += xpForLevel;
        }

        const xpInCurrentLevel = newTotalXP - xpUsedForPreviousLevels;
        const xpRequiredForCurrentLevel = calculateXPToNextLevel(newLevel);
        const xpToNextLevel = xpRequiredForCurrentLevel - xpInCurrentLevel;
        
        // Add to recent XP gains (keep last 10)
        const newXPGain = {
          amount: xpAmount,
          source,
          timestamp: Date.now(),
          id: Math.random().toString(36).substr(2, 9)
        };
        
        const updatedRecentGains = [newXPGain, ...recentXPGains].slice(0, 10);
        
        set({
          level: newLevel,
          currentXP: xpInCurrentLevel,
          totalXP: newTotalXP,
          xpToNextLevel: xpToNextLevel - xpInCurrentLevel,
          recentXPGains: updatedRecentGains,
          showLevelUpModal: leveledUp,
          showXPGainAnimation: true,
          lastXPGain: xpAmount
        });

        // 🎵 EPIC SOUND EFFECTS! 🎵
        if (leveledUp) {
          // Epic level up sound sequence
          soundManager.play('levelUp');
          setTimeout(() => {
            soundManager.play('epicSuccess');
          }, 800);
          setTimeout(() => {
            soundManager.play('achievement');
          }, 1500);
        } else {
          // XP gain sound with intensity based on amount
          soundManager.play('xpGain');
          if (xpAmount >= 50) {
            setTimeout(() => {
              soundManager.play('powerUp');
            }, 300);
          }
          if (xpAmount >= 100) {
            setTimeout(() => {
              soundManager.play('magicSparkle');
            }, 600);
          }
        }

        // Auto-hide XP gain animation after 2 seconds
        setTimeout(() => {
          set({ showXPGainAnimation: false });
        }, 2000);
        
        return {
          leveledUp,
          newLevel,
          xpGained: xpAmount,
          newTotalXP
        };
      },

      // Sync with user profile (from Firebase)
      syncWithProfile: (profile) => {
        const { calculateXPToNextLevel } = get();
        
        const level = profile.level || 1;
        const totalXP = profile.totalXP || 0;
        const currentXP = profile.xp || 0;
        const xpToNextLevel = calculateXPToNextLevel(level) - currentXP;
        
        set({
          level,
          currentXP,
          totalXP,
          xpToNextLevel
        });
      },

      // Get XP progress percentage
      getXPProgress: () => {
        const { currentXP, xpToNextLevel } = get();
        const totalXPForLevel = currentXP + xpToNextLevel;
        return totalXPForLevel > 0 ? (currentXP / totalXPForLevel) * 100 : 0;
      },

      // Get level progress info
      getLevelProgress: () => {
        const { level, currentXP, xpToNextLevel, calculateXPToNextLevel } = get();
        const totalXPForLevel = calculateXPToNextLevel(level);
        const progress = (currentXP / totalXPForLevel) * 100;
        
        return {
          level,
          currentXP,
          xpToNextLevel,
          totalXPForLevel,
          progress: Math.min(progress, 100)
        };
      },

      // Add achievement
      addAchievement: (achievement) => {
        const { achievements } = get();
        const newAchievement = {
          ...achievement,
          id: Math.random().toString(36).substr(2, 9),
          unlockedAt: Date.now()
        };
        
        set({
          achievements: [newAchievement, ...achievements]
        });
        
        return newAchievement;
      },

      // Check for achievements
      checkAchievements: () => {
        const { level, totalXP, recentXPGains, achievements } = get();
        const newAchievements = [];
        
        // Level-based achievements
        const levelMilestones = [5, 10, 25, 50, 100];
        levelMilestones.forEach(milestone => {
          if (level >= milestone && !achievements.find(a => a.id === `level_${milestone}`)) {
            newAchievements.push({
              id: `level_${milestone}`,
              name: `Level ${milestone} Master`,
              description: `Reached level ${milestone}!`,
              icon: '🏆',
              type: 'level',
              rarity: milestone >= 50 ? 'legendary' : milestone >= 25 ? 'epic' : 'rare'
            });
          }
        });
        
        // XP-based achievements
        const xpMilestones = [1000, 5000, 10000, 25000, 50000];
        xpMilestones.forEach(milestone => {
          if (totalXP >= milestone && !achievements.find(a => a.id === `xp_${milestone}`)) {
            newAchievements.push({
              id: `xp_${milestone}`,
              name: `${milestone} XP Collector`,
              description: `Earned ${milestone} total XP!`,
              icon: '⭐',
              type: 'xp',
              rarity: milestone >= 25000 ? 'legendary' : milestone >= 10000 ? 'epic' : 'rare'
            });
          }
        });
        
        // Add new achievements
        if (newAchievements.length > 0) {
          const { achievements: currentAchievements } = get();
          set({
            achievements: [...newAchievements, ...currentAchievements]
          });
        }
        
        return newAchievements;
      },

      // Close level up modal
      closeLevelUpModal: () => set({ showLevelUpModal: false }),

      // Get recent XP gains for display
      getRecentXPGains: () => {
        const { recentXPGains } = get();
        return recentXPGains.slice(0, 5); // Return last 5 gains
      },

      // Clear old XP gains
      clearOldXPGains: () => {
        const { recentXPGains } = get();
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        const filteredGains = recentXPGains.filter(gain => gain.timestamp > oneHourAgo);
        
        set({ recentXPGains: filteredGains });
      },

      // Reset XP (for testing or admin purposes)
      resetXP: () => {
        set({
          level: 1,
          currentXP: 0,
          totalXP: 0,
          xpToNextLevel: 100,
          recentXPGains: [],
          achievements: [],
          showLevelUpModal: false,
          showXPGainAnimation: false,
          lastXPGain: 0
        });
      }
    }),
    {
      name: 'xp-storage',
      partialize: (state) => ({
        level: state.level,
        currentXP: state.currentXP,
        totalXP: state.totalXP,
        achievements: state.achievements,
        recentXPGains: state.recentXPGains
      }),
    }
  )
);

export default useXPStore;
