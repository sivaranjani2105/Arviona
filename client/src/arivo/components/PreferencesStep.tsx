
import React from 'react';
import { motion } from 'framer-motion';
import { UserProfile } from '../types';

interface PreferencesStepProps {
  profile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
  onFinish: () => void;
  onBack: () => void;
}

export const PreferencesStep: React.FC<PreferencesStepProps> = ({ profile, onUpdate, onFinish, onBack }) => {
  const togglePref = (key: keyof UserProfile['preferences']) => {
    onUpdate({
      preferences: {
        ...profile.preferences,
        [key]: !profile.preferences[key]
      }
    });
  };

  const options = [
    { key: 'notifications', title: 'Smart Reminders', desc: 'Get notified about study schedules and pending goals.', icon: '🔔' },
    { key: 'weeklyDigest', title: 'Weekly Progress Report', desc: 'Receive a summary of your achievements every Monday.', icon: '📊' },
    { key: 'darkMode', title: 'Late Night Mode', desc: 'Switch to a darker theme to reduce eye strain during night studies.', icon: '🌙' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto w-full"
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Final touches</h2>
        <p className="text-slate-500">Configure how you'd like to use LearnWay.</p>
      </div>

      <div className="space-y-4 mb-12">
        {options.map((opt) => (
          <div 
            key={opt.key}
            onClick={() => togglePref(opt.key as any)}
            className="group flex items-center p-6 bg-white border-2 border-slate-100 rounded-3xl hover:border-indigo-100 hover:bg-indigo-50/30 cursor-pointer transition-all duration-300"
          >
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl mr-6 group-hover:scale-110 transition-transform">
              {opt.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 text-lg">{opt.title}</h3>
              <p className="text-sm text-slate-500">{opt.desc}</p>
            </div>
            <div className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${profile.preferences[opt.key as keyof UserProfile['preferences']] ? 'bg-indigo-600' : 'bg-slate-200'}`}>
              <motion.div 
                animate={{ x: profile.preferences[opt.key as keyof UserProfile['preferences']] ? 24 : 4 }}
                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-8">
        <button 
          onClick={onBack}
          className="px-8 py-4 text-slate-500 font-bold hover:text-slate-800 transition-colors"
        >
          ← Back
        </button>
        <button 
          onClick={onFinish}
          className="px-16 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 hover:shadow-indigo-200 transform hover:scale-105 active:scale-95 transition-all"
        >
          All Set, Let's Go!
        </button>
      </div>
    </motion.div>
  );
};
