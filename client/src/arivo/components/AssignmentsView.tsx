
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Clock, CheckCircle2, AlertCircle, FileText, Search } from 'lucide-react';
import { UserProfile, Assignment } from '../types';

interface AssignmentsViewProps {
  profile: UserProfile;
  onStartAssignment: (assignment: Assignment) => void;
  onViewAssignment: (assignment: Assignment) => void;
}

const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: '1',
    title: 'Quantum Mechanics Basics',
    subject: 'Physics',
    dueDate: 'Oct 15, 2026',
    status: 'Pending',
  },
  {
    id: '2',
    title: 'Cell Structure and Function',
    subject: 'Biology',
    dueDate: 'Oct 12, 2026',
    status: 'Submitted',
  },
  {
    id: '3',
    title: 'Linear Algebra Problem Set',
    subject: 'Mathematics',
    dueDate: 'Oct 10, 2026',
    status: 'Graded',
    score: '95/100',
  },
  {
    id: '4',
    title: 'Organic Chemistry Synthesis',
    subject: 'Chemistry',
    dueDate: 'Oct 20, 2026',
    status: 'Pending',
  },
  {
    id: '5',
    title: 'World War II Timeline',
    subject: 'Social Studies',
    dueDate: 'Oct 08, 2026',
    status: 'Graded',
    score: '88/100',
  }
];

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({ profile, onStartAssignment, onViewAssignment }) => {
  const [assignments, setAssignments] = useState<Assignment[]>(MOCK_ASSIGNMENTS);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Pending' | 'Submitted' | 'Graded'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleMarkComplete = (id: string) => {
    setAssignments(prev => prev.map(a => 
      a.id === id ? { ...a, status: 'Submitted' } : a
    ));
  };

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

  const getStatusStyles = (status: Assignment['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Submitted':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Graded':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: Assignment['status']) => {
    switch (status) {
      case 'Pending':
        return <AlertCircle className="w-3.5 h-3.5 mr-1" />;
      case 'Submitted':
        return <Clock className="w-3.5 h-3.5 mr-1" />;
      case 'Graded':
        return <CheckCircle2 className="w-3.5 h-3.5 mr-1" />;
    }
  };

  const getDaysLeftBadge = (dueDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dueDateStr);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return (
        <div className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">
          Overdue
        </div>
      );
    } else if (diffDays === 0) {
      return (
        <div className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
          Due today
        </div>
      );
    } else if (diffDays <= 2) {
      return (
        <div className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
          {diffDays} {diffDays === 1 ? 'day' : 'days'} left
        </div>
      );
    } else {
      return (
        <div className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
          {diffDays} days left
        </div>
      );
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesFilter = activeFilter === 'All' || assignment.status === activeFilter;
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          assignment.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className={`w-full ${profile.preferences.darkMode ? 'text-white' : 'text-slate-900'}`}>
      <div className="mb-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2 text-[#5046e5] font-bold text-sm uppercase tracking-widest mb-2"
        >
          <span className="w-8 h-[2px] bg-[#5046e5] rounded-full"></span>
          <span>Academic</span>
        </motion.div>
        <motion.h1 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold tracking-tight"
        >
          Your Assignments
        </motion.h1>
        <p className={`${profile.preferences.darkMode ? 'text-slate-400' : 'text-slate-500'} mt-3 text-base max-w-xl leading-relaxed`}>
          Track your progress, submit your work, and review your grades all in one place.
        </p>
      </div>

      {/* Search Input */}
      <div className="mb-6 relative max-w-md group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className={`w-5 h-5 transition-colors ${
            profile.preferences.darkMode ? 'text-slate-500 group-focus-within:text-[#5046e5]' : 'text-slate-400 group-focus-within:text-[#5046e5]'
          }`} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title or subject..."
          className={`w-full pl-11 pr-4 py-3 rounded-2xl border transition-all outline-none focus:ring-2 focus:ring-[#5046e5]/20 focus:border-[#5046e5] ${
            profile.preferences.darkMode 
              ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' 
              : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
          }`}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1 mb-8 p-1 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 w-fit">
        {['All', 'Pending', 'Submitted', 'Graded'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter as any)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all relative ${
              activeFilter === filter
                ? 'text-white'
                : profile.preferences.darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {activeFilter === filter && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-[#5046e5] rounded-xl shadow-lg shadow-indigo-500/20"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{filter}</span>
          </button>
        ))}
      </div>

      <motion.div 
        key={activeFilter}
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredAssignments.map((assignment) => (
          <motion.div
            key={assignment.id}
            variants={itemVariants}
            className={`p-6 rounded-3xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
              profile.preferences.darkMode 
                ? 'bg-slate-800 border-slate-700 hover:border-indigo-500/50' 
                : 'bg-white border-slate-100 hover:border-indigo-200'
            } shadow-sm`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col space-y-2">
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center w-fit ${getStatusStyles(assignment.status)}`}>
                  {getStatusIcon(assignment.status)}
                  {assignment.status}
                </div>
                {assignment.status === 'Pending' && getDaysLeftBadge(assignment.dueDate)}
              </div>
              {assignment.score && (
                <div className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                  Score: {assignment.score}
                </div>
              )}
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-2 text-slate-400 mb-1">
                <BookOpen className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">{assignment.subject}</span>
              </div>
              <h3 className="text-lg font-bold leading-tight group-hover:text-[#5046e5] transition-colors line-clamp-2">
                {assignment.title}
              </h3>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="flex items-center text-slate-400">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-xs font-medium">Due {assignment.dueDate}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                {assignment.status === 'Pending' && (
                  <button 
                    onClick={() => handleMarkComplete(assignment.id)}
                    className={`px-4 py-2 rounded-xl font-bold text-xs transition-all active:scale-95 ${
                      profile.preferences.darkMode
                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    Mark as Complete
                  </button>
                )}
                <button 
                  onClick={() => {
                    if (assignment.status === 'Pending') {
                      onStartAssignment(assignment);
                    } else {
                      onViewAssignment(assignment);
                    }
                  }}
                  className={`px-5 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                    assignment.status === 'Pending'
                      ? 'bg-[#5046e5] text-white shadow-lg shadow-indigo-500/20 hover:bg-[#4338ca]'
                      : profile.preferences.darkMode
                        ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {assignment.status === 'Pending' ? 'Start' : 'View'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Empty State / Add New Placeholder */}
        <motion.div
          variants={itemVariants}
          className={`p-6 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-all min-h-[240px] ${
            profile.preferences.darkMode 
              ? 'border-slate-700 bg-slate-800/30 hover:border-slate-600' 
              : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-400">
            <FileText className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-400">No more assignments</p>
          <p className="text-xs text-slate-500 mt-1">You're all caught up for now!</p>
        </motion.div>
      </motion.div>
    </div>
  );
};
