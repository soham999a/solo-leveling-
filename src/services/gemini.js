import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI only if API key is available
const genAI = import.meta.env.VITE_GEMINI_API_KEY ?
  new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY) : null;

// Get the model - Updated to use the correct model name
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;

// Daily Reflection AI
export const generateDailyReflection = async (journalEntry, userLevel, completedHabits) => {
  // Return fallback if no model available
  if (!model) {
    return {
      reflection: "Great work today! Every step forward is progress. Keep building those positive habits - you're on an amazing journey of growth!",
      error: null
    };
  }

  try {
    const prompt = `
    Act as a growth coach and motivational mentor. A user at level ${userLevel} has journaled this: "${journalEntry}"
    
    They completed these habits today: ${completedHabits.map(h => h.name).join(', ')}
    
    Provide:
    1. Encouraging feedback (2-3 sentences)
    2. One specific insight about their growth
    3. A motivational message for tomorrow
    
    Keep it personal, uplifting, and focused on their journey. Use a warm but inspiring tone.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return { 
      reflection: text,
      error: null 
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return { 
      reflection: "Great work today! Every step forward is progress. Keep building those positive habits - you're on an amazing journey of growth!",
      error: error.message 
    };
  }
};

// Weekly Boss Generator
export const generateWeeklyBoss = async (weeklyHabits, userLevel, missedDays) => {
  // Return fallback if no model available
  if (!model) {
    return {
      boss: `**The Procrastination Shadow**\n\nThis week, a familiar foe emerges from the depths of delay. The Procrastination Shadow feeds on missed opportunities and grows stronger with each postponed task.\n\n**Powers:**\n- Time Distortion: Makes important tasks seem overwhelming\n- Comfort Zone Trap: Keeps you stuck in familiar patterns\n- Tomorrow's Promise: Convinces you there's always later\n\n**Battle Strategy:** Face this boss with small, immediate actions. Break large tasks into tiny steps, set 5-minute timers, and celebrate each small victory. Remember: action is the light that banishes shadows!`,
      error: null
    };
  }

  try {
    const habitSummary = weeklyHabits.map(h => `${h.name}: ${h.completionRate}% completion`).join(', ');
    
    const prompt = `
    Act as an RPG story writer. Create a boss character that symbolizes a real-life challenge based on this week's habit data:
    
    User Level: ${userLevel}
    Habits this week: ${habitSummary}
    Days missed: ${missedDays}
    
    Generate a boss with:
    1. A creative name that relates to their biggest challenge
    2. A short backstory (2-3 sentences) about what this boss represents
    3. 3 "powers" that are metaphors for real obstacles
    4. An encouraging battle strategy (how to defeat this boss in real life)
    
    Make it engaging, slightly dramatic, but ultimately empowering. The boss should feel conquerable.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return { 
      boss: text,
      error: null 
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return { 
      boss: `**The Procrastination Shadow**\n\nThis week, a familiar foe emerges from the depths of delay. The Procrastination Shadow feeds on missed opportunities and grows stronger with each postponed task.\n\n**Powers:**\n- Time Distortion: Makes important tasks seem overwhelming\n- Comfort Zone Trap: Keeps you stuck in familiar patterns\n- Tomorrow's Promise: Convinces you there's always later\n\n**Battle Strategy:** Face this boss with small, immediate actions. Break large tasks into tiny steps, set 5-minute timers, and celebrate each small victory. Remember: action is the light that banishes shadows!`,
      error: error.message 
    };
  }
};

// Motivational Quotes Generator
export const generateMotivationalQuote = async (userLevel, currentStreak, timeOfDay) => {
  // Return fallback if no model available
  if (!model) {
    const fallbackQuotes = [
      "Every level up starts with showing up.",
      "Your consistency is your superpower.",
      "Small habits, massive transformations.",
      "Progress over perfection, always.",
      "You're building the future you deserve."
    ];
    return {
      quote: fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)],
      error: null
    };
  }

  try {
    const prompt = `
    Generate a short, powerful motivational quote for a user who is:
    - Level ${userLevel} in their personal growth journey
    - On a ${currentStreak}-day streak
    - It's ${timeOfDay}
    
    Make it personal, inspiring, and relevant to habit building. Keep it under 20 words.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return { 
      quote: text.replace(/"/g, ''),
      error: null 
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    const fallbackQuotes = [
      "Every level up starts with showing up.",
      "Your consistency is your superpower.",
      "Small habits, massive transformations.",
      "Progress over perfection, always.",
      "You're building the future you deserve."
    ];
    return { 
      quote: fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)],
      error: error.message 
    };
  }
};

// Habit Suggestion Generator
export const generateHabitSuggestion = async (userLevel, existingHabits, userGoals) => {
  // Return fallback if no model available
  if (!model) {
    return {
      suggestion: "Try adding a 5-minute morning meditation habit. It's simple, builds mental clarity, and creates a peaceful start to your day. Start with just 2 minutes if needed!",
      error: null
    };
  }

  try {
    const prompt = `
    Suggest a new habit for a level ${userLevel} user who wants to improve their life.
    
    Current habits: ${existingHabits.join(', ')}
    Goals: ${userGoals}
    
    Suggest:
    1. A specific, actionable habit name
    2. Why it complements their existing habits
    3. How to start small (beginner-friendly)
    4. Expected XP value (10-50 based on difficulty)
    
    Focus on habits that build momentum and create positive compound effects.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return { 
      suggestion: text,
      error: null 
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return { 
      suggestion: "Try adding a 5-minute morning meditation habit. It's simple, builds mental clarity, and creates a peaceful start to your day. Start with just 2 minutes if needed!",
      error: error.message 
    };
  }
};

// Level Up Celebration
export const generateLevelUpMessage = async (newLevel, previousLevel, topHabits) => {
  // Return fallback if no model available
  if (!model) {
    return {
      message: `🎉 LEVEL UP! 🎉\n\nCongratulations! You've reached Level ${newLevel}!\n\nYour dedication to growth has unlocked new potential. The habits you've built are transforming you into the person you're meant to become. Ready for the next challenge?`,
      error: null
    };
  }

  try {
    const prompt = `
    A user just leveled up from level ${previousLevel} to level ${newLevel}!
    Their top habits are: ${topHabits.join(', ')}
    
    Create an epic, celebratory message that:
    1. Congratulates them on this achievement
    2. Acknowledges their growth journey
    3. Hints at new challenges and opportunities ahead
    4. Feels like a video game level-up notification
    
    Make it exciting and empowering! Use emojis sparingly but effectively.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return { 
      message: text,
      error: null 
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return { 
      message: `🎉 LEVEL UP! 🎉\n\nCongratulations! You've reached Level ${newLevel}!\n\nYour dedication to growth has unlocked new potential. The habits you've built are transforming you into the person you're meant to become. Ready for the next challenge?`,
      error: error.message 
    };
  }
};

// AI Life Coach
export const generateLifeCoachAdvice = async (coachingType, userData) => {
  // Return fallback if no model available
  if (!model) {
    const fallbackAdvice = {
      daily: "Focus on your top 3 priorities today. Remember, small consistent actions lead to extraordinary results. You've got this!",
      weekly: "This week, challenge yourself to level up one habit. Whether it's adding 5 more minutes to your workout or reading one extra page, growth happens in small increments.",
      motivation: "Every expert was once a beginner. Every pro was once an amateur. Every icon was once an unknown. Don't give up on your journey!",
      strategy: "Success isn't about perfection - it's about consistency. Focus on showing up every day, even when you don't feel like it."
    };

    return {
      advice: fallbackAdvice[coachingType] || fallbackAdvice.daily,
      actionItems: ["Take one small step forward", "Celebrate your progress", "Stay consistent", "Believe in yourself"],
      error: null
    };
  }

  try {
    let prompt = '';

    switch (coachingType) {
      case 'daily':
        prompt = `
        Act as Jin-Woo from Solo Leveling, now a personal life coach. A user named ${userData.profileName} is at level ${userData.level} with ${userData.currentXP} XP.

        Today they completed ${userData.completedToday}/${userData.totalHabits} habits.
        Their habits: ${userData.habits.map(h => h.name).join(', ')}

        Give them a daily check-in in Jin-Woo's voice - motivational, strategic, and focused on systematic growth.
        Include:
        1. Assessment of today's progress
        2. One specific improvement suggestion
        3. Motivational message for the rest of the day
        4. A "quest" for tomorrow

        Keep it personal, inspiring, and under 200 words. Use Jin-Woo's determined, strategic personality.
        `;
        break;

      case 'weekly':
        prompt = `
        As Jin-Woo, analyze ${userData.profileName}'s weekly performance. They're level ${userData.level} and have been building these habits: ${userData.habits.map(h => h.name).join(', ')}.

        Provide a strategic weekly review like Jin-Woo would analyze his dungeon raids:
        1. What went well this week (celebrate wins)
        2. Areas for improvement (like analyzing failed raids)
        3. Strategic adjustments for next week
        4. One new "dungeon" (challenge) to tackle

        Be analytical but encouraging, like Jin-Woo planning his next level-up.
        `;
        break;

      case 'challenge':
        prompt = `
        Channel Jin-Woo's mindset when he faced impossible dungeons. ${userData.profileName} is level ${userData.level} and ready for a challenge.

        Create an epic challenge that pushes their limits:
        1. A specific 7-day challenge related to their habits
        2. Why this challenge will make them stronger
        3. How to prepare (like Jin-Woo preparing for boss fights)
        4. The rewards they'll gain

        Make it feel like an epic quest that's challenging but achievable.
        `;
        break;

      case 'optimization':
        prompt = `
        As Jin-Woo optimizing his skills and strategies, help ${userData.profileName} optimize their productivity system.

        Current habits: ${userData.habits.map(h => h.name).join(', ')}
        Level: ${userData.level}

        Provide optimization advice:
        1. Habit stacking opportunities
        2. Time management improvements
        3. Energy optimization (like Jin-Woo managing his mana)
        4. System upgrades for better results

        Be strategic and systematic, like Jin-Woo analyzing his stat distribution.
        `;
        break;

      case 'motivation':
        prompt = `
        ${userData.profileName} needs a motivation boost. Channel Jin-Woo's most inspiring moments.

        They're level ${userData.level}, working on: ${userData.habits.map(h => h.name).join(', ')}

        Give them a powerful motivational speech like Jin-Woo before a major battle:
        1. Remind them of their growth journey
        2. Connect their current struggles to Jin-Woo's challenges
        3. Paint a vision of their future self
        4. End with a battle cry for action

        Make it epic, personal, and absolutely inspiring!
        `;
        break;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse action items if they exist
    const actionItems = [];
    const lines = text.split('\n');
    let inActionSection = false;

    for (const line of lines) {
      if (line.toLowerCase().includes('action') || line.includes('•') || line.includes('-')) {
        if (line.trim().length > 5) {
          actionItems.push(line.replace(/^[-•*]\s*/, '').trim());
        }
      }
    }

    return {
      advice: text,
      actionItems: actionItems.slice(0, 4), // Limit to 4 action items
      error: null
    };
  } catch (error) {
    console.error('Life Coach AI Error:', error);

    const fallbackAdvice = {
      daily: "Hunter, every day is a chance to level up. You've made progress today, and that's what matters. Focus on consistency over perfection. Tomorrow, tackle your most important habit first - that's your daily boss battle. Remember: 'I will become stronger.'",
      weekly: "This week showed your dedication to growth. Like Jin-Woo analyzing his raids, look at what worked and what didn't. Adjust your strategy, not your goals. Next week, add one small improvement to your routine. Progress is progress, no matter how small.",
      challenge: "Ready for your next dungeon? Challenge yourself to complete all habits for 7 days straight. This isn't just about habits - it's about proving to yourself that you can overcome any obstacle. Prepare like Jin-Woo: plan, execute, dominate.",
      optimization: "Time to upgrade your system. Stack your habits like Jin-Woo stacks his skills. Do your hardest habit when your energy is highest. Use triggers and rewards. Optimize for consistency, not intensity. Small improvements compound into massive results.",
      motivation: "Hunter, remember why you started this journey. Every habit you build, every level you gain, every challenge you overcome - you're becoming the person you're meant to be. Jin-Woo went from E-rank to Shadow Monarch. Your transformation is just beginning. Rise up!"
    };

    return {
      advice: fallbackAdvice[coachingType] || fallbackAdvice.motivation,
      actionItems: [
        "Complete your most important habit today",
        "Set a specific time for tomorrow's first habit",
        "Celebrate one small win from today",
        "Plan your next level-up goal"
      ],
      error: error.message
    };
  }
};
