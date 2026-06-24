
import React from 'react';
import { motion } from 'framer-motion';
import { UserType } from '../types';

interface UserTypeSelectionProps {
  selected: UserType;
  onSelect: (type: UserType) => void;
  onNext: () => void;
}

const roles = [
  { id: 'school', title: 'School Student', emoji: '🎒', desc: 'Focusing on school boards and foundational learning.' },
  { id: 'college', title: 'College Student', emoji: '🎓', desc: 'Advancing in higher education and specialized degrees.' },
  { id: 'self-learner', title: 'Self Learner', emoji: '🧑‍💻', desc: 'Learning for career growth, skills, or personal interest.' },
  { id: 'teacher', title: 'Teacher', emoji: '👨‍🏫', desc: 'Manage your classes, students, and track progress.' },
];

export const UserTypeSelection: React.FC<UserTypeSelectionProps> = ({ selected, onSelect, onNext }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col items-center"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">How would you describe yourself?</h2>
        <p className="text-slate-500 max-w-sm mx-auto">We'll tailor your dashboard to suit your specific learning needs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-12">
        {roles.map((role) => (
          <motion.button
            key={role.id}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(role.id as UserType)}
            className={`relative p-6 rounded-[2rem] border-2 transition-all duration-500 text-left group ${
              selected === role.id 
                ? 'bg-white border-indigo-600 shadow-2xl shadow-indigo-100 ring-4 ring-indigo-50' 
                : 'bg-white/50 border-slate-100 hover:border-slate-200 shadow-sm'
            }`}
          >
            <div className={`text-4xl mb-4 p-4 rounded-2xl inline-block transition-transform duration-500 group-hover:rotate-12 ${
              selected === role.id ? 'bg-indigo-50' : 'bg-slate-50'
            }`}>
              {role.emoji}
            </div>
            <h3 className={`text-xl font-bold mb-2 transition-colors ${
              selected === role.id ? 'text-indigo-600' : 'text-slate-800'
            }`}>
              {role.title}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              {role.desc}
            </p>

            {selected === role.id && (
              <motion.div 
                layoutId="check"
                className="absolute top-4 right-4 bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs"
              >
                ✓
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      <button
        disabled={!selected}
        onClick={onNext}
        className={`px-12 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 transform ${
          selected 
            ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95 opacity-100' 
            : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-50'
        }`}
      >
        Continue to Setup
      </button>
    </motion.div>
  );
};
