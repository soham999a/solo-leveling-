import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useKnowledgeStore from '../store/knowledgeStore';

const KnowledgeSkillTree = () => {
  const { knowledgeXP, knowledgeLevel, watchedEpisodes } = useKnowledgeStore();
  const [selectedSkill, setSelectedSkill] = useState(null);

  const skills = [
    {
      id: 'hunter_basics',
      name: 'Hunter Basics',
      description: 'Understanding the fundamentals of the hunter world',
      icon: '🎯',
      requiredXP: 0,
      requiredLevel: 1,
      unlocked: true,
      benefits: ['Basic understanding of hunter ranks', 'Introduction to dungeon mechanics']
    },
    {
      id: 'system_mastery',
      name: 'System Mastery',
      description: 'Deep understanding of the leveling system',
      icon: '⚙️',
      requiredXP: 100,
      requiredLevel: 2,
      unlocked: knowledgeXP >= 100,
      benefits: ['Advanced XP optimization', 'Quest completion strategies', 'Daily habit formation']
    },
    {
      id: 'strategic_thinking',
      name: 'Strategic Thinking',
      description: 'Learning Jin-Woo\'s tactical approach',
      icon: '🧠',
      requiredXP: 250,
      requiredLevel: 3,
      unlocked: knowledgeXP >= 250,
      benefits: ['Problem-solving techniques', 'Risk assessment skills', 'Long-term planning']
    },
    {
      id: 'leadership_skills',
      name: 'Leadership Skills',
      description: 'Command and inspire like the Shadow Monarch',
      icon: '👑',
      requiredXP: 500,
      requiredLevel: 5,
      unlocked: knowledgeXP >= 500,
      benefits: ['Team management', 'Delegation mastery', 'Inspiring others']
    },
    {
      id: 'shadow_mastery',
      name: 'Shadow Mastery',
      description: 'Understanding the power of the Shadow Army',
      icon: '🌑',
      requiredXP: 750,
      requiredLevel: 8,
      unlocked: knowledgeXP >= 750,
      benefits: ['Resource multiplication', 'Passive income strategies', 'System automation']
    },
    {
      id: 'monarch_wisdom',
      name: 'Monarch Wisdom',
      description: 'The ultimate understanding of power and responsibility',
      icon: '⚡',
      requiredXP: 1000,
      requiredLevel: 10,
      unlocked: knowledgeXP >= 1000,
      benefits: ['Master-level decision making', 'Ultimate responsibility', 'Legacy building']
    }
  ];

  const getSkillProgress = (skill) => {
    if (!skill.unlocked) {
      return Math.min((knowledgeXP / skill.requiredXP) * 100, 100);
    }
    return 100;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-gaming font-bold text-gradient mb-2">
          Knowledge Skill Tree
        </h2>
        <p className="text-gray-400">
          Unlock abilities by watching Solo Leveling and gaining Knowledge XP
        </p>
      </div>

      {/* Skill Tree Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedSkill(skill)}
            className={`relative cursor-pointer transition-all duration-300 ${
              skill.unlocked 
                ? 'transform hover:scale-105' 
                : 'opacity-60'
            }`}
          >
            {/* Skill Card */}
            <div className={`card p-4 border-2 transition-all ${
              skill.unlocked
                ? 'border-green-500/50 bg-green-900/10'
                : 'border-gray-600 bg-gray-800/50'
            } ${selectedSkill?.id === skill.id ? 'ring-2 ring-primary-500' : ''}`}>
              
              {/* Skill Icon */}
              <div className="text-center mb-3">
                <div className={`text-4xl mb-2 ${skill.unlocked ? '' : 'grayscale'}`}>
                  {skill.icon}
                </div>
                <h3 className={`font-gaming font-bold ${
                  skill.unlocked ? 'text-white' : 'text-gray-400'
                }`}>
                  {skill.name}
                </h3>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{Math.round(getSkillProgress(skill))}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className={`h-full rounded-full ${
                      skill.unlocked 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'bg-gradient-to-r from-gray-500 to-gray-400'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${getSkillProgress(skill)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Requirements */}
              <div className="text-xs text-gray-400 space-y-1">
                <div className="flex justify-between">
                  <span>Required XP:</span>
                  <span className={knowledgeXP >= skill.requiredXP ? 'text-green-400' : 'text-red-400'}>
                    {skill.requiredXP}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Required Level:</span>
                  <span className={knowledgeLevel >= skill.requiredLevel ? 'text-green-400' : 'text-red-400'}>
                    {skill.requiredLevel}
                  </span>
                </div>
              </div>

              {/* Unlock Status */}
              {skill.unlocked && (
                <div className="absolute top-2 right-2">
                  <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    ✓
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Skill Details Modal */}
      {selectedSkill && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedSkill(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <div className="text-6xl mb-3">{selectedSkill.icon}</div>
              <h3 className="text-xl font-gaming font-bold text-white mb-2">
                {selectedSkill.name}
              </h3>
              <p className="text-gray-300 text-sm">
                {selectedSkill.description}
              </p>
            </div>

            {/* Benefits */}
            <div className="mb-6">
              <h4 className="text-primary-400 font-medium mb-3">Benefits:</h4>
              <div className="space-y-2">
                {selectedSkill.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start text-sm text-gray-300">
                    <span className="text-accent-400 mr-2">•</span>
                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="text-center">
              {selectedSkill.unlocked ? (
                <div className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium">
                  ✓ Unlocked
                </div>
              ) : (
                <div className="bg-gray-600 text-white py-2 px-4 rounded-lg font-medium">
                  🔒 Locked - Need {selectedSkill.requiredXP - knowledgeXP} more XP
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedSkill(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Current Progress Summary */}
      <div className="card p-6 text-center">
        <h3 className="text-lg font-gaming font-bold text-white mb-4">
          Your Knowledge Journey
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-2xl font-bold text-accent-400">{knowledgeLevel}</div>
            <div className="text-sm text-gray-400">Knowledge Level</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary-400">{knowledgeXP}</div>
            <div className="text-sm text-gray-400">Total Knowledge XP</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">
              {skills.filter(s => s.unlocked).length}
            </div>
            <div className="text-sm text-gray-400">Skills Unlocked</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeSkillTree;
