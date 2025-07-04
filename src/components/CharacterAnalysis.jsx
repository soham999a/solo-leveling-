import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CharacterAnalysis = ({ season, watchedEpisodes }) => {
  const [selectedCharacter, setSelectedCharacter] = useState('jinwoo');

  const characters = {
    jinwoo: {
      name: 'Sung Jin-Woo',
      title: 'The Shadow Monarch',
      image: '🗡️',
      description: 'The protagonist who transforms from the weakest E-rank hunter to the most powerful being.',
      traits: [
        'Determination and perseverance',
        'Strategic thinking',
        'Loyalty to family',
        'Continuous self-improvement',
        'Leadership development'
      ],
      development: {
        season1: 'Awakens to the System and begins his transformation from weakness to strength',
        season2: 'Embraces his role as the Shadow Monarch and faces greater challenges'
      },
      realWorldLessons: [
        'Systematic approach to personal growth',
        'Importance of daily discipline and habits',
        'How to turn weaknesses into strengths',
        'The power of consistent effort over time',
        'Leadership through example and competence'
      ],
      quotes: [
        '"I\'m used to it." - Accepting current circumstances while working to change them',
        '"If I don\'t do it, who will?" - Taking responsibility for your own growth',
        '"I will become stronger." - Clear commitment to improvement'
      ]
    },
    chaehae: {
      name: 'Cha Hae-In',
      title: 'S-Rank Hunter',
      image: '⚔️',
      description: 'A powerful S-rank hunter who becomes an important ally and eventual romantic interest.',
      traits: [
        'Strong moral compass',
        'Independent and capable',
        'Protective of others',
        'Professional excellence',
        'Emotional intelligence'
      ],
      development: {
        season1: 'Establishes herself as a formidable hunter with unique abilities',
        season2: 'Develops deeper connections and shows vulnerability alongside strength'
      },
      realWorldLessons: [
        'Balancing strength with compassion',
        'Professional excellence and personal growth',
        'The importance of having strong principles',
        'Building meaningful relationships while maintaining independence',
        'Leading by example in challenging situations'
      ],
      quotes: [
        '"Strength isn\'t just about power." - Understanding true strength',
        '"I\'ll protect what matters." - Clear priorities and values'
      ]
    },
    goto: {
      name: 'Goto Ryuji',
      title: 'Japanese S-Rank Hunter',
      image: '🔥',
      description: 'A powerful Japanese hunter who represents the pinnacle of traditional hunter strength.',
      traits: [
        'Confidence and pride',
        'Competitive spirit',
        'Recognition of true strength',
        'Honor and respect',
        'Adaptability'
      ],
      development: {
        season1: 'Represents the established order of powerful hunters',
        season2: 'Learns to recognize and respect new forms of power'
      },
      realWorldLessons: [
        'Healthy competition drives improvement',
        'Recognizing when others surpass you',
        'Adapting to changing circumstances',
        'Maintaining dignity in defeat',
        'The value of mutual respect'
      ],
      quotes: [
        '"True strength recognizes true strength." - Acknowledging excellence in others'
      ]
    }
  };

  const currentCharacter = characters[selectedCharacter];
  const watchedCount = watchedEpisodes.filter(ep => ep.season === season).length;

  return (
    <div className="space-y-8">
      {/* Character Selector */}
      <div className="card p-6">
        <h3 className="text-lg font-gaming font-bold text-white mb-4">
          Character Analysis
        </h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(characters).map(([key, character]) => (
            <motion.button
              key={key}
              onClick={() => setSelectedCharacter(key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCharacter === key
                  ? 'bg-accent-600 text-white'
                  : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
              }`}
            >
              {character.image} {character.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Character Details */}
      <motion.div
        key={selectedCharacter}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Character Overview */}
        <div className="card p-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{currentCharacter.image}</div>
            <h2 className="text-2xl font-gaming font-bold text-white mb-2">
              {currentCharacter.name}
            </h2>
            <p className="text-accent-400 font-medium mb-4">
              {currentCharacter.title}
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              {currentCharacter.description}
            </p>
          </div>

          {/* Character Traits */}
          <div className="mb-6">
            <h4 className="text-primary-400 font-medium mb-3">Key Traits:</h4>
            <div className="space-y-2">
              {currentCharacter.traits.map((trait, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center text-sm text-gray-300"
                >
                  <span className="w-2 h-2 bg-accent-400 rounded-full mr-3"></span>
                  {trait}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Character Development */}
          <div>
            <h4 className="text-primary-400 font-medium mb-3">Character Development:</h4>
            <div className="space-y-3">
              <div className="bg-dark-700/50 rounded-lg p-3">
                <h5 className="text-accent-400 text-sm font-medium mb-1">Season 1:</h5>
                <p className="text-gray-300 text-sm">{currentCharacter.development.season1}</p>
              </div>
              <div className="bg-dark-700/50 rounded-lg p-3">
                <h5 className="text-accent-400 text-sm font-medium mb-1">Season 2:</h5>
                <p className="text-gray-300 text-sm">{currentCharacter.development.season2}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Real-World Applications */}
        <div className="space-y-6">
          {/* Life Lessons */}
          <div className="card p-6">
            <h4 className="text-primary-400 font-medium mb-4">Real-World Applications:</h4>
            <div className="space-y-3">
              {currentCharacter.realWorldLessons.map((lesson, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-dark-700/50 rounded-lg p-3"
                >
                  <div className="flex items-start">
                    <span className="text-accent-400 mr-2 mt-1">💡</span>
                    <p className="text-gray-300 text-sm">{lesson}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Memorable Quotes */}
          <div className="card p-6">
            <h4 className="text-primary-400 font-medium mb-4">Memorable Quotes:</h4>
            <div className="space-y-4">
              {currentCharacter.quotes.map((quote, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-gradient-to-r from-dark-700/50 to-dark-600/50 rounded-lg p-4 border-l-4 border-accent-400"
                >
                  <p className="text-gray-300 text-sm italic leading-relaxed">
                    {quote}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="card p-6">
            <h4 className="text-primary-400 font-medium mb-4">Your Analysis Progress:</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Episodes Analyzed</span>
                <span className="text-accent-400 font-bold">{watchedCount}</span>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-2">
                <motion.div
                  className="h-full bg-gradient-to-r from-accent-500 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((watchedCount / 12) * 100, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <p className="text-xs text-gray-400">
                {watchedCount < 12 
                  ? `Watch ${12 - watchedCount} more episodes to unlock deeper character insights`
                  : 'All character insights unlocked! You\'re a true Solo Leveling scholar.'
                }
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Character Comparison (if multiple characters unlocked) */}
      {watchedCount >= 5 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <h4 className="text-primary-400 font-medium mb-4">Character Growth Parallels:</h4>
          <div className="bg-dark-700/50 rounded-lg p-4">
            <p className="text-gray-300 text-sm leading-relaxed">
              <span className="text-accent-400 font-medium">Jin-Woo's Transformation:</span> Like Jin-Woo's systematic 
              approach to leveling up, you can apply similar principles to your own personal development. 
              His journey from weakness to strength mirrors the process of building habits, gaining skills, 
              and consistently working toward your goals.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CharacterAnalysis;
