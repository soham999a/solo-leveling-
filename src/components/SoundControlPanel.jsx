import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEpicSounds } from '../hooks/useEpicSounds';

const SoundControlPanel = () => {
  const { sounds, isEnabled, volume, toggleSounds, changeVolume } = useEpicSounds();
  const [isOpen, setIsOpen] = useState(false);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    changeVolume(newVolume);
  };

  const testSounds = [
    { name: 'levelUp', label: '🎉 Level Up', color: 'from-yellow-500 to-orange-500' },
    { name: 'xpGain', label: '⭐ XP Gain', color: 'from-blue-500 to-purple-500' },
    { name: 'questComplete', label: '🏆 Quest Complete', color: 'from-green-500 to-emerald-500' },
    { name: 'epicSuccess', label: '💥 Epic Success', color: 'from-red-500 to-pink-500' },
    { name: 'magicSparkle', label: '✨ Magic Sparkle', color: 'from-purple-500 to-indigo-500' },
    { name: 'achievement', label: '🎖️ Achievement', color: 'from-amber-500 to-yellow-500' }
  ];

  return (
    <>
      {/* Sound Control Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg transition-all duration-300 ${
          isEnabled
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
            : 'bg-gray-600 text-gray-300'
        }`}
        style={{
          boxShadow: isEnabled 
            ? '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(147, 51, 234, 0.3)' 
            : '0 4px 15px rgba(0, 0, 0, 0.3)'
        }}
      >
        {isEnabled ? '🔊' : '🔇'}
      </motion.button>

      {/* Sound Control Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed bottom-48 right-6 z-40 w-80 bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-2xl backdrop-blur-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.95))',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(59, 130, 246, 0.2)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-gaming font-bold text-gradient">
                SOUND CONTROL
              </h3>
              <motion.button
                onClick={() => setIsOpen(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </motion.button>
            </div>

            {/* Master Controls */}
            <div className="space-y-4 mb-6">
              {/* Enable/Disable Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Sound Effects</span>
                <motion.button
                  onClick={toggleSounds}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                    isEnabled ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                >
                  <motion.div
                    animate={{ x: isEnabled ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                  />
                </motion.button>
              </div>

              {/* Volume Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Volume</span>
                  <span className="text-blue-400 font-bold">{Math.round(volume * 100)}%</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    disabled={!isEnabled}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, #374151 ${volume * 100}%, #374151 100%)`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Sound Test Buttons */}
            <div className="space-y-3">
              <h4 className="text-sm font-gaming font-bold text-gray-300 mb-3">
                TEST SOUNDS
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {testSounds.map((sound) => (
                  <motion.button
                    key={sound.name}
                    onClick={() => sounds[sound.name] && sounds[sound.name]()}
                    disabled={!isEnabled}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-2 rounded-lg text-xs font-medium text-white transition-all duration-200 ${
                      isEnabled 
                        ? `bg-gradient-to-r ${sound.color} hover:shadow-lg` 
                        : 'bg-gray-600 cursor-not-allowed'
                    }`}
                    style={{
                      boxShadow: isEnabled 
                        ? '0 4px 15px rgba(0, 0, 0, 0.3)' 
                        : 'none'
                    }}
                  >
                    {sound.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/30">
              <p className="text-xs text-gray-300 text-center">
                🎵 Epic Solo Leveling sound effects enhance your productivity journey!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
          transition: all 0.2s ease;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.8);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
        
        .slider:disabled::-webkit-slider-thumb {
          background: #6b7280;
          box-shadow: none;
        }
        
        .slider:disabled::-moz-range-thumb {
          background: #6b7280;
          box-shadow: none;
        }
      `}</style>
    </>
  );
};

export default SoundControlPanel;
