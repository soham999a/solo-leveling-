import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useKnowledgeStore from '../store/knowledgeStore';

const EpisodeCard = ({ episode, isWatched, onMarkWatched }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showInsight, setShowInsight] = useState(false);
  const { generateEpisodeInsight } = useKnowledgeStore();

  const handleWatchClick = () => {
    if (!isWatched) {
      onMarkWatched();
    }
  };

  const handleInsightClick = async () => {
    if (!showInsight) {
      const insight = await generateEpisodeInsight(episode.id);
      // You could store this insight in state if needed
    }
    setShowInsight(!showInsight);
  };

  return (
    <motion.div
      className={`card-glow relative overflow-hidden ${
        isWatched ? 'border-green-500/50' : 'border-gray-700'
      }`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Watched Badge */}
      {isWatched && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
            <span className="mr-1">✓</span>
            WATCHED
          </div>
        </div>
      )}

      {/* Episode Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-gaming font-bold text-white mb-1">
              Episode {episode.episode}
            </h3>
            <h4 className="text-primary-400 font-medium mb-2">
              {episode.title}
            </h4>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>{episode.duration} min</span>
              <span>+{episode.xpReward} XP</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-4 leading-relaxed">
          {episode.description}
        </p>

        {/* Knowledge Points Preview */}
        <div className="mb-4">
          <h5 className="text-accent-400 font-medium text-sm mb-2">Key Learning Points:</h5>
          <div className="space-y-1">
            {episode.knowledgePoints.slice(0, 2).map((point, index) => (
              <div key={index} className="text-xs text-gray-400 flex items-center">
                <span className="w-1 h-1 bg-accent-400 rounded-full mr-2"></span>
                {point}
              </div>
            ))}
            {episode.knowledgePoints.length > 2 && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
              >
                {showDetails ? 'Show less' : `+${episode.knowledgePoints.length - 2} more`}
              </button>
            )}
          </div>
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 border-t border-gray-700 pt-4"
          >
            <h5 className="text-accent-400 font-medium text-sm mb-2">Learning Objectives:</h5>
            <div className="space-y-1 mb-4">
              {episode.learningObjectives.map((objective, index) => (
                <div key={index} className="text-xs text-gray-400 flex items-start">
                  <span className="w-1 h-1 bg-primary-400 rounded-full mr-2 mt-1.5"></span>
                  {objective}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* AI Insight Section */}
        {showInsight && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 border-t border-gray-700 pt-4"
          >
            <div className="bg-dark-700/50 rounded-lg p-4">
              <h5 className="text-accent-400 font-medium text-sm mb-2 flex items-center">
                <span className="mr-2">🤖</span>
                AI Analysis
              </h5>
              <div className="space-y-3 text-xs text-gray-300">
                <div>
                  <span className="text-primary-400 font-medium">Summary:</span>
                  <p className="mt-1">Episode {episode.episode}: {episode.title} explores themes of {episode.knowledgePoints.join(', ')}.</p>
                </div>
                <div>
                  <span className="text-primary-400 font-medium">Real-world Applications:</span>
                  <ul className="mt-1 space-y-1">
                    <li>• Apply systematic improvement to personal goals</li>
                    <li>• Develop daily discipline habits</li>
                    <li>• Embrace challenges as growth opportunities</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {/* Watch/Mark Watched Button */}
          <motion.button
            onClick={handleWatchClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isWatched}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
              isWatched
                ? 'bg-green-600 text-white cursor-default'
                : 'bg-primary-600 hover:bg-primary-700 text-white'
            }`}
          >
            {isWatched ? 'Completed' : 'Mark as Watched'}
          </motion.button>

          {/* Streaming Links */}
          <div className="flex space-x-1">
            {episode.streamingLinks?.crunchyroll && (
              <motion.a
                href={episode.streamingLinks.crunchyroll}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-all"
              >
                CR
              </motion.a>
            )}
            {episode.streamingLinks?.funimation && (
              <motion.a
                href={episode.streamingLinks.funimation}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-all"
              >
                FUN
              </motion.a>
            )}
          </div>

          {/* AI Insight Button */}
          <motion.button
            onClick={handleInsightClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-accent-600 hover:bg-accent-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-all"
          >
            🤖
          </motion.button>
        </div>
      </div>

      {/* XP Reward Indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500 opacity-50"></div>
    </motion.div>
  );
};

export default EpisodeCard;
