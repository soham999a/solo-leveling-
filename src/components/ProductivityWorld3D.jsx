import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingParticles, MagicParticles } from './ParticleSystem';
import { useEpicSounds } from '../hooks/useEpicSounds';
import useHabitStore from '../store/habitStore';
import useXPStore from '../store/xpStore';

// 🏰 3D World Themes
const worldThemes = {
  castle: {
    name: "Productivity Castle",
    description: "Build your fortress of habits",
    colors: ['#4338ca', '#7c3aed', '#db2777'],
    environment: 'medieval'
  },
  forest: {
    name: "Focus Forest",
    description: "Grow trees with every completed task",
    colors: ['#059669', '#0d9488', '#0891b2'],
    environment: 'nature'
  },
  city: {
    name: "Achievement City",
    description: "Construct your metropolis of success",
    colors: ['#dc2626', '#ea580c', '#d97706'],
    environment: 'urban'
  },
  space: {
    name: "Cosmic Station",
    description: "Explore the universe of productivity",
    colors: ['#1e40af', '#7c2d12', '#be185d'],
    environment: 'space'
  },
  temple: {
    name: "Wisdom Temple",
    description: "Ancient knowledge and mindful progress",
    colors: ['#b45309', '#a16207', '#92400e'],
    environment: 'ancient'
  }
};

// 🎯 Simple 3D Habit Visualization (CSS-based for performance)
const Simple3DHabit = ({ habit, index, onClick }) => {
  const getBuildingHeight = () => {
    return Math.max(40, habit.streak * 10 + habit.difficulty * 5);
  };

  const getBuildingColor = () => {
    if (habit.completedToday) return 'linear-gradient(45deg, #10b981, #059669)';
    if (habit.streak > 7) return 'linear-gradient(45deg, #3b82f6, #1d4ed8)';
    if (habit.streak > 3) return 'linear-gradient(45deg, #8b5cf6, #7c3aed)';
    return 'linear-gradient(45deg, #6b7280, #4b5563)';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{
        scale: 1.05,
        rotateY: 10,
        rotateX: -5,
        transition: { duration: 0.2 }
      }}
      onClick={() => onClick(habit)}
      className="relative cursor-pointer"
      style={{
        width: '80px',
        height: `${getBuildingHeight()}px`,
        background: getBuildingColor(),
        borderRadius: '8px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
        transform: 'perspective(1000px) rotateX(5deg)',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Building Details */}
      <div className="absolute inset-0 bg-black/10 rounded-lg" />

      {/* XP Orb */}
      <motion.div
        animate={{
          y: [0, -5, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-yellow-400 rounded-full"
        style={{
          boxShadow: '0 0 20px rgba(251, 191, 36, 0.8)',
          background: 'radial-gradient(circle, #fbbf24, #f59e0b)'
        }}
      />

      {/* Habit Name */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-white font-medium text-center w-20">
        {habit.name}
      </div>

      {/* Streak Badge */}
      {habit.streak > 0 && (
        <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
          {habit.streak}
        </div>
      )}
    </motion.div>
  );
};

// 🌟 Simple XP Crystal Component
const SimpleXPCrystal = ({ xp, level }) => {
  return (
    <motion.div
      animate={{
        rotateY: [0, 360],
        scale: [1, 1.1, 1]
      }}
      transition={{
        rotateY: { duration: 4, repeat: Infinity, ease: "linear" },
        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      }}
      className="relative flex flex-col items-center"
    >
      {/* Crystal */}
      <div
        className="w-16 h-20 relative"
        style={{
          background: 'linear-gradient(45deg, #8b5cf6, #a855f7, #c084fc)',
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.8))',
          transform: 'perspective(1000px) rotateX(10deg)'
        }}
      />

      {/* Level Text */}
      <div className="absolute top-6 text-yellow-400 font-bold text-lg">
        {level}
      </div>

      {/* XP Text */}
      <div className="text-white text-sm mt-2 font-medium">
        {xp} XP
      </div>
    </motion.div>
  );
};

// 🎮 Simple 3D World Scene (CSS-based for performance)
const Simple3DWorldScene = ({ theme, habits, onHabitClick }) => {
  const { level, currentXP } = useXPStore();

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background with theme colors */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, ${worldThemes[theme].colors[0]}, ${worldThemes[theme].colors[1]}, ${worldThemes[theme].colors[2]})`
        }}
      />

      {/* Floating particles for atmosphere */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            animate={{
              x: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
              y: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%'
            }}
          />
        ))}
      </div>

      {/* Central XP Crystal */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <SimpleXPCrystal xp={currentXP} level={level} />
      </div>

      {/* Habit Buildings arranged in a circle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-80 h-80">
          {habits.map((habit, index) => {
            const angle = (index / habits.length) * 360;
            const radius = 120;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;

            return (
              <div
                key={habit.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`
                }}
              >
                <Simple3DHabit
                  habit={habit}
                  index={index}
                  onClick={onHabitClick}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 🌍 Main 3D Productivity World Component
const ProductivityWorld3D = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('castle');
  const [selectedHabit, setSelectedHabit] = useState(null);
  
  const { sounds } = useEpicSounds();
  const { habits } = useHabitStore();

  const handleHabitClick = (habit) => {
    setSelectedHabit(habit);
    sounds.magicSparkle();
  };

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    sounds.powerUp();
  };

  return (
    <>
      {/* 3D World Button */}
      <motion.button
        onClick={() => {
          setIsOpen(!isOpen);
          sounds.epicSuccess();
        }}
        whileHover={{ scale: 1.1, rotateY: 10 }}
        whileTap={{ scale: 0.9 }}
        className="fixed top-20 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center text-2xl shadow-lg"
        style={{
          boxShadow: '0 0 30px rgba(147, 51, 234, 0.6)'
        }}
      >
        <motion.div
          animate={{ 
            rotateY: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🌍
        </motion.div>
      </motion.button>

      {/* 3D World Modal */}
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
              <div className="absolute top-0 left-0 right-0 z-10 p-6 bg-gradient-to-r from-purple-600 to-pink-600">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-gaming font-bold text-white">
                      {worldThemes[selectedTheme].name}
                    </h2>
                    <p className="text-white/80">
                      {worldThemes[selectedTheme].description}
                    </p>
                  </div>
                  
                  {/* Theme Selector */}
                  <div className="flex space-x-2">
                    {Object.entries(worldThemes).map(([key, theme]) => (
                      <motion.button
                        key={key}
                        onClick={() => handleThemeChange(key)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${
                          selectedTheme === key 
                            ? 'bg-white text-purple-600' 
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        {key === 'castle' && '🏰'}
                        {key === 'forest' && '🌲'}
                        {key === 'city' && '🏙️'}
                        {key === 'space' && '🚀'}
                        {key === 'temple' && '🏛️'}
                      </motion.button>
                    ))}
                  </div>
                  
                  {/* Close Button */}
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

              {/* 3D World Scene */}
              <div className="absolute inset-0 pt-24">
                <Simple3DWorldScene
                  theme={selectedTheme}
                  habits={habits}
                  onHabitClick={handleHabitClick}
                />
              </div>

              {/* Controls Info */}
              <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white">
                <h3 className="font-bold mb-2">🎮 Controls</h3>
                <div className="text-sm space-y-1">
                  <div>🖱️ Click & Drag: Rotate view</div>
                  <div>🔍 Scroll: Zoom in/out</div>
                  <div>🎯 Click buildings: View habit details</div>
                  <div>🎨 Top buttons: Change world theme</div>
                </div>
              </div>

              {/* Habit Details */}
              {selectedHabit && (
                <motion.div
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="absolute top-24 right-6 w-80 bg-gray-800 rounded-lg p-6 text-white"
                >
                  <h3 className="text-xl font-bold mb-2">{selectedHabit.name}</h3>
                  <div className="space-y-2 text-sm">
                    <div>📊 Difficulty: {selectedHabit.difficulty}/10</div>
                    <div>🔥 Streak: {selectedHabit.streak} days</div>
                    <div>⭐ XP Value: {selectedHabit.xpValue}</div>
                    <div>📅 Category: {selectedHabit.category}</div>
                    <div className={`font-bold ${selectedHabit.completedToday ? 'text-green-400' : 'text-yellow-400'}`}>
                      {selectedHabit.completedToday ? '✅ Completed Today!' : '⏳ Pending Today'}
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={() => setSelectedHabit(null)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg"
                  >
                    Close Details
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductivityWorld3D;
