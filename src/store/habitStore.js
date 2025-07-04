import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  createHabit,
  getUserHabits,
  updateHabit,
  completeHabit
} from '../services/firebase';
import soundManager from '../utils/soundManager';

const useHabitStore = create(
  persist(
    (set, get) => ({
      // State
      habits: [],
      completions: {},
      streaks: {},
      isLoading: false,
      error: null,
      selectedDate: new Date().toISOString().split('T')[0],

      // Actions
      setHabits: (habits) => set({ habits }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      setSelectedDate: (date) => set({ selectedDate: date }),

      // Load user habits
      loadHabits: async (userId) => {
        if (!userId) return;
        
        set({ isLoading: true, error: null });
        const { data: habits, error } = await getUserHabits(userId);
        
        if (error) {
          set({ error, isLoading: false });
          return { success: false, error };
        }
        
        // Calculate streaks and completions
        const completions = {};
        const streaks = {};
        
        habits.forEach(habit => {
          completions[habit.id] = habit.completions || [];
          streaks[habit.id] = calculateStreak(habit.completions || []);
        });
        
        set({ 
          habits, 
          completions, 
          streaks, 
          isLoading: false 
        });
        
        return { success: true, habits };
      },

      // Create new habit
      createHabit: async (userId, habitData) => {
        set({ isLoading: true, error: null });
        
        const newHabit = {
          name: habitData.name,
          description: habitData.description || '',
          category: habitData.category || 'general',
          xpValue: habitData.xpValue || 10,
          icon: habitData.icon || '⭐',
          color: habitData.color || '#0ea5e9',
          frequency: habitData.frequency || 'daily',
          isActive: true,
          completions: []
        };
        
        const { id, error } = await createHabit(userId, newHabit);
        
        if (error) {
          set({ error, isLoading: false });
          return { success: false, error };
        }
        
        const habitWithId = { ...newHabit, id };
        const { habits, completions, streaks } = get();
        
        set({ 
          habits: [...habits, habitWithId],
          completions: { ...completions, [id]: [] },
          streaks: { ...streaks, [id]: 0 },
          isLoading: false 
        });
        
        return { success: true, habit: habitWithId };
      },

      // Update habit
      updateHabit: async (habitId, updates) => {
        set({ isLoading: true, error: null });
        
        const { error } = await updateHabit(habitId, updates);
        
        if (error) {
          set({ error, isLoading: false });
          return { success: false, error };
        }
        
        const { habits } = get();
        const updatedHabits = habits.map(habit => 
          habit.id === habitId ? { ...habit, ...updates } : habit
        );
        
        set({ habits: updatedHabits, isLoading: false });
        
        return { success: true };
      },

      // Complete habit
      completeHabit: async (userId, habitId) => {
        const { habits, completions, streaks } = get();
        const habit = habits.find(h => h.id === habitId);
        
        if (!habit) {
          set({ error: 'Habit not found' });
          return { success: false, error: 'Habit not found' };
        }
        
        const today = new Date().toISOString().split('T')[0];
        const todayCompletions = completions[habitId] || [];
        
        // Check if already completed today
        if (todayCompletions.includes(today)) {
          set({ error: 'Habit already completed today' });
          return { success: false, error: 'Habit already completed today' };
        }
        
        set({ isLoading: true, error: null });
        
        // Complete habit in Firebase
        const { error, newLevel, currentLevelXP, totalXP, leveledUp } = await completeHabit(
          userId, 
          habitId, 
          habit.xpValue
        );
        
        if (error) {
          set({ error, isLoading: false });
          return { success: false, error };
        }
        
        // Update local state
        const newCompletions = [...todayCompletions, today];
        const newStreak = calculateStreak(newCompletions);
        
        set({
          completions: {
            ...completions,
            [habitId]: newCompletions
          },
          streaks: {
            ...streaks,
            [habitId]: newStreak
          },
          isLoading: false
        });

        // 🎵 EPIC QUEST COMPLETION SOUNDS! 🎵
        soundManager.play('questComplete');

        // Special effects for streaks
        if (newStreak >= 7) {
          setTimeout(() => {
            soundManager.play('achievement');
          }, 600);
        }

        if (newStreak >= 30) {
          setTimeout(() => {
            soundManager.play('epicSuccess');
          }, 1200);
        }

        return {
          success: true,
          xpGained: habit.xpValue,
          newLevel,
          currentLevelXP,
          totalXP,
          leveledUp,
          newStreak
        };
      },

      // Get habit completion status for a date
      isHabitCompleted: (habitId, date) => {
        const { completions } = get();
        const habitCompletions = completions[habitId] || [];
        return habitCompletions.includes(date);
      },

      // Get habits for today
      getTodaysHabits: () => {
        const { habits, selectedDate } = get();
        return habits.filter(habit => habit.isActive);
      },

      // Get completed habits for today
      getTodaysCompletedHabits: () => {
        const { habits, completions, selectedDate } = get();
        return habits.filter(habit => {
          const habitCompletions = completions[habit.id] || [];
          return habitCompletions.includes(selectedDate);
        });
      },

      // Get habit statistics
      getHabitStats: (habitId) => {
        const { completions, streaks } = get();
        const habitCompletions = completions[habitId] || [];
        const currentStreak = streaks[habitId] || 0;
        
        // Calculate completion rate for last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const last30Days = [];
        for (let i = 0; i < 30; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          last30Days.push(date.toISOString().split('T')[0]);
        }
        
        const completedInLast30Days = habitCompletions.filter(date => 
          last30Days.includes(date)
        ).length;
        
        const completionRate = Math.round((completedInLast30Days / 30) * 100);
        
        return {
          totalCompletions: habitCompletions.length,
          currentStreak,
          completionRate,
          last30DaysCompletions: completedInLast30Days
        };
      },

      // Clear error
      clearError: () => set({ error: null })
    }),
    {
      name: 'habit-storage',
      partialize: (state) => ({ 
        habits: state.habits,
        completions: state.completions,
        streaks: state.streaks
      }),
    }
  )
);

// Helper function to calculate streak
function calculateStreak(completions) {
  if (!completions || completions.length === 0) return 0;
  
  const sortedDates = completions.sort((a, b) => new Date(b) - new Date(a));
  const today = new Date().toISOString().split('T')[0];
  
  let streak = 0;
  let currentDate = new Date();
  
  for (let i = 0; i < sortedDates.length; i++) {
    const completionDate = sortedDates[i];
    const expectedDate = currentDate.toISOString().split('T')[0];
    
    if (completionDate === expectedDate) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}

export default useHabitStore;
