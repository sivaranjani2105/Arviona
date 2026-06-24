
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface AboutYouStepProps {
  profile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
  onNext: () => void;
  onBack: () => void;
}

const DEGREE_BRANCH_MAP: Record<string, string[]> = {
  'B.Tech': ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'IT', 'Chemical', 'Biotechnology'],
  'B.E.': ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'IT', 'Chemical', 'Biotechnology'],
  'B.Sc': ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'Statistics', 'Botany', 'Zoology'],
  'B.Com': ['General', 'Accounting', 'Finance', 'Taxation', 'Banking', 'Insurance'],
  'B.A.': ['English', 'History', 'Psychology', 'Sociology', 'Economics', 'Political Science', 'Philosophy'],
  'M.Tech': ['Computer Science', 'VLSI', 'Structural', 'Thermal', 'Power Systems', 'Data Science'],
  'MBA': ['Finance', 'Marketing', 'HR', 'Operations', 'International Business', 'IT Management'],
  'MCA': ['Computer Applications'],
  'Ph.D': ['Research in Science', 'Research in Engineering', 'Research in Humanities', 'Research in Management']
};

export const AboutYouStep: React.FC<AboutYouStepProps> = ({ profile, onUpdate, onNext, onBack }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!profile.fullName.trim()) newErrors.fullName = "Tell us your name!";
    
    if (profile.userType === 'school') {
      if (!profile.class) newErrors.class = "Select your class";
      if (!profile.board) newErrors.board = "Select your board";
    } else if (profile.userType === 'college') {
      if (!profile.degree) newErrors.degree = "Select your degree";
      if (!profile.department) newErrors.department = "Select your department";
    } else if (profile.userType === 'self-learner') {
      if (!profile.learningGoal) newErrors.learningGoal = "What are you aiming for?";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      onNext();
    }
  };

  const handleDegreeChange = (degree: string) => {
    onUpdate({ degree, department: '' });
  };

  return (
    <div className="max-w-2xl mx-auto w-full animate-[fadeInRight_0.5s_ease-out]">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-3">Let’s get acquainted</h2>
        <p className="text-slate-500 text-lg font-medium">This helps us personalize your dashboard and recommendations.</p>
      </div>

      <div className="space-y-8">
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700 ml-2 uppercase tracking-wider">Full Name</label>
          <input 
            type="text" 
            value={profile.fullName}
            onChange={(e) => onUpdate({ fullName: e.target.value })}
            placeholder="e.g. Alex Johnson"
            className={`w-full px-6 py-5 rounded-[1.5rem] bg-white border-2 transition-all duration-300 outline-none focus:ring-8 ${
              errors.fullName ? 'border-red-300 focus:border-red-500 focus:ring-red-50' : 'border-slate-100 focus:border-indigo-500 focus:ring-indigo-50 shadow-sm'
            }`}
          />
          {errors.fullName && <p className="text-sm text-red-500 ml-2 font-bold animate-pulse">{errors.fullName}</p>}
        </div>

        {profile.userType === 'school' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 ml-2 uppercase tracking-wider">Class</label>
              <select 
                value={profile.class}
                onChange={(e) => onUpdate({ class: e.target.value })}
                className="w-full px-6 py-5 rounded-[1.5rem] bg-white border-2 border-slate-100 focus:border-indigo-500 focus:ring-8 focus:ring-indigo-50 outline-none transition-all duration-300 shadow-sm appearance-none"
              >
                <option value="">Select Class</option>
                {[6, 7, 8, 9, 10, 11, 12].map(num => (
                  <option key={num} value={num}>Class {num}</option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 ml-2 uppercase tracking-wider">Board</label>
              <select 
                value={profile.board}
                onChange={(e) => onUpdate({ board: e.target.value })}
                className="w-full px-6 py-5 rounded-[1.5rem] bg-white border-2 border-slate-100 focus:border-indigo-500 focus:ring-8 focus:ring-indigo-50 outline-none transition-all duration-300 shadow-sm appearance-none"
              >
                <option value="">Select Board</option>
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="State Board">State Board</option>
              </select>
            </div>
          </div>
        )}

        {profile.userType === 'college' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 ml-2 uppercase tracking-wider">Degree</label>
                <select 
                  value={profile.degree}
                  onChange={(e) => handleDegreeChange(e.target.value)}
                  className={`w-full px-6 py-5 rounded-[1.5rem] bg-white border-2 transition-all duration-300 outline-none focus:ring-8 appearance-none shadow-sm ${
                    errors.degree ? 'border-red-300 focus:border-red-500 focus:ring-red-50' : 'border-slate-100 focus:border-indigo-500 focus:ring-indigo-50'
                  }`}
                >
                  <option value="">Select Degree</option>
                  {Object.keys(DEGREE_BRANCH_MAP).map(deg => (
                    <option key={deg} value={deg}>{deg}</option>
                  ))}
                </select>
                {errors.degree && <p className="text-sm text-red-500 ml-2 font-bold">{errors.degree}</p>}
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 ml-2 uppercase tracking-wider">Branch/Department</label>
                <select 
                  value={profile.department}
                  disabled={!profile.degree}
                  onChange={(e) => onUpdate({ department: e.target.value })}
                  className={`w-full px-6 py-5 rounded-[1.5rem] bg-white border-2 transition-all duration-300 outline-none focus:ring-8 appearance-none shadow-sm ${
                    !profile.degree ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''
                  } ${
                    errors.department ? 'border-red-300 focus:border-red-500 focus:ring-red-50' : 'border-slate-100 focus:border-indigo-500 focus:ring-indigo-50'
                  }`}
                >
                  <option value="">Select Branch</option>
                  {profile.degree && DEGREE_BRANCH_MAP[profile.degree]?.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
                {errors.department && <p className="text-sm text-red-500 ml-2 font-bold">{errors.department}</p>}
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 ml-2 uppercase tracking-wider">Year of Study</label>
              <div className="flex flex-wrap gap-4">
                {['1st', '2nd', '3rd', '4th'].map(year => (
                  <button
                    key={year}
                    onClick={() => onUpdate({ yearOfStudy: year })}
                    className={`flex-1 min-w-[80px] py-4 rounded-2xl border-2 transition-all duration-300 font-bold ${
                      profile.yearOfStudy === year 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                        : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {year} Year
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {profile.userType === 'self-learner' && (
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 ml-2 uppercase tracking-wider">Primary Learning Goal</label>
            <textarea 
              value={profile.learningGoal}
              onChange={(e) => onUpdate({ learningGoal: e.target.value })}
              placeholder="e.g., Master Full-Stack Web Development for a Career Change..."
              rows={4}
              className="w-full px-6 py-5 rounded-[1.5rem] bg-white border-2 border-slate-100 focus:border-indigo-500 focus:ring-8 focus:ring-indigo-50 outline-none transition-all duration-300 shadow-sm resize-none text-lg font-medium"
            />
          </div>
        )}

        <div className="flex items-center justify-between pt-12">
          <button 
            onClick={onBack}
            className="px-8 py-4 text-slate-500 font-bold hover:text-slate-800 transition-colors text-lg"
          >
            ← Back
          </button>
          <button 
            onClick={handleContinue}
            className="px-14 py-5 bg-indigo-600 text-white font-bold rounded-[1.5rem] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all text-xl"
          >
            Next Step
          </button>
        </div>
      </div>
    </div>
  );
};
