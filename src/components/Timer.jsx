import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import useTimerStore from '../store/timerStore';
import useXPStore from '../store/xpStore';

const Timer = ({ className = '', compact = false }) => {
  const {
    timeRemaining,
    isRunning,
    isPaused,
    currentSession,
    sessionCount,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    switchSession,
    getCurrentTimeFormatted,
    getSessionProgress,
    completeSession,
    cleanup
  } = useTimerStore();

  const { addXP } = useXPStore();

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const handlePlayPause = () => {
    if (isRunning) {
      pauseTimer();
    } else if (isPaused) {
      resumeTimer();
    } else {
      startTimer();
    }
  };

  const handleStop = () => {
    stopTimer();
  };

  const handleSessionSwitch = (sessionType) => {
    switchSession(sessionType);
  };

  const progress = getSessionProgress();
  const timeFormatted = getCurrentTimeFormatted();

  const getSessionColor = () => {
    switch (currentSession) {
      case 'work':
        return 'from-red-500 to-orange-500';
      case 'shortBreak':
        return 'from-green-500 to-blue-500';
      case 'longBreak':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-primary-500 to-accent-500';
    }
  };

  const getSessionIcon = () => {
    switch (currentSession) {
      case 'work':
        return '🎯';
      case 'shortBreak':
        return '☕';
      case 'longBreak':
        return '🌟';
      default:
        return '⏰';
    }
  };

  const getSessionLabel = () => {
    switch (currentSession) {
      case 'work':
        return 'Focus Time';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return 'Timer';
    }
  };

  if (compact) {
    return (
      <div className={`card p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getSessionIcon()}</span>
            <div>
              <div className="font-gaming font-bold text-lg">{timeFormatted}</div>
              <div className="text-xs text-gray-400">{getSessionLabel()}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={handlePlayPause}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary p-2 rounded-full"
            >
              {isRunning ? '⏸️' : '▶️'}
            </motion.button>
            
            {(isRunning || isPaused) && (
              <motion.button
                onClick={handleStop}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary p-2 rounded-full"
              >
                ⏹️
              </motion.button>
            )}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3 w-full bg-dark-700 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full bg-gradient-to-r ${getSessionColor()}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`card-glow p-6 ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-gaming font-bold text-gradient mb-2">
          POMODORO TIMER
        </h3>
        <div className="flex items-center justify-center space-x-2">
          <span className="text-3xl">{getSessionIcon()}</span>
          <span className="text-lg font-semibold text-white">{getSessionLabel()}</span>
        </div>
      </div>

      {/* Timer Display */}
      <div className="text-center mb-8">
        <motion.div
          key={timeFormatted}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="text-6xl font-gaming font-bold text-white mb-4"
        >
          {timeFormatted}
        </motion.div>
        
        {/* Session count */}
        <div className="text-sm text-gray-400">
          Session {sessionCount + 1} • {currentSession === 'work' ? 'Focus' : 'Break'} Mode
        </div>
      </div>

      {/* Progress Circle */}
      <div className="flex justify-center mb-8">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-dark-700"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
              animate={{ 
                strokeDashoffset: 2 * Math.PI * 45 * (1 - progress / 100)
              }}
              transition={{ duration: 0.3 }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className="text-primary-500" stopColor="currentColor" />
                <stop offset="100%" className="text-accent-500" stopColor="currentColor" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-white">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4 mb-6">
        <motion.button
          onClick={handlePlayPause}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary px-8 py-3 text-lg font-semibold"
        >
          {isRunning ? 'Pause' : isPaused ? 'Resume' : 'Start'}
        </motion.button>
        
        {(isRunning || isPaused) && (
          <motion.button
            onClick={handleStop}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-secondary px-6 py-3"
          >
            Stop
          </motion.button>
        )}
      </div>

      {/* Session Switcher */}
      <div className="flex justify-center space-x-2">
        <motion.button
          onClick={() => handleSessionSwitch('work')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            currentSession === 'work'
              ? 'bg-red-500 text-white'
              : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
          }`}
          disabled={isRunning}
        >
          🎯 Work
        </motion.button>
        
        <motion.button
          onClick={() => handleSessionSwitch('shortBreak')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            currentSession === 'shortBreak'
              ? 'bg-green-500 text-white'
              : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
          }`}
          disabled={isRunning}
        >
          ☕ Short Break
        </motion.button>
        
        <motion.button
          onClick={() => handleSessionSwitch('longBreak')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            currentSession === 'longBreak'
              ? 'bg-purple-500 text-white'
              : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
          }`}
          disabled={isRunning}
        >
          🌟 Long Break
        </motion.button>
      </div>
    </div>
  );
};

export default Timer;
