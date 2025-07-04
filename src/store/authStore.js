import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  auth,
  onAuthStateChanged,
  signInWithGoogle as firebaseSignInWithGoogle,
  handleRedirectResult,
  signInWithEmail as firebaseSignInWithEmail,
  signUpWithEmail as firebaseSignUpWithEmail,
  logOut as firebaseLogOut,
  getUserProfile,
  updateUserProfile,
  createUserProfile
} from '../services/firebase';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      profile: null,
      isLoading: true,
      isAuthenticated: false,
      error: null,

      // Actions
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        isLoading: false 
      }),

      setProfile: (profile) => set({ profile }),

      setError: (error) => set({ error }),

      setLoading: (isLoading) => set({ isLoading }),

      // Initialize auth listener
      initializeAuth: () => {
        return onAuthStateChanged(auth, async (user) => {
          if (user) {
            // User is signed in
            const { data: profile, error } = await getUserProfile(user.uid);
            
            if (profile) {
              set({ 
                user, 
                profile, 
                isAuthenticated: true, 
                isLoading: false,
                error: null 
              });
            } else {
              // Create initial profile if it doesn't exist
              const initialProfile = {
                email: user.email,
                displayName: user.displayName || 'New Hunter',
                level: 1,
                xp: 0,
                totalXP: 0
              };

              await createUserProfile(user.uid, initialProfile);
              set({ 
                user, 
                profile: initialProfile, 
                isAuthenticated: true, 
                isLoading: false,
                error: null 
              });
            }
          } else {
            // User is signed out
            set({ 
              user: null, 
              profile: null, 
              isAuthenticated: false, 
              isLoading: false,
              error: null 
            });
          }
        });
      },

      // Sign in with Google
      signInWithGoogle: async () => {
        set({ isLoading: true, error: null });
        const { user, error, redirecting } = await firebaseSignInWithGoogle();

        if (redirecting) {
          // User is being redirected, keep loading state
          return { success: false, redirecting: true };
        }

        if (error) {
          set({ error, isLoading: false });
          return { success: false, error };
        }

        return { success: true, user };
      },

      // Handle redirect result (call this on app initialization)
      handleRedirectResult: async () => {
        const { user, error } = await handleRedirectResult();
        if (user) {
          // User signed in via redirect
          return { success: true, user };
        }
        if (error) {
          set({ error });
          return { success: false, error };
        }
        return { success: false };
      },

      // Sign in with email
      signInWithEmail: async (email, password) => {
        set({ isLoading: true, error: null });
        const { user, error } = await firebaseSignInWithEmail(email, password);

        if (error) {
          set({ error, isLoading: false });
          return { success: false, error };
        }

        return { success: true, user };
      },

      // Sign up with email
      signUpWithEmail: async (email, password, displayName) => {
        set({ isLoading: true, error: null });
        const { user, error } = await firebaseSignUpWithEmail(email, password, displayName);

        if (error) {
          set({ error, isLoading: false });
          return { success: false, error };
        }

        return { success: true, user };
      },

      // Sign out
      signOut: async () => {
        set({ isLoading: true });
        const { error } = await firebaseLogOut();
        
        if (error) {
          set({ error, isLoading: false });
          return { success: false, error };
        }
        
        set({ 
          user: null, 
          profile: null, 
          isAuthenticated: false, 
          isLoading: false,
          error: null 
        });
        
        return { success: true };
      },

      // Update profile
      updateProfile: async (updates) => {
        const { user, profile } = get();
        if (!user) return { success: false, error: 'No user logged in' };

        set({ isLoading: true });
        const { error } = await updateUserProfile(user.uid, updates);
        
        if (error) {
          set({ error, isLoading: false });
          return { success: false, error };
        }
        
        const updatedProfile = { ...profile, ...updates };
        set({ profile: updatedProfile, isLoading: false });
        
        return { success: true, profile: updatedProfile };
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Get current user data
      getCurrentUser: () => {
        const { user, profile, isAuthenticated } = get();
        return { user, profile, isAuthenticated };
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

export default useAuthStore;
