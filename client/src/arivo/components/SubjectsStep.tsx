
import React from 'react';
import { motion } from 'framer-motion';
import { UserProfile } from '../types';

interface SubjectsStepProps {
  profile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
  onNext: () => void;
  onBack: () => void;
}

const subjectList = {
  school: ['Mathematics', 'Science', 'Social Studies', 'English', 'Computing', 'Arts', 'Hindi', 'Physics', 'Chemistry', 'Biology'],
  college: ['Engineering Math', 'Data Structures', 'Microprocessors', 'Economics', 'Psychology', 'Literature', 'Marketing', 'Digital Electronics'],
  'self-learner': ['Web Development', 'UI/UX Design', 'Data Science', 'Business Strategy', 'Creative Writing', 'Public Speaking', 'Personal Finance']
};

export const SubjectsStep: React.FC<SubjectsStepProps> = ({ profile, onUpdate, onNext, onBack }) => {
  const currentSubjects = subjectList[profile.userType || 'school'];

  const toggleSubject = (subject: string) => {
    const updated = profile.selectedSubjects.includes(subject)
      ? profile.selectedSubjects.filter(s => s !== subject)
      : [...profile.selectedSubjects, subject];
    onUpdate({ selectedSubjects: updated });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-3xl mx-auto w-full"
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Select your interests</h2>
        <p className="text-slate-500">Pick subjects you're interested in or need help with.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {currentSubjects.map((subject) => (
          <motion.button
            key={subject}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleSubject(subject)}
            className={`px-6 py-3 rounded-full border-2 transition-all duration-300 font-semibold ${
              profile.selectedSubjects.includes(subject)
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100'
                : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
            }`}
          >
            {subject}
            {profile.selectedSubjects.includes(subject) && <span className="ml-2">✕</span>}
          </motion.button>
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
          onClick={onNext}
          disabled={profile.selectedSubjects.length === 0}
          className={`px-12 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all ${
            profile.selectedSubjects.length > 0
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Next Step
        </button>
      </div>
    </motion.div>
  );
};
