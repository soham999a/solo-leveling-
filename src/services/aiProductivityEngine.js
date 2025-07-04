// 🧠 ULTIMATE AI PRODUCTIVITY ENGINE 🧠
// The most advanced AI system for productivity optimization

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI only if API key is available
const genAI = import.meta.env.VITE_GEMINI_API_KEY ?
  new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY) : null;

class AIProductivityEngine {
  constructor() {
    this.model = genAI ? genAI.getGenerativeModel({ model: "gemini-pro" }) : null;
    this.userPatterns = new Map();
    this.predictions = new Map();
    this.hasApiKey = !!import.meta.env.VITE_GEMINI_API_KEY;
  }

  // 🔮 PREDICTIVE ANALYTICS
  async analyzePredictivePatterns(userData) {
    // Return fallback if no API key
    if (!this.hasApiKey || !this.model) {
      return this.getFallbackPredictions();
    }

    const { habits, completions, timestamps, level, xp } = userData;

    try {
      const prompt = `
Analyze this user's productivity patterns and predict optimal times, energy levels, and success probability:

USER DATA:
- Level: ${level}, XP: ${xp}
- Habits: ${JSON.stringify(habits)}
- Recent completions: ${JSON.stringify(completions)}
- Timestamps: ${JSON.stringify(timestamps)}

ANALYZE AND PREDICT:
1. Most productive hours of the day
2. Energy patterns and optimal break times
3. Habit success probability for different times
4. Weekly productivity cycles
5. Burnout risk assessment
6. Optimal habit scheduling
7. Performance improvement suggestions

Return JSON format with specific predictions and recommendations.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;

      try {
        return JSON.parse(response.text());
      } catch {
        return this.parseAIResponse(response.text());
      }
    } catch (error) {
      console.error('Predictive analysis error:', error);
      return this.getFallbackPredictions();
    }
  }

  // 🎯 SMART GOAL OPTIMIZATION
  async optimizeGoals(currentGoals, userContext) {
    // Return fallback if no API key
    if (!this.hasApiKey || !this.model) {
      return this.getFallbackGoalOptimization();
    }

    try {
      const prompt = `
You are an expert goal optimization AI. Analyze and improve these goals:

CURRENT GOALS: ${JSON.stringify(currentGoals)}
USER CONTEXT: ${JSON.stringify(userContext)}

OPTIMIZE FOR:
1. SMART criteria (Specific, Measurable, Achievable, Relevant, Time-bound)
2. User's current level and capabilities
3. Realistic progression and difficulty curve
4. Motivation and engagement factors
5. Long-term sustainability

PROVIDE:
- Optimized goal versions
- Difficulty ratings (1-10)
- Estimated completion time
- Success probability
- Motivation strategies
- Milestone breakdowns

Return detailed JSON with optimized goals and reasoning.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return this.parseGoalOptimization(response.text());
    } catch (error) {
      console.error('Goal optimization error:', error);
      return this.getFallbackGoalOptimization();
    }
  }

  // 🧠 PRODUCTIVITY DNA ANALYSIS
  async createProductivityDNA(userHistory) {
    // Return fallback if no API key
    if (!this.hasApiKey || !this.model) {
      return this.getFallbackDNA();
    }

    try {
      const prompt = `
Create a comprehensive "Productivity DNA" profile based on this user's history:

USER HISTORY: ${JSON.stringify(userHistory)}

ANALYZE AND CREATE DNA PROFILE:
1. Productivity Archetype (Explorer, Achiever, Optimizer, etc.)
2. Peak Performance Times
3. Motivation Triggers
4. Stress Patterns
5. Learning Style
6. Goal Preference (short-term vs long-term)
7. Social vs Solo preferences
8. Reward Sensitivity
9. Challenge Tolerance
10. Focus Patterns

PROVIDE:
- Detailed personality profile
- Strengths and weaknesses
- Personalized strategies
- Recommended habit types
- Optimal environment settings
- Communication style preferences

Return comprehensive JSON profile.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return this.parseProductivityDNA(response.text());
    } catch (error) {
      console.error('DNA analysis error:', error);
      return this.getFallbackDNA();
    }
  }

  // ⚡ AUTO HABIT CREATION
  async generateSmartHabits(userProfile, goals) {
    // Return fallback if no API key
    if (!this.hasApiKey || !this.model) {
      return this.getFallbackHabits();
    }

    try {
      const prompt = `
Generate personalized habits based on user profile and goals:

USER PROFILE: ${JSON.stringify(userProfile)}
GOALS: ${JSON.stringify(goals)}

CREATE HABITS THAT ARE:
1. Aligned with user's productivity DNA
2. Progressive difficulty (beginner to advanced)
3. Scientifically backed for effectiveness
4. Engaging and motivating
5. Realistic for user's lifestyle
6. Synergistic with existing habits

FOR EACH HABIT PROVIDE:
- Name and description
- Category and difficulty
- XP value and rewards
- Optimal timing
- Success strategies
- Progress tracking methods
- Motivation techniques

Generate 10-15 personalized habits in JSON format.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return this.parseHabitGeneration(response.text());
    } catch (error) {
      console.error('Habit generation error:', error);
      return this.getFallbackHabits();
    }
  }

  // 📊 REAL-TIME PERFORMANCE OPTIMIZATION
  async getRealtimeOptimization(currentState) {
    // Return fallback if no API key
    if (!this.hasApiKey || !this.model) {
      return this.getFallbackOptimization();
    }

    try {
      const prompt = `
Provide real-time optimization suggestions based on current state:

CURRENT STATE: ${JSON.stringify(currentState)}

ANALYZE:
1. Current energy level indicators
2. Focus and attention patterns
3. Stress and fatigue signals
4. Environmental factors
5. Time of day optimization

PROVIDE IMMEDIATE SUGGESTIONS:
- Task prioritization
- Break recommendations
- Environment adjustments
- Focus techniques
- Energy management
- Motivation boosters

Return actionable JSON recommendations.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return this.parseOptimizationSuggestions(response.text());
    } catch (error) {
      console.error('Real-time optimization error:', error);
      return this.getFallbackOptimization();
    }
  }

  // 🎨 PERSONALIZED UI ADAPTATION
  async adaptUI(userBehavior, preferences) {
    // Return fallback if no API key
    if (!this.hasApiKey || !this.model) {
      return this.getFallbackUIAdaptations();
    }

    try {
      const prompt = `
Adapt the UI based on user behavior and preferences:

USER BEHAVIOR: ${JSON.stringify(userBehavior)}
PREFERENCES: ${JSON.stringify(preferences)}

RECOMMEND UI ADAPTATIONS:
1. Layout optimizations
2. Color scheme preferences
3. Information density
4. Navigation patterns
5. Widget priorities
6. Notification settings
7. Visual complexity level
8. Interaction preferences

Return JSON with specific UI adaptation recommendations.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return this.parseUIAdaptations(response.text());
    } catch (error) {
      console.error('UI adaptation error:', error);
      return this.getFallbackUIAdaptations();
    }
  }

  // 🔬 ADVANCED ANALYTICS
  async generateAdvancedInsights(userData) {
    // Return fallback if no API key
    if (!this.hasApiKey || !this.model) {
      return this.getFallbackInsights();
    }

    try {
      const prompt = `
Generate advanced productivity insights and analytics:

USER DATA: ${JSON.stringify(userData)}

PROVIDE DEEP INSIGHTS:
1. Productivity trends and patterns
2. Correlation analysis between habits
3. Performance predictors
4. Optimization opportunities
5. Risk factors and warnings
6. Success pattern identification
7. Comparative benchmarking
8. Future performance projections

Return comprehensive analytics in JSON format.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return this.parseAdvancedInsights(response.text());
    } catch (error) {
      console.error('Advanced insights error:', error);
      return this.getFallbackInsights();
    }
  }

  // 🎯 HELPER METHODS
  parseAIResponse(text) {
    // Extract structured data from AI response
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('JSON parsing error:', error);
    }
    
    return this.extractStructuredData(text);
  }

  extractStructuredData(text) {
    // Fallback parsing for non-JSON responses
    const lines = text.split('\n');
    const data = {};
    
    lines.forEach(line => {
      if (line.includes(':')) {
        const [key, value] = line.split(':');
        data[key.trim()] = value.trim();
      }
    });
    
    return data;
  }

  // 🔄 FALLBACK METHODS
  getFallbackPredictions() {
    return {
      productiveHours: ['9:00-11:00', '14:00-16:00'],
      energyPattern: 'Morning peak, afternoon dip, evening recovery',
      optimalBreaks: 'Every 90 minutes',
      burnoutRisk: 'Low',
      recommendations: ['Take breaks regularly', 'Focus on morning tasks']
    };
  }

  getFallbackGoalOptimization() {
    return {
      optimizedGoals: [],
      recommendations: ['Break large goals into smaller steps', 'Set specific deadlines'],
      successProbability: 75
    };
  }

  getFallbackDNA() {
    return {
      archetype: 'Balanced Achiever',
      strengths: ['Consistent', 'Goal-oriented'],
      preferences: ['Morning productivity', 'Clear structure'],
      recommendations: ['Use time-blocking', 'Set daily priorities']
    };
  }

  getFallbackHabits() {
    return [
      {
        name: 'Morning Meditation',
        category: 'Wellness',
        difficulty: 3,
        xpValue: 25,
        description: 'Start your day with 10 minutes of mindfulness'
      },
      {
        name: 'Daily Planning',
        category: 'Organization',
        difficulty: 2,
        xpValue: 20,
        description: 'Plan your top 3 priorities for the day'
      }
    ];
  }

  getFallbackOptimization() {
    return {
      suggestions: ['Take a 5-minute break', 'Hydrate', 'Check posture'],
      priority: 'medium',
      reasoning: 'General wellness optimization'
    };
  }

  getFallbackUIAdaptations() {
    return {
      layout: 'standard',
      colorScheme: 'dark',
      density: 'medium',
      recommendations: ['Keep current layout', 'Enable dark mode']
    };
  }

  getFallbackInsights() {
    return {
      trends: ['Steady progress', 'Consistent engagement'],
      opportunities: ['Increase habit difficulty', 'Add social elements'],
      warnings: ['None detected'],
      score: 85
    };
  }

  // 🎯 PARSING METHODS
  parseGoalOptimization(text) {
    // Parse goal optimization response
    return this.parseAIResponse(text);
  }

  parseProductivityDNA(text) {
    // Parse DNA analysis response
    return this.parseAIResponse(text);
  }

  parseHabitGeneration(text) {
    // Parse habit generation response
    return this.parseAIResponse(text);
  }

  parseOptimizationSuggestions(text) {
    // Parse optimization suggestions
    return this.parseAIResponse(text);
  }

  parseUIAdaptations(text) {
    // Parse UI adaptation recommendations
    return this.parseAIResponse(text);
  }

  parseAdvancedInsights(text) {
    // Parse advanced insights
    return this.parseAIResponse(text);
  }
}

// Create singleton instance
const aiProductivityEngine = new AIProductivityEngine();

export default aiProductivityEngine;
