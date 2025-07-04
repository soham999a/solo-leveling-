import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useXPStore from '../store/xpStore';
import useHabitStore from '../store/habitStore';

// Epic Solo Leveling Avatar Component
const Avatar = ({ level, xp }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showPowerUp, setShowPowerUp] = useState(false);

  const hunterRank = useMemo(() => {
    if (level >= 100) return {
      rank: 'SHADOW MONARCH',
      color: '#000000',
      glow: '#8B5CF6',
      avatar: '👤',
      title: 'The Absolute Being',
      aura: 'shadow-monarch'
    };
    if (level >= 50) return {
      rank: 'S-RANK',
      color: '#FFD700',
      glow: '#FFA500',
      avatar: '⚡',
      title: 'Elite Hunter',
      aura: 's-rank'
    };
    if (level >= 25) return {
      rank: 'A-RANK',
      color: '#9333EA',
      glow: '#A855F7',
      avatar: '🔥',
      title: 'Advanced Hunter',
      aura: 'a-rank'
    };
    if (level >= 10) return {
      rank: 'B-RANK',
      color: '#3B82F6',
      glow: '#60A5FA',
      avatar: '⚔️',
      title: 'Skilled Hunter',
      aura: 'b-rank'
    };
    if (level >= 5) return {
      rank: 'C-RANK',
      color: '#10B981',
      glow: '#34D399',
      avatar: '🛡️',
      title: 'Hunter',
      aura: 'c-rank'
    };
    if (level >= 2) return {
      rank: 'D-RANK',
      color: '#F59E0B',
      glow: '#FBBF24',
      avatar: '⭐',
      title: 'Novice Hunter',
      aura: 'd-rank'
    };
    return {
      rank: 'E-RANK',
      color: '#6B7280',
      glow: '#9CA3AF',
      avatar: '🔰',
      title: 'Awakened',
      aura: 'e-rank'
    };
  }, [level]);

  const ParticleEffect = ({ count, color, size = 4 }) => (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{ backgroundColor: color }}
          initial={{
            x: Math.random() * 300,
            y: Math.random() * 300,
            scale: 0,
            opacity: 0
          }}
          animate={{
            x: Math.random() * 300,
            y: Math.random() * 300,
            scale: [0, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  );

  const ShadowSoldiers = () => (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl opacity-30"
          style={{
            left: `${20 + i * 30}%`,
            top: `${60 + Math.sin(i) * 20}%`,
          }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5
          }}
        >
          👥
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Background Aura */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        style={{
          background: `radial-gradient(circle, ${hunterRank.glow}20 0%, transparent 70%)`
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Particle Effects */}
      {level >= 10 && (
        <ParticleEffect
          count={Math.min(level, 20)}
          color={hunterRank.glow}
        />
      )}

      {/* Shadow Soldiers for high levels */}
      {level >= 20 && <ShadowSoldiers />}

      {/* Main Avatar Container */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        animate={{
          y: [0, -5, 0]
        }}
        transition={{
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 0.2 }
        }}
      >
        {/* Rank Badge */}
        <motion.div
          className="mb-4 px-4 py-2 rounded-lg font-gaming font-bold text-sm border-2 shadow-lg"
          style={{
            backgroundColor: hunterRank.color,
            borderColor: hunterRank.glow,
            color: hunterRank.rank === 'SHADOW MONARCH' ? '#FFFFFF' : '#000000',
            boxShadow: `0 0 20px ${hunterRank.glow}80`
          }}
          animate={{
            boxShadow: [
              `0 0 20px ${hunterRank.glow}80`,
              `0 0 30px ${hunterRank.glow}`,
              `0 0 20px ${hunterRank.glow}80`
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {hunterRank.rank}
        </motion.div>

        {/* Avatar Icon */}
        <motion.div
          className="text-8xl mb-4 filter drop-shadow-lg"
          animate={{
            rotate: isHovered ? [0, 5, -5, 0] : 0,
            scale: isHovered ? 1.1 : 1
          }}
          transition={{ duration: 0.5 }}
          style={{
            filter: `drop-shadow(0 0 20px ${hunterRank.glow})`
          }}
        >
          {hunterRank.avatar}
        </motion.div>

        {/* Level Display */}
        <motion.div
          className="text-3xl font-gaming font-bold text-white mb-2"
          animate={{
            textShadow: [
              `0 0 10px ${hunterRank.glow}`,
              `0 0 20px ${hunterRank.glow}`,
              `0 0 10px ${hunterRank.glow}`
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          LEVEL {level}
        </motion.div>

        {/* Title */}
        <div className="text-sm text-gray-300 font-medium mb-4">
          {hunterRank.title}
        </div>

        {/* XP Progress Bar */}
        <div className="w-48 bg-dark-700 rounded-full h-3 mb-4 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${hunterRank.color}, ${hunterRank.glow})`
            }}
            initial={{ width: 0 }}
            animate={{ width: `${(xp % 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        {/* XP Text */}
        <div className="text-sm text-gray-400">
          {xp % 100}/100 XP to next level
        </div>

        {/* Power-up Effect */}
        <AnimatePresence>
          {showPowerUp && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 2 }}
              exit={{ opacity: 0, scale: 3 }}
              transition={{ duration: 1 }}
            >
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: `radial-gradient(circle, ${hunterRank.glow} 0%, transparent 70%)`
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Special Effects for Shadow Monarch */}
        {hunterRank.rank === 'SHADOW MONARCH' && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: [
                'radial-gradient(circle, #8B5CF6 0%, transparent 70%)',
                'radial-gradient(circle, #000000 0%, transparent 70%)',
                'radial-gradient(circle, #8B5CF6 0%, transparent 70%)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* Interactive Hover Effects */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ParticleEffect count={30} color={hunterRank.glow} />
        </motion.div>
      )}
    </div>
  );
};

// Main AvatarScene Component - Epic 2D Version
const AvatarScene = () => {
  const { level, currentXP, totalXP } = useXPStore();
  const { getTodaysCompletedHabits, habits } = useHabitStore();

  const completedToday = getTodaysCompletedHabits().length;
  const completionRate = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 rounded-lg overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, #3B82F6 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, #9333EA 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, #10B981 0%, transparent 50%)
            `
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Main Avatar */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Avatar level={level} xp={currentXP} />
      </div>

      {/* Stats Overlay */}
      <div className="absolute top-4 left-4 z-20">
        <motion.div
          className="bg-dark-800/90 backdrop-blur-sm rounded-lg p-4 border border-primary-500/30"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-xs text-gray-400 mb-1">TODAY'S PROGRESS</div>
          <div className="flex items-center space-x-2">
            <div className="text-lg font-bold text-primary-400">
              {completedToday}/{habits.length}
            </div>
            <div className="text-sm text-gray-300">Habits</div>
          </div>
          <div className="w-24 bg-dark-700 rounded-full h-2 mt-2">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 1, delay: 0.8 }}
            />
          </div>
        </motion.div>
      </div>

      <div className="absolute top-4 right-4 z-20">
        <motion.div
          className="bg-dark-800/90 backdrop-blur-sm rounded-lg p-4 border border-accent-500/30"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="text-xs text-gray-400 mb-1">TOTAL XP</div>
          <div className="text-lg font-bold text-accent-400">
            {totalXP.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            All-time earned
          </div>
        </motion.div>
      </div>

      {/* Power Level Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <motion.div
          className="bg-dark-800/90 backdrop-blur-sm rounded-lg px-6 py-3 border border-purple-500/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">POWER LEVEL</div>
            <motion.div
              className="text-2xl font-gaming font-bold text-purple-400"
              animate={{
                textShadow: [
                  '0 0 10px #A855F7',
                  '0 0 20px #A855F7',
                  '0 0 10px #A855F7'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {(level * 1000 + totalXP).toLocaleString()}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Floating Action Button for Power-up */}
      <motion.button
        className="absolute bottom-4 right-4 z-20 w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-2xl shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            '0 0 20px rgba(245, 158, 11, 0.5)',
            '0 0 30px rgba(245, 158, 11, 0.8)',
            '0 0 20px rgba(245, 158, 11, 0.5)'
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={() => {
          // Trigger power-up animation
        }}
      >
        ⚡
      </motion.button>
    </div>
  );
};

export default AvatarScene;
