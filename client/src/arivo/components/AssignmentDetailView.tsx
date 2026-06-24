
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Calendar, FileText, CheckCircle2, MessageSquare, Award, Download } from 'lucide-react';
import { UserProfile, Assignment } from '../types';

interface AssignmentDetailViewProps {
  profile: UserProfile;
  assignment: Assignment;
  onBack: () => void;
}

export const AssignmentDetailView: React.FC<AssignmentDetailViewProps> = ({ profile, assignment, onBack }) => {
  // Mock submission data
  const submissionData = {
    submittedAt: 'Oct 12, 2026 at 2:30 PM',
    answer: "The cell is the basic structural, functional, and biological unit of all known organisms. A cell is the smallest unit of life. Cells are often called the 'building blocks of life'. The study of cells is called cell biology, cellular biology, or cytology.\n\nCells consist of cytoplasm enclosed within a membrane, which contains many biomolecules such as proteins and nucleic acids. Most plant and animal cells are only visible under a light microscope, with dimensions between 1 and 100 micrometres.",
    files: [
      { name: 'cell_diagram.png', size: '1.4 MB' },
      { name: 'research_notes.pdf', size: '850 KB' }
    ],
    feedback: assignment.status === 'Graded' ? "Excellent work on the cell structure explanation. Your diagram was particularly detailed and accurate. Keep up the great work!" : null,
    grade: assignment.status === 'Graded' ? 'A+' : null
  };

  const getGradeColor = (grade: string | null) => {
    if (!grade) return '';
    if (grade.startsWith('A')) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (grade.startsWith('B')) return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${profile.preferences.darkMode ? 'text-white' : 'text-slate-900'}`}>
      <button 
        onClick={onBack}
        className="flex items-center space-x-2 text-slate-500 hover:text-[#5046e5] transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-bold uppercase tracking-widest">Back to Assignments</span>
      </button>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center space-x-2 text-[#5046e5] font-bold text-sm uppercase tracking-widest mb-2">
            <span className="w-8 h-[2px] bg-[#5046e5] rounded-full"></span>
            <span>{assignment.subject}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{assignment.title}</h1>
          <div className="flex items-center text-slate-500 space-x-4">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Due {assignment.dueDate}</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
              <span className="text-sm font-medium">Submitted {submissionData.submittedAt}</span>
            </div>
          </div>
        </div>

        {assignment.status === 'Graded' && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-4 rounded-3xl border flex items-center space-x-4 ${getGradeColor(submissionData.grade)}`}
          >
            <div className="text-center px-4 border-r border-current/20">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">Grade</div>
              <div className="text-3xl font-black">{submissionData.grade}</div>
            </div>
            <div className="text-center px-4">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">Score</div>
              <div className="text-2xl font-bold">{assignment.score}</div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Submitted Answer */}
          <section className={`p-8 rounded-3xl border ${profile.preferences.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Your Submission
            </h3>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed">
                {submissionData.answer}
              </p>
            </div>

            {submissionData.files.length > 0 && (
              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Attached Files</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {submissionData.files.map((file, index) => (
                    <div 
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-xl border ${
                        profile.preferences.darkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-100'
                      }`}
                    >
                      <div className="flex items-center min-w-0">
                        <FileText className="w-4 h-4 text-[#5046e5] mr-3 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="text-sm font-bold truncate">{file.name}</div>
                          <div className="text-[10px] text-slate-500">{file.size}</div>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-[#5046e5] transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="space-y-8">
          {/* Feedback Section */}
          {assignment.status === 'Graded' && (
            <section className={`p-8 rounded-3xl border ${profile.preferences.darkMode ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#5046e5] mb-4 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                Instructor Feedback
              </h3>
              <p className={`text-sm leading-relaxed ${profile.preferences.darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                "{submissionData.feedback}"
              </p>
              <div className="mt-6 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-indigo-200 dark:bg-indigo-500/30 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold">
                  JS
                </div>
                <div>
                  <div className="text-xs font-bold">Prof. Jane Smith</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest">Biology Department</div>
                </div>
              </div>
            </section>
          )}

          {/* Achievement Badge */}
          {assignment.status === 'Graded' && (
            <section className={`p-8 rounded-3xl border text-center ${profile.preferences.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="font-bold mb-1">New Achievement!</h3>
              <p className="text-xs text-slate-500 mb-4">You've earned the 'Cell Specialist' badge for this assignment.</p>
              <button className="text-xs font-bold text-[#5046e5] hover:underline">View in Profile</button>
            </section>
          )}

          {/* Status Info */}
          <section className={`p-8 rounded-3xl border ${profile.preferences.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              Course Info
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Subject</div>
                <div className="text-sm font-bold">{assignment.subject}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Status</div>
                <div className={`text-sm font-bold ${assignment.status === 'Graded' ? 'text-emerald-500' : 'text-blue-500'}`}>
                  {assignment.status}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
