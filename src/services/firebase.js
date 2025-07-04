// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, addDoc, query, where, orderBy, getDocs, serverTimestamp } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Google Auth Provider with proper configuration
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Add scopes for better user info
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Auth functions
export const signInWithGoogle = async () => {
  try {
    // Try popup first, fallback to redirect if needed
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error) {
    console.warn('Google sign-in error:', error.code, error.message);

    // If popup is blocked, try redirect method
    if (error.code === 'auth/popup-blocked') {
      try {
        await signInWithRedirect(auth, googleProvider);
        return { user: null, error: null, redirecting: true };
      } catch (redirectError) {
        console.warn('Redirect sign-in also failed:', redirectError.message);
      }
    }

    // Provide user-friendly error message
    let userMessage = 'Failed to sign in with Google. ';
    if (error.code === 'auth/popup-blocked') {
      userMessage += 'Please allow popups for this site or try refreshing.';
    } else if (error.code === 'auth/popup-closed-by-user') {
      userMessage += 'Sign-in was cancelled.';
    } else if (error.code === 'auth/network-request-failed') {
      userMessage += 'Network error. Please check your connection.';
    } else if (error.code === 'auth/unauthorized-domain') {
      userMessage += 'This domain is not authorized for Google sign-in. Please try email sign-in.';
    } else if (error.message && error.message.includes('unauthorized_domain')) {
      userMessage += 'This domain is not authorized for Google sign-in. Please try email sign-in.';
    } else {
      userMessage += 'Please try again or use email sign-in.';
    }
    return { user: null, error: userMessage };
  }
};

// Handle redirect result
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      return { user: result.user, error: null };
    }
    return { user: null, error: null };
  } catch (error) {
    console.warn('Redirect result error:', error.message);
    return { user: null, error: error.message };
  }
};

export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const signUpWithEmail = async (email, password, displayName) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user profile in Firestore
    await createUserProfile(result.user.uid, {
      email: result.user.email,
      displayName: displayName || result.user.displayName,
      level: 1,
      xp: 0,
      totalXP: 0,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    });
    
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// User Profile functions
export const createUserProfile = async (userId, profileData) => {
  try {
    await setDoc(doc(db, 'users', userId), profileData);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const getUserProfile = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { data: docSnap.data(), error: null };
    } else {
      return { data: null, error: 'User profile not found' };
    }
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Habit functions
export const createHabit = async (userId, habitData) => {
  try {
    const docRef = await addDoc(collection(db, 'habits'), {
      userId,
      ...habitData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

export const getUserHabits = async (userId) => {
  try {
    const q = query(
      collection(db, 'habits'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const habits = [];
    querySnapshot.forEach((doc) => {
      habits.push({ id: doc.id, ...doc.data() });
    });
    return { data: habits, error: null };
  } catch (error) {
    return { data: [], error: error.message };
  }
};

export const updateHabit = async (habitId, updates) => {
  try {
    const docRef = doc(db, 'habits', habitId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Habit completion functions
export const completeHabit = async (userId, habitId, xpGained) => {
  try {
    // Add completion record
    await addDoc(collection(db, 'habitCompletions'), {
      userId,
      habitId,
      xpGained,
      completedAt: serverTimestamp()
    });
    
    // Update user XP
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const currentData = userDoc.data();
      const newTotalXP = (currentData.totalXP || 0) + xpGained;
      const newLevel = Math.floor(newTotalXP / 100) + 1; // 100 XP per level
      const currentLevelXP = newTotalXP % 100;
      
      await updateDoc(userRef, {
        xp: currentLevelXP,
        totalXP: newTotalXP,
        level: newLevel,
        updatedAt: serverTimestamp()
      });
      
      return { 
        newLevel, 
        currentLevelXP, 
        totalXP: newTotalXP, 
        leveledUp: newLevel > (currentData.level || 1),
        error: null 
      };
    }
    
    return { error: 'User not found' };
  } catch (error) {
    return { error: error.message };
  }
};

// Knowledge/Episode tracking functions
export const markEpisodeWatched = async (userId, episodeData) => {
  try {
    const docRef = await addDoc(collection(db, 'watchedEpisodes'), {
      userId,
      ...episodeData,
      watchedAt: serverTimestamp()
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

export const getUserWatchedEpisodes = async (userId) => {
  try {
    const q = query(
      collection(db, 'watchedEpisodes'),
      where('userId', '==', userId),
      orderBy('watchedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const episodes = [];
    querySnapshot.forEach((doc) => {
      episodes.push({ id: doc.id, ...doc.data() });
    });
    return { data: episodes, error: null };
  } catch (error) {
    return { data: [], error: error.message };
  }
};

export const updateKnowledgeXP = async (userId, knowledgeXP, knowledgeLevel) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      knowledgeXP,
      knowledgeLevel,
      updatedAt: serverTimestamp()
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Export auth and db for direct use
export { auth, db, onAuthStateChanged };
