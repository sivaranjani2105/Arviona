
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../services/api';
import { UserProfile } from '../types';

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

interface AssessmentViewProps {
  profile: UserProfile;
  onBack: () => void;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({ profile, onBack }) => {
  const [step, setStep] = useState<'selection' | 'loading' | 'quiz' | 'results'>('selection');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateQuiz = async (subject: string) => {
    setStep('loading');
    setError(null);
    setCurrentIndex(0);
    setUserAnswers([]);

    try {
      const prompt = `
        Generate 5 multiple choice questions for a ${profile.userType} student on the subject of "${subject}".
        The student's name is ${profile.fullName}.
        The questions should be challenging but appropriate for their level.
        Return ONLY a JSON array of objects. Do not wrap in markdown quotes.
        Each object must have:
        - question: string
        - options: string array (4 items)
        - correctIndex: number (0-3)
      `;

      const response = await api.post('/ai/chat', {
        message: prompt,
        systemInstruction: "You are a quiz generator. Output ONLY a valid JSON array matching the request. Do not include markdown code block syntax (like ```json)."
      });

      const responseText = response.response;

      const data = JSON.parse(responseText || '[]');
      if (data.length > 0) {
        setQuestions(data);
        setStep('quiz');
      } else {
        throw new Error("No questions generated");
      }
    } catch (err) {
      console.error(err);
      setError("AI was unable to generate questions. Please try again in a moment.");
      setStep('selection');
    }
  };

  const handleAnswer = (index: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = index;
    setUserAnswers(newAnswers);
    
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setStep('results');
      }
    }, 400);
  };

  const handleRetrySame = () => {
    setCurrentIndex(0);
    setUserAnswers([]);
    setStep('quiz');
  };

  const calculateScore = () => {
    return userAnswers.reduce((acc, ans, idx) => {
      return ans === questions[idx].correctIndex ? acc + 1 : acc;
    }, 0);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto py-8 ${profile.preferences.darkMode ? 'text-white' : 'text-slate-900'}`}>
      <AnimatePresence mode="wait">
        {step === 'selection' && (
          <motion.div 
            key="selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <h2 className="text-4xl font-black mb-4">Choose a Subject to Test</h2>
            <p className={`${profile.preferences.darkMode ? 'text-slate-400' : 'text-slate-500'} mb-12 max-w-lg mx-auto`}>
              Our AI will curate a personalized assessment based on your chosen interests. Ready?
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
              {profile.selectedSubjects.map(sub => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`p-6 rounded-[2rem] border-2 transition-all duration-300 font-bold text-lg ${
                    selectedSubject === sub 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-500/20 scale-105' 
                      : profile.preferences.darkMode
                        ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-indigo-500'
                        : 'bg-white border-slate-100 hover:border-indigo-200 text-slate-700 shadow-lg shadow-slate-200/50'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {error && <p className="text-rose-500 mb-6 font-bold">{error}</p>}

            <div className="flex justify-center space-x-6">
              <button 
                onClick={onBack} 
                className={`px-8 py-4 font-bold transition-colors ${profile.preferences.darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Maybe Later
              </button>
              <button 
                disabled={!selectedSubject}
                onClick={() => generateQuiz(selectedSubject)}
                className={`px-12 py-4 rounded-2xl font-black text-xl shadow-2xl transition-all ${
                  selectedSubject 
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:scale-105 active:scale-95 shadow-indigo-500/20' 
                    : profile.preferences.darkMode ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Generate Challenge
              </button>
            </div>
          </motion.div>
        )}

        {step === 'loading' && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className={`w-24 h-24 border-8 rounded-full animate-spin mb-8 ${profile.preferences.darkMode ? 'border-slate-800 border-t-indigo-500' : 'border-slate-100 border-t-indigo-600'}`}></div>
            <h2 className="text-3xl font-black mb-4">AI is crafting your quiz...</h2>
            <p className={`${profile.preferences.darkMode ? 'text-slate-400' : 'text-slate-500'} italic max-w-sm`}>
              Gathering the best questions for {selectedSubject} tailored for a {profile.userType} level.
            </p>
          </motion.div>
        )}

        {step === 'quiz' && questions.length > 0 && (
          <motion.div 
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            <div className="mb-12">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <span className="text-indigo-500 font-black uppercase tracking-widest text-xs">Question {currentIndex + 1} of {questions.length}</span>
                  <h2 className="text-2xl font-black mt-1">{selectedSubject} Challenge</h2>
                </div>
                <span className={`font-black ${profile.preferences.darkMode ? 'text-slate-600' : 'text-slate-300'}`}>{Math.round(((currentIndex + 1) / questions.length) * 100)}%</span>
              </div>
              <div className={`h-3 rounded-full overflow-hidden ${profile.preferences.darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
                />
              </div>
            </div>

            <div className={`p-10 rounded-[2.5rem] border ${profile.preferences.darkMode ? 'bg-slate-800 border-slate-700 shadow-2xl shadow-slate-950/50' : 'bg-white border-slate-100 shadow-2xl shadow-slate-200/50'}`}>
              <h3 className="text-2xl font-bold mb-10 leading-snug">
                {questions[currentIndex].question}
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {questions[currentIndex].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className={`group flex items-center p-6 rounded-2xl border-2 transition-all duration-300 text-left font-semibold text-lg ${
                      userAnswers[currentIndex] === idx 
                        ? 'bg-indigo-600 border-indigo-600 text-white' 
                        : profile.preferences.darkMode
                          ? 'bg-slate-700 border-slate-600 text-slate-300 hover:border-indigo-500 hover:bg-slate-600'
                          : 'bg-slate-50 border-slate-100 hover:border-indigo-300 hover:bg-white text-slate-700'
                    }`}
                  >
                    <span className={`w-10 h-10 flex items-center justify-center rounded-xl mr-5 transition-colors ${
                      userAnswers[currentIndex] === idx 
                        ? 'bg-white/20' 
                        : profile.preferences.darkMode
                          ? 'bg-slate-800 text-slate-500 group-hover:text-indigo-400'
                          : 'bg-white text-slate-400 group-hover:text-indigo-600'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 'results' && (
          <motion.div 
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10"
          >
            <div className={`w-32 h-32 bg-green-500 text-white rounded-[2.5rem] flex items-center justify-center text-5xl mx-auto mb-8 shadow-2xl animate-bounce ${profile.preferences.darkMode ? 'shadow-green-900/40' : 'shadow-green-200'}`}>
              🎉
            </div>
            <h2 className="text-5xl font-black mb-4">Assessment Complete!</h2>
            <div className="text-8xl font-black text-indigo-500 my-4 tabular-nums">
              {calculateScore()}<span className={`text-4xl ${profile.preferences.darkMode ? 'text-slate-700' : 'text-slate-300'}`}>/{questions.length}</span>
            </div>
            
            <p className={`text-xl max-w-md mx-auto mb-10 ${profile.preferences.darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {calculateScore() === questions.length 
                ? "Perfect score! You've absolutely mastered this topic. Ready for more?" 
                : calculateScore() >= questions.length / 2 
                  ? "Great job! You have a solid grasp of the material. Keep it up!"
                  : "Good effort! Practice makes perfect. Why not try again?"}
            </p>

            {/* Assessment Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
              <button 
                onClick={handleRetrySame}
                className={`flex items-center justify-center space-x-3 p-5 border-2 rounded-3xl font-bold transition-all group ${
                  profile.preferences.darkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-indigo-500'
                    : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50 hover:border-indigo-200 shadow-lg shadow-slate-200/50'
                }`}
              >
                <span className="text-2xl group-hover:rotate-180 transition-transform duration-500">🔄</span>
                <span>Retry Same Quiz</span>
              </button>
              <button 
                onClick={() => generateQuiz(selectedSubject)}
                className={`flex items-center justify-center space-x-3 p-5 border-2 rounded-3xl font-bold transition-all group ${
                  profile.preferences.darkMode
                    ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20'
                    : 'bg-indigo-50 border-indigo-100 text-indigo-700 hover:bg-indigo-100 shadow-lg shadow-indigo-100/50'
                }`}
              >
                <span>New {selectedSubject} Challenge</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
              <button 
                onClick={() => {
                  setStep('selection');
                  setSelectedSubject('');
                }}
                className="text-indigo-500 font-black hover:underline px-6 py-2"
              >
                Try Another Subject
              </button>
              <button 
                onClick={onBack}
                className={`font-bold px-6 py-2 transition-colors ${profile.preferences.darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Back to Home
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
