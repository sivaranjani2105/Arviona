
import React from 'react';
import { motion } from 'framer-motion';
import { UserProfile } from '../types';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface ScheduleViewProps {
  profile: UserProfile;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIME_SLOTS = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
  '06:00 PM', '07:00 PM'
];

interface ScheduleItem {
  day: string;
  time: string;
  subject: string;
  duration: number; // in hours
  color: string;
}

const MOCK_SCHEDULE: ScheduleItem[] = [
  { day: 'Mon', time: '09:00 AM', subject: 'Mathematics', duration: 1.5, color: 'bg-blue-500' },
  { day: 'Mon', time: '11:00 AM', subject: 'Physics', duration: 1, color: 'bg-indigo-500' },
  { day: 'Tue', time: '10:00 AM', subject: 'Chemistry', duration: 2, color: 'bg-emerald-500' },
  { day: 'Wed', time: '09:00 AM', subject: 'Biology', duration: 1, color: 'bg-rose-500' },
  { day: 'Wed', time: '02:00 PM', subject: 'History', duration: 1.5, color: 'bg-amber-500' },
  { day: 'Thu', time: '11:00 AM', subject: 'Geography', duration: 1, color: 'bg-violet-500' },
  { day: 'Fri', time: '09:00 AM', subject: 'Computer Science', duration: 2, color: 'bg-cyan-500' },
  { day: 'Fri', time: '03:00 PM', subject: 'English', duration: 1, color: 'bg-fuchsia-500' },
];

export const ScheduleView: React.FC<ScheduleViewProps> = ({ profile }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className={`w-full ${profile.preferences.darkMode ? 'text-white' : 'text-slate-900'}`}>
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2 text-indigo-500 font-bold text-sm uppercase tracking-widest mb-2"
          >
            <span className="w-8 h-[2px] bg-indigo-500 rounded-full"></span>
            <span>Schedule</span>
          </motion.div>
            <motion.h1 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold tracking-tight"
            >
              Weekly Planner
            </motion.h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className={`flex items-center p-2 rounded-2xl border ${profile.preferences.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-lg shadow-slate-200/50'}`}>
            <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 font-bold text-sm">Mar 24 - Mar 30, 2026</span>
            <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all">
            Add Event
          </button>
        </div>
      </header>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className={`rounded-3xl border overflow-hidden shadow-2xl shadow-slate-200/50 ${profile.preferences.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white'}`}
      >
        <div className="grid grid-cols-8 border-b border-slate-100">
          <div className="p-4 border-r border-slate-100 bg-slate-50/50 flex items-center justify-center">
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          {DAYS.map(day => (
            <div key={day} className="p-4 text-center border-r border-slate-100 last:border-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-0.5">{day}</span>
              <span className="text-base font-bold">2{DAYS.indexOf(day) + 4}</span>
            </div>
          ))}
        </div>

        <div className="relative">
          {TIME_SLOTS.map((time, timeIdx) => (
            <div key={time} className="grid grid-cols-8 border-b border-slate-50 last:border-0 h-20">
              <div className="p-3 border-r border-slate-100 bg-slate-50/30 flex items-start justify-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase">{time}</span>
              </div>
              {DAYS.map(day => (
                <div key={`${day}-${time}`} className="border-r border-slate-50 last:border-0 relative group">
                  <div className="absolute inset-0 group-hover:bg-indigo-50/30 transition-colors" />
                  
                  {/* Render Mock Schedule Items */}
                  {MOCK_SCHEDULE.filter(item => item.day === day && item.time === time).map((item, idx) => (
                    <motion.div
                      key={`${item.subject}-${idx}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`absolute inset-x-1 top-1 rounded-lg p-2 shadow-md z-10 cursor-pointer hover:scale-[1.02] transition-transform ${item.color}`}
                      style={{ height: `calc(${item.duration * 100}% - 8px)` }}
                    >
                      <div className="text-[9px] font-bold text-white/70 uppercase mb-0.5">{item.time}</div>
                      <div className="text-[10px] font-bold text-white truncate">{item.subject}</div>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </motion.div>

      <div className="mt-8 flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-xs font-bold text-slate-500">Mathematics</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-indigo-500" />
          <span className="text-xs font-bold text-slate-500">Science</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-xs font-bold text-slate-500">Chemistry</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <span className="text-xs font-bold text-slate-500">Biology</span>
        </div>
      </div>
    </div>
  );
};
