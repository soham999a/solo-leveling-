import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingParticles } from './ParticleSystem';

// Epic Page Transition Wrapper
const EpicPageTransition = ({ children, className = "" }) => {
  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 0.8,
      rotateX: -15,
      y: 100,
      filter: "blur(10px)"
    },
    in: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      y: 0,
      filter: "blur(0px)"
    },
    out: {
      opacity: 0,
      scale: 1.2,
      rotateX: 15,
      y: -100,
      filter: "blur(10px)"
    }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.8
  };

  return (
    <motion.div
      className={`min-h-screen perspective-1000 ${className}`}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  );
};

// Epic Loading Screen
export const EpicLoadingScreen = ({ isLoading, message = "Loading your epic journey..." }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center"
        >
          <FloatingParticles particleCount={30} colors={['#3b82f6', '#8b5cf6', '#ec4899']} />
          
          <div className="text-center relative z-10">
            {/* Epic Loading Animation */}
            <motion.div
              className="relative mb-8"
              animate={{
                rotateY: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Outer Ring */}
              <motion.div
                className="w-24 h-24 border-4 border-blue-500/30 rounded-full absolute"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Middle Ring */}
              <motion.div
                className="w-20 h-20 border-4 border-purple-500/50 rounded-full absolute top-2 left-2"
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Inner Ring */}
              <motion.div
                className="w-16 h-16 border-4 border-pink-500/70 rounded-full absolute top-4 left-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Center Core */}
              <motion.div
                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full absolute top-8 left-8"
                animate={{
                  scale: [1, 1.5, 1],
                  boxShadow: [
                    "0 0 20px rgba(59, 130, 246, 0.5)",
                    "0 0 40px rgba(147, 51, 234, 0.8)",
                    "0 0 20px rgba(59, 130, 246, 0.5)"
                  ]
                }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Epic Title */}
            <motion.h1
              className="text-4xl font-gaming font-bold text-gradient mb-4"
              animate={{
                scale: [1, 1.05, 1],
                textShadow: [
                  "0 0 20px rgba(59, 130, 246, 0.5)",
                  "0 0 30px rgba(147, 51, 234, 0.8)",
                  "0 0 20px rgba(59, 130, 246, 0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              LEVELUP LIFE
            </motion.h1>

            {/* Loading Message */}
            <motion.p
              className="text-gray-400 text-lg mb-6"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              {message}
            </motion.p>

            {/* Progress Bar */}
            <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden mx-auto">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                animate={{
                  x: ["-100%", "100%"],
                  boxShadow: [
                    "0 0 10px rgba(59, 130, 246, 0.5)",
                    "0 0 20px rgba(147, 51, 234, 0.8)",
                    "0 0 10px rgba(59, 130, 246, 0.5)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ width: "50%" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Epic Card Entrance Animation
export const EpicCardEntrance = ({ children, delay = 0, className = "" }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 50,
        rotateX: -15,
        scale: 0.8,
        filter: "blur(10px)"
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        filter: "blur(0px)"
      }}
      transition={{
        duration: 0.8,
        delay,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      className={className}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  );
};

// Epic Button Hover Effect
export const EpicButton = ({ 
  children, 
  onClick, 
  className = "", 
  variant = "primary",
  disabled = false,
  ...props 
}) => {
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-purple-500",
    secondary: "bg-gradient-to-r from-gray-600 to-gray-700",
    accent: "bg-gradient-to-r from-purple-500 to-pink-500",
    success: "bg-gradient-to-r from-green-500 to-emerald-500",
    danger: "bg-gradient-to-r from-red-500 to-pink-500"
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? {
        scale: 1.05,
        rotateX: -5,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(59, 130, 246, 0.5)"
      } : {}}
      whileTap={!disabled ? { scale: 0.95, rotateX: -2 } : {}}
      className={`
        ${variants[variant]} 
        text-white font-medium py-3 px-6 rounded-lg 
        transition-all duration-300 transform-3d
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      style={{
        transformStyle: 'preserve-3d',
        boxShadow: disabled ? 'none' : '0 8px 25px rgba(0, 0, 0, 0.2)'
      }}
      {...props}
    >
      <motion.span
        animate={!disabled ? {
          textShadow: [
            "0 0 10px rgba(255, 255, 255, 0.5)",
            "0 0 20px rgba(255, 255, 255, 0.8)",
            "0 0 10px rgba(255, 255, 255, 0.5)"
          ]
        } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
};

// Epic Stagger Container
export const EpicStaggerContainer = ({ children, className = "" }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Epic Item Animation
export const EpicStaggerItem = ({ children, className = "" }) => {
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      rotateX: -10,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className={className}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  );
};

export default EpicPageTransition;
