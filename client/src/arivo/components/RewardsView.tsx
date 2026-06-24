
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Trophy, 
  Lock, 
  Star, 
  Users, 
  BookOpen, 
  Target, 
  Award, 
  Medal, 
  CheckCircle2, 
  History, 
  TrendingUp,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { UserProfile, Achievement } from '../types';

interface RewardsViewProps {
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
    name: '7-Day Streak',
    description: 'Study for 7 days in a row.',
    icon: 'Flame',
    category: 'Streak',
    isEarned: true,
    earnedDate: 'Oct 09, 2026'
  },
  {
    id: '4',
    name: 'Perfect Score',
    description: 'Get 100% on any assessment.',
    icon: 'Target',
    category: 'Academic',
    isEarned: false,
    unlockRequirement: 'Get 100% on an assessment'
  },
  {
    id: '5',
    name: 'Social Butterfly',
    description: 'Share your progress with 5 friends.',
    icon: 'Users',
    category: 'Social',
    isEarned: false,
    unlockRequirement: 'Share progress 5 times'
  }
];

const CRYSTAL_HISTORY = [
  { id: 1, reason: 'Completed Physics Lesson', amount: 50, date: 'Today, 10:30 AM' },
  { id: 2, reason: 'Daily Login Bonus', amount: 10, date: 'Today, 08:00 AM' },
  { id: 3, reason: 'Passed Biology Quiz', amount: 100, date: 'Yesterday' },
  { id: 4, reason: 'Achievement: Fast Learner', amount: 200, date: 'Oct 05, 2026' },
];

const SUBJECT_MASTERY = [
  { subject: 'Physics', progress: 85, tier: 'Expert', color: 'bg-blue-500' },
  { subject: 'Mathematics', progress: 65, tier: 'Advanced', color: 'bg-indigo-500' },
  { subject: 'Biology', progress: 40, tier: 'Intermediate', color: 'bg-emerald-500' },
  { subject: 'Chemistry', progress: 20, tier: 'Novice', color: 'bg-amber-500' },
];

export const RewardsView: React.FC<RewardsViewProps> = ({ profile }) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Academic' | 'Streak' | 'Social' | 'Special'>('All');

  const filteredAchievements = MOCK_ACHIEVEMENTS.filter(a => 
    activeFilter === 'All' || a.category === activeFilter
  );

  const getIcon = (iconName: string, isEarned: boolean) => {
    const props = { className: `w-8 h-8 ${isEarned ? 'text-white' : 'text-slate-500'}` };
    switch (iconName) {
      case 'Zap': return <Zap {...props} />;
      case 'BookOpen': return <BookOpen {...props} />;
      case 'Target': return <Target {...props} />;
      case 'Flame': return <Star {...props} />;
      case 'Users': return <Users {...props} />;
      case 'Award': return <Award {...props} />;
      case 'Medal': return <Medal {...props} />;
      default: return <Award {...props} />;
    }
  };

  return (
    <div className={`w-full max-w-5xl mx-auto pb-20 ${profile.preferences.darkMode ? 'text-white' : 'text-slate-900'}`}>
      <div className="mb-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2 text-[#5046e5] font-bold text-sm uppercase tracking-widest mb-2"
        >
          <span className="w-8 h-[2px] bg-[#5046e5] rounded-full"></span>
          <span>Progression</span>
        </motion.div>
        <motion.h1 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold tracking-tight"
        >
          Your Rewards
        </motion.h1>
      </div>

      <div className="space-y-12">
        {/* Section 1: XP Charge Bar */}
        <section className={`p-8 rounded-[2.5rem] border ${profile.preferences.darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-[#5046e5]/10 flex items-center justify-center text-[#5046e5]">
                <Zap className="w-7 h-7 fill-[#5046e5]" />
              </div>
              <div>
                <h2 className="text-xl font-black">Level 7</h2>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mastery Level</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-[#5046e5]">425 <span className="text-sm text-slate-500 font-bold">/ 500 XP</span></p>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">75 XP to Level 8</p>
            </div>
          </div>
          
          <div className={`h-6 w-full rounded-full overflow-hidden relative ${profile.preferences.darkMode ? 'bg-slate-900' : 'bg-slate-100'} border ${profile.preferences.darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '85%' }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-[#5046e5] relative"
              style={{ boxShadow: '0 0 20px rgba(80, 70, 229, 0.4)' }}
            >
              <div 
                className="absolute inset-0 w-full h-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  animation: 'shimmer 2s infinite'
                }}
              />
            </motion.div>
          </div>
        </section>

        {/* Section 2: Crystal Balance & History */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className={`lg:col-span-1 p-8 rounded-[2.5rem] border flex flex-col items-center justify-center text-center ${profile.preferences.darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
            <div 
              className="w-20 h-20 rounded-3xl bg-cyan-500/10 flex items-center justify-center text-4xl mb-6"
              style={{ animation: 'gem-pulse 3s infinite, gem-scale 5s infinite' }}
            >
              💎
            </div>
            <h2 className="text-4xl font-black mb-2">1,240</h2>
            <p className="text-xs font-bold text-cyan-500 uppercase tracking-[0.2em]">Total Crystals</p>
            <button className="mt-8 w-full py-3 rounded-2xl bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 hover:bg-cyan-600 transition-all">
              Visit Shop
            </button>
          </div>

          <div className={`lg:col-span-2 p-8 rounded-[2.5rem] border ${profile.preferences.darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <History className="w-5 h-5 text-slate-400" />
                <h2 className="text-lg font-bold">Earning History</h2>
              </div>
              <button className="text-xs font-bold text-[#5046e5] hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {CRYSTAL_HISTORY.map((item) => (
                <div key={item.id} className={`flex items-center justify-between p-4 rounded-2xl ${profile.preferences.darkMode ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{item.reason}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{item.date}</p>
                    </div>
                  </div>
                  <p className="text-sm font-black text-cyan-500">+{item.amount} 💎</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Achievements Badge Grid */}
        <section className={`p-8 rounded-[2.5rem] border ${profile.preferences.darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center space-x-3">
              <Trophy className="w-6 h-6 text-amber-500" />
              <h2 className="text-xl font-bold">Achievements</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {['All', 'Academic', 'Streak', 'Social'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter as any)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeFilter === filter
                      ? 'bg-[#5046e5] text-white shadow-lg shadow-indigo-500/20'
                      : profile.preferences.darkMode 
                        ? 'bg-slate-900 text-slate-400 border border-slate-700' 
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredAchievements.map((achievement) => (
              <div key={achievement.id} className="flex flex-col items-center text-center group">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 relative transition-transform group-hover:scale-110 ${
                  achievement.isEarned
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20 ring-4 ring-amber-500/10'
                    : 'bg-slate-100 dark:bg-slate-800 grayscale opacity-50'
                }`}>
                  {getIcon(achievement.icon, achievement.isEarned)}
                  {!achievement.isEarned && <Lock className="absolute w-5 h-5 text-slate-500" />}
                </div>
                <p className={`text-xs font-black ${achievement.isEarned ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{achievement.name}</p>
                <p className="text-[9px] text-slate-500 font-medium mt-1 leading-tight">{achievement.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Subject Mastery Tier Bars */}
        <section className={`p-8 rounded-[2.5rem] border ${profile.preferences.darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
          <div className="flex items-center space-x-3 mb-8">
            <GraduationCap className="w-6 h-6 text-[#5046e5]" />
            <h2 className="text-xl font-bold">Subject Mastery</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SUBJECT_MASTERY.map((item) => (
              <div key={item.subject} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-black">{item.subject}</p>
                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest text-white ${item.color}`}>
                      {item.tier}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-500">{item.progress}%</p>
                </div>
                <div className={`h-2 w-full rounded-full overflow-hidden ${profile.preferences.darkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full ${item.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
