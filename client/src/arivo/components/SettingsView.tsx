
import React from 'react';
import { motion } from 'framer-motion';
import { UserProfile } from '../types';

interface SettingsViewProps {
  profile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
  onBack: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ profile, onUpdate, onBack }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  const togglePref = (key: keyof UserProfile['preferences']) => {
    onUpdate({
      preferences: {
        ...profile.preferences,
        [key]: !profile.preferences[key]
      }
    });
  };

  return (
    <div className={`w-full max-w-5xl mx-auto py-8 ${profile.preferences.darkMode ? 'text-white' : 'text-slate-900'}`}>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-12"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">Settings</h1>
            <p className="text-slate-500 font-medium">Manage your account and learning experience</p>
          </div>
          <button 
            onClick={onBack}
            className="p-3 bg-white rounded-2xl shadow-xl shadow-slate-200 border border-slate-100 hover:bg-slate-50 transition-colors text-slate-500"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Navigation Sidebar (Local) */}
          <div className="lg:col-span-3 space-y-2">
            <SettingsNavLink active label="Profile Settings" icon="👤" />
            <SettingsNavLink label="Learning Preferences" icon="🎓" />
            <SettingsNavLink label="Notifications" icon="🔔" />
            <SettingsNavLink label="Appearance" icon="🎨" />
            <SettingsNavLink label="Security" icon="🔒" />
          </div>

          {/* Main Content Areas */}
          <div className="lg:col-span-9 space-y-10">
            
            {/* 1. Profile Settings */}
            <motion.section variants={itemVariants} className={`p-8 rounded-[2.5rem] border ${profile.preferences.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-xl shadow-slate-100'}`}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black">Profile Details</h2>
                <button className="text-indigo-600 font-bold text-sm hover:underline">Edit photo</button>
              </div>
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-2xl font-black text-white shadow-xl ring-4 ring-indigo-50">
                    {profile.fullName[0]}
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                        <input 
                          type="text" 
                          value={profile.fullName}
                          onChange={(e) => onUpdate({ fullName: e.target.value })}
                          className={`w-full px-5 py-3.5 rounded-2xl border-2 transition-all outline-none ${profile.preferences.darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-100 focus:bg-white focus:border-indigo-500'}`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                        <input 
                          type="email" 
                          value={profile.email}
                          className={`w-full px-5 py-3.5 rounded-2xl border-2 bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed`}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* 2. Learning Preferences */}
            <motion.section variants={itemVariants} className={`p-8 rounded-[2.5rem] border ${profile.preferences.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-xl shadow-slate-100'}`}>
              <h2 className="text-xl font-black mb-8">Learning Preferences</h2>
              <div className="space-y-8">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block mb-3">Selected Subjects</label>
                  <div className="flex flex-wrap gap-2">
                    {profile.selectedSubjects.map(sub => (
                      <span key={sub} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold border border-indigo-100 flex items-center">
                        {sub}
                        <button className="ml-2 hover:text-indigo-800">×</button>
                      </span>
                    ))}
                    <button className="px-4 py-2 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl text-sm font-bold text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-all">+ Add Subject</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block mb-3">Difficulty Level</label>
                    <div className="flex p-1 bg-slate-100 rounded-2xl">
                      {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => onUpdate({ difficulty: lvl as any })}
                          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${profile.difficulty === lvl ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* 3. Notifications */}
            <motion.section variants={itemVariants} className={`p-8 rounded-[2.5rem] border ${profile.preferences.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-xl shadow-slate-100'}`}>
              <h2 className="text-xl font-black mb-8">Notifications</h2>
              <div className="space-y-6">
                <ToggleItem 
                  label="Class Reminders" 
                  desc="Get notified 15 minutes before your scheduled lessons." 
                  active={profile.preferences.notifications} 
                  onToggle={() => togglePref('notifications')}
                />
                <ToggleItem 
                  label="Assignment & Exam Alerts" 
                  desc="Critical updates about upcoming deadlines and tests." 
                  active={profile.preferences.examAlerts} 
                  onToggle={() => togglePref('examAlerts')}
                />
              </div>
            </motion.section>

            {/* 4. Appearance */}
            <motion.section variants={itemVariants} className={`p-8 rounded-[2.5rem] border ${profile.preferences.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-xl shadow-slate-100'}`}>
              <h2 className="text-xl font-black mb-8">Appearance</h2>
              <div className="space-y-10">
                <ToggleItem 
                  label="Dark Mode" 
                  desc="Switch between light and dark themes." 
                  active={profile.preferences.darkMode} 
                  onToggle={() => togglePref('darkMode')}
                />
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-800">Font Size</h4>
                      <p className="text-sm text-slate-500">Adjust the text size for better readability.</p>
                    </div>
                    <span className="text-sm font-black text-indigo-600">{profile.preferences.fontSize}px</span>
                  </div>
                  <input 
                    type="range" 
                    min="12" 
                    max="24" 
                    value={profile.preferences.fontSize} 
                    onChange={(e) => onUpdate({ preferences: { ...profile.preferences, fontSize: parseInt(e.target.value) }})}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>
            </motion.section>

            {/* 5. Security */}
            <motion.section variants={itemVariants} className={`p-8 rounded-[2.5rem] border ${profile.preferences.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-xl shadow-slate-100'}`}>
              <h2 className="text-xl font-black mb-8">Security & Privacy</h2>
              <div className="space-y-4">
                <button className="w-full p-5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-between group transition-all">
                  <div className="flex items-center space-x-4">
                    <span className="text-xl">🔑</span>
                    <span className="font-bold text-slate-700">Change Password</span>
                  </div>
                  <svg className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button className="w-full p-5 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-2xl flex items-center justify-center space-x-3 transition-all">
                   <span className="font-black text-rose-600">Logout from all devices</span>
                </button>
              </div>
            </motion.section>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

const SettingsNavLink = ({ active, label, icon }: any) => (
  <button className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-500 hover:bg-slate-100'}`}>
    <span className="text-lg">{icon}</span>
    <span className="font-black text-sm">{label}</span>
  </button>
);

const ToggleItem = ({ label, desc, active, onToggle }: any) => (
  <div className="flex items-center justify-between group cursor-pointer" onClick={onToggle}>
    <div className="flex-1 pr-10">
      <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{label}</h4>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
    <div className={`w-12 h-6.5 rounded-full relative transition-colors duration-300 p-1 ${active ? 'bg-indigo-600' : 'bg-slate-200'}`}>
      <motion.div 
        animate={{ x: active ? 22 : 0 }}
        className="w-4.5 h-4.5 bg-white rounded-full shadow-md"
      />
    </div>
  </div>
);
