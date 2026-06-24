
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Clock, Flame, Trophy, Medal, Award, Star, Target } from 'lucide-react';
import { UserProfile } from '../types';
import { ChatAIButton } from './ChatAI';

interface DashboardProps {
  profile: UserProfile;
  onStartAssessment: () => void;
  onNavigate: (view: 'dashboard' | 'assessment' | 'profile' | 'settings' | 'add-lecture' | 'lectures' | 'assignments' | 'submit-assignment' | 'assignment-detail' | 'achievements' | 'rewards' | 'analytics' | 'schedule') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ profile, onStartAssessment, onNavigate }) => {
  const firstName = profile.fullName.split(' ')[0] || 'Student';

  const [showNotifications, setShowNotifications] = React.useState(false);
  const [notifications, setNotifications] = React.useState([
    {
      id: 1,
      title: 'Assignment Reminder',
      description: 'Your Physics assignment is due in 2 hours.',
      time: '2h ago',
      icon: '📝',
      read: false,
      type: 'assignment'
    },
    {
      id: 2,
      title: 'New Lecture Available',
      description: 'Introduction to Quantum Mechanics is now live.',
      time: '5h ago',
      icon: '🎥',
      read: false,
      type: 'lecture'
    },
    {
      id: 3,
      title: 'Streak Alert!',
      description: 'You are on a 5-day learning streak. Keep it up!',
      time: '1d ago',
      icon: '🔥',
      read: true,
      type: 'streak'
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const getThemeColor = () => {
    switch(profile.userType) {
      case 'school': return 'text-blue-600';
      case 'college': return 'text-violet-600';
      case 'self-learner': return 'text-emerald-600';
      default: return 'text-indigo-600';
    }
  };

  return (
    <div className={`w-full ${profile.preferences.darkMode ? 'text-white' : 'text-slate-900'}`}>
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2 text-indigo-500 font-bold text-sm uppercase tracking-widest mb-2"
          >
            <span className="w-8 h-[2px] bg-indigo-500 rounded-full"></span>
            <span>Home</span>
          </motion.div>
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            Welcome back, <span className="text-indigo-600 dark:text-indigo-400">{firstName}</span>!
          </motion.h1>
          <p className={`${profile.preferences.darkMode ? 'text-slate-400' : 'text-slate-500'} mt-3 text-base max-w-xl leading-relaxed`}>
            {profile.userType === 'school' && `Ready to master your Class ${profile.class || '9'} curriculum today? You have 3 tasks pending.`}
            {profile.userType === 'college' && `Your ${profile.degree || 'Degree'} semester is at 45% completion. Keep it up!`}
            {profile.userType === 'self-learner' && "Consistency is key. You're just 4 lessons away from your next milestone!"}
          </p>

          {/* XP Charge Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 max-w-2xl"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-xl filter drop-shadow-[0_0_8px_rgba(255,255,0,0.5)]">⚡</span>
                <span className="font-bold text-sm uppercase tracking-wider">Level {profile.level}</span>
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{profile.xp} / 500 XP</span>
            </div>
            <div className={`h-4 w-full rounded-full overflow-hidden relative ${profile.preferences.darkMode ? 'bg-slate-800' : 'bg-slate-100'} border ${profile.preferences.darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(profile.xp / 500) * 100}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-[#5046e5] relative"
                style={{
                  boxShadow: '0 0 15px rgba(80, 70, 229, 0.4)',
                  animation: 'pulse-glow 2s infinite'
                }}
              >
                {/* Shimmer Effect */}
                <div 
                  className="absolute inset-0 w-full h-full"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    animation: 'shimmer 2s infinite'
                  }}
                />
              </motion.div>
            </div>
            <div className="mt-2 flex justify-end">
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest animate-pulse">Near Level Up!</span>
            </div>
          </motion.div>
        </div>
        
        <div className="flex items-center space-x-4 relative">
          <ChatAIButton />

          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-4 shadow-xl shadow-slate-200/50 rounded-2xl border transition-all text-slate-500 ${
                showNotifications ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-100 hover:scale-105 active:scale-95'
              }`}
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-3 right-3 w-3 h-3 bg-rose-500 rounded-full border-2 border-white"></span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className={`absolute right-0 mt-4 w-80 md:w-96 rounded-3xl shadow-2xl border z-[100] overflow-hidden ${
                    profile.preferences.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
                  }`}
                >
                  <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <h3 className="font-bold text-lg">Notifications</h3>
                    <button 
                      onClick={markAllAsRead}
                      className="text-xs font-bold text-indigo-600 hover:underline"
                    >
                      Mark all as read
                    </button>
                  </div>
                  
                  <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id}
                          className={`p-5 flex items-start space-x-4 border-b border-slate-50 last:border-0 transition-colors hover:bg-slate-50/50 cursor-pointer relative ${
                            !notif.read ? 'bg-indigo-50/30' : ''
                          }`}
                        >
                          {!notif.read && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                          )}
                          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl flex-shrink-0">
                            {notif.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-bold text-sm truncate">{notif.title}</h4>
                              <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap ml-2">{notif.time}</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                              {notif.description}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-10 text-center">
                        <p className="text-slate-400 font-medium">No notifications yet!</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 text-center">
                    <button className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                      View All Activity
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard label="Course Completion" value="65%" icon={<GraduationCap className="w-8 h-8 text-white" />} color="bg-blue-500" darkMode={profile.preferences.darkMode} />
            <StatCard label="Time Spent" value="12.5h" icon={<Clock className="w-8 h-8 text-white" />} color="bg-amber-500" darkMode={profile.preferences.darkMode} />
            <StatCard label="Learning Streak" value="5 Days" icon={<Flame className="w-8 h-8 text-white" />} color="bg-rose-500" darkMode={profile.preferences.darkMode} />
          </div>

          <motion.div variants={itemVariants} className={`p-6 md:p-8 rounded-3xl ${profile.preferences.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} border shadow-sm`}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">Your Subjects</h2>
              <button 
                onClick={() => onNavigate('lectures')}
                className="text-indigo-600 font-semibold hover:underline px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg transition-all text-sm"
              >
                View All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(profile.selectedSubjects.length > 0 ? profile.selectedSubjects : ['Science', 'Mathematics', 'Economics']).map((sub, idx) => {
                const progress = [25, 55, 85, 40, 70, 95][idx % 6];
                const barColor = progress <= 30 ? 'bg-rose-500' : 
                                progress <= 60 ? 'bg-amber-500' : 
                                'bg-emerald-500';
                const textColor = progress <= 30 ? 'text-rose-600 dark:text-rose-400' : 
                                 progress <= 60 ? 'text-amber-600 dark:text-amber-400' : 
                                 'text-emerald-600 dark:text-emerald-400';

                return (
                  <div 
                    key={sub} 
                    onClick={() => onNavigate('lectures')}
                    className={`p-6 rounded-2xl border transition-all group hover:border-indigo-500/50 cursor-pointer ${profile.preferences.darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-100'}`}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm text-xl group-hover:scale-105 transition-transform">
                        {['🧬', '📐', '📊', '📚', '💻', '🌍'][idx % 6]}
                      </div>
                      <div>
                        <h3 className="font-bold text-base">{sub}</h3>
                        <p className="text-xs text-slate-500 font-medium">12 Lessons Left</p>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <span>Progress</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className={`h-full ${barColor}`}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                        <span className={`text-xs font-bold min-w-[30px] text-right ${textColor}`}>{progress}%</span>
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 mt-1">
                        {[2, 4, 5, 1, 3, 5][idx % 6]} of 5 assignments done
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Assignments Summary Card */}
          <motion.div variants={itemVariants} className={`p-6 md:p-8 rounded-3xl ${profile.preferences.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} border shadow-sm`}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">Upcoming Assignments</h2>
              <button 
                onClick={() => onNavigate('assignments')}
                className="text-indigo-600 font-semibold hover:underline px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg transition-all text-sm"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                { title: 'Cell Structure Quiz', subject: 'Biology', dueDate: 'Oct 15, 2026' },
                { title: 'Calculus Problem Set', subject: 'Mathematics', dueDate: 'Oct 18, 2026' },
                { title: 'Macroeconomics Essay', subject: 'Economics', dueDate: 'Oct 20, 2026' }
              ].map((assignment, idx) => (
                <div 
                  key={idx}
                  onClick={() => onNavigate('assignments')}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all hover:border-indigo-500/50 cursor-pointer ${profile.preferences.darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-100'}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm text-lg">
                      {['🧬', '📐', '📊'][idx % 3]}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">{assignment.title}</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{assignment.subject}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Due Date</div>
                    <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{assignment.dueDate}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <motion.div 
            variants={itemVariants} 
            className={`p-8 rounded-3xl ${profile.preferences.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-900 text-white'} border shadow-lg relative overflow-hidden group`}
          >
             <div className="relative z-10">
               <span className="inline-block px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider rounded-full mb-4 border border-indigo-500/30">Quick Challenge</span>
               <h2 className="text-xl font-bold mb-3 leading-tight">Test your skills</h2>
               <p className={`${profile.preferences.darkMode ? 'text-slate-400' : 'text-slate-300'} mb-8 text-sm leading-relaxed`}>
                 Take a short quiz generated by AI specifically for your chosen subjects!
               </p>
               <button 
                 onClick={onStartAssessment}
                 className="w-full py-4 rounded-xl font-bold transition-all bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] shadow-md shadow-indigo-500/20"
               >
                 Start Assessment
               </button>
             </div>
          </motion.div>

          <motion.div variants={itemVariants} className={`p-6 rounded-3xl ${profile.preferences.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} border shadow-sm`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Up Next</h2>
            </div>
            
            <div className="space-y-4 mb-6">
              <TaskItem label="Introduction to AI" time="10:30 AM" done={false} darkMode={profile.preferences.darkMode} />
              <TaskItem label="Chapter 2 Practice" time="02:00 PM" done={false} darkMode={profile.preferences.darkMode} />
            </div>

            <button className="w-full py-3 text-slate-400 font-bold text-xs bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 hover:text-indigo-400 transition-all">
              + Manage Schedule
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color, darkMode }: any) => (
  <div className={`p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-0.5 shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4 shadow-sm`}>
      {icon}
    </div>
    <div className={`text-[10px] font-bold uppercase tracking-wider text-slate-400`}>{label}</div>
    <div className="text-3xl font-bold mt-0.5 tracking-tight">{value}</div>
  </div>
);

const TaskItem = ({ label, time, done, darkMode }: any) => (
  <div className="flex items-center space-x-3 group cursor-pointer">
    <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
      done 
        ? 'bg-emerald-500 border-emerald-500 text-white' 
        : darkMode 
          ? 'border-slate-700 bg-slate-800 group-hover:border-indigo-500' 
          : 'border-slate-200 group-hover:border-indigo-400'
    }`}>
      {done ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
      ) : (
        <div className={`w-1.5 h-1.5 rounded-full transition-colors ${darkMode ? 'bg-slate-700 group-hover:bg-indigo-500' : 'bg-slate-200 group-hover:bg-indigo-400'}`} />
      )}
    </div>
    <div className="flex-1">
      <div className={`font-bold text-sm transition-all ${
        done 
          ? 'line-through text-slate-400' 
          : darkMode 
            ? 'text-slate-200 group-hover:text-indigo-400' 
            : 'text-slate-700 group-hover:text-indigo-600'
      }`}>{label}</div>
      <div className={`text-[10px] font-bold ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{time}</div>
    </div>
  </div>
);
