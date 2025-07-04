import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/authStore';
import useXPStore from '../store/xpStore';

const SocialHub = () => {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [challenges, setChallenges] = useState([]);
  const [friends, setFriends] = useState([]);
  const [guilds, setGuilds] = useState([]);
  
  const { user, profile } = useAuthStore();
  const { level, totalXP } = useXPStore();

  // Mock data for demonstration
  useEffect(() => {
    // Mock leaderboard data
    setFriends([
      { id: 1, name: 'Shadow Hunter', level: 15, xp: 1250, rank: 'A', streak: 12, avatar: '🗡️' },
      { id: 2, name: 'Iron Warrior', level: 12, xp: 980, rank: 'B', streak: 8, avatar: '⚔️' },
      { id: 3, name: 'Mage Knight', level: 18, xp: 1580, rank: 'S', streak: 15, avatar: '🔮' },
      { id: 4, name: 'Beast Tamer', level: 10, xp: 750, rank: 'C', streak: 5, avatar: '🐺' },
      { id: 5, name: 'Flame Archer', level: 14, xp: 1100, rank: 'B', streak: 10, avatar: '🏹' },
    ]);

    // Mock challenges
    setChallenges([
      {
        id: 1,
        title: '7-Day Consistency Challenge',
        description: 'Complete all habits for 7 days straight',
        participants: 156,
        reward: '500 XP + Legendary Badge',
        timeLeft: '3 days',
        difficulty: 'Hard',
        icon: '🔥'
      },
      {
        id: 2,
        title: 'Knowledge Seeker',
        description: 'Watch 5 Solo Leveling episodes this week',
        participants: 89,
        reward: '300 XP + Scholar Title',
        timeLeft: '5 days',
        difficulty: 'Medium',
        icon: '📚'
      },
      {
        id: 3,
        title: 'Early Bird Challenge',
        description: 'Wake up before 6 AM for 5 days',
        participants: 234,
        reward: '200 XP + Dawn Warrior Badge',
        timeLeft: '2 days',
        difficulty: 'Medium',
        icon: '🌅'
      }
    ]);

    // Mock guilds
    setGuilds([
      {
        id: 1,
        name: 'Shadow Monarchs',
        members: 45,
        level: 25,
        description: 'Elite hunters seeking ultimate power',
        requirements: 'Level 15+, 80% consistency',
        icon: '👑',
        rank: 1
      },
      {
        id: 2,
        name: 'Iron Will Society',
        members: 78,
        level: 18,
        description: 'Dedicated to building unbreakable habits',
        requirements: 'Level 10+, 30-day streak',
        icon: '⚡',
        rank: 2
      },
      {
        id: 3,
        name: 'Knowledge Seekers',
        members: 92,
        level: 22,
        description: 'Learning and growing together',
        requirements: 'Level 5+, Active participation',
        icon: '🧠',
        rank: 3
      }
    ]);
  }, []);

  const TabButton = ({ id, label, icon, isActive, onClick }) => (
    <motion.button
      onClick={() => onClick(id)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
        isActive
          ? 'bg-primary-600 text-white'
          : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </motion.button>
  );

  const LeaderboardCard = ({ friend, position }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: position * 0.1 }}
      className="flex items-center justify-between p-4 bg-dark-700/50 rounded-lg border border-gray-600 hover:border-primary-500/50 transition-all"
    >
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary-400">#{position + 1}</span>
          <span className="text-3xl">{friend.avatar}</span>
        </div>
        <div>
          <h3 className="font-bold text-white">{friend.name}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>Level {friend.level}</span>
            <span>{friend.rank}-Rank</span>
            <span>🔥 {friend.streak} days</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-lg font-bold text-accent-400">{friend.xp} XP</div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-sm bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded mt-1"
        >
          Challenge
        </motion.button>
      </div>
    </motion.div>
  );

  const ChallengeCard = ({ challenge }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6 hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{challenge.icon}</span>
          <div>
            <h3 className="font-bold text-white">{challenge.title}</h3>
            <p className="text-sm text-gray-400">{challenge.description}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-bold ${
          challenge.difficulty === 'Hard' ? 'bg-red-900/30 text-red-400' :
          challenge.difficulty === 'Medium' ? 'bg-yellow-900/30 text-yellow-400' :
          'bg-green-900/30 text-green-400'
        }`}>
          {challenge.difficulty}
        </span>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Participants:</span>
          <span className="text-white font-bold">{challenge.participants}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Reward:</span>
          <span className="text-accent-400 font-bold">{challenge.reward}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Time Left:</span>
          <span className="text-orange-400 font-bold">{challenge.timeLeft}</span>
        </div>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white py-2 rounded-lg font-bold"
      >
        Join Challenge
      </motion.button>
    </motion.div>
  );

  const GuildCard = ({ guild }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card p-6 hover:shadow-lg transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-4xl">{guild.icon}</span>
          <div>
            <h3 className="font-bold text-white">{guild.name}</h3>
            <p className="text-sm text-gray-400">Rank #{guild.rank} Guild</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-primary-400">Lv.{guild.level}</div>
          <div className="text-sm text-gray-400">{guild.members} members</div>
        </div>
      </div>
      
      <p className="text-gray-300 text-sm mb-4">{guild.description}</p>
      
      <div className="bg-dark-700/50 rounded-lg p-3 mb-4">
        <h4 className="text-sm font-bold text-accent-400 mb-1">Requirements:</h4>
        <p className="text-xs text-gray-400">{guild.requirements}</p>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-accent-600 to-purple-600 text-white py-2 rounded-lg font-bold"
      >
        Apply to Join
      </motion.button>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-gaming font-bold text-gradient mb-2">
          Social Hub
        </h2>
        <p className="text-gray-400">
          Compete, collaborate, and conquer together
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center space-x-2">
        <TabButton
          id="leaderboard"
          label="Leaderboard"
          icon="🏆"
          isActive={activeTab === 'leaderboard'}
          onClick={setActiveTab}
        />
        <TabButton
          id="challenges"
          label="Challenges"
          icon="⚔️"
          isActive={activeTab === 'challenges'}
          onClick={setActiveTab}
        />
        <TabButton
          id="guilds"
          label="Guilds"
          icon="🏰"
          isActive={activeTab === 'guilds'}
          onClick={setActiveTab}
        />
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'leaderboard' && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="card p-4 bg-gradient-to-r from-primary-900/30 to-accent-900/30 border border-primary-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">👑</span>
                  <div>
                    <h3 className="font-bold text-white">Your Rank</h3>
                    <p className="text-sm text-gray-400">Level {level} • {totalXP} XP</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-400">#7</div>
                  <div className="text-sm text-gray-400">This week</div>
                </div>
              </div>
            </div>
            
            {friends.map((friend, index) => (
              <LeaderboardCard key={friend.id} friend={friend} position={index} />
            ))}
          </motion.div>
        )}

        {activeTab === 'challenges' && (
          <motion.div
            key="challenges"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {challenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </motion.div>
        )}

        {activeTab === 'guilds' && (
          <motion.div
            key="guilds"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {guilds.map((guild) => (
              <GuildCard key={guild.id} guild={guild} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialHub;
