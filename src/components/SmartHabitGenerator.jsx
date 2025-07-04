import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MagicParticles } from './ParticleSystem';
import { useEpicSounds } from '../hooks/useEpicSounds';
import useAuthStore from '../store/authStore';
import useXPStore from '../store/xpStore';
import useHabitStore from '../store/habitStore';

const genAI = import.meta.env.VITE_GEMINI_API_KEY ?
  new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY) : null;

const SmartHabitGenerator = ({ isOpen, onClose, onHabitGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHabits, setGeneratedHabits] = useState([]);
  const [userGoals, setUserGoals] = useState('');
  const [focusArea, setFocusArea] = useState('productivity');
  const [difficulty, setDifficulty] = useState('medium');
  
  const { sounds } = useEpicSounds();
  const { user } = useAuthStore();
  const { level, currentXP } = useXPStore();
  const { habits } = useHabitStore();

  const focusAreas = [
    { value: 'productivity', label: '⚡ Productivity', color: 'from-blue-500 to-purple-500' },
    { value: 'health', label: '💪 Health & Fitness', color: 'from-green-500 to-emerald-500' },
    { value: 'learning', label: '📚 Learning & Growth', color: 'from-yellow-500 to-orange-500' },
    { value: 'mindfulness', label: '🧘 Mindfulness & Mental Health', color: 'from-purple-500 to-pink-500' },
    { value: 'creativity', label: '🎨 Creativity & Hobbies', color: 'from-pink-500 to-rose-500' },
    { value: 'social', label: '👥 Social & Relationships', color: 'from-indigo-500 to-blue-500' },
    { value: 'finance', label: '💰 Finance & Career', color: 'from-emerald-500 to-teal-500' },
    { value: 'lifestyle', label: '🏠 Lifestyle & Organization', color: 'from-orange-500 to-red-500' }
  ];

  const difficultyLevels = [
    { value: 'easy', label: '🌱 Easy (Beginner)', description: 'Simple habits to build momentum' },
    { value: 'medium', label: '⚡ Medium (Intermediate)', description: 'Balanced challenge and achievability' },
    { value: 'hard', label: '🔥 Hard (Advanced)', description: 'Challenging habits for experienced users' },
    { value: 'mixed', label: '🎯 Mixed (Progressive)', description: 'Variety of difficulty levels' }
  ];

  const generateSmartHabits = async () => {
    setIsGenerating(true);
    sounds.powerUp();

    try {
      // If no API key, use fallback habits
      if (!genAI) {
        const fallbackHabits = getFallbackHabits(focusArea, difficulty);
        setGeneratedHabits(fallbackHabits);
        setIsGenerating(false);
        return;
      }

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const userContext = {
        name: user?.displayName || 'User',
        level: level,
        currentXP: currentXP,
        existingHabits: habits.map(h => ({ name: h.name, category: h.category })),
        goals: userGoals,
        focusArea: focusArea,
        difficulty: difficulty
      };

      const prompt = `
You are an expert habit formation coach and productivity specialist. Generate 8-10 personalized habits based on this user profile:

USER PROFILE:
- Name: ${userContext.name}
- Level: ${userContext.level}
- Current XP: ${userContext.currentXP}
- Focus Area: ${focusArea}
- Difficulty Preference: ${difficulty}
- Goals: ${userGoals}

EXISTING HABITS:
${userContext.existingHabits.map(h => `• ${h.name} (${h.category})`).join('\n')}

REQUIREMENTS:
1. Generate habits that complement existing ones (avoid duplicates)
2. Focus primarily on the "${focusArea}" area
3. Match the "${difficulty}" difficulty level
4. Align with user's stated goals
5. Use proven habit formation principles
6. Make habits specific, measurable, and actionable
7. Include variety in time commitment and complexity
8. Consider the user's current level and experience

FOR EACH HABIT, PROVIDE:
- name: Clear, motivating habit name
- description: Detailed explanation of what to do
- category: One of [Productivity, Health, Learning, Mindfulness, Creativity, Social, Finance, Lifestyle]
- difficulty: Number 1-10 (1=very easy, 10=very hard)
- xpValue: XP reward (10-100 based on difficulty and impact)
- timeEstimate: How long it takes (e.g., "5 minutes", "30 minutes")
- frequency: How often (e.g., "Daily", "3x per week")
- tips: 2-3 practical tips for success
- benefits: Why this habit is valuable

Return ONLY a valid JSON array of habit objects. No additional text or formatting.

Example format:
[
  {
    "name": "Morning Mindfulness",
    "description": "Start each day with 10 minutes of meditation or deep breathing",
    "category": "Mindfulness",
    "difficulty": 3,
    "xpValue": 25,
    "timeEstimate": "10 minutes",
    "frequency": "Daily",
    "tips": ["Use a meditation app", "Start with just 5 minutes", "Create a quiet space"],
    "benefits": "Reduces stress, improves focus, sets positive tone for the day"
  }
]
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let responseText = response.text();
      
      // Clean up the response to extract JSON
      responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      responseText = responseText.trim();
      
      try {
        const habits = JSON.parse(responseText);
        setGeneratedHabits(habits);
        sounds.achievement();
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        // Fallback habits if AI response isn't valid JSON
        setGeneratedHabits(getFallbackHabits());
        sounds.notification();
      }
      
    } catch (error) {
      console.error('Habit generation error:', error);
      setGeneratedHabits(getFallbackHabits());
      sounds.warning();
    }
    
    setIsGenerating(false);
  };

  const getFallbackHabits = () => {
    const fallbackHabits = {
      productivity: [
        {
          name: "Daily Priority Planning",
          description: "Spend 10 minutes each morning identifying your top 3 priorities for the day",
          category: "Productivity",
          difficulty: 3,
          xpValue: 25,
          timeEstimate: "10 minutes",
          frequency: "Daily",
          tips: ["Use a simple notebook", "Review the night before", "Focus on impact over quantity"],
          benefits: "Increases focus, reduces overwhelm, improves daily achievement"
        },
        {
          name: "Pomodoro Focus Sessions",
          description: "Work in focused 25-minute blocks with 5-minute breaks",
          category: "Productivity",
          difficulty: 4,
          xpValue: 30,
          timeEstimate: "25 minutes",
          frequency: "Daily",
          tips: ["Use a timer", "Eliminate distractions", "Take real breaks"],
          benefits: "Improves concentration, prevents burnout, increases productivity"
        }
      ],
      health: [
        {
          name: "Morning Movement",
          description: "Do 10 minutes of light exercise or stretching each morning",
          category: "Health",
          difficulty: 3,
          xpValue: 25,
          timeEstimate: "10 minutes",
          frequency: "Daily",
          tips: ["Start simple", "Focus on consistency", "Listen to your body"],
          benefits: "Boosts energy, improves mood, enhances physical health"
        }
      ]
    };
    
    return fallbackHabits[focusArea] || fallbackHabits.productivity;
  };

  const handleSelectHabit = (habit) => {
    onHabitGenerated(habit);
    sounds.questComplete();
  };

  const selectedFocusArea = focusAreas.find(area => area.value === focusArea);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <MagicParticles particleCount={20} size="small" />
            
            {/* Header */}
            <div className={`p-6 bg-gradient-to-r ${selectedFocusArea?.color || 'from-blue-500 to-purple-500'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-gaming font-bold text-white">
                    🤖 Smart Habit Generator
                  </h2>
                  <p className="text-white/80">
                    AI-powered personalized habit recommendations
                  </p>
                </div>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-white hover:text-red-300 text-2xl"
                >
                  ✕
                </motion.button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {generatedHabits.length === 0 ? (
                // Configuration Phase
                <div className="space-y-6">
                  {/* Goals Input */}
                  <div>
                    <label className="block text-white font-medium mb-2">
                      🎯 What are your current goals?
                    </label>
                    <textarea
                      value={userGoals}
                      onChange={(e) => setUserGoals(e.target.value)}
                      placeholder="e.g., Improve focus, build better morning routine, learn new skills..."
                      className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>

                  {/* Focus Area */}
                  <div>
                    <label className="block text-white font-medium mb-3">
                      🎨 Choose your focus area:
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {focusAreas.map((area) => (
                        <motion.button
                          key={area.value}
                          onClick={() => setFocusArea(area.value)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-3 rounded-lg text-sm font-medium transition-all ${
                            focusArea === area.value
                              ? `bg-gradient-to-r ${area.color} text-white`
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          {area.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty Level */}
                  <div>
                    <label className="block text-white font-medium mb-3">
                      ⚡ Difficulty preference:
                    </label>
                    <div className="space-y-2">
                      {difficultyLevels.map((level) => (
                        <motion.button
                          key={level.value}
                          onClick={() => setDifficulty(level.value)}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className={`w-full p-3 rounded-lg text-left transition-all ${
                            difficulty === level.value
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          <div className="font-medium">{level.label}</div>
                          <div className="text-sm opacity-80">{level.description}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <motion.button
                    onClick={generateSmartHabits}
                    disabled={isGenerating || !userGoals.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                      isGenerating || !userGoals.trim()
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : `bg-gradient-to-r ${selectedFocusArea?.color} text-white hover:shadow-lg`
                    }`}
                  >
                    {isGenerating ? (
                      <div className="flex items-center justify-center space-x-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Generating Epic Habits...</span>
                      </div>
                    ) : (
                      '🚀 Generate Smart Habits'
                    )}
                  </motion.button>
                </div>
              ) : (
                // Generated Habits Display
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">
                      🎉 Your Personalized Habits
                    </h3>
                    <motion.button
                      onClick={() => setGeneratedHabits([])}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      🔄 Generate New
                    </motion.button>
                  </div>

                  <div className="grid gap-4">
                    {generatedHabits.map((habit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-white text-lg">{habit.name}</h4>
                            <p className="text-gray-300 text-sm">{habit.description}</p>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="bg-blue-600 text-white px-2 py-1 rounded">
                              {habit.xpValue} XP
                            </span>
                            <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded">
                              {habit.difficulty}/10
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                          <div>
                            <span className="text-gray-400">⏱️ Time:</span>
                            <span className="text-white ml-1">{habit.timeEstimate}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">📅 Frequency:</span>
                            <span className="text-white ml-1">{habit.frequency}</span>
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-gray-400 text-sm mb-1">💡 Benefits:</p>
                          <p className="text-gray-300 text-sm">{habit.benefits}</p>
                        </div>

                        <div className="mb-4">
                          <p className="text-gray-400 text-sm mb-1">🎯 Tips:</p>
                          <ul className="text-gray-300 text-sm space-y-1">
                            {habit.tips?.map((tip, tipIndex) => (
                              <li key={tipIndex}>• {tip}</li>
                            ))}
                          </ul>
                        </div>

                        <motion.button
                          onClick={() => handleSelectHabit(habit)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full py-2 rounded-lg font-medium bg-gradient-to-r ${selectedFocusArea?.color} text-white hover:shadow-lg transition-all`}
                        >
                          ✅ Add This Habit
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Fallback habits when API is not available
const getFallbackHabits = (focusArea, difficulty) => {
  const baseHabits = {
    productivity: [
      { name: "Daily Planning", description: "Plan your top 3 priorities each morning", category: "Productivity", difficulty: 2, xpValue: 20, timeEstimate: "10 minutes", frequency: "Daily", tips: ["Use a planner", "Review the night before", "Keep it simple"], benefits: "Increases focus and reduces overwhelm" },
      { name: "Pomodoro Sessions", description: "Work in focused 25-minute blocks", category: "Productivity", difficulty: 3, xpValue: 30, timeEstimate: "25 minutes", frequency: "Daily", tips: ["Use a timer", "Take breaks", "Eliminate distractions"], benefits: "Improves concentration and productivity" }
    ],
    health: [
      { name: "Morning Walk", description: "Take a 15-minute walk to start your day", category: "Health", difficulty: 2, xpValue: 25, timeEstimate: "15 minutes", frequency: "Daily", tips: ["Start small", "Choose a route", "Listen to music"], benefits: "Boosts energy and improves mood" },
      { name: "Hydration Tracking", description: "Drink 8 glasses of water throughout the day", category: "Health", difficulty: 1, xpValue: 15, timeEstimate: "2 minutes", frequency: "Daily", tips: ["Use a water bottle", "Set reminders", "Add lemon for flavor"], benefits: "Improves energy and skin health" }
    ],
    learning: [
      { name: "Daily Reading", description: "Read for 20 minutes each day", category: "Learning", difficulty: 2, xpValue: 25, timeEstimate: "20 minutes", frequency: "Daily", tips: ["Choose interesting books", "Set a timer", "Take notes"], benefits: "Expands knowledge and vocabulary" },
      { name: "Skill Practice", description: "Practice a new skill for 15 minutes", category: "Learning", difficulty: 3, xpValue: 30, timeEstimate: "15 minutes", frequency: "Daily", tips: ["Choose one skill", "Use online resources", "Track progress"], benefits: "Builds expertise and confidence" }
    ],
    mindfulness: [
      { name: "Morning Meditation", description: "Start your day with 10 minutes of mindfulness", category: "Mindfulness", difficulty: 3, xpValue: 25, timeEstimate: "10 minutes", frequency: "Daily", tips: ["Use a meditation app", "Start with 5 minutes", "Create a quiet space"], benefits: "Reduces stress and improves focus" },
      { name: "Gratitude Journal", description: "Write down 3 things you're grateful for", category: "Mindfulness", difficulty: 1, xpValue: 15, timeEstimate: "5 minutes", frequency: "Daily", tips: ["Keep it simple", "Be specific", "Write by hand"], benefits: "Improves mood and perspective" }
    ]
  };

  const selectedHabits = baseHabits[focusArea] || baseHabits.productivity;

  // Adjust difficulty based on preference
  return selectedHabits.map(habit => ({
    ...habit,
    difficulty: difficulty === 'easy' ? Math.max(1, habit.difficulty - 1) :
                difficulty === 'hard' ? Math.min(10, habit.difficulty + 2) :
                habit.difficulty,
    xpValue: difficulty === 'easy' ? habit.xpValue - 5 :
             difficulty === 'hard' ? habit.xpValue + 15 :
             habit.xpValue
  }));
};

export default SmartHabitGenerator;
