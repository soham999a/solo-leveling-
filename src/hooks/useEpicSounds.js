import { useCallback, useEffect, useState } from 'react';
import soundManager from '../utils/soundManager';

// Epic Sound Hook for Solo Leveling App
export const useEpicSounds = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [volume, setVolume] = useState(0.7);

  // Initialize sound system
  useEffect(() => {
    soundManager.setVolume(volume);
    if (isEnabled) {
      soundManager.enable();
    } else {
      soundManager.disable();
    }
  }, [isEnabled, volume]);

  // Sound effect functions
  const playSound = useCallback((soundName) => {
    if (isEnabled) {
      soundManager.play(soundName);
    }
  }, [isEnabled]);

  // Specific sound effects
  const sounds = {
    // UI Interactions
    buttonHover: () => playSound('buttonHover'),
    buttonClick: () => playSound('buttonClick'),
    cardHover: () => playSound('cardHover'),
    
    // Level System
    levelUp: () => playSound('levelUp'),
    xpGain: () => playSound('xpGain'),
    questComplete: () => playSound('questComplete'),
    
    // Epic Moments
    epicSuccess: () => playSound('epicSuccess'),
    powerUp: () => playSound('powerUp'),
    achievement: () => playSound('achievement'),
    
    // Ambient
    backgroundHum: () => playSound('backgroundHum'),
    magicSparkle: () => playSound('magicSparkle'),
    
    // Notifications
    notification: () => playSound('notification'),
    warning: () => playSound('warning'),
    error: () => playSound('error'),
  };

  // Control functions
  const toggleSounds = useCallback(() => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    return newState;
  }, [isEnabled]);

  const changeVolume = useCallback((newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    soundManager.setVolume(clampedVolume);
  }, []);

  return {
    sounds,
    isEnabled,
    volume,
    toggleSounds,
    changeVolume,
    playSound
  };
};

// Epic Button Sound Hook
export const useEpicButton = (onClick, soundType = 'buttonClick') => {
  const { sounds } = useEpicSounds();

  const handleClick = useCallback((event) => {
    // Play sound effect
    if (sounds[soundType]) {
      sounds[soundType]();
    }
    
    // Call original onClick if provided
    if (onClick) {
      onClick(event);
    }
  }, [onClick, sounds, soundType]);

  const handleHover = useCallback(() => {
    sounds.buttonHover();
  }, [sounds]);

  return {
    onClick: handleClick,
    onMouseEnter: handleHover
  };
};

// Epic Card Sound Hook
export const useEpicCard = (onHover, soundType = 'cardHover') => {
  const { sounds } = useEpicSounds();

  const handleHover = useCallback((event) => {
    // Play sound effect
    if (sounds[soundType]) {
      sounds[soundType]();
    }
    
    // Call original onHover if provided
    if (onHover) {
      onHover(event);
    }
  }, [onHover, sounds, soundType]);

  return {
    onMouseEnter: handleHover
  };
};

// Epic Level System Hook
export const useEpicLevelSounds = () => {
  const { sounds } = useEpicSounds();

  const playLevelUp = useCallback(() => {
    sounds.levelUp();
    // Add a slight delay for epic success sound
    setTimeout(() => {
      sounds.epicSuccess();
    }, 800);
  }, [sounds]);

  const playXPGain = useCallback((amount) => {
    sounds.xpGain();
    
    // Play additional effects for large XP gains
    if (amount >= 100) {
      setTimeout(() => {
        sounds.powerUp();
      }, 300);
    }
  }, [sounds]);

  const playQuestComplete = useCallback(() => {
    sounds.questComplete();
    setTimeout(() => {
      sounds.achievement();
    }, 600);
  }, [sounds]);

  return {
    playLevelUp,
    playXPGain,
    playQuestComplete
  };
};

// Epic Notification Hook
export const useEpicNotifications = () => {
  const { sounds } = useEpicSounds();

  const playNotification = useCallback((type = 'notification') => {
    switch (type) {
      case 'success':
        sounds.achievement();
        break;
      case 'warning':
        sounds.warning();
        break;
      case 'error':
        sounds.error();
        break;
      case 'magic':
        sounds.magicSparkle();
        break;
      default:
        sounds.notification();
    }
  }, [sounds]);

  return {
    playNotification
  };
};

// Epic Ambient Hook
export const useEpicAmbient = () => {
  const { sounds, isEnabled } = useEpicSounds();
  const [isPlaying, setIsPlaying] = useState(false);

  const startAmbient = useCallback(() => {
    if (isEnabled && !isPlaying) {
      sounds.backgroundHum();
      setIsPlaying(true);
    }
  }, [sounds, isEnabled, isPlaying]);

  const stopAmbient = useCallback(() => {
    setIsPlaying(false);
    // Note: You'd need to implement stop functionality in soundManager
  }, []);

  const playMagicSparkle = useCallback(() => {
    sounds.magicSparkle();
  }, [sounds]);

  return {
    startAmbient,
    stopAmbient,
    playMagicSparkle,
    isPlaying
  };
};

export default useEpicSounds;
