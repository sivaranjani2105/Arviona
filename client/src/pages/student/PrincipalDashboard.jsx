import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  LayoutDashboard, Users, UserX, Award, BarChart3, TrendingUp, Sparkles, 
  LogOut, Shield, CheckCircle2, ChevronRight, Activity, Zap, BrainCircuit
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  CartesianGrid, BarChart, Bar, Cell 
} from 'recharts';

const PrincipalDashboard = () => {
  const { logout, user } = useAuth();
  const { principalTelemetry, fetchPrincipalTelemetry } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchPrincipalTelemetry();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!principalTelemetry) {
    return (
      <div className="min-h-screen bg-[#060813] text-white flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold tracking-wider text-slate-400">LOADING PRINCIPAL TELEMETRY...</p>
        </div>
      </div>
    );
  }

  const { engagementIndex, riskPrediction, houseRankings, teacherPerformance, growthTrends, aiDigitalTwin } = principalTelemetry;

  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'at-risk', label: 'Student Warning Loop', icon: <UserX size={18} /> },
    { id: 'teachers', label: 'Teacher Insights', icon: <Users size={18} /> },
    { id: 'houses', label: 'House Standing', icon: <Award size={18} /> }
  ];

  return (
    <div className="min-h-screen bg-[#070919] text-[#F3F4F6] font-sans flex overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#0B0D23] border-r border-[#1E293B] flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Header */}
          <div className="px-6 py-8 border-b border-[#1E293B] flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-500 to-violet-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20">
              <Shield size={22} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-wider font-poppins text-white uppercase">ARVIONA</span>
              <span className="text-[9px] tracking-widest text-[#818CF8] font-bold uppercase">Principal Hub</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    active 
                      ? 'bg-gradient-to-r from-indigo-600/25 to-violet-600/10 border border-indigo-500/30 text-white shadow-md' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <span className={active ? 'text-indigo-400' : 'text-slate-400'}>{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile Card / Log Out */}
        <div className="p-4 border-t border-[#1E293B] space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center font-bold text-white shadow-md">
              PS
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-white truncate">{user?.name || 'Principal Skinner'}</span>
              <span className="text-[10px] text-slate-400 truncate">School Administrator</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-500/50 text-rose-300 font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
          >
            <LogOut size={14} /> LOGOUT
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 space-y-8">
        
        {/* Top Header */}
        <header className="flex justify-between items-center pb-6 border-b border-[#1E293B]">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight font-poppins">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              High-level administrative engagement loop metrics & AI predictions.
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-[#0B0D23] border border-[#1E293B] px-4 py-2 rounded-xl flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">Sync Live</span>
            </div>
          </div>
        </header>

        {/* Tab Switcher Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            
            {/* TAB 1: OVERVIEW DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                
                {/* Metrics Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Overall Engagement Score */}
                  <div className="bg-[#0B0D23] border border-[#1E293B] p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute right-[-10px] top-[-10px] opacity-[0.03] text-indigo-400"><Activity size={100} /></div>
                    <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Engagement Index</span>
                    <div className="mt-4 flex items-baseline gap-2">
                      <strong className="text-4xl font-extrabold text-white">{Math.round(engagementIndex.engagementScoreIndex)}%</strong>
                      <span className="text-xs font-bold text-slate-400">Score</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Active student gamification index.</p>
                  </div>

                  {/* Average XP */}
                  <div className="bg-[#0B0D23] border border-[#1E293B] p-6 rounded-2xl flex flex-col justify-between">
                    <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">Average XP Level</span>
                    <div className="mt-4 flex items-baseline gap-2">
                      <strong className="text-4xl font-extrabold text-white">{Math.round(engagementIndex.averageXp)}</strong>
                      <span className="text-xs font-bold text-slate-400">pts</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Average XP points per student.</p>
                  </div>

                  {/* Active Streak average */}
                  <div className="bg-[#0B0D23] border border-[#1E293B] p-6 rounded-2xl flex flex-col justify-between">
                    <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Average Consistency Streak</span>
                    <div className="mt-4 flex items-baseline gap-2">
                      <strong className="text-4xl font-extrabold text-white">{engagementIndex.averageStreak.toFixed(1)}</strong>
                      <span className="text-xs font-bold text-slate-400">days</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Average active streak count.</p>
                  </div>

                  {/* At Risk Percentage */}
                  <div className={`border p-6 rounded-2xl flex flex-col justify-between ${
                    riskPrediction.atRiskPercentage > 30 
                      ? 'bg-rose-500/5 border-rose-500/20' 
                      : 'bg-[#0B0D23] border-[#1E293B]'
                  }`}>
                    <span className="text-xs font-extrabold text-rose-400 uppercase tracking-wider">At-Risk Ratio</span>
                    <div className="mt-4 flex items-baseline gap-2">
                      <strong className="text-4xl font-extrabold text-white">{riskPrediction.atRiskPercentage.toFixed(1)}%</strong>
                      <span className="text-xs font-bold text-slate-400">Ratio</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Students flagged for review.</p>
                  </div>
                </div>

                {/* AI Digital Twin Prediction panel & Growth Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Digital Twin */}
                  <div className="lg:col-span-1 bg-gradient-to-br from-[#121633] to-[#0A0D23] border border-[#2A2B5E] p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[350px]">
                    <div className="absolute top-0 right-0 p-6 text-[#A78BFA]/10"><BrainCircuit size={130} /></div>
                    
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-2 bg-[#818CF8]/10 border border-[#818CF8]/30 px-3 py-1 rounded-full">
                        <Sparkles size={14} className="text-[#A78BFA] animate-pulse" />
                        <span className="text-[10px] tracking-wider font-extrabold text-[#A78BFA] uppercase">AI Digital Twin Forecast</span>
                      </div>
                      <h3 className="text-xl font-extrabold text-white font-poppins">Predictive Performance</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Arviona's Digital Twin model forecasts average school exam outcomes based on gamification behaviour patterns.
                      </p>
                    </div>

                    <div className="my-6 bg-black/30 border border-white/5 rounded-2xl p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400">Forecasted Exam Avg</span>
                        <strong className="text-2xl font-extrabold text-[#A78BFA]">{aiDigitalTwin.predictedAverageExamScore}%</strong>
                      </div>
                      <div className="flex justify-between items-center border-t border-white/5 pt-2">
                        <span className="text-xs font-bold text-slate-400">Model Confidence</span>
                        <strong className="text-sm font-extrabold text-emerald-400">{aiDigitalTwin.confidenceIntervalPercent}%</strong>
                      </div>
                    </div>

                    <div className="text-xs bg-[#818CF8]/5 border border-[#818CF8]/25 p-3.5 rounded-xl text-[#C7D2FE] font-medium leading-relaxed">
                      💡 <strong>Actionable Recommendation:</strong> {aiDigitalTwin.impactOfEngagementHours}
                    </div>
                  </div>

                  {/* Growth Chart */}
                  <div className="lg:col-span-2 bg-[#0B0D23] border border-[#1E293B] p-6 rounded-3xl flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-extrabold text-white font-poppins">Weekly XP Generation</h3>
                      <p className="text-xs text-slate-400 mt-1">Growth chart showing XP points accumulated school-wide.</p>
                    </div>
                    
                    <div className="h-64 mt-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={growthTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                          <XAxis dataKey="week" stroke="#64748B" fontSize={11} fontWeight="bold" />
                          <YAxis stroke="#64748B" fontSize={11} fontWeight="bold" />
                          <Tooltip contentStyle={{ backgroundColor: '#0B0D23', borderColor: '#1E293B', color: '#FFF' }} />
                          <Area type="monotone" dataKey="xpGenerated" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorXp)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: AT RISK WARNINGS */}
            {activeTab === 'at-risk' && (
              <div className="space-y-6">
                <div className="bg-[#0B0D23] border border-[#1E293B] p-6 rounded-3xl">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-extrabold text-white font-poppins">At-Risk Student warning loop</h3>
                      <p className="text-xs text-slate-400 mt-1">Flagged students matching indicators of low engagement or academic struggle.</p>
                    </div>
                    <span className="bg-rose-500/10 border border-rose-500/20 px-3.5 py-1.5 rounded-xl text-xs font-bold text-rose-300">
                      {riskPrediction.atRiskCount} Students Flagged
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-[#1E293B] text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                          <th className="py-4 px-4">Student Name</th>
                          <th className="py-4 px-4">Risk Level</th>
                          <th className="py-4 px-4">Trigger Indicators</th>
                          <th className="py-4 px-4">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {riskPrediction.studentsList.map((stud) => (
                          <tr key={stud.studentId} className="border-b border-[#1E293B]/50 hover:bg-white/5 transition-colors font-medium">
                            <td className="py-4 px-4 text-white font-bold">{stud.studentName}</td>
                            <td className="py-4 px-4">
                              <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold tracking-wider ${
                                stud.riskLevel === 'HIGH' 
                                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}>
                                {stud.riskLevel} RISK
                              </span>
                            </td>
                            <td className="py-4 px-4 text-slate-300">
                              <div className="flex flex-col gap-1">
                                {stud.reasons.map((r, idx) => (
                                  <span key={idx} className="text-xs flex items-center gap-1.5 text-slate-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span> {r}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <button className="flex items-center gap-1 text-xs font-extrabold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider">
                                Initiate Loop <ChevronRight size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: TEACHERS TABLE */}
            {activeTab === 'teachers' && (
              <div className="space-y-6">
                <div className="bg-[#0B0D23] border border-[#1E293B] p-6 rounded-3xl">
                  <div className="mb-6">
                    <h3 className="text-lg font-extrabold text-white font-poppins">Teacher performance metrics</h3>
                    <p className="text-xs text-slate-400 mt-1">Instructors evaluated on class collaboration rate and digital quests output.</p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-[#1E293B] text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                          <th className="py-4 px-4">Teacher Name</th>
                          <th className="py-4 px-4">Active Classes</th>
                          <th className="py-4 px-4">Class Performance Index</th>
                          <th className="py-4 px-4">Efficiency</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teacherPerformance.map((teach) => (
                          <tr key={teach.teacherId} className="border-b border-[#1E293B]/50 hover:bg-white/5 transition-colors font-medium">
                            <td className="py-4 px-4 text-white font-bold">{teach.teacherName}</td>
                            <td className="py-4 px-4 text-slate-300">{teach.classesCount} Classes</td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <span className="font-extrabold text-white">{teach.performanceIndex}%</span>
                                <div className="w-24 bg-[#1E293B] h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-[#6366F1] h-1.5 rounded-full" style={{ width: `${teach.performanceIndex}%` }}></div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                                <CheckCircle2 size={12} /> High Efficiency
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: HOUSES SCOREBOARD */}
            {activeTab === 'houses' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Houses leaderboard */}
                  <div className="bg-[#0B0D23] border border-[#1E293B] p-6 rounded-3xl">
                    <h3 className="text-lg font-extrabold text-white font-poppins mb-6">School House Rankings</h3>
                    
                    <div className="space-y-4">
                      {houseRankings.map((house, idx) => (
                        <div key={idx} className="flex justify-between items-center p-4 bg-black/25 border border-[#1E293B] rounded-2xl relative overflow-hidden group hover:border-[#6366F1]/30 transition-all">
                          <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: house.colorHex }}></div>
                          
                          <div className="flex items-center gap-4 pl-2">
                            <span className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-extrabold text-xs text-white">
                              #{idx + 1}
                            </span>
                            <div className="flex flex-col">
                              <strong className="text-sm text-white font-bold">{house.name} House</strong>
                            </div>
                          </div>

                          <strong className="text-lg font-extrabold text-white">{house.points} pts</strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* House Point Distribution Chart */}
                  <div className="bg-[#0B0D23] border border-[#1E293B] p-6 rounded-3xl flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-extrabold text-white font-poppins">Point Distribution</h3>
                      <p className="text-xs text-slate-400 mt-1">Comparison chart of total house score values.</p>
                    </div>

                    <div className="h-64 mt-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={houseRankings}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                          <XAxis dataKey="name" stroke="#64748B" fontSize={11} fontWeight="bold" />
                          <YAxis stroke="#64748B" fontSize={11} fontWeight="bold" />
                          <Tooltip contentStyle={{ backgroundColor: '#0B0D23', borderColor: '#1E293B', color: '#FFF' }} />
                          <Bar dataKey="points">
                            {houseRankings.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.colorHex || '#6366F1'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

      </main>
    </div>
  );
};

export default PrincipalDashboard;
