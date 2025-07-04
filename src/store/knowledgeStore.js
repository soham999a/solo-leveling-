import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  updateDoc, 
  doc, 
  serverTimestamp,
  getDoc 
} from 'firebase/firestore';
import { db } from '../services/firebase';

// Solo Leveling Episodes Data
const SOLO_LEVELING_EPISODES = [
  // Season 1
  {
    id: 's1e1',
    season: 1,
    episode: 1,
    title: "I'm Used to It",
    description: "Sung Jin-Woo is the weakest of the weak, an E-rank hunter with no money, no talent, and no prospects. When he enters a high-rank dungeon, disaster strikes.",
    duration: 24,
    knowledgePoints: [
      "Understanding weakness and perseverance",
      "The importance of family responsibility",
      "How adversity shapes character"
    ],
    learningObjectives: [
      "Analyze Jin-Woo's initial character traits",
      "Understand the hunter ranking system",
      "Identify themes of sacrifice and determination"
    ],
    streamingLinks: {
      crunchyroll: "https://www.crunchyroll.com/solo-leveling",
      funimation: "https://www.funimation.com/shows/solo-leveling/"
    },
    xpReward: 50
  },
  {
    id: 's1e2',
    season: 1,
    episode: 2,
    title: "If I Don't Do It, Who Will?",
    description: "Jin-Woo awakens in a hospital and discovers that the System has made him a Player. He must now complete daily quests or face severe penalties.",
    duration: 24,
    knowledgePoints: [
      "The concept of systematic self-improvement",
      "Discipline and daily habits",
      "Consequences of choices"
    ],
    learningObjectives: [
      "Understand the System's mechanics",
      "Analyze the importance of daily discipline",
      "Connect to real-world habit formation"
    ],
    streamingLinks: {
      crunchyroll: "https://www.crunchyroll.com/solo-leveling",
      funimation: "https://www.funimation.com/shows/solo-leveling/"
    },
    xpReward: 50
  },
  {
    id: 's1e3',
    season: 1,
    episode: 3,
    title: "It's Like a Game",
    description: "Jin-Woo begins to understand his new abilities and starts training. He discovers that he can level up like in a video game.",
    duration: 24,
    knowledgePoints: [
      "Gamification of personal growth",
      "Progressive skill development",
      "The power of visualization"
    ],
    learningObjectives: [
      "Explore gamification principles",
      "Understand progressive overload in training",
      "Apply gaming concepts to real life"
    ],
    streamingLinks: {
      crunchyroll: "https://www.crunchyroll.com/solo-leveling",
      funimation: "https://www.funimation.com/shows/solo-leveling/"
    },
    xpReward: 50
  },
  {
    id: 's1e4',
    season: 1,
    episode: 4,
    title: "I've Got to Get Stronger",
    description: "Jin-Woo continues his training and faces his first real challenge in a dungeon. He begins to understand the true nature of his powers.",
    duration: 24,
    knowledgePoints: [
      "Commitment to continuous improvement",
      "Facing fears and challenges head-on",
      "Understanding personal limitations"
    ],
    learningObjectives: [
      "Analyze the importance of consistent practice",
      "Understand how to overcome self-doubt",
      "Learn about progressive skill building"
    ],
    streamingLinks: {
      crunchyroll: "https://www.crunchyroll.com/solo-leveling",
      funimation: "https://www.funimation.com/shows/solo-leveling/"
    },
    xpReward: 50
  },
  {
    id: 's1e5',
    season: 1,
    episode: 5,
    title: "A Pretty Good Deal",
    description: "Jin-Woo encounters other hunters and begins to realize how much he has changed. His new abilities attract attention.",
    duration: 24,
    knowledgePoints: [
      "Recognition of personal growth",
      "Managing newfound confidence",
      "Dealing with others' perceptions"
    ],
    learningObjectives: [
      "Understand the psychology of transformation",
      "Learn about handling success and recognition",
      "Explore the social aspects of personal change"
    ],
    streamingLinks: {
      crunchyroll: "https://www.crunchyroll.com/solo-leveling",
      funimation: "https://www.funimation.com/shows/solo-leveling/"
    },
    xpReward: 50
  },
  {
    id: 's1e6',
    season: 1,
    episode: 6,
    title: "The Real Hunt Begins",
    description: "Jin-Woo faces his first major test as he enters a dangerous dungeon. His strategic thinking and new abilities are put to the test.",
    duration: 24,
    knowledgePoints: [
      "Strategic planning and execution",
      "Risk assessment and management",
      "Leadership under pressure"
    ],
    learningObjectives: [
      "Analyze strategic decision-making processes",
      "Understand risk vs. reward calculations",
      "Learn about leadership in challenging situations"
    ],
    streamingLinks: {
      crunchyroll: "https://www.crunchyroll.com/solo-leveling",
      funimation: "https://www.funimation.com/shows/solo-leveling/"
    },
    xpReward: 50
  },
  // Season 2 Episodes
  {
    id: 's2e1',
    season: 2,
    episode: 1,
    title: "Arise",
    description: "Jin-Woo's powers evolve as he gains the ability to command shadow soldiers. A new chapter in his journey begins.",
    duration: 24,
    knowledgePoints: [
      "Evolution of leadership abilities",
      "Building and managing teams",
      "Responsibility that comes with power"
    ],
    learningObjectives: [
      "Understand advanced leadership concepts",
      "Learn about team building and management",
      "Explore the ethics of power and responsibility"
    ],
    streamingLinks: {
      crunchyroll: "https://www.crunchyroll.com/solo-leveling",
      funimation: "https://www.funimation.com/shows/solo-leveling/"
    },
    xpReward: 60
  },
  {
    id: 's2e2',
    season: 2,
    episode: 2,
    title: "The Shadow Army",
    description: "Jin-Woo learns to command his shadow soldiers and faces increasingly difficult challenges that test his strategic abilities.",
    duration: 24,
    knowledgePoints: [
      "Advanced team coordination",
      "Delegation and trust",
      "Scaling personal effectiveness"
    ],
    learningObjectives: [
      "Learn about effective delegation",
      "Understand team coordination strategies",
      "Explore how to scale personal impact"
    ],
    streamingLinks: {
      crunchyroll: "https://www.crunchyroll.com/solo-leveling",
      funimation: "https://www.funimation.com/shows/solo-leveling/"
    },
    xpReward: 60
  }
];

const useKnowledgeStore = create((set, get) => ({
  // State
  episodes: SOLO_LEVELING_EPISODES,
  watchedEpisodes: [],
  knowledgeXP: 0,
  knowledgeLevel: 1,
  currentStreak: 0,
  totalWatchTime: 0,
  learningInsights: [],
  isLoading: false,
  error: null,

  // Actions
  loadEpisodes: () => {
    // Episodes are static data, already loaded
    set({ episodes: SOLO_LEVELING_EPISODES });
  },

  loadWatchedEpisodes: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      
      const q = query(
        collection(db, 'watchedEpisodes'),
        where('userId', '==', userId),
        orderBy('watchedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const watchedEpisodes = [];
      querySnapshot.forEach((doc) => {
        watchedEpisodes.push({ id: doc.id, ...doc.data() });
      });
      
      // Calculate knowledge XP and level
      const totalKnowledgeXP = watchedEpisodes.reduce((sum, ep) => sum + (ep.xpGained || 0), 0);
      const knowledgeLevel = Math.floor(totalKnowledgeXP / 100) + 1;
      
      set({ 
        watchedEpisodes, 
        knowledgeXP: totalKnowledgeXP,
        knowledgeLevel,
        isLoading: false 
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  markEpisodeWatched: async (userId, episode) => {
    try {
      set({ isLoading: true, error: null });
      
      // Check if already watched
      const { watchedEpisodes } = get();
      const alreadyWatched = watchedEpisodes.some(w => w.episodeId === episode.id);
      
      if (alreadyWatched) {
        set({ isLoading: false });
        return;
      }
      
      // Add to watched episodes
      const watchedData = {
        userId,
        episodeId: episode.id,
        season: episode.season,
        episode: episode.episode,
        title: episode.title,
        xpGained: episode.xpReward,
        watchedAt: serverTimestamp(),
        duration: episode.duration
      };
      
      const docRef = await addDoc(collection(db, 'watchedEpisodes'), watchedData);
      
      // Update local state
      const newWatchedEpisode = { id: docRef.id, ...watchedData };
      const updatedWatchedEpisodes = [...watchedEpisodes, newWatchedEpisode];
      const newKnowledgeXP = get().knowledgeXP + episode.xpReward;
      const newKnowledgeLevel = Math.floor(newKnowledgeXP / 100) + 1;
      
      set({ 
        watchedEpisodes: updatedWatchedEpisodes,
        knowledgeXP: newKnowledgeXP,
        knowledgeLevel: newKnowledgeLevel,
        isLoading: false 
      });
      
      // Update user's total knowledge XP in profile
      await get().updateUserKnowledgeXP(userId, newKnowledgeXP, newKnowledgeLevel);
      
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateUserKnowledgeXP: async (userId, knowledgeXP, knowledgeLevel) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        knowledgeXP,
        knowledgeLevel,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user knowledge XP:', error);
    }
  },

  generateEpisodeInsight: async (episodeId) => {
    try {
      const episode = get().episodes.find(ep => ep.id === episodeId);
      if (!episode) return null;
      
      // This would integrate with Gemini AI to generate insights
      // For now, return static insights
      return {
        summary: `Episode ${episode.episode}: ${episode.title} explores themes of ${episode.knowledgePoints.join(', ')}.`,
        keyLessons: episode.knowledgePoints,
        realWorldApplications: [
          "Apply systematic improvement to personal goals",
          "Develop daily discipline habits",
          "Embrace challenges as growth opportunities"
        ],
        characterDevelopment: "Jin-Woo's journey from weakness to strength mirrors real personal development",
        nextSteps: "Consider how you can implement similar systematic approaches in your own life"
      };
    } catch (error) {
      console.error('Error generating insight:', error);
      return null;
    }
  },

  getWatchingStreak: () => {
    const { watchedEpisodes } = get();
    if (watchedEpisodes.length === 0) return 0;
    
    // Calculate consecutive days of watching
    const sortedEpisodes = watchedEpisodes
      .sort((a, b) => b.watchedAt?.seconds - a.watchedAt?.seconds);
    
    let streak = 1;
    let currentDate = new Date(sortedEpisodes[0].watchedAt?.seconds * 1000);
    
    for (let i = 1; i < sortedEpisodes.length; i++) {
      const episodeDate = new Date(sortedEpisodes[i].watchedAt?.seconds * 1000);
      const dayDiff = Math.floor((currentDate - episodeDate) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        streak++;
        currentDate = episodeDate;
      } else {
        break;
      }
    }
    
    return streak;
  },

  getSeasonProgress: (season) => {
    const { episodes, watchedEpisodes } = get();
    const seasonEpisodes = episodes.filter(ep => ep.season === season);
    const watchedSeasonEpisodes = watchedEpisodes.filter(ep => ep.season === season);
    
    return {
      total: seasonEpisodes.length,
      watched: watchedSeasonEpisodes.length,
      percentage: seasonEpisodes.length > 0 ? (watchedSeasonEpisodes.length / seasonEpisodes.length) * 100 : 0
    };
  },

  // Reset functions
  resetKnowledgeData: () => {
    set({
      watchedEpisodes: [],
      knowledgeXP: 0,
      knowledgeLevel: 1,
      currentStreak: 0,
      totalWatchTime: 0,
      learningInsights: []
    });
  }
}));

export default useKnowledgeStore;
