import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { FloatingParticles, MagicParticles } from './ParticleSystem';
import { useEpicSounds } from '../hooks/useEpicSounds';
import useAuthStore from '../store/authStore';
import useXPStore from '../store/xpStore';
import useHabitStore from '../store/habitStore';

// Initialize Gemini AI (with fallback)
const genAI = import.meta.env.VITE_GEMINI_API_KEY ?
  new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY) : null;

const UltimateAICoach = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [coachPersonality, setCoachPersonality] = useState('motivational');
  const [aiMode, setAiMode] = useState('coach'); // coach, analyst, mentor, friend
  const messagesEndRef = useRef(null);
  
  const { sounds } = useEpicSounds();
  const { user, profile } = useAuthStore();
  const { level, currentXP, totalXP } = useXPStore();
  const { habits, getTodaysCompletedHabits } = useHabitStore();

  // AI Personalities
  const personalities = {
    motivational: {
      name: "Sung Jin-Woo",
      avatar: "⚡",
      style: "Epic and motivational like the Shadow Monarch",
      color: "from-blue-500 to-purple-600"
    },
    analytical: {
      name: "Strategic Advisor",
      avatar: "🧠",
      style: "Data-driven and analytical",
      color: "from-green-500 to-teal-600"
    },
    supportive: {
      name: "Gentle Guide",
      avatar: "🌟",
      style: "Supportive and understanding",
      color: "from-pink-500 to-rose-600"
    },
    challenger: {
      name: "Drill Sergeant",
      avatar: "🔥",
      style: "Tough love and challenging",
      color: "from-red-500 to-orange-600"
    }
  };

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 1,
        type: 'ai',
        content: `🌟 **Welcome, ${user?.displayName || 'Hunter'}!** 🌟\n\nI'm your **Ultimate AI Productivity Coach** - powered by advanced AI and designed to help you become the most productive version of yourself!\n\n**Current Status:**\n⚡ Level ${level}\n🎯 ${currentXP} XP\n✅ ${getTodaysCompletedHabits().length} habits completed today\n\n**What can I help you with?**\n• 📊 Analyze your productivity patterns\n• 🎯 Set and optimize goals\n• 💡 Suggest new habits\n• 🧠 Provide motivation and coaching\n• 📈 Create personalized strategies\n\nType anything to get started! 🚀`,
        timestamp: Date.now(),
        personality: coachPersonality
      }]);
    }
  }, [user, level, currentXP]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Advanced AI Context Builder
  const buildAIContext = () => {
    const completedHabits = getTodaysCompletedHabits();
    const completionRate = habits.length > 0 ? Math.round((completedHabits.length / habits.length) * 100) : 0;
    
    return {
      user: {
        name: user?.displayName || 'User',
        level: level,
        currentXP: currentXP,
        totalXP: totalXP
      },
      productivity: {
        habitsTotal: habits.length,
        habitsCompletedToday: completedHabits.length,
        completionRate: completionRate,
        habits: habits.map(h => ({
          name: h.name,
          category: h.category,
          difficulty: h.difficulty,
          xpValue: h.xpValue
        }))
      },
      personality: personalities[coachPersonality],
      timestamp: new Date().toISOString(),
      context: "You are an advanced AI productivity coach in a Solo Leveling-themed app. Be motivational, insightful, and provide actionable advice."
    };
  };

  // Advanced AI Response Generator with Fallback
  const generateAIResponse = async (userMessage) => {
    // If no API key, use intelligent fallback responses
    if (!genAI) {
      return generateFallbackResponse(userMessage);
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const context = buildAIContext();

      const prompt = `
You are ${context.personality.name}, an advanced AI productivity coach with the personality: ${context.personality.style}.

USER CONTEXT:
- Name: ${context.user.name}
- Level: ${context.user.level}
- Current XP: ${context.user.currentXP}
- Total XP: ${context.user.totalXP}
- Habits completed today: ${context.productivity.habitsCompletedToday}/${context.productivity.habitsTotal}
- Completion rate: ${context.productivity.completionRate}%

CURRENT HABITS:
${context.productivity.habits.map(h => `• ${h.name} (${h.category}, ${h.xpValue} XP)`).join('\n')}

USER MESSAGE: "${userMessage}"

INSTRUCTIONS:
1. Respond in character as ${context.personality.name}
2. Be ${context.personality.style.toLowerCase()}
3. Provide specific, actionable advice
4. Reference their current progress and habits when relevant
5. Use emojis and formatting for engagement
6. Keep responses concise but impactful (max 200 words)
7. Include Solo Leveling references when appropriate
8. Suggest specific improvements or new habits when relevant

Respond as ${context.personality.name}:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('AI Error:', error);
      return generateFallbackResponse(userMessage);
    }
  };

  // Intelligent Fallback Response System
  const generateFallbackResponse = (userMessage) => {
    const context = buildAIContext();
    const personality = personalities[coachPersonality];
    const lowerMessage = userMessage.toLowerCase();

    // Analyze user message and provide contextual responses
    if (lowerMessage.includes('progress') || lowerMessage.includes('analyze')) {
      return `📊 **Progress Analysis** 📊\n\nGreat question! Here's what I see:\n\n✅ **Current Status:** Level ${context.user.level} with ${context.user.currentXP} XP\n🎯 **Today's Progress:** ${context.productivity.habitsCompletedToday}/${context.productivity.habitsTotal} habits completed (${context.productivity.completionRate}%)\n\n${context.productivity.completionRate >= 80 ? '🔥 **Excellent work!** You\'re crushing it today!' : context.productivity.completionRate >= 50 ? '💪 **Good progress!** Keep pushing forward!' : '⚡ **Let\'s level up!** Every small step counts!'}\n\n**Next Steps:**\n• Focus on consistency over perfection\n• Celebrate small wins\n• ${context.productivity.habitsTotal < 5 ? 'Consider adding 1-2 more habits' : 'Master your current habits first'}\n\nYou've got this, Hunter! 🚀`;
    }

    if (lowerMessage.includes('motivat') || lowerMessage.includes('inspire')) {
      const motivationalMessages = [
        `⚡ **Rise, Shadow Monarch!** ⚡\n\nRemember why you started this journey. Every habit you complete, every level you gain, brings you closer to becoming the strongest version of yourself!\n\n🔥 **Your Power Level:** ${context.user.level}\n⭐ **XP Earned:** ${context.user.currentXP}\n🎯 **Completion Rate:** ${context.productivity.completionRate}%\n\n${context.productivity.completionRate >= 70 ? 'You\'re already showing the discipline of a true Hunter!' : 'Every Hunter started where you are now. The difference? They never gave up!'}\n\n**Remember:** The system chose you for a reason. Trust the process! 💪`,
        `🌟 **Hunter, Your Journey Continues!** 🌟\n\nI see the fire in your determination! Level ${context.user.level} is just the beginning of your epic transformation.\n\n**Today's Achievements:**\n✅ ${context.productivity.habitsCompletedToday} quests completed\n⚡ ${context.user.currentXP} XP earned\n🔥 ${context.productivity.completionRate}% success rate\n\n${context.productivity.completionRate >= 80 ? 'You\'re operating at S-Rank level!' : 'Every A-Rank Hunter had days like this. Keep grinding!'}\n\nThe strongest Hunters aren't born - they're forged through consistent daily battles. You're becoming unstoppable! 🚀`
      ];
      return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    }

    if (lowerMessage.includes('habit') || lowerMessage.includes('suggest') || lowerMessage.includes('new')) {
      const suggestions = [
        '🌅 **Morning Power Hour** - Start each day with 30 minutes of focused work',
        '💧 **Hydration Quest** - Drink 8 glasses of water daily',
        '📚 **Knowledge Absorption** - Read for 20 minutes daily',
        '🧘 **Mental Fortress** - 10 minutes of meditation or deep breathing',
        '🏃 **Physical Training** - 15 minutes of exercise or movement',
        '📝 **Daily Reflection** - Write 3 things you\'re grateful for',
        '🎯 **Priority Focus** - Identify your top 3 tasks each morning',
        '📱 **Digital Detox** - 1 hour of phone-free time daily'
      ];

      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      return `💡 **Habit Suggestion** 💡\n\nBased on your current level (${context.user.level}) and progress, here's a powerful habit to consider:\n\n${randomSuggestion}\n\n**Why this works:**\n• Builds on your existing momentum\n• Matches your current skill level\n• Creates compound growth over time\n\n**Pro Tip:** Start with just 5 minutes if it feels overwhelming. Consistency beats intensity every time!\n\nReady to add this to your arsenal? 🚀`;
    }

    if (lowerMessage.includes('goal') || lowerMessage.includes('plan')) {
      return `🎯 **Goal Setting Mastery** 🎯\n\nLet's level up your goal-setting game!\n\n**Your Current Power Level:** ${context.user.level}\n**XP Progress:** ${context.user.currentXP}\n\n**SMART Goal Framework:**\n📍 **Specific** - What exactly do you want to achieve?\n📊 **Measurable** - How will you track progress?\n✅ **Achievable** - Is it realistic for your current level?\n🎯 **Relevant** - Does it align with your vision?\n⏰ **Time-bound** - When will you complete it?\n\n**Next Level Strategy:**\n• Break big goals into daily habits\n• Focus on systems, not just outcomes\n• Celebrate small wins along the way\n\nWhat specific goal are you working toward? I'll help you create an epic action plan! 💪`;
    }

    // Default response based on personality
    const defaultResponses = {
      motivational: `⚡ **Greetings, Hunter!** ⚡\n\nI sense great potential in you! At Level ${context.user.level} with ${context.user.currentXP} XP, you're already on the path to greatness.\n\n**Today's Status:**\n🎯 ${context.productivity.habitsCompletedToday}/${context.productivity.habitsTotal} quests completed\n📈 ${context.productivity.completionRate}% success rate\n\nEvery Shadow Monarch started as an E-Rank Hunter. What matters is your determination to keep leveling up!\n\nWhat challenge shall we conquer together today? 🚀`,
      analytical: `📊 **Data Analysis Complete** 📊\n\nCurrent metrics show promising trends:\n\n**Performance Overview:**\n• Level: ${context.user.level}\n• XP: ${context.user.currentXP}\n• Daily Completion: ${context.productivity.completionRate}%\n• Active Habits: ${context.productivity.habitsTotal}\n\n**Optimization Opportunities:**\n${context.productivity.completionRate < 70 ? '• Focus on consistency over quantity\n• Consider reducing habit difficulty' : '• Ready for increased challenge\n• Consider adding advanced habits'}\n\nWhat specific area would you like to optimize? 🎯`,
      supportive: `🌟 **You're Doing Amazing!** 🌟\n\nI want you to know that every step you're taking matters. Level ${context.user.level} represents real growth and dedication!\n\n**Today's Wins:**\n✨ ${context.productivity.habitsCompletedToday} habits completed\n💫 ${context.user.currentXP} XP earned\n🌈 ${context.productivity.completionRate}% progress\n\nRemember, progress isn't always linear. Some days are harder than others, and that's completely normal.\n\n**Gentle Reminder:**\n• You're stronger than you think\n• Small steps lead to big changes\n• I believe in your journey\n\nHow are you feeling about your progress today? 💝`,
      challenger: `🔥 **Time to Level Up, Hunter!** 🔥\n\nLevel ${context.user.level}? That's just the beginning! I see you've completed ${context.productivity.habitsCompletedToday}/${context.productivity.habitsTotal} habits today.\n\n${context.productivity.completionRate >= 80 ? '💪 **Impressive!** But can you maintain this intensity?' : '⚡ **Come on!** I know you can push harder than this!'}\n\n**Challenge Mode Activated:**\n• No excuses, only results\n• Consistency is your weapon\n• Every habit skipped is XP lost\n\nThe question is: Are you ready to prove you have what it takes to reach S-Rank?\n\nShow me your determination! 🚀`
    };

    return defaultResponses[coachPersonality] || defaultResponses.motivational;
  };

  // Send Message Handler
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    // Play sound effect
    sounds.buttonClick();

    // Generate AI response
    const aiResponse = await generateAIResponse(inputMessage);
    
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: Date.now(),
        personality: coachPersonality
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      sounds.notification();
    }, 1500);
  };

  // Quick Action Buttons
  const quickActions = [
    { text: "📊 Analyze my progress", icon: "📊" },
    { text: "🎯 Set new goals", icon: "🎯" },
    { text: "💡 Suggest habits", icon: "💡" },
    { text: "🔥 Motivate me", icon: "🔥" },
    { text: "📈 Optimize routine", icon: "📈" },
    { text: "🧠 Focus strategies", icon: "🧠" }
  ];

  return (
    <>
      {/* AI Coach Button */}
      <motion.button
        onClick={() => {
          setIsOpen(!isOpen);
          sounds.magicSparkle();
        }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className={`fixed bottom-6 left-6 z-50 w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg transition-all duration-300 ${
          isOpen 
            ? `bg-gradient-to-r ${personalities[coachPersonality].color} text-white` 
            : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
        }`}
        style={{
          boxShadow: '0 0 30px rgba(147, 51, 234, 0.6), 0 0 60px rgba(236, 72, 153, 0.3)'
        }}
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {personalities[coachPersonality].avatar}
        </motion.div>
      </motion.button>

      {/* AI Coach Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -50 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed bottom-24 left-6 z-40 w-96 h-96 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl backdrop-blur-sm overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.95))',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(147, 51, 234, 0.3)'
            }}
          >
            <MagicParticles particleCount={15} size="small" />
            
            {/* Header */}
            <div className={`p-4 bg-gradient-to-r ${personalities[coachPersonality].color} relative`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{personalities[coachPersonality].avatar}</div>
                  <div>
                    <h3 className="font-gaming font-bold text-white">
                      {personalities[coachPersonality].name}
                    </h3>
                    <p className="text-xs text-white/80">Ultimate AI Coach</p>
                  </div>
                </div>
                
                {/* Personality Selector */}
                <select
                  value={coachPersonality}
                  onChange={(e) => setCoachPersonality(e.target.value)}
                  className="bg-white/20 text-white text-xs rounded px-2 py-1 border-none"
                >
                  {Object.entries(personalities).map(([key, personality]) => (
                    <option key={key} value={key} className="text-gray-800">
                      {personality.avatar} {personality.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto h-64 space-y-3">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg text-sm ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : `bg-gradient-to-r ${personalities[message.personality || coachPersonality].color} text-white`
                    }`}
                  >
                    <div dangerouslySetInnerHTML={{ 
                      __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n/g, '<br>')
                    }} />
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className={`bg-gradient-to-r ${personalities[coachPersonality].color} text-white p-3 rounded-lg`}>
                    <div className="flex space-x-1">
                      <motion.div
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="p-2 border-t border-gray-700">
              <div className="grid grid-cols-3 gap-1 mb-2">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setInputMessage(action.text)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-xs p-1 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
                  >
                    {action.icon}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask your AI coach anything..."
                  className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg text-sm border-none focus:ring-2 focus:ring-purple-500"
                />
                <motion.button
                  onClick={handleSendMessage}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 bg-gradient-to-r ${personalities[coachPersonality].color} text-white rounded-lg text-sm font-medium`}
                >
                  🚀
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UltimateAICoach;
