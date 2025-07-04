import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useKnowledgeStore from '../store/knowledgeStore';
import EpisodeCard from '../components/EpisodeCard';
import KnowledgeProgress from '../components/KnowledgeProgress';
import CharacterAnalysis from '../components/CharacterAnalysis';
import KnowledgeSkillTree from '../components/KnowledgeSkillTree';

const KnowledgeHub = () => {
  const navigate = useNavigate();
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [viewMode, setViewMode] = useState('episodes'); // episodes, progress, analysis, skills

  const { user, profile } = useAuthStore();
  const { 
    episodes, 
    watchedEpisodes, 
    knowledgeXP, 
    loadEpisodes, 
    loadWatchedEpisodes,
    markEpisodeWatched 
  } = useKnowledgeStore();

  useEffect(() => {
    if (user) {
      loadEpisodes();
      loadWatchedEpisodes(user.uid);
    }
  }, [user, loadEpisodes, loadWatchedEpisodes]);

  const seasonEpisodes = episodes.filter(ep => ep.season === selectedSeason);
  const watchedCount = watchedEpisodes.filter(ep => ep.season === selectedSeason).length;
  const progressPercentage = seasonEpisodes.length > 0 ? (watchedCount / seasonEpisodes.length) * 100 : 0;

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
                KNOWLEDGE HUB
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400">Knowledge XP:</span>
                <span className="text-lg font-bold text-accent-400">{knowledgeXP}</span>
              </div>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              {['episodes', 'progress', 'analysis', 'skills'].map((mode) => (
                <motion.button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    viewMode === mode
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Season Selector */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-gaming font-bold text-white">
              Solo Leveling - Season {selectedSeason}
            </h2>
            <div className="flex space-x-2">
              {[1, 2].map((season) => (
                <motion.button
                  key={season}
                  onClick={() => setSelectedSeason(season)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedSeason === season
                      ? 'bg-accent-600 text-white'
                      : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                  }`}
                >
                  Season {season}
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="card p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Season {selectedSeason} Progress</span>
              <span className="text-primary-400 font-bold">{watchedCount}/{seasonEpisodes.length}</span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-3">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="text-sm text-gray-400 mt-1">
              {progressPercentage.toFixed(1)}% Complete
            </div>
          </div>
        </div>

        {/* Content based on view mode */}
        {viewMode === 'episodes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seasonEpisodes.map((episode, index) => (
              <motion.div
                key={episode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <EpisodeCard
                  episode={episode}
                  isWatched={watchedEpisodes.some(w => w.episodeId === episode.id)}
                  onMarkWatched={() => markEpisodeWatched(user.uid, episode)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {viewMode === 'progress' && (
          <KnowledgeProgress 
            episodes={seasonEpisodes}
            watchedEpisodes={watchedEpisodes}
            knowledgeXP={knowledgeXP}
          />
        )}

        {viewMode === 'analysis' && (
          <CharacterAnalysis
            season={selectedSeason}
            watchedEpisodes={watchedEpisodes}
          />
        )}

        {viewMode === 'skills' && (
          <KnowledgeSkillTree />
        )}
      </main>
    </div>
  );
};

export default KnowledgeHub;
