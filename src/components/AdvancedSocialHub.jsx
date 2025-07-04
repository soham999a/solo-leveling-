import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingParticles, MagicParticles } from './ParticleSystem';
import { useEpicSounds } from '../hooks/useEpicSounds';
import useAuthStore from '../store/authStore';
import useXPStore from '../store/xpStore';

const AdvancedSocialHub = () => {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [isOpen, setIsOpen] = useState(false);
  const [challenges, setChallenges] = useState([]);
  const [guilds, setGuilds] = useState([]);
  const [mentors, setMentors] = useState([]);
  
  const { sounds } = useEpicSounds();
  const { user } = useAuthStore();
  const { level, currentXP } = useXPStore();

  // Mock data for demonstration
  useEffect(() => {
    setChallenges([
      {
        id: 1,
        name: "30-Day Productivity Sprint",
        description: "Complete daily habits for 30 consecutive days",
        participants: 1247,
        reward: "Epic Productivity Master Badge",
        timeLeft: "23 days",
        difficulty: "Hard",
        category: "Endurance"
      },
      {
        id: 2,
        name: "Morning Warrior Challenge",
        description: "Wake up before 6 AM for 7 days straight",
        participants: 892,
        reward: "Early Bird Achievement",
        timeLeft: "5 days",
        difficulty: "Medium",
        category: "Lifestyle"
      },
      {
        id: 3,
        name: "Focus Master Tournament",
        description: "Complete 100 Pomodoro sessions this month",
        participants: 2156,
        reward: "Focus Champion Title",
        timeLeft: "12 days",
        difficulty: "Hard",
        category: "Productivity"
      }
    ]);

    setGuilds([
      {
        id: 1,
        name: "Shadow Monarchs",
        members: 156,
        level: 42,
        description: "Elite productivity warriors seeking ultimate efficiency",
        badge: "👑",
        requirements: "Level 25+, 90% habit completion rate"
      },
      {
        id: 2,
        name: "Dawn Breakers",
        members: 89,
        level: 28,
        description: "Early risers conquering the morning hours",
        badge: "🌅",
        requirements: "Level 15+, Morning routine habits"
      },
      {
        id: 3,
        name: "Focus Legends",
        members: 203,
        level: 35,
        description: "Masters of deep work and concentration",
        badge: "🎯",
        requirements: "Level 20+, Focus-based habits"
      }
    ]);

    setMentors([
      {
        id: 1,
        name: "Alex Chen",
        title: "Productivity Sage",
        level: 87,
        specialties: ["Time Management", "Goal Setting", "Habit Formation"],
        rating: 4.9,
        sessions: 342,
        avatar: "🧙‍♂️"
      },
      {
        id: 2,
        name: "Sarah Kim",
        title: "Wellness Guru",
        level: 72,
        specialties: ["Mindfulness", "Work-Life Balance", "Stress Management"],
        rating: 4.8,
        sessions: 198,
        avatar: "🧘‍♀️"
      },
      {
        id: 3,
        name: "Marcus Johnson",
        title: "Performance Coach",
        level: 95,
        specialties: ["Peak Performance", "Leadership", "Motivation"],
        rating: 5.0,
        sessions: 567,
        avatar: "💪"
      }
    ]);
  }, []);

  const tabs = [
    { id: 'leaderboard', name: '🏆 Leaderboard', icon: '🏆' },
    { id: 'challenges', name: '⚔️ Challenges', icon: '⚔️' },
    { id: 'guilds', name: '🏰 Guilds', icon: '🏰' },
    { id: 'mentorship', name: '👨‍🏫 Mentorship', icon: '👨‍🏫' },
    { id: 'events', name: '🎉 Events', icon: '🎉' }
  ];

  const mockLeaderboard = [
    { rank: 1, name: "Jin-Woo Sung", level: 99, xp: 125000, badge: "👑", streak: 365 },
    { rank: 2, name: "Emma Watson", level: 87, xp: 98500, badge: "🥈", streak: 287 },
    { rank: 3, name: "David Park", level: 82, xp: 89200, badge: "🥉", streak: 156 },
    { rank: 4, name: "Lisa Chen", level: 78, xp: 82100, badge: "⭐", streak: 203 },
    { rank: 5, name: "You", level: level, xp: currentXP, badge: "🔥", streak: 42 }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    sounds.buttonClick();
  };

  const handleJoinChallenge = (challengeId) => {
    sounds.questComplete();
    // Implementation for joining challenge
  };

  const handleJoinGuild = (guildId) => {
    sounds.achievement();
    // Implementation for joining guild
  };

  const handleBookMentor = (mentorId) => {
    sounds.notification();
    // Implementation for booking mentor session
  };

  return (
    <>
      {/* Social Hub Button */}
      <motion.button
        onClick={() => {
          setIsOpen(!isOpen);
          sounds.magicSparkle();
        }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className="fixed top-20 left-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center justify-center text-2xl shadow-lg"
        style={{
          boxShadow: '0 0 30px rgba(236, 72, 153, 0.6)'
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
          👥
        </motion.div>
      </motion.button>

      {/* Social Hub Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute inset-4 bg-gray-900 rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <FloatingParticles particleCount={25} colors={['#ec4899', '#8b5cf6', '#3b82f6']} />
              
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-pink-600 to-purple-600">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-gaming font-bold text-white">
                      🌟 Advanced Social Hub
                    </h2>
                    <p className="text-white/80">
                      Connect, compete, and grow with the productivity community
                    </p>
                  </div>
                  
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-white hover:text-red-300 text-2xl"
                  >
                    ✕
                  </motion.button>
                </div>

                {/* Tab Navigation */}
                <div className="flex space-x-2 mt-4 overflow-x-auto">
                  {tabs.map((tab) => (
                    <motion.button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                        activeTab === tab.id
                          ? 'bg-white text-purple-600'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {tab.icon} {tab.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto h-[calc(100%-200px)]">
                {activeTab === 'leaderboard' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white mb-4">🏆 Global Leaderboard</h3>
                    {mockLeaderboard.map((player, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border ${
                          player.name === 'You' 
                            ? 'bg-blue-600/20 border-blue-500' 
                            : 'bg-gray-800 border-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-2xl">{player.badge}</div>
                            <div>
                              <div className="font-bold text-white">#{player.rank} {player.name}</div>
                              <div className="text-gray-400 text-sm">
                                Level {player.level} • {player.xp.toLocaleString()} XP
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-orange-400 font-bold">{player.streak} day streak</div>
                            <div className="text-gray-400 text-sm">Current streak</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === 'challenges' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white mb-4">⚔️ Active Challenges</h3>
                    {challenges.map((challenge, index) => (
                      <motion.div
                        key={challenge.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-white text-lg">{challenge.name}</h4>
                            <p className="text-gray-300 text-sm">{challenge.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              challenge.difficulty === 'Hard' ? 'bg-red-600' :
                              challenge.difficulty === 'Medium' ? 'bg-yellow-600' : 'bg-green-600'
                            } text-white`}>
                              {challenge.difficulty}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-gray-400">👥 Participants:</span>
                            <span className="text-white ml-1">{challenge.participants.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">⏰ Time Left:</span>
                            <span className="text-white ml-1">{challenge.timeLeft}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">🏷️ Category:</span>
                            <span className="text-white ml-1">{challenge.category}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <span className="text-gray-400 text-sm">🏆 Reward: </span>
                          <span className="text-yellow-400 font-medium">{challenge.reward}</span>
                        </div>

                        <motion.button
                          onClick={() => handleJoinChallenge(challenge.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                        >
                          ⚔️ Join Challenge
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === 'guilds' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white mb-4">🏰 Productivity Guilds</h3>
                    {guilds.map((guild, index) => (
                      <motion.div
                        key={guild.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="text-3xl">{guild.badge}</div>
                            <div>
                              <h4 className="font-bold text-white text-lg">{guild.name}</h4>
                              <p className="text-gray-300 text-sm">{guild.description}</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-gray-400">👥 Members:</span>
                            <span className="text-white ml-1">{guild.members}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">⭐ Guild Level:</span>
                            <span className="text-white ml-1">{guild.level}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <span className="text-gray-400 text-sm">📋 Requirements: </span>
                          <span className="text-yellow-400 text-sm">{guild.requirements}</span>
                        </div>

                        <motion.button
                          onClick={() => handleJoinGuild(guild.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                        >
                          🏰 Join Guild
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === 'mentorship' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white mb-4">👨‍🏫 Expert Mentors</h3>
                    {mentors.map((mentor, index) => (
                      <motion.div
                        key={mentor.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="text-3xl">{mentor.avatar}</div>
                            <div>
                              <h4 className="font-bold text-white text-lg">{mentor.name}</h4>
                              <p className="text-purple-400 text-sm">{mentor.title}</p>
                              <p className="text-gray-400 text-sm">Level {mentor.level}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-yellow-400 font-bold">⭐ {mentor.rating}</div>
                            <div className="text-gray-400 text-sm">{mentor.sessions} sessions</div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <span className="text-gray-400 text-sm">🎯 Specialties: </span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {mentor.specialties.map((specialty, idx) => (
                              <span key={idx} className="bg-purple-600 text-white px-2 py-1 rounded text-xs">
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>

                        <motion.button
                          onClick={() => handleBookMentor(mentor.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                        >
                          📅 Book Session
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === 'events' && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-xl font-bold text-white mb-2">Community Events</h3>
                    <p className="text-gray-400 mb-6">
                      Exciting community events and competitions coming soon!
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium"
                    >
                      🔔 Notify Me
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdvancedSocialHub;
