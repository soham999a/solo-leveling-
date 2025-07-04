import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useXPStore from '../store/xpStore';
import useHabitStore from '../store/habitStore';
import LevelTracker from '../components/LevelTracker';
import XPBar, { DashboardXPBar } from '../components/XPBar';
import Timer from '../components/Timer';
import HabitItem from '../components/HabitItem';
import HabitModal from '../components/HabitModal';
import LevelUpModal from '../components/LevelUpModal';
import ReflectionCard from '../components/ReflectionCard';
import AvatarScene from '../scenes/AvatarScene';
import AILifeCoach from '../components/AILifeCoach';
import ParticleSystem, { FloatingParticles, MagicParticles } from '../components/ParticleSystem';
import { useEpicSounds, useEpicButton, useEpicCard, useEpicLevelSounds } from '../hooks/useEpicSounds';
import SoundControlPanel from '../components/SoundControlPanel';
import EpicPageTransition, { EpicCardEntrance, EpicButton, EpicStaggerContainer, EpicStaggerItem } from '../components/EpicPageTransition';
import UltimateAICoach from '../components/UltimateAICoach';
import ProductivityWorld3D from '../components/ProductivityWorld3D';
import SmartHabitGenerator from '../components/SmartHabitGenerator';
import AdvancedSocialHub from '../components/AdvancedSocialHub';
import FeatureShowcase from '../components/FeatureShowcase';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [isSmartGeneratorOpen, setIsSmartGeneratorOpen] = useState(false);

  const { user, profile, isAuthenticated, signOut } = useAuthStore();
  const { syncWithProfile } = useXPStore();
  const { habits, loadHabits, getTodaysCompletedHabits } = useHabitStore();

  // Epic Sound System
  const { sounds } = useEpicSounds();
  const { playLevelUp, playXPGain, playQuestComplete } = useEpicLevelSounds();

  // Epic Button Handlers
  const analyticsButton = useEpicButton(() => navigate('/analytics'));
  const knowledgeButton = useEpicButton(() => navigate('/knowledge'));
  const socialButton = useEpicButton(() => navigate('/social'));
  const signOutButton = useEpicButton(signOut);
  const createHabitButton = useEpicButton(() => setIsHabitModalOpen(true));
  const smartGeneratorButton = useEpicButton(() => setIsSmartGeneratorOpen(true));

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Load user data
  useEffect(() => {
    if (user && profile) {
      syncWithProfile(profile);
      loadHabits(user.uid);
    }
  }, [user, profile, syncWithProfile, loadHabits]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleCreateHabit = () => {
    setEditingHabit(null);
    setIsHabitModalOpen(true);
  };

  const handleEditHabit = (habit) => {
    setEditingHabit(habit);
    setIsHabitModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsHabitModalOpen(false);
    setEditingHabit(null);
  };

  // Calculate today's stats
  const completedHabits = getTodaysCompletedHabits();
  const completionRate = habits.length > 0 ? Math.round((completedHabits.length / habits.length) * 100) : 0;

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <EpicPageTransition className="bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 relative overflow-hidden">
      {/* Epic Floating Particles */}
      <FloatingParticles
        particleCount={40}
        colors={['#3b82f6', '#8b5cf6', '#ec4899', '#ffd700']}
        speed={0.8}
        size="small"
      />

      {/* Header */}
      <header className="bg-dark-800/50 backdrop-blur-sm border-b border-dark-700 glass-morphism relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-gaming font-bold text-gradient">
                LEVELUP LIFE
              </h1>
            </div>

            {/* Navigation & User menu */}
            <div className="flex items-center space-x-4">
              <motion.button
                {...analyticsButton}
                whileHover={{ scale: 1.05, rotateX: -5 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary px-4 py-2 flex items-center space-x-2 epic-glow float-3d"
              >
                <span>📊</span>
                <span>Analytics</span>
              </motion.button>
              <motion.button
                {...knowledgeButton}
                whileHover={{ scale: 1.05, rotateX: -5 }}
                whileTap={{ scale: 0.95 }}
                className="btn-accent px-4 py-2 flex items-center space-x-2 epic-glow float-3d"
              >
                <span>📚</span>
                <span>Knowledge Hub</span>
              </motion.button>
              <span className="text-gray-300">
                Welcome back, {profile?.displayName || 'Hunter'}!
              </span>
              <motion.button
                {...signOutButton}
                whileHover={{ scale: 1.05, rotateX: -3 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary px-4 py-2 transform-3d"
              >
                Sign Out
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EpicStaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Avatar & Stats */}
          <EpicStaggerItem className="space-y-6">
            {/* 3D Avatar Scene */}
            <motion.div
              className="card-glow p-4 float-3d relative"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <MagicParticles particleCount={15} size="small" />
              <h3 className="text-lg font-gaming font-bold text-gradient mb-4 text-center">
                YOUR AVATAR
              </h3>
              <AvatarScene />
            </motion.div>

            {/* XP Progress */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <DashboardXPBar />
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              className="card p-6 card-3d epic-glow"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h3 className="text-lg font-gaming font-bold text-gradient mb-4">
                TODAY'S PROGRESS
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Habits Completed</span>
                  <span className="text-green-400 font-bold">{completedHabits.length} / {habits.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Completion Rate</span>
                  <span className="text-primary-400 font-bold">{completionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">XP Earned Today</span>
                  <span className="text-accent-400 font-bold">{completedHabits.reduce((sum, habit) => sum + habit.xpValue, 0)} XP</span>
                </div>
              </div>
            </motion.div>
          </EpicStaggerItem>

          {/* Center Column - Habits */}
          <EpicStaggerItem className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-gaming font-bold text-white">
                Daily Quests
              </h2>
              <div className="flex space-x-2">
                <motion.button
                  onClick={handleCreateHabit}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary px-4 py-2"
                >
                  + Add Quest
                </motion.button>
                <motion.button
                  {...smartGeneratorButton}
                  whileHover={{ scale: 1.05, rotateX: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-accent px-4 py-2 epic-glow"
                >
                  🤖 AI Generate
                </motion.button>
              </div>
            </div>

            {/* Habits List */}
            <div className="space-y-4">
              {habits.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card p-8 text-center card-3d epic-glow relative"
                >
                  <MagicParticles particleCount={20} size="medium" />
                  <motion.div
                    className="text-6xl mb-4"
                    animate={{
                      rotateY: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    🎯
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2 font-gaming">
                    Ready to Start Your Journey?
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Create your first habit to begin earning XP and leveling up!
                  </p>
                  <motion.button
                    {...createHabitButton}
                    whileHover={{
                      scale: 1.05,
                      rotateX: -5,
                      boxShadow: "0 20px 40px rgba(59, 130, 246, 0.6)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary px-6 py-3 epic-glow transform-3d"
                  >
                    Create Your First Quest
                  </motion.button>
                </motion.div>
              ) : (
                habits.map((habit, index) => (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <HabitItem
                      habit={habit}
                      onEdit={handleEditHabit}
                    />
                  </motion.div>
                ))
              )}
            </div>
          </EpicStaggerItem>

          {/* Right Column - Timer & Activities */}
          <EpicStaggerItem className="space-y-6">
            {/* Pomodoro Timer */}
            <Timer compact />
            
            {/* Recent Activity */}
            <div className="card p-6">
              <h3 className="text-lg font-gaming font-bold text-gradient mb-4">
                RECENT ACTIVITY
              </h3>
              <div className="space-y-3">
                <div className="text-center text-gray-400 py-8">
                  <div className="text-4xl mb-2">📊</div>
                  <p>Complete some habits to see your activity!</p>
                </div>
              </div>
            </div>

            {/* AI Reflection */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <ReflectionCard />
            </motion.div>

            {/* Social Hub */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="card p-6 card-3d epic-glow relative">
                <FloatingParticles particleCount={10} size="small" />
                <h3 className="text-lg font-gaming font-bold text-gradient mb-4">
                  SOCIAL HUB
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl mb-1">🏆</div>
                    <div className="text-sm text-gray-400">Rank #7</div>
                  </div>
                  <div>
                    <div className="text-2xl mb-1">⚔️</div>
                    <div className="text-sm text-gray-400">3 Challenges</div>
                  </div>
                  <div>
                    <div className="text-2xl mb-1">🏰</div>
                    <div className="text-sm text-gray-400">No Guild</div>
                  </div>
                </div>
                <motion.button
                  {...socialButton}
                  whileHover={{
                    scale: 1.02,
                    rotateX: -3,
                    boxShadow: "0 15px 30px rgba(139, 92, 246, 0.5)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-4 btn-accent py-2 epic-glow transform-3d"
                >
                  Enter Social Hub
                </motion.button>
              </div>
            </motion.div>
          </EpicStaggerItem>
        </EpicStaggerContainer>
      </main>

      {/* Habit Modal */}
      <HabitModal
        isOpen={isHabitModalOpen}
        onClose={handleCloseModal}
        habit={editingHabit}
      />

      {/* Level Up Modal */}
      <LevelUpModal />

      {/* Ultimate AI Coach */}
      <UltimateAICoach />

      {/* Feature Showcase */}
      <FeatureShowcase />

      {/* Epic Sound Control Panel */}
      <SoundControlPanel />
    </EpicPageTransition>
  );
};

export default Dashboard;
