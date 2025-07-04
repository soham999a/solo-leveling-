// 🌍 REAL-WORLD INTEGRATION SYSTEM 🌍
// Connect productivity with smart devices, IoT, and real-world systems

class RealWorldIntegrationService {
  constructor() {
    this.connectedDevices = new Map();
    this.integrations = new Map();
    this.isSupported = this.checkBrowserSupport();
  }

  // 🔍 Check Browser Support
  checkBrowserSupport() {
    return {
      geolocation: 'geolocation' in navigator,
      notifications: 'Notification' in window,
      bluetooth: 'bluetooth' in navigator,
      usb: 'usb' in navigator,
      vibration: 'vibrate' in navigator,
      battery: 'getBattery' in navigator,
      deviceOrientation: 'DeviceOrientationEvent' in window,
      ambientLight: 'AmbientLightSensor' in window,
      accelerometer: 'Accelerometer' in window
    };
  }

  // 📱 SMART PHONE INTEGRATION
  async initializePhoneIntegration() {
    try {
      // Request notification permission
      if (this.isSupported.notifications) {
        const permission = await Notification.requestPermission();
        console.log('Notification permission:', permission);
      }

      // Initialize device sensors
      if (this.isSupported.deviceOrientation) {
        this.initializeMotionSensors();
      }

      // Initialize battery monitoring
      if (this.isSupported.battery) {
        this.initializeBatteryMonitoring();
      }

      return { success: true, message: 'Phone integration initialized' };
    } catch (error) {
      console.error('Phone integration error:', error);
      return { success: false, error: error.message };
    }
  }

  // 🏃 Motion & Activity Tracking
  initializeMotionSensors() {
    if (this.isSupported.deviceOrientation) {
      window.addEventListener('devicemotion', (event) => {
        const acceleration = event.acceleration;
        if (acceleration) {
          this.processMotionData({
            x: acceleration.x,
            y: acceleration.y,
            z: acceleration.z,
            timestamp: Date.now()
          });
        }
      });
    }

    // Step counting simulation
    this.stepCount = 0;
    this.lastMotionTime = 0;
  }

  processMotionData(motion) {
    const totalAcceleration = Math.sqrt(
      motion.x * motion.x + 
      motion.y * motion.y + 
      motion.z * motion.z
    );

    // Simple step detection
    if (totalAcceleration > 15 && Date.now() - this.lastMotionTime > 500) {
      this.stepCount++;
      this.lastMotionTime = Date.now();
      
      // Trigger step-based habits
      this.triggerStepBasedHabits(this.stepCount);
    }
  }

  triggerStepBasedHabits(steps) {
    // Check for step-based habit completions
    const stepMilestones = [1000, 5000, 10000, 15000];
    
    stepMilestones.forEach(milestone => {
      if (steps >= milestone && !this.achievedMilestone(milestone)) {
        this.sendNotification(`🚶 ${milestone} steps achieved!`, 'Keep moving, you\'re doing great!');
        this.markMilestoneAchieved(milestone);
      }
    });
  }

  // 🔋 Battery Monitoring
  async initializeBatteryMonitoring() {
    try {
      const battery = await navigator.getBattery();
      
      battery.addEventListener('levelchange', () => {
        this.handleBatteryChange(battery.level);
      });

      battery.addEventListener('chargingchange', () => {
        this.handleChargingChange(battery.charging);
      });

    } catch (error) {
      console.error('Battery monitoring error:', error);
    }
  }

  handleBatteryChange(level) {
    // Suggest productivity habits based on battery level
    if (level < 0.2) {
      this.sendNotification('🔋 Low Battery', 'Perfect time for a break or offline habit!');
    } else if (level > 0.8) {
      this.sendNotification('⚡ Fully Charged', 'Ready for high-energy productivity tasks!');
    }
  }

  handleChargingChange(isCharging) {
    if (isCharging) {
      this.sendNotification('🔌 Charging', 'Great time for focused work while your device charges!');
    }
  }

  // 📍 LOCATION-BASED HABITS
  async initializeLocationTracking() {
    if (!this.isSupported.geolocation) {
      return { success: false, error: 'Geolocation not supported' };
    }

    try {
      const position = await this.getCurrentPosition();
      this.currentLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      // Watch for location changes
      this.watchId = navigator.geolocation.watchPosition(
        (position) => this.handleLocationChange(position),
        (error) => console.error('Location error:', error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );

      return { success: true, location: this.currentLocation };
    } catch (error) {
      console.error('Location tracking error:', error);
      return { success: false, error: error.message };
    }
  }

  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

  handleLocationChange(position) {
    const newLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };

    // Check for location-based habit triggers
    this.checkLocationBasedHabits(newLocation);
    this.currentLocation = newLocation;
  }

  checkLocationBasedHabits(location) {
    // Predefined locations (user can customize these)
    const locations = {
      gym: { lat: 40.7128, lng: -74.0060, radius: 100 }, // Example coordinates
      office: { lat: 40.7589, lng: -73.9851, radius: 50 },
      home: { lat: 40.7505, lng: -73.9934, radius: 30 }
    };

    Object.entries(locations).forEach(([name, loc]) => {
      const distance = this.calculateDistance(location, loc);
      if (distance <= loc.radius) {
        this.triggerLocationHabit(name);
      }
    });
  }

  calculateDistance(pos1, pos2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = pos1.latitude * Math.PI/180;
    const φ2 = pos2.lat * Math.PI/180;
    const Δφ = (pos2.lat - pos1.latitude) * Math.PI/180;
    const Δλ = (pos2.lng - pos1.longitude) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }

  triggerLocationHabit(locationName) {
    const habitSuggestions = {
      gym: 'Time for your workout! 💪',
      office: 'Start your workday with intention! 📊',
      home: 'Perfect time for relaxation or family time! 🏠'
    };

    const message = habitSuggestions[locationName];
    if (message) {
      this.sendNotification(`📍 At ${locationName}`, message);
    }
  }

  // 🌐 WEB API INTEGRATIONS
  async integrateWithSpotify() {
    // Spotify Web API integration for focus music
    try {
      const clientId = 'your-spotify-client-id';
      const redirectUri = window.location.origin;
      const scopes = 'user-modify-playback-state user-read-playback-state';
      
      const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scopes}`;
      
      return { success: true, authUrl };
    } catch (error) {
      console.error('Spotify integration error:', error);
      return { success: false, error: error.message };
    }
  }

  async playFocusMusic() {
    // Play focus playlist when starting work sessions
    try {
      const token = localStorage.getItem('spotify_token');
      if (!token) {
        throw new Error('Spotify not connected');
      }

      const response = await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          context_uri: 'spotify:playlist:37i9dQZF1DX0XUsuxWHRQd' // Focus playlist
        })
      });

      return { success: response.ok };
    } catch (error) {
      console.error('Music playback error:', error);
      return { success: false, error: error.message };
    }
  }

  // 🏠 SMART HOME INTEGRATION (Simulated)
  async connectSmartHome() {
    // Simulated smart home integration
    const devices = [
      { id: 'lights', name: 'Smart Lights', type: 'lighting' },
      { id: 'thermostat', name: 'Smart Thermostat', type: 'climate' },
      { id: 'speaker', name: 'Smart Speaker', type: 'audio' }
    ];

    devices.forEach(device => {
      this.connectedDevices.set(device.id, device);
    });

    return { success: true, devices };
  }

  async controlSmartLights(mode) {
    // Simulate smart light control
    const modes = {
      focus: { brightness: 100, color: 'cool_white', temperature: 6500 },
      relax: { brightness: 50, color: 'warm_white', temperature: 2700 },
      energize: { brightness: 100, color: 'daylight', temperature: 5000 }
    };

    const settings = modes[mode];
    if (settings) {
      console.log(`Setting lights to ${mode} mode:`, settings);
      this.sendNotification('💡 Smart Lights', `Lights set to ${mode} mode for optimal productivity!`);
      return { success: true, settings };
    }

    return { success: false, error: 'Invalid mode' };
  }

  // 📱 NOTIFICATION SYSTEM
  sendNotification(title, body, options = {}) {
    if (!this.isSupported.notifications || Notification.permission !== 'granted') {
      console.log('Notification:', title, body);
      return;
    }

    const notification = new Notification(title, {
      body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      tag: 'productivity-habit',
      requireInteraction: false,
      ...options
    });

    // Auto-close after 5 seconds
    setTimeout(() => notification.close(), 5000);

    // Vibrate if supported
    if (this.isSupported.vibration) {
      navigator.vibrate([200, 100, 200]);
    }

    return notification;
  }

  // 🎯 HABIT AUTOMATION
  automateHabitTriggers(habits) {
    habits.forEach(habit => {
      if (habit.triggers) {
        habit.triggers.forEach(trigger => {
          this.setupHabitTrigger(habit, trigger);
        });
      }
    });
  }

  setupHabitTrigger(habit, trigger) {
    switch (trigger.type) {
      case 'time':
        this.scheduleTimeBasedHabit(habit, trigger.time);
        break;
      case 'location':
        this.setupLocationBasedHabit(habit, trigger.location);
        break;
      case 'activity':
        this.setupActivityBasedHabit(habit, trigger.activity);
        break;
      case 'device':
        this.setupDeviceBasedHabit(habit, trigger.device);
        break;
    }
  }

  scheduleTimeBasedHabit(habit, time) {
    const now = new Date();
    const [hours, minutes] = time.split(':');
    const scheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    
    if (scheduledTime < now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilTrigger = scheduledTime.getTime() - now.getTime();
    
    setTimeout(() => {
      this.sendNotification(`⏰ ${habit.name}`, `Time for your ${habit.name} habit!`);
    }, timeUntilTrigger);
  }

  // 🔧 UTILITY METHODS
  achievedMilestone(milestone) {
    const achieved = JSON.parse(localStorage.getItem('achieved_milestones') || '[]');
    return achieved.includes(milestone);
  }

  markMilestoneAchieved(milestone) {
    const achieved = JSON.parse(localStorage.getItem('achieved_milestones') || '[]');
    achieved.push(milestone);
    localStorage.setItem('achieved_milestones', JSON.stringify(achieved));
  }

  // 📊 INTEGRATION STATUS
  getIntegrationStatus() {
    return {
      browserSupport: this.isSupported,
      connectedDevices: Array.from(this.connectedDevices.values()),
      activeIntegrations: Array.from(this.integrations.keys()),
      locationTracking: !!this.watchId,
      notificationsEnabled: Notification.permission === 'granted'
    };
  }

  // 🧹 CLEANUP
  cleanup() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  }
}

// Create singleton instance
const realWorldIntegration = new RealWorldIntegrationService();

export default realWorldIntegration;
