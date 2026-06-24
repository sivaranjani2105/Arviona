
import React from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';
import { UserProfile } from '../types';
import { TrendingUp, Clock, Target, Award, BookOpen, Brain } from 'lucide-react';

interface AnalyticsViewProps {
  profile: UserProfile;
}

const timeSpentData = [
  { subject: 'Mathematics', hours: 8.5 },
  { subject: 'Physics', hours: 6.2 },
  { subject: 'Chemistry', hours: 4.8 },
  { subject: 'Biology', hours: 3.5 },
  { subject: 'Computer Science', hours: 7.0 },
];

const assessmentScoresData = [
  { test: 'Test 1', score: 68 },
  { test: 'Test 2', score: 75 },
  { test: 'Test 3', score: 72 },
  { test: 'Test 4', score: 88 },
  { test: 'Test 5', score: 94 },
];

const courseCompletionData = [
  { name: 'Mathematics', value: 85 },
  { name: 'Physics', value: 60 },
  { name: 'Chemistry', value: 45 },
  { name: 'Biology', value: 30 },
  { name: 'CS', value: 90 },
];

const BRAND_COLOR = '#5046e5';
const COLORS = ['#5046e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ profile }) => {
  const isDark = profile.preferences.darkMode;

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

  return (
    <div className={`max-w-7xl mx-auto space-y-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
      <header className="mb-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2 text-indigo-500 font-bold text-sm uppercase tracking-widest mb-2"
        >
          <span className="w-8 h-[2px] bg-indigo-500 rounded-full"></span>
          <span>Analytics</span>
        </motion.div>
        <h2 className="text-3xl font-bold tracking-tight">Learning Insights</h2>
        <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} mt-1 text-base font-medium`}>Deep dive into your academic performance and habits</p>
      </header>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <MetricCard 
          title="Total Study Time" 
          value="30h" 
          change="+15%" 
          icon={<Clock className="w-6 h-6" />} 
          color="bg-blue-500" 
          darkMode={isDark}
        />
        <MetricCard 
          title="Avg. Score" 
          value="79.4%" 
          change="+8%" 
          icon={<Target className="w-6 h-6" />} 
          color="bg-indigo-500" 
          darkMode={isDark}
        />
        <MetricCard 
          title="Milestones" 
          value="15" 
          change="+3" 
          icon={<Award className="w-6 h-6" />} 
          color="bg-emerald-500" 
          darkMode={isDark}
        />
        <MetricCard 
          title="Course Progress" 
          value="62%" 
          change="+5%" 
          icon={<BookOpen className="w-6 h-6" />} 
          color="bg-violet-500" 
          darkMode={isDark}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Time Spent Bar Chart */}
        <motion.div 
          variants={itemVariants}
          className={`lg:col-span-7 p-6 rounded-3xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50'}`}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold">Time Spent per Subject</h3>
              <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Weekly distribution of learning hours</p>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeSpentData} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={isDark ? '#334155' : '#f1f5f9'} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="subject" 
                  type="category"
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12, fontWeight: 700 }}
                  width={120}
                />
                <Tooltip 
                  cursor={{ fill: isDark ? '#1e293b' : '#f8fafc' }}
                  contentStyle={{ 
                    borderRadius: '16px', 
                    backgroundColor: isDark ? '#1e293b' : '#fff',
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    color: isDark ? '#fff' : '#000'
                  }}
                />
                <Bar dataKey="hours" fill={BRAND_COLOR} radius={[0, 10, 10, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Course Completion Donut */}
        <motion.div 
          variants={itemVariants}
          className={`lg:col-span-5 p-6 rounded-3xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50'}`}
        >
          <h3 className="text-lg font-bold mb-1">Course Completion</h3>
          <p className={`text-xs font-medium mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Progress breakdown by subject</p>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={courseCompletionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {courseCompletionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    backgroundColor: isDark ? '#1e293b' : '#fff',
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Assessment Scores Line Chart */}
      <motion.div 
        variants={itemVariants}
        className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50'}`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold">Assessment Performance</h3>
            <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Score progression over the last 5 tests</p>
          </div>
          <div className="flex items-center space-x-2 text-emerald-500 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-lg">
            <TrendingUp className="w-4 h-4" />
            <span>Upward Trend</span>
          </div>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={assessmentScoresData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#f1f5f9'} />
              <XAxis 
                dataKey="test" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12, fontWeight: 600 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12, fontWeight: 600 }}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  backgroundColor: isDark ? '#1e293b' : '#fff',
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke={BRAND_COLOR} 
                strokeWidth={4}
                dot={{ r: 6, fill: BRAND_COLOR, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

const MetricCard = ({ title, value, change, icon, color, darkMode }: any) => (
  <div className={`p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-slate-200/30 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
    <div className="flex items-center justify-between mb-3">
      <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
        {icon}
      </div>
      <div className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
        {change}
      </div>
    </div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
    <h4 className={`text-2xl font-bold mt-0.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{value}</h4>
  </div>
);
