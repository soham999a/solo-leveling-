import React from 'react';
import { motion } from 'framer-motion';
import useKnowledgeStore from '../store/knowledgeStore';

const KnowledgeProgress = ({ episodes, watchedEpisodes, knowledgeXP }) => {
  const { getWatchingStreak, getSeasonProgress, knowledgeLevel } = useKnowledgeStore();
  
  const streak = getWatchingStreak();
  const season1Progress = getSeasonProgress(1);
  const season2Progress = getSeasonProgress(2);
  
  const totalWatchTime = watchedEpisodes.reduce((sum, ep) => sum + (ep.duration || 0), 0);
  const avgEpisodeLength = episodes.length > 0 ? episodes.reduce((sum, ep) => sum + ep.duration, 0) / episodes.length : 0;
  
  const knowledgeStats = [
    {
      label: 'Knowledge Level',
      value: knowledgeLevel,
      icon: '🎓',
      color: 'text-accent-400'
    },
    {
      label: 'Total Knowledge XP',
      value: knowledgeXP,
      icon: '⭐',
      color: 'text-primary-400'
    },
    {
      label: 'Episodes Watched',
      value: watchedEpisodes.length,
      icon: '📺',
      color: 'text-green-400'
    },
    {
      label: 'Watch Streak',
      value: `${streak} days`,
      icon: '🔥',
      color: 'text-orange-400'
    },
    {
      label: 'Total Watch Time',
      value: `${Math.floor(totalWatchTime / 60)}h ${totalWatchTime % 60}m`,
      icon: '⏱️',
      color: 'text-blue-400'
    },
    {
      label: 'Avg Episode Length',
      value: `${Math.round(avgEpisodeLength)} min`,
      icon: '📊',
      color: 'text-purple-400'
    }
  ];

  const achievements = [
    {
      id: 'first_episode',
      title: 'First Step',
      description: 'Watched your first episode',
      icon: '🎬',
      unlocked: watchedEpisodes.length >= 1,
      requirement: '1 episode'
    },
    {
      id: 'season_complete',
      title: 'Season Master',
      description: 'Completed an entire season',
      icon: '👑',
      unlocked: season1Progress.percentage === 100 || season2Progress.percentage === 100,
      requirement: 'Complete 1 season'
    },
    {
      id: 'knowledge_seeker',
      title: 'Knowledge Seeker',
      description: 'Reached Knowledge Level 5',
      icon: '📚',
      unlocked: knowledgeLevel >= 5,
      requirement: 'Level 5'
    },
    {
      id: 'streak_master',
      title: 'Consistency Master',
      description: 'Maintained a 7-day watching streak',
      icon: '🔥',
      unlocked: streak >= 7,
      requirement: '7-day streak'
    },
    {
      id: 'binge_watcher',
      title: 'Dedicated Hunter',
      description: 'Watched 10+ episodes',
      icon: '⚡',
      unlocked: watchedEpisodes.length >= 10,
      requirement: '10 episodes'
    },
    {
      id: 'knowledge_master',
      title: 'Solo Leveling Scholar',
      description: 'Earned 1000+ Knowledge XP',
      icon: '🏆',
      unlocked: knowledgeXP >= 1000,
      requirement: '1000 XP'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Knowledge Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {knowledgeStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-4 text-center"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className={`text-2xl font-bold ${stat.color} mb-1`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Season Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Season 1 Progress */}
        <div className="card p-6">
          <h3 className="text-lg font-gaming font-bold text-white mb-4">
            Season 1 Progress
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Episodes Watched</span>
              <span className="text-primary-400 font-bold">
                {season1Progress.watched}/{season1Progress.total}
              </span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-3">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${season1Progress.percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="text-sm text-gray-400">
              {season1Progress.percentage.toFixed(1)}% Complete
            </div>
          </div>
        </div>

        {/* Season 2 Progress */}
        <div className="card p-6">
          <h3 className="text-lg font-gaming font-bold text-white mb-4">
            Season 2 Progress
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Episodes Watched</span>
              <span className="text-primary-400 font-bold">
                {season2Progress.watched}/{season2Progress.total}
              </span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-3">
              <motion.div
                className="h-full bg-gradient-to-r from-accent-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${season2Progress.percentage}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              />
            </div>
            <div className="text-sm text-gray-400">
              {season2Progress.percentage.toFixed(1)}% Complete
            </div>
          </div>
        </div>
      </div>

      {/* Knowledge Level Progress */}
      <div className="card p-6">
        <h3 className="text-lg font-gaming font-bold text-white mb-4">
          Knowledge Level Progress
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Level {knowledgeLevel}</span>
            <span className="text-accent-400 font-bold">
              {knowledgeXP % 100}/100 XP
            </span>
          </div>
          <div className="w-full bg-dark-700 rounded-full h-4">
            <motion.div
              className="h-full bg-gradient-to-r from-accent-500 to-purple-500 rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${(knowledgeXP % 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse rounded-full"></div>
            </motion.div>
          </div>
          <div className="text-sm text-gray-400">
            {100 - (knowledgeXP % 100)} XP to next level
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="card p-6">
        <h3 className="text-lg font-gaming font-bold text-white mb-6">
          Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border transition-all ${
                achievement.unlocked
                  ? 'bg-green-900/20 border-green-500/50'
                  : 'bg-dark-700/50 border-gray-600'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold ${
                    achievement.unlocked ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-gray-400 mb-1">
                    {achievement.description}
                  </p>
                  <div className="text-xs text-gray-500">
                    {achievement.requirement}
                  </div>
                </div>
                {achievement.unlocked && (
                  <div className="text-green-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeProgress;
