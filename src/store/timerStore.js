import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTimerStore = create(
  persist(
    (set, get) => ({
      // State
      timeRemaining: 25 * 60, // 25 minutes in seconds
      isRunning: false,
      isPaused: false,
      currentSession: 'work', // 'work', 'shortBreak', 'longBreak'
      sessionCount: 0,
      totalSessions: 0,
      totalFocusTime: 0, // in seconds
      intervalId: null,
      
      // Timer settings
      workDuration: 25 * 60, // 25 minutes
      shortBreakDuration: 5 * 60, // 5 minutes
      longBreakDuration: 15 * 60, // 15 minutes
      sessionsUntilLongBreak: 4,
      
      // Audio settings
      soundEnabled: true,
      notificationsEnabled: true,
      
      // XP rewards
      workSessionXP: 25,
      breakSessionXP: 5,

      // Actions
      setTimeRemaining: (time) => set({ timeRemaining: time }),
      
      setIsRunning: (isRunning) => set({ isRunning }),
      
      setIsPaused: (isPaused) => set({ isPaused }),
      
      setCurrentSession: (session) => set({ currentSession: session }),

      // Start timer
      startTimer: () => {
        const { timeRemaining, intervalId } = get();
        
        if (intervalId) {
          clearInterval(intervalId);
        }
        
        const newIntervalId = setInterval(() => {
          const { timeRemaining: currentTime } = get();
          
          if (currentTime <= 0) {
            get().completeSession();
          } else {
            set({ timeRemaining: currentTime - 1 });
          }
        }, 1000);
        
        set({ 
          isRunning: true, 
          isPaused: false,
          intervalId: newIntervalId 
        });
      },

      // Pause timer
      pauseTimer: () => {
        const { intervalId } = get();
        
        if (intervalId) {
          clearInterval(intervalId);
        }
        
        set({ 
          isRunning: false, 
          isPaused: true,
          intervalId: null 
        });
      },

      // Resume timer
      resumeTimer: () => {
        get().startTimer();
      },

      // Stop timer
      stopTimer: () => {
        const { intervalId } = get();
        
        if (intervalId) {
          clearInterval(intervalId);
        }
        
        const { currentSession, workDuration, shortBreakDuration, longBreakDuration } = get();
        let resetTime;
        
        switch (currentSession) {
          case 'work':
            resetTime = workDuration;
            break;
          case 'shortBreak':
            resetTime = shortBreakDuration;
            break;
          case 'longBreak':
            resetTime = longBreakDuration;
            break;
          default:
            resetTime = workDuration;
        }
        
        set({ 
          isRunning: false, 
          isPaused: false,
          timeRemaining: resetTime,
          intervalId: null 
        });
      },

      // Reset timer
      resetTimer: () => {
        const { intervalId } = get();
        
        if (intervalId) {
          clearInterval(intervalId);
        }
        
        set({ 
          timeRemaining: 25 * 60,
          isRunning: false,
          isPaused: false,
          currentSession: 'work',
          sessionCount: 0,
          intervalId: null 
        });
      },

      // Complete current session
      completeSession: () => {
        const { 
          currentSession, 
          sessionCount, 
          totalSessions,
          totalFocusTime,
          workDuration,
          shortBreakDuration,
          longBreakDuration,
          sessionsUntilLongBreak,
          workSessionXP,
          breakSessionXP,
          soundEnabled,
          notificationsEnabled,
          intervalId
        } = get();
        
        // Clear interval
        if (intervalId) {
          clearInterval(intervalId);
        }
        
        // Play completion sound
        if (soundEnabled) {
          get().playCompletionSound();
        }
        
        // Show notification
        if (notificationsEnabled) {
          get().showNotification();
        }
        
        let nextSession;
        let nextDuration;
        let newSessionCount = sessionCount;
        let xpGained = 0;
        let focusTimeAdded = 0;
        
        if (currentSession === 'work') {
          newSessionCount += 1;
          xpGained = workSessionXP;
          focusTimeAdded = workDuration;
          
          // Determine next session type
          if (newSessionCount % sessionsUntilLongBreak === 0) {
            nextSession = 'longBreak';
            nextDuration = longBreakDuration;
          } else {
            nextSession = 'shortBreak';
            nextDuration = shortBreakDuration;
          }
        } else {
          // Break session completed
          nextSession = 'work';
          nextDuration = workDuration;
          xpGained = breakSessionXP;
        }
        
        set({
          currentSession: nextSession,
          timeRemaining: nextDuration,
          sessionCount: newSessionCount,
          totalSessions: totalSessions + 1,
          totalFocusTime: totalFocusTime + focusTimeAdded,
          isRunning: false,
          isPaused: false,
          intervalId: null
        });
        
        return {
          sessionCompleted: currentSession,
          nextSession,
          xpGained,
          sessionCount: newSessionCount
        };
      },

      // Switch session type manually
      switchSession: (sessionType) => {
        const { workDuration, shortBreakDuration, longBreakDuration } = get();
        let duration;
        
        switch (sessionType) {
          case 'work':
            duration = workDuration;
            break;
          case 'shortBreak':
            duration = shortBreakDuration;
            break;
          case 'longBreak':
            duration = longBreakDuration;
            break;
          default:
            duration = workDuration;
        }
        
        get().stopTimer();
        
        set({
          currentSession: sessionType,
          timeRemaining: duration
        });
      },

      // Update timer settings
      updateSettings: (settings) => {
        const { 
          workDuration: newWorkDuration,
          shortBreakDuration: newShortBreakDuration,
          longBreakDuration: newLongBreakDuration,
          ...otherSettings 
        } = settings;
        
        const updates = { ...otherSettings };
        
        if (newWorkDuration) {
          updates.workDuration = newWorkDuration * 60;
        }
        if (newShortBreakDuration) {
          updates.shortBreakDuration = newShortBreakDuration * 60;
        }
        if (newLongBreakDuration) {
          updates.longBreakDuration = newLongBreakDuration * 60;
        }
        
        set(updates);
        
        // Reset current timer if not running
        const { isRunning, currentSession } = get();
        if (!isRunning) {
          const { workDuration, shortBreakDuration, longBreakDuration } = get();
          let resetTime;
          
          switch (currentSession) {
            case 'work':
              resetTime = workDuration;
              break;
            case 'shortBreak':
              resetTime = shortBreakDuration;
              break;
            case 'longBreak':
              resetTime = longBreakDuration;
              break;
            default:
              resetTime = workDuration;
          }
          
          set({ timeRemaining: resetTime });
        }
      },

      // Format time for display
      formatTime: (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      },

      // Get current time formatted
      getCurrentTimeFormatted: () => {
        const { timeRemaining } = get();
        return get().formatTime(timeRemaining);
      },

      // Get session progress percentage
      getSessionProgress: () => {
        const { timeRemaining, currentSession, workDuration, shortBreakDuration, longBreakDuration } = get();
        let totalDuration;
        
        switch (currentSession) {
          case 'work':
            totalDuration = workDuration;
            break;
          case 'shortBreak':
            totalDuration = shortBreakDuration;
            break;
          case 'longBreak':
            totalDuration = longBreakDuration;
            break;
          default:
            totalDuration = workDuration;
        }
        
        const elapsed = totalDuration - timeRemaining;
        return (elapsed / totalDuration) * 100;
      },

      // Play completion sound
      playCompletionSound: () => {
        try {
          const audio = new Audio('/notification.mp3');
          audio.play().catch(() => {
            // Fallback to system beep or silent fail
            console.log('Could not play notification sound');
          });
        } catch (error) {
          console.log('Audio not supported');
        }
      },

      // Show browser notification
      showNotification: () => {
        const { currentSession } = get();
        
        if ('Notification' in window && Notification.permission === 'granted') {
          const title = currentSession === 'work' ? 'Work Session Complete!' : 'Break Time Over!';
          const body = currentSession === 'work' 
            ? 'Great job! Time for a break.' 
            : 'Break time is over. Ready to focus?';
          
          new Notification(title, {
            body,
            icon: '/favicon.ico',
            badge: '/favicon.ico'
          });
        }
      },

      // Request notification permission
      requestNotificationPermission: async () => {
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          set({ notificationsEnabled: permission === 'granted' });
          return permission === 'granted';
        }
        return false;
      },

      // Get timer statistics
      getTimerStats: () => {
        const { totalSessions, totalFocusTime, sessionCount } = get();
        
        return {
          totalSessions,
          totalFocusTime,
          currentSessionCount: sessionCount,
          totalFocusHours: Math.floor(totalFocusTime / 3600),
          totalFocusMinutes: Math.floor((totalFocusTime % 3600) / 60)
        };
      },

      // Cleanup on unmount
      cleanup: () => {
        const { intervalId } = get();
        if (intervalId) {
          clearInterval(intervalId);
          set({ intervalId: null });
        }
      }
    }),
    {
      name: 'timer-storage',
      partialize: (state) => ({
        sessionCount: state.sessionCount,
        totalSessions: state.totalSessions,
        totalFocusTime: state.totalFocusTime,
        workDuration: state.workDuration,
        shortBreakDuration: state.shortBreakDuration,
        longBreakDuration: state.longBreakDuration,
        sessionsUntilLongBreak: state.sessionsUntilLongBreak,
        soundEnabled: state.soundEnabled,
        notificationsEnabled: state.notificationsEnabled,
        workSessionXP: state.workSessionXP,
        breakSessionXP: state.breakSessionXP
      }),
    }
  )
);

export default useTimerStore;
