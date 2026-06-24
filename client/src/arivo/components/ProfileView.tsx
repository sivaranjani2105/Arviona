
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile } from '../types';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, onUpdate }) => {
  const [newSubject, setNewSubject] = useState('');

  const initials = profile.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const handleAddSubject = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = newSubject.trim();
    if (trimmed && !profile.selectedSubjects.includes(trimmed)) {
      onUpdate({
        selectedSubjects: [...profile.selectedSubjects, trimmed],
      });
      setNewSubject('');
    }
  };

  const handleRemoveSubject = (subject: string) => {
    onUpdate({
      selectedSubjects: profile.selectedSubjects.filter((s) => s !== subject),
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className={`w-full ${profile.preferences.darkMode ? 'text-white' : 'text-slate-900'}`}>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {/* Profile Header */}
        <motion.div 
          variants={itemVariants}
          className={`p-10 rounded-[3rem] ${profile.preferences.darkMode ? 'bg-slate-800' : 'bg-white'} shadow-2xl shadow-slate-200/50 border border-white/40 overflow-hidden relative`}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] flex items-center justify-center text-4xl md:text-5xl font-black text-white shadow-2xl ring-8 ring-indigo-50 transition-transform hover:scale-105">
              {initials}
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 mb-4">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">{profile.fullName}</h1>
                <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-200">
                  Verified Student
                </span>
              </div>
              <p className="text-lg text-slate-500 font-medium max-w-2xl mb-8">
                Currently learning your way through <b>{profile.selectedSubjects.length} subjects</b> as a <b>{profile.userType}</b> student. 
                Keep pushing your boundaries! 🚀
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <QuickStat icon="🔥" label="Streak" value="5 Days" />
                <QuickStat icon="🏆" label="Points" value="1,240" />
                <QuickStat icon="🎯" label="Rank" value="#12" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Detailed Info Cards */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
            <div className={`p-8 rounded-[2.5rem] ${profile.preferences.darkMode ? 'bg-slate-800' : 'bg-white shadow-xl shadow-slate-100'} border border-slate-100`}>
              <h2 className="text-xl font-black mb-8 flex items-center">
                <span className="p-2 bg-indigo-50 rounded-xl mr-3 text-xl">📋</span> Personal Learning Path
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <InfoItem label="Role" value={profile.userType?.replace('-', ' ')} />
                {profile.userType === 'school' && (
                  <>
                    <InfoItem label="Class" value={`Class ${profile.class}`} />
                    <InfoItem label="Board" value={profile.board} />
                  </>
                )}
                {profile.userType === 'college' && (
                  <>
                    <InfoItem label="Degree" value={profile.degree} />
                    <InfoItem label="Department" value={profile.department} />
                    <InfoItem label="Year of Study" value={`${profile.yearOfStudy} Year`} />
                  </>
                )}
                {profile.userType === 'self-learner' && (
                  <div className="md:col-span-2">
                    <InfoItem label="Goal" value={profile.learningGoal} />
                  </div>
                )}
              </div>

              {/* Add More Subjects Input */}
              <div className="mt-6 p-6 rounded-[2rem] bg-slate-50/50 border border-dashed border-slate-200">
                <label className="text-xs font-black uppercase tracking-widest text-indigo-500 mb-4 block">Expand your horizons</label>
                <form onSubmit={handleAddSubject} className="relative mb-4">
                  <input 
                    type="text" 
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Add a new subject (e.g. Astro-Physics)"
                    className={`w-full pl-6 pr-20 py-4 rounded-2xl border-2 outline-none transition-all ${
                      profile.preferences.darkMode 
                        ? 'bg-slate-700 border-slate-600 focus:border-indigo-400' 
                        : 'bg-white border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50'
                    }`}
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 px-4 bg-indigo-600 text-white rounded-xl font-black text-xs hover:bg-indigo-700 transition-colors"
                  >
                    ADD
                  </button>
                </form>

                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {profile.selectedSubjects.map((sub) => (
                      <motion.span 
                        key={sub}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold border border-indigo-100 flex items-center space-x-2 group hover:bg-indigo-100 transition-colors"
                      >
                        <span>{sub}</span>
                        <button 
                          onClick={() => handleRemoveSubject(sub)}
                          className="opacity-0 group-hover:opacity-100 text-indigo-400 hover:text-rose-500 transition-all"
                        >
                          ✕
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className={`p-8 rounded-[2.5rem] ${profile.preferences.darkMode ? 'bg-slate-800' : 'bg-white shadow-xl shadow-slate-100'} border border-slate-100`}>
              <h2 className="text-xl font-black mb-8 flex items-center">
                <span className="p-2 bg-amber-50 rounded-xl mr-3 text-xl">🧬</span> Learning Interests
              </h2>
              <div className="flex flex-wrap gap-3">
                {profile.selectedSubjects.map((sub) => (
                  <span key={sub} className="px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-default">
                    {sub}
                  </span>
                ))}
                {profile.selectedSubjects.length === 0 && (
                  <p className="text-slate-400 italic">No subjects selected yet.</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Settings / Preferences Preview */}
          <motion.div variants={itemVariants} className="space-y-8">
             <div className={`p-8 rounded-[2.5rem] ${profile.preferences.darkMode ? 'bg-slate-800' : 'bg-indigo-600 text-white'} border border-indigo-500 shadow-2xl`}>
               <h2 className="text-xl font-black mb-6">Learning Habits</h2>
               <div className="space-y-6">
                 <HabitToggle label="Smart Notifications" active={profile.preferences.notifications} />
                 <HabitToggle label="Weekly Digest" active={profile.preferences.weeklyDigest} />
                 <HabitToggle label="Eye Protection (Dark Mode)" active={profile.preferences.darkMode} />
               </div>
               <button className="w-full mt-10 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl font-black transition-all text-sm">
                 Edit All Preferences
               </button>
             </div>
             
             <div className={`p-8 rounded-[2.5rem] ${profile.preferences.darkMode ? 'bg-slate-800' : 'bg-slate-50'} border border-slate-100`}>
               <div className="text-center">
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Member Since</p>
                 <p className="text-2xl font-black text-slate-900">February 2025</p>
               </div>
             </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const QuickStat = ({ icon, label, value }: any) => (
  <div className="flex items-center space-x-3 bg-slate-50 border border-slate-100 p-4 px-6 rounded-2xl">
    <span className="text-2xl">{icon}</span>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">{label}</p>
      <p className="text-lg font-black text-slate-800 leading-none">{value}</p>
    </div>
  </div>
);

const InfoItem = ({ label, value }: any) => (
  <div className="space-y-1">
    <p className="text-xs font-black uppercase tracking-widest text-indigo-400">{label}</p>
    <p className="text-xl font-bold text-slate-800 capitalize">{value || 'Not Specified'}</p>
  </div>
);

const HabitToggle = ({ label, active }: any) => (
  <div className="flex items-center justify-between">
    <span className="font-bold text-sm opacity-90">{label}</span>
    <div className={`w-8 h-4 rounded-full relative transition-colors ${active ? 'bg-indigo-400' : 'bg-white/20'}`}>
      <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${active ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
    </div>
  </div>
);
