
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Lock, Star, Zap, Users, BookOpen, Target, Award, Medal, CheckCircle2 } from 'lucide-react';
import { UserProfile, Achievement } from '../types';

interface AchievementsViewProps {
  profile: UserProfile;
}

const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: '1',
    name: 'Fast Learner',
    description: 'Complete 5 lessons in a single day.',
    icon: 'Zap',
    category: 'Academic',
    isEarned: true,
    earnedDate: 'Oct 05, 2026'
  },
  {
    id: '2',
    name: 'Knowledge Seeker',
    description: 'Complete 10 lessons in total.',
    icon: 'BookOpen',
    category: 'Academic',
    isEarned: true,
    earnedDate: 'Oct 08, 2026'
  },
  {
    id: '3',
    name: 'Perfect Score',
    description: 'Get 100% on any assessment.',
    icon: 'Target',
    category: 'Academic',
    isEarned: false,
    unlockRequirement: 'Get 100% on an assessment'
  },
  {
    id: '4',
    name: '7-Day Streak',
    description: 'Study for 7 days in a row.',
    icon: 'Flame',
    category: 'Streak',
    isEarned: true,
    earnedDate: 'Oct 09, 2026'
  },
  {
    id: '5',
    name: 'Social Butterfly',
    description: 'Share your progress with 5 friends.',
    icon: 'Users',
    category: 'Social',
    isEarned: false,
    unlockRequirement: 'Share progress 5 times'
  },
  {
    id: '6',
    name: 'Early Bird',
    description: 'Complete a lesson before 7 AM.',
    icon: 'Sun',
    category: 'Special',
    isEarned: false,
    unlockRequirement: 'Finish a lesson before 7 AM'
  },
  {
    id: '7',
    name: 'Master of Physics',
    description: 'Complete all Physics modules.',
    icon: 'Award',
    category: 'Academic',
    isEarned: false,
    unlockRequirement: 'Finish all Physics lessons'
  },
  {
    id: '8',
    name: 'Top Contributor',
    description: 'Answer 10 questions in the community.',
    icon: 'Medal',
    category: 'Social',
    isEarned: false,
    unlockRequirement: 'Answer 10 community questions'
  },
  {
    id: '9',
    name: 'Marathoner',
    description: 'Study for 4 hours in one session.',
    icon: 'Clock',
    category: 'Streak',
    isEarned: false,
    unlockRequirement: '4-hour study session'
  }
];

export const AchievementsView: React.FC<AchievementsViewProps> = ({ profile }) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Academic' | 'Streak' | 'Social' | 'Special'>('All');

  const earnedCount = MOCK_ACHIEVEMENTS.filter(a => a.isEarned).length;
  const totalCount = MOCK_ACHIEVEMENTS.length;

  const filteredAchievements = MOCK_ACHIEVEMENTS.filter(a => 
    activeFilter === 'All' || a.category === activeFilter
  );

  const getIcon = (iconName: string, isEarned: boolean) => {
    const props = { className: `w-10 h-10 ${isEarned ? 'text-white' : 'text-slate-500'}` };
    switch (iconName) {
      case 'Zap': return <Zap {...props} />;
      case 'BookOpen': return <BookOpen {...props} />;
      case 'Target': return <Target {...props} />;
      case 'Flame': return <Star {...props} />; // Using Star as placeholder for Flame if not imported
      case 'Users': return <Users {...props} />;
      case 'Award': return <Award {...props} />;
      case 'Medal': return <Medal {...props} />;
      default: return <Award {...props} />;
    }
  };

  return (
    <div className={`w-full ${profile.preferences.darkMode ? 'text-white' : 'text-slate-900'}`}>
      <div className="mb-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2 text-[#5046e5] font-bold text-sm uppercase tracking-widest mb-2"
        >
          <span className="w-8 h-[2px] bg-[#5046e5] rounded-full"></span>
          <span>Rewards</span>
        </motion.div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.h1 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold tracking-tight"
            >
              Achievements
            </motion.h1>
            <p className={`${profile.preferences.darkMode ? 'text-slate-400' : 'text-slate-500'} mt-3 text-base max-w-xl leading-relaxed`}>
              Unlock badges by reaching milestones and staying consistent with your learning journey.
            </p>
          </div>

          {/* Stats Row */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-2xl border flex items-center space-x-6 ${
              profile.preferences.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Earned</p>
                <p className="text-xl font-black">{earnedCount} / {totalCount}</p>
              </div>
            </div>
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700"></div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Progress</p>
              <p className="text-xl font-black">{Math.round((earnedCount / totalCount) * 100)}%</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {['All', 'Academic', 'Streak', 'Social', 'Special'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter as any)}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
              activeFilter === filter
                ? 'bg-[#5046e5] text-white shadow-lg shadow-indigo-500/20'
                : profile.preferences.darkMode 
                  ? 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700' 
                  : 'bg-white text-slate-500 hover:text-slate-700 border border-slate-200 shadow-sm'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredAchievements.map((achievement) => (
            <motion.div
              layout
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`p-8 rounded-[2.5rem] border transition-all duration-300 relative overflow-hidden group ${
                achievement.isEarned
                  ? profile.preferences.darkMode
                    ? 'bg-slate-800 border-amber-500/50 shadow-lg shadow-amber-500/5'
                    : 'bg-white border-amber-400 shadow-xl shadow-amber-500/10'
                  : profile.preferences.darkMode
                    ? 'bg-slate-800/50 border-slate-700 grayscale'
                    : 'bg-slate-50 border-slate-200 grayscale'
              }`}
            >
              {/* Background Glow for Earned */}
              {achievement.isEarned && (
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none"></div>
              )}

              <div className="flex flex-col items-center text-center relative z-10">
                {/* Badge Icon Container */}
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 relative ${
                  achievement.isEarned
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30 ring-4 ring-amber-500/20'
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}>
                  {getIcon(achievement.icon, achievement.isEarned)}
                  
                  {!achievement.isEarned && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20 rounded-full">
                      <Lock className="w-6 h-6 text-slate-500" />
                    </div>
                  )}

                  {/* Shimmer for Earned */}
                  {achievement.isEarned && (
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_3s_infinite]"></div>
                    </div>
                  )}
                </div>

                <h3 className={`text-xl font-black mb-2 ${achievement.isEarned ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500'}`}>
                  {achievement.name}
                </h3>
                <p className={`text-sm leading-relaxed mb-4 ${achievement.isEarned ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400'}`}>
                  {achievement.description}
                </p>

                {/* Unlock Requirement or Earned Date */}
                <div className={`mt-auto pt-4 border-t w-full ${profile.preferences.darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                  {achievement.isEarned ? (
                    <div className="flex items-center justify-center space-x-1.5 text-emerald-500 font-bold text-[10px] uppercase tracking-widest">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Earned {achievement.earnedDate}</span>
                    </div>
                  ) : (
                    <div className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                      Unlock: {achievement.unlockRequirement}
                    </div>
                  )}
                </div>
              </div>

              {/* Category Badge */}
              <div className={`absolute top-4 right-6 px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] ${
                achievement.isEarned
                  ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
              }`}>
                {achievement.category}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
