import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useHabitStore from '../store/habitStore';
import useXPStore from '../store/xpStore';
import useKnowledgeStore from '../store/knowledgeStore';

const Analytics = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('week'); // week, month, year
  const [selectedMetric, setSelectedMetric] = useState('overview');
  
  const { user, profile } = useAuthStore();
  const { habits, completions, getHabitStats } = useHabitStore();
  const { level, totalXP, xpHistory } = useXPStore();
  const { knowledgeXP, knowledgeLevel, watchedEpisodes } = useKnowledgeStore();

  // Calculate advanced metrics
  const analytics = useMemo(() => {
    const now = new Date();
    const daysBack = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
    
    // Productivity Score (0-100)
    const completedToday = Object.values(completions).filter(dates => 
      dates.includes(now.toISOString().split('T')[0])
    ).length;
    const productivityScore = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;
    
    // Streak Analysis
    const streaks = habits.map(habit => {
      const stats = getHabitStats(habit.id);
      return stats.currentStreak;
    });
    const avgStreak = streaks.length > 0 ? Math.round(streaks.reduce((a, b) => a + b, 0) / streaks.length) : 0;
    const maxStreak = Math.max(...streaks, 0);
    
    // XP Growth Rate
    const xpGrowthRate = totalXP > 0 ? Math.round((totalXP / Math.max(1, daysBack)) * 7) : 0; // XP per week
    
    // Consistency Score
    const totalPossibleCompletions = habits.length * daysBack;
    const actualCompletions = Object.values(completions).reduce((total, dates) => {
      return total + dates.filter(date => {
        const dateObj = new Date(date);
        const daysDiff = Math.floor((now - dateObj) / (1000 * 60 * 60 * 24));
        return daysDiff <= daysBack;
      }).length;
    }, 0);
    const consistencyScore = totalPossibleCompletions > 0 ? Math.round((actualCompletions / totalPossibleCompletions) * 100) : 0;
    
    // Predicted Level
    const daysToNextLevel = Math.ceil((((level + 1) * 100) - (totalXP % 100)) / Math.max(1, xpGrowthRate / 7));
    const predictedLevel = level + Math.floor(xpGrowthRate * 4 / 100); // 4 weeks projection
    
    return {
      productivityScore,
      avgStreak,
      maxStreak,
      xpGrowthRate,
      consistencyScore,
      daysToNextLevel,
      predictedLevel,
      totalHabits: habits.length,
      activeStreaks: streaks.filter(s => s > 0).length,
      knowledgeProgress: Math.round((knowledgeXP / 1000) * 100), // Progress to max knowledge
      episodesWatched: watchedEpisodes.length
    };
  }, [habits, completions, totalXP, level, timeRange, knowledgeXP, watchedEpisodes]);

  const MetricCard = ({ title, value, subtitle, icon, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6 hover:shadow-lg transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`text-3xl ${color}`}>{icon}</div>
        {trend && (
          <div className={`text-sm px-2 py-1 rounded ${
            trend > 0 ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
          }`}>
            {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{title}</div>
      {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
    </motion.div>
  );

  const ProgressRing = ({ percentage, size = 120, strokeWidth = 8, color = "#3B82F6" }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#374151"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{percentage}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Header */}
      <header className="bg-dark-800/50 backdrop-blur-sm border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <motion.button
                onClick={() => navigate('/dashboard')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Back to Dashboard
              </motion.button>
              <h1 className="text-xl font-gaming font-bold text-gradient">
                ADVANCED ANALYTICS
              </h1>
            </div>
            
            {/* Time Range Selector */}
            <div className="flex items-center space-x-2">
              {['week', 'month', 'year'].map((range) => (
                <motion.button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    timeRange === range
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Productivity Score"
            value={analytics.productivityScore}
            subtitle="Today's completion rate"
            icon="⚡"
            color="text-yellow-400"
            trend={5}
          />
          <MetricCard
            title="Consistency Score"
            value={analytics.consistencyScore}
            subtitle={`${timeRange} average`}
            icon="🎯"
            color="text-blue-400"
            trend={3}
          />
          <MetricCard
            title="XP Growth Rate"
            value={analytics.xpGrowthRate}
            subtitle="XP per week"
            icon="📈"
            color="text-green-400"
            trend={8}
          />
          <MetricCard
            title="Active Streaks"
            value={analytics.activeStreaks}
            subtitle={`Max: ${analytics.maxStreak} days`}
            icon="🔥"
            color="text-orange-400"
            trend={2}
          />
        </div>

        {/* Progress Rings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 text-center">
            <h3 className="text-lg font-bold text-white mb-4">Overall Progress</h3>
            <ProgressRing 
              percentage={analytics.productivityScore} 
              color="#3B82F6"
            />
            <p className="text-gray-400 mt-4">Hunter Level {level}</p>
          </div>
          
          <div className="card p-6 text-center">
            <h3 className="text-lg font-bold text-white mb-4">Knowledge Progress</h3>
            <ProgressRing 
              percentage={analytics.knowledgeProgress} 
              color="#9333EA"
            />
            <p className="text-gray-400 mt-4">Knowledge Level {knowledgeLevel}</p>
          </div>
          
          <div className="card p-6 text-center">
            <h3 className="text-lg font-bold text-white mb-4">Consistency</h3>
            <ProgressRing 
              percentage={analytics.consistencyScore} 
              color="#10B981"
            />
            <p className="text-gray-400 mt-4">Avg Streak: {analytics.avgStreak} days</p>
          </div>
        </div>

        {/* Predictions & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card p-6">
            <h3 className="text-lg font-bold text-white mb-4">🔮 Predictions</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-dark-700/50 rounded-lg">
                <span className="text-gray-300">Next Level Up</span>
                <span className="text-primary-400 font-bold">{analytics.daysToNextLevel} days</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-dark-700/50 rounded-lg">
                <span className="text-gray-300">Predicted Level (1 month)</span>
                <span className="text-accent-400 font-bold">Level {analytics.predictedLevel}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-dark-700/50 rounded-lg">
                <span className="text-gray-300">Knowledge Mastery</span>
                <span className="text-purple-400 font-bold">{Math.round((analytics.knowledgeProgress / 100) * 30)} days</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-bold text-white mb-4">💡 AI Insights</h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                <p className="text-blue-300 text-sm">
                  🎯 Your consistency is {analytics.consistencyScore > 70 ? 'excellent' : 'improving'}! 
                  Keep focusing on daily habits.
                </p>
              </div>
              <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                <p className="text-green-300 text-sm">
                  📈 XP growth rate is {analytics.xpGrowthRate > 50 ? 'outstanding' : 'steady'}. 
                  You're on track for major progress!
                </p>
              </div>
              <div className="p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
                <p className="text-purple-300 text-sm">
                  📚 Knowledge progress: {analytics.episodesWatched} episodes watched. 
                  Learning fuels growth!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Habit Performance */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-white mb-6">📊 Habit Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {habits.map((habit) => {
              const stats = getHabitStats(habit.id);
              const completionRate = Math.round((stats.totalCompletions / Math.max(1, stats.totalDays)) * 100);
              
              return (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-dark-700/50 rounded-lg border border-gray-600"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{habit.icon || '⭐'}</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      completionRate >= 80 ? 'bg-green-900/30 text-green-400' :
                      completionRate >= 60 ? 'bg-yellow-900/30 text-yellow-400' :
                      'bg-red-900/30 text-red-400'
                    }`}>
                      {completionRate}%
                    </span>
                  </div>
                  <h4 className="font-bold text-white mb-2">{habit.name}</h4>
                  <div className="text-sm text-gray-400 space-y-1">
                    <div>Streak: {stats.currentStreak} days</div>
                    <div>Total: {stats.totalCompletions} times</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
