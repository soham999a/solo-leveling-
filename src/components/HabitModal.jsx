import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useHabitStore from '../store/habitStore';
import useAuthStore from '../store/authStore';

const HabitModal = ({ isOpen, onClose, habit = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'health',
    xpValue: 10,
    icon: '⭐',
    color: '#0ea5e9',
    frequency: 'daily'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { createHabit, updateHabit } = useHabitStore();
  const { user } = useAuthStore();

  const isEditing = !!habit;

  // Populate form when editing
  useEffect(() => {
    if (habit) {
      setFormData({
        name: habit.name || '',
        description: habit.description || '',
        category: habit.category || 'health',
        xpValue: habit.xpValue || 10,
        icon: habit.icon || '⭐',
        color: habit.color || '#0ea5e9',
        frequency: habit.frequency || 'daily'
      });
    } else {
      // Reset form for new habit
      setFormData({
        name: '',
        description: '',
        category: 'health',
        xpValue: 10,
        icon: '⭐',
        color: '#0ea5e9',
        frequency: 'daily'
      });
    }
    setErrors({});
  }, [habit, isOpen]);

  const categories = [
    { value: 'health', label: 'Health & Fitness', icon: '💪' },
    { value: 'productivity', label: 'Productivity', icon: '⚡' },
    { value: 'learning', label: 'Learning', icon: '📚' },
    { value: 'mindfulness', label: 'Mindfulness', icon: '🧘' },
    { value: 'social', label: 'Social', icon: '👥' },
    { value: 'creativity', label: 'Creativity', icon: '🎨' },
    { value: 'finance', label: 'Finance', icon: '💰' },
    { value: 'general', label: 'General', icon: '⭐' }
  ];

  const commonIcons = [
    '⭐', '💪', '📚', '🧘', '🏃', '💧', '🥗', '😴',
    '✍️', '🎯', '🎨', '🎵', '💰', '📱', '🌱', '🔥'
  ];

  const colors = [
    '#0ea5e9', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
    '#f97316', '#6366f1', '#14b8a6', '#eab308'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Habit name is required';
    }
    
    if (formData.xpValue < 1 || formData.xpValue > 100) {
      newErrors.xpValue = 'XP value must be between 1 and 100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      let result;
      
      if (isEditing) {
        result = await updateHabit(habit.id, formData);
      } else {
        result = await createHabit(user.uid, formData);
      }
      
      if (result.success) {
        onClose();
      }
    } catch (error) {
      console.error('Error saving habit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-dark-800 rounded-xl border border-dark-700 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-dark-700">
              <h2 className="text-xl font-gaming font-bold text-white">
                {isEditing ? 'Edit Quest' : 'Create New Quest'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Quest Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                  placeholder="e.g., Morning Workout"
                  required
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 resize-none"
                  placeholder="Optional description..."
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {commonIcons.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, icon }))}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all ${
                        formData.icon === icon
                          ? 'bg-primary-500 text-white'
                          : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Color
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      className={`w-8 h-8 rounded-lg transition-all ${
                        formData.color === color
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-dark-800'
                          : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* XP Value */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  XP Reward
                </label>
                <input
                  type="number"
                  name="xpValue"
                  value={formData.xpValue}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                />
                {errors.xpValue && (
                  <p className="text-red-400 text-sm mt-1">{errors.xpValue}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 btn-secondary py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 btn-primary py-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    isEditing ? 'Update Quest' : 'Create Quest'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default HabitModal;
