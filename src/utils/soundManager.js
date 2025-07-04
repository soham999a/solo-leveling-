// ===== EPIC SOUND SYSTEM FOR SOLO LEVELING APP =====

class SoundManager {
  constructor() {
    this.sounds = {};
    this.isEnabled = true;
    this.volume = 0.7;
    this.audioContext = null;
    this.masterGain = null;
    
    // Initialize Web Audio API
    this.initializeAudioContext();
    
    // Load all epic sounds
    this.loadSounds();
  }

  initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = this.volume;
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  // Epic sound library with Solo Leveling vibes
  loadSounds() {
    const soundUrls = {
      // UI Interactions
      buttonHover: this.createTone(800, 0.1, 'sine'),
      buttonClick: this.createTone(600, 0.15, 'square'),
      cardHover: this.createTone(400, 0.08, 'triangle'),
      
      // Level System
      levelUp: this.createEpicLevelUpSound(),
      xpGain: this.createXPGainSound(),
      questComplete: this.createQuestCompleteSound(),
      
      // Epic Moments
      epicSuccess: this.createEpicSuccessSound(),
      powerUp: this.createPowerUpSound(),
      achievement: this.createAchievementSound(),
      
      // Ambient
      backgroundHum: this.createAmbientHum(),
      magicSparkle: this.createMagicSparkle(),
      
      // Notifications
      notification: this.createNotificationSound(),
      warning: this.createWarningSound(),
      error: this.createErrorSound(),
    };

    this.sounds = soundUrls;
  }

  // Create epic synthesized sounds
  createTone(frequency, duration, type = 'sine') {
    return () => {
      if (!this.audioContext || !this.isEnabled) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.masterGain);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    };
  }

  createEpicLevelUpSound() {
    return () => {
      if (!this.audioContext || !this.isEnabled) return;
      
      // Epic ascending chord progression
      const frequencies = [261.63, 329.63, 392.00, 523.25]; // C-E-G-C
      const duration = 1.5;
      
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          const oscillator = this.audioContext.createOscillator();
          const gainNode = this.audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(this.masterGain);
          
          oscillator.frequency.value = freq;
          oscillator.type = 'triangle';
          
          gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.4, this.audioContext.currentTime + 0.1);
          gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8);
          
          oscillator.start(this.audioContext.currentTime);
          oscillator.stop(this.audioContext.currentTime + 0.8);
        }, index * 200);
      });
    };
  }

  createXPGainSound() {
    return () => {
      if (!this.audioContext || !this.isEnabled) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.masterGain);
      
      oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
      oscillator.frequency.linearRampToValueAtTime(800, this.audioContext.currentTime + 0.3);
      oscillator.type = 'sawtooth';
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.3);
    };
  }

  createQuestCompleteSound() {
    return () => {
      if (!this.audioContext || !this.isEnabled) return;
      
      // Victory fanfare
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C-E-G-C (higher octave)
      
      notes.forEach((freq, index) => {
        setTimeout(() => {
          const oscillator = this.audioContext.createOscillator();
          const gainNode = this.audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(this.masterGain);
          
          oscillator.frequency.value = freq;
          oscillator.type = 'square';
          
          gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.05);
          gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
          
          oscillator.start(this.audioContext.currentTime);
          oscillator.stop(this.audioContext.currentTime + 0.4);
        }, index * 100);
      });
    };
  }

  createEpicSuccessSound() {
    return () => {
      if (!this.audioContext || !this.isEnabled) return;
      
      // Epic power chord
      const frequencies = [130.81, 164.81, 196.00]; // C-E-G (lower octave)
      
      frequencies.forEach(freq => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator.frequency.value = freq;
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.4, this.audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.2);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 1.2);
      });
    };
  }

  createPowerUpSound() {
    return () => {
      if (!this.audioContext || !this.isEnabled) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.masterGain);
      
      oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.6);
      oscillator.type = 'triangle';
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.6);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.6);
    };
  }

  createAchievementSound() {
    return () => {
      if (!this.audioContext || !this.isEnabled) return;
      
      // Magical achievement sound
      const frequencies = [659.25, 783.99, 987.77, 1318.51]; // E-G-B-E
      
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          const oscillator = this.audioContext.createOscillator();
          const gainNode = this.audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(this.masterGain);
          
          oscillator.frequency.value = freq;
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.25, this.audioContext.currentTime + 0.05);
          gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
          
          oscillator.start(this.audioContext.currentTime);
          oscillator.stop(this.audioContext.currentTime + 0.5);
        }, index * 150);
      });
    };
  }

  createAmbientHum() {
    return () => {
      if (!this.audioContext || !this.isEnabled) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.masterGain);
      
      oscillator.frequency.value = 60; // Deep bass hum
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 2);
      
      oscillator.start(this.audioContext.currentTime);
      // This will run continuously - stop manually when needed
    };
  }

  createMagicSparkle() {
    return () => {
      if (!this.audioContext || !this.isEnabled) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.masterGain);
      
      oscillator.frequency.setValueAtTime(2000, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(4000, this.audioContext.currentTime + 0.1);
      oscillator.frequency.exponentialRampToValueAtTime(1000, this.audioContext.currentTime + 0.3);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.3);
    };
  }

  createNotificationSound() {
    return () => {
      if (!this.audioContext || !this.isEnabled) return;
      
      const frequencies = [800, 1000];
      
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          const oscillator = this.audioContext.createOscillator();
          const gainNode = this.audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(this.masterGain);
          
          oscillator.frequency.value = freq;
          oscillator.type = 'triangle';
          
          gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.05);
          gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
          
          oscillator.start(this.audioContext.currentTime);
          oscillator.stop(this.audioContext.currentTime + 0.3);
        }, index * 200);
      });
    };
  }

  createWarningSound() {
    return () => {
      if (!this.audioContext || !this.isEnabled) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.masterGain);
      
      oscillator.frequency.value = 440;
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.2);
      gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.3);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.5);
    };
  }

  createErrorSound() {
    return () => {
      if (!this.audioContext || !this.isEnabled) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.masterGain);
      
      oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
      oscillator.frequency.linearRampToValueAtTime(200, this.audioContext.currentTime + 0.4);
      oscillator.type = 'sawtooth';
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.4, this.audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.4);
    };
  }

  // Public methods
  play(soundName) {
    if (this.sounds[soundName] && this.isEnabled) {
      try {
        this.sounds[soundName]();
      } catch (error) {
        console.warn(`Failed to play sound: ${soundName}`, error);
      }
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.masterGain) {
      this.masterGain.gain.value = this.volume;
    }
  }

  toggle() {
    this.isEnabled = !this.isEnabled;
    return this.isEnabled;
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }
}

// Create global sound manager instance
const soundManager = new SoundManager();

export default soundManager;
