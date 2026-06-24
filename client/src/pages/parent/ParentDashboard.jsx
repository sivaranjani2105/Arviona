import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  LayoutDashboard, User, Calendar, TrendingUp, MessageSquare, 
  LogOut, Bell, BookOpen, Clock, AlertTriangle, FileText, Award,
  CheckCircle2, Sparkles, Flame, Shield, ArrowRight, Book, ClipboardCheck,
  Download
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  CartesianGrid, LineChart, Line, BarChart, Bar, Cell 
} from 'recharts';

const ParentDashboard = () => {
  const { user, login, logout } = useAuth();
  const { 
    students, 
    weeklyReports, 
    notifications, 
    markNotificationsAsRead,
    signWeeklyReport,
    writtenNotes,
    scheduleEvents,
    parentFeedbacks,
    addParentFeedback
  } = useData();

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const userName = user?.email?.split('@')[0] || 'Parent';

  const activeTab = searchParams.get('tab') || 'dashboard';

  // Lucas Miller is ID S1029 (associated student)
  const lucasProfile = students.find(s => s.id === 'S1029') || students[0];
  
  // Filter reports sent for Lucas
  const lucasReports = weeklyReports.filter(r => r.studentId === 'S1029' && r.sent);

  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [reportChartType, setReportChartType] = useState('gpa'); // 'gpa' or 'predicted'
  const [signatures, setSignatures] = useState({});
  const [feedbackText, setFeedbackText] = useState('');

  const navItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: 'child', icon: <User size={20} />, label: 'Student Details' },
    { id: 'teacher', icon: <MessageSquare size={20} />, label: 'Teacher Contact' },
    { id: 'attendance', icon: <Clock size={20} />, label: 'Attendance' },
    { id: 'progress', icon: <TrendingUp size={20} />, label: 'Academic Gaps' },
    { id: 'reports', icon: <FileText size={20} />, label: 'Weekly Reports' },
  ];

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  const handleBellClick = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
    if (!showNotificationDropdown) {
      markNotificationsAsRead('parent');
    }
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    addParentFeedback('S1029', 'Eleanor Miller', feedbackText);
    alert('Feedback submitted to Dr. Anderson successfully!');
    setFeedbackText('');
  };

  const parentNotifs = notifications.filter(n => n.recipient === 'parent');
  const unreadParentNotifs = parentNotifs.filter(n => !n.read).length;

  const renderContent = () => {
    if (activeTab === 'child') {
      return (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-3xl font-extrabold text-white shadow-md">
              LM
            </div>
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-2xl font-poppins font-bold text-slate-800">Lucas Miller</h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-3.5 text-xs font-semibold text-slate-400">
                <span className="bg-slate-50 border border-slate-150 px-2.5 py-1 rounded-xl">Grade 8</span>
                <span className="bg-slate-50 border border-slate-150 px-2.5 py-1 rounded-xl">Lincoln Middle School</span>
                <span className="bg-slate-50 border border-slate-150 px-2.5 py-1 rounded-xl">Homeroom: Room 302</span>
              </div>
            </div>
          </div>

          {/* Gamification Viewer */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-1.5"><Flame size={18} className="text-amber-500 fill-amber-500" /> Active Streaks</h3>
                <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl flex items-center gap-4">
                  <span className="text-4xl animate-pulse">🔥</span>
                  <div>
                    <h4 className="font-bold text-slate-800">{lucasProfile.streak} Days Streak</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Lucas is in the top 15% of active students this week.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-1.5"><Award size={18} className="text-indigo-500" /> Badges Earned</h3>
              <div className="flex flex-wrap gap-2.5">
                {lucasProfile.badges.map((badge, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-150 px-3 py-2 rounded-xl flex items-center gap-2 text-xs hover:scale-105 hover:bg-slate-100 transition-all cursor-default shadow-sm">
                    <span className="text-lg">{badge.icon}</span>
                    <div className="flex flex-col">
                      <strong className="text-slate-700 font-semibold">{badge.name}</strong>
                      <span className="text-[9px] text-slate-400">{badge.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gamification Level and XP Progress */}
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-6 rounded-3xl text-white border border-slate-800 shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-2xl font-extrabold text-indigo-300">
                  Lvl {Math.floor(lucasProfile.xp / 500) + 1}
                </div>
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">Gamification Progress</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{lucasProfile.xp} XP Accumulated</p>
                </div>
              </div>
              <div className="text-xs text-indigo-300 font-semibold bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl">
                {500 - (lucasProfile.xp % 500)} XP to next level
              </div>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden border border-slate-700">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${(lucasProfile.xp % 500) / 500 * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
              />
            </div>
          </div>

          {/* Teacher Notes & Resources */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5"><FileText size={18} className="text-primary" /> Teacher Notes & Evaluation Logs</h3>
            <div className="space-y-4 divide-y divide-slate-100">
              {writtenNotes && writtenNotes.filter(n => n.studentId === lucasProfile.id).length > 0 ? (
                writtenNotes.filter(n => n.studentId === lucasProfile.id).map((note, index) => (
                  <div key={note.id} className={`pt-4 ${index === 0 ? 'pt-0' : ''} space-y-2`}>
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-xs text-slate-800">{note.title}</h4>
                      <span className="text-[10px] text-slate-400">{note.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">{note.content}</p>
                    {note.fileName && (
                      <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] text-slate-500 font-semibold w-fit gap-4 mt-2">
                        <span className="truncate max-w-[150px]">{note.fileName}</span>
                        <button 
                          onClick={() => alert(`Downloading file: ${note.fileName}`)}
                          className="p-1 bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded transition-colors border border-slate-200"
                        >
                          <Download size={10} />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No notes uploaded by the teacher yet.</p>
              )}
            </div>
          </div>

          {/* Upcoming Live Sessions */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5"><Calendar size={18} className="text-amber-500" /> Upcoming Scheduled Live Sessions</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {scheduleEvents && scheduleEvents.length > 0 ? (
                scheduleEvents.map((evt) => (
                  <div key={evt.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-xs text-slate-800">{evt.title}</h4>
                        <span className="text-[9px] font-bold text-primary bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 uppercase tracking-wide shrink-0">
                          {evt.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal mt-2">{evt.desc}</p>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold pt-4 border-t border-slate-100/50 mt-2">
                      <span>📅 Date: {evt.date}</span>
                      <span>⏰ Time: {evt.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No live sessions scheduled yet.</p>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'teacher') {
      const lucasFeedbacks = parentFeedbacks.filter(fb => fb.studentId === 'S1029');

      return (
        <div className="space-y-6">
          {/* Teacher Info Card & Feedback */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Dr. Anderson's Premium Bio Profile Card */}
            <div className="md:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="text-center pb-6 border-b border-slate-100">
                  <div className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-100 mx-auto flex items-center justify-center text-2xl font-extrabold text-primary shadow-sm mb-4">
                    DA
                  </div>
                  <h3 className="font-poppins font-bold text-slate-800 text-lg">Dr. Marcus Anderson</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Science & Calculus Lead</p>
                </div>
                
                <div className="space-y-4 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">About Instructor</h4>
                    <p className="text-slate-650 leading-relaxed font-sans">
                      Dr. Anderson holds a Ph.D. in Physics from Stanford. He has 15+ years of experience helping students bridge cognitive learning gaps.
                    </p>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center py-1 border-b border-slate-50">
                      <span className="text-slate-400 font-semibold">Email:</span>
                      <a href="mailto:dr.anderson@arivo.com" className="text-primary hover:underline font-bold">dr.anderson@arivo.com</a>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-50">
                      <span className="text-slate-400 font-semibold">Office:</span>
                      <span className="text-slate-800 font-bold">Lincoln Hall, Rm 405</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-50">
                      <span className="text-slate-400 font-semibold">Availability:</span>
                      <span className="text-slate-800 font-bold">Mon/Wed/Fri (2:30-4 PM)</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400 font-semibold">Response Time:</span>
                      <span className="text-emerald-600 font-bold">Within 24 hours</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-6">
                <a 
                  href="mailto:dr.anderson@arivo.com?subject=Inquiry regarding Lucas Miller"
                  className="w-full text-center block text-xs text-white font-bold bg-primary hover:bg-primary/95 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-100"
                >
                  Send Direct Email
                </a>
              </div>
            </div>

            {/* Interactive Feedback Form & Logs */}
            <div className="md:col-span-2 space-y-6">
              {/* Feedback Form */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                <div>
                  <h3 className="font-bold text-slate-800 flex items-center gap-1.5"><MessageSquare size={18} className="text-primary" /> Send Feedback or Inquiry</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Submit your observations or questions. Dr. Anderson will be notified immediately.</p>
                </div>

                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Message</label>
                    <textarea 
                      rows="4"
                      placeholder="Type your message to the teacher here... e.g., 'Lucas found the limits exercises very helpful, thank you!'"
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-medium text-slate-700 outline-none focus:border-primary resize-none placeholder-slate-400"
                      maxLength="500"
                    />
                    <div className="flex justify-between items-center text-[10px] text-slate-400 px-1">
                      <span>Character Limit: 500 max</span>
                      <span>{feedbackText.length}/500</span>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={!feedbackText.trim()}
                    className="bg-primary hover:bg-primary/95 text-white px-6 py-2.5 rounded-xl text-xs font-bold disabled:opacity-50 transition-all shadow-md shadow-indigo-100 flex items-center gap-1.5 ml-auto"
                  >
                    Submit Feedback <ArrowRight size={14} />
                  </button>
                </form>
              </div>

              {/* Feedback History Log */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                <h3 className="font-bold text-slate-800 text-sm">Feedback History Log</h3>
                <div className="space-y-4 divide-y divide-slate-100">
                  {lucasFeedbacks.length > 0 ? (
                    lucasFeedbacks.map((fb, index) => (
                      <div key={fb.id} className={`pt-4 ${index === 0 ? 'pt-0' : ''} space-y-2`}>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-lg">
                             Eleanor Miller
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">{fb.date}</span>
                        </div>
                        <p className="text-xs text-slate-650 leading-relaxed font-sans">{fb.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No feedback submitted yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'attendance') {
      return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-poppins font-bold text-slate-800">Attendance Analytics</h2>
              <p className="text-xs text-slate-500 mt-0.5">Lucas's presence percentage is updated daily.</p>
            </div>
            <Clock className="text-emerald-500" size={24} />
          </div>

          <div className="grid sm:grid-cols-2 gap-8 items-center border-t border-slate-100 pt-6">
            <div className="text-center space-y-2">
              <div className="text-6xl font-extrabold text-slate-900">{lucasProfile.attendance}%</div>
              <p className="text-xs font-semibold text-emerald-600">Excellent Standing (+2% this month)</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Total days attended:</span>
                  <span className="text-slate-800">44 days</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '98%' }}></div>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Excused absences:</span>
                  <span className="text-slate-800">1 day</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'progress') {
      const masteryData = lucasProfile.knowledgeGaps.map(g => ({
        topic: g.topic,
        score: g.score,
        gap: g.gap
      }));

      return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div>
            <h2 className="text-xl font-poppins font-bold text-slate-800">Knowledge Gaps & Predicted Trajectory</h2>
            <p className="text-xs text-slate-500 mt-0.5">Real-time prediction calculations mapping subject-level understanding gaps.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 border-t border-slate-100 pt-6">
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 text-sm">Target Gaps & Learning Status</h3>
              <div className="space-y-3">
                {lucasProfile.knowledgeGaps.map((item, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                    <div className="flex justify-between font-bold mb-1.5">
                      <span className="text-slate-700">{item.topic}</span>
                      <span className="text-indigo-600">{item.score}% Mastery</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mb-2">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: `${item.score}%` }}></div>
                    </div>
                    {item.gap > 10 ? (
                      <div className="space-y-1.5 mt-2">
                        <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-1">
                          ⚠️ Gap Detected: {item.gap}% deficiency. Recommended actions:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.recommendations?.map((rec, rIdx) => (
                            <span key={rIdx} className="bg-white border border-slate-200 text-slate-650 px-2 py-0.5 rounded text-[9px] shadow-sm flex items-center gap-1 font-medium">
                              <Sparkles size={9} className="text-indigo-500" /> {rec}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
                        ✓ Proficient. All learning targets achieved for this unit.
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {/* ML Trajectory Card */}
              <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-primary/10 text-primary px-3 py-1 rounded-full inline-block mb-3">
                    ML Trajectory Predictor
                  </span>
                  <h4 className="font-bold text-slate-800 text-sm">Predicted Midterm GPA</h4>
                  <div className="flex items-baseline gap-2 mt-2">
                    <strong className="text-4xl text-slate-850 font-extrabold">{lucasProfile.predictedScore}%</strong>
                    <span className="text-xs font-semibold text-slate-400">Class Rank: {lucasProfile.rank}</span>
                  </div>
                  <p className="text-xs text-slate-650 mt-3 leading-relaxed">
                    Based on Lucas's attendance index of {lucasProfile.attendance}%, combined with quiz completions, our models predict an upcoming Midterm grade of <strong>{lucasProfile.predictedScore}%</strong>.
                  </p>
                </div>

                <div className="mt-4 border-t border-slate-200/50 pt-3 flex gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full mt-1 ${lucasProfile.predictedScore >= 70 ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Lucas is in <strong>{lucasProfile.predictedScore >= 70 ? 'Good Standing' : 'At Risk - Intervention Recommended'}</strong>.
                  </p>
                </div>
              </div>

              {/* Subject Mastery Distribution Chart */}
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <h4 className="font-bold text-slate-800 text-xs mb-3">Subject Mastery Distribution</h4>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={masteryData} layout="vertical" margin={{ left: -10, right: 10, top: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} stroke="#cbd5e1" fontSize={9} />
                      <YAxis dataKey="topic" type="category" stroke="#cbd5e1" fontSize={9} width={90} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '10px' }}
                        formatter={(value) => [`${value}%`, 'Mastery']}
                      />
                      <Bar dataKey="score" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={10}>
                        {masteryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.score >= 80 ? '#10b981' : entry.score >= 65 ? '#6366f1' : '#f59e0b'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'reports') {
      const chartData = [...lucasReports]
        .sort((a, b) => new Date(a.compiledAt) - new Date(b.compiledAt))
        .map((r, idx) => ({
          name: `Week ${idx + 1}`,
          gpa: r.gpa,
          predicted: r.predictedScore,
          attendance: r.attendance,
          date: new Date(r.compiledAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        }));

      const sortedReports = [...lucasReports].sort((a, b) => new Date(b.compiledAt) - new Date(a.compiledAt));

      return (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-poppins font-bold text-slate-800">Weekly Progress Summaries</h2>
              <p className="text-xs text-slate-500 mt-0.5">Review verified academic summaries compiled and sent by Lucas's teacher.</p>
            </div>
          </div>

          {chartData.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Academic Performance Trends</h3>
                  <p className="text-[11px] text-slate-500">Historical trajectory over weekly reports</p>
                </div>
                <div className="flex gap-1.5 bg-slate-150 p-1 rounded-xl">
                  <button 
                    onClick={() => setReportChartType('gpa')}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${reportChartType === 'gpa' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Weekly GPA
                  </button>
                  <button 
                    onClick={() => setReportChartType('predicted')}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${reportChartType === 'predicted' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Midterm Forecast
                  </button>
                </div>
              </div>

              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={reportChartType === 'gpa' ? '#3b82f6' : '#6366f1'} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={reportChartType === 'gpa' ? '#3b82f6' : '#6366f1'} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis 
                      domain={reportChartType === 'gpa' ? [2.5, 4.0] : [60, 100]} 
                      stroke="#94a3b8" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey={reportChartType} 
                      stroke={reportChartType === 'gpa' ? '#3b82f6' : '#6366f1'} 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {sortedReports.length > 0 ? (
              sortedReports.map((report) => (
                <div key={report.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 overflow-hidden">
                  {/* Report Header */}
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4 bg-gradient-to-r from-primary/5 to-transparent p-4 rounded-t-2xl -mx-6 -mt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-primary/10 text-primary rounded-xl"><ClipboardCheck size={22} /></div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm">Official Weekly Report</h3>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Lincoln Middle School • Academic Summary</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-400">{new Date(report.compiledAt).toLocaleDateString()}</span>
                  </div>

                  {/* Summary grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-50 border border-slate-150 p-3 rounded-2xl text-center">
                      <span className="text-[10px] text-slate-400 block mb-1">Attendance</span>
                      <strong className="text-base text-slate-800 font-bold">{report.attendance}%</strong>
                    </div>
                    <div className="bg-slate-50 border border-slate-150 p-3 rounded-2xl text-center">
                      <span className="text-[10px] text-slate-400 block mb-1">Weekly GPA</span>
                      <strong className="text-base text-slate-800 font-bold">{report.gpa}</strong>
                    </div>
                    <div className="bg-slate-50 border border-slate-150 p-3 rounded-2xl text-center">
                      <span className="text-[10px] text-slate-400 block mb-1">Predicted Midterm</span>
                      <strong className="text-base text-primary font-bold">{report.predictedScore}%</strong>
                    </div>
                  </div>

                  {/* notes */}
                  <div className="space-y-2 p-4 bg-indigo-50/20 border border-indigo-100 rounded-2xl">
                    <h4 className="font-bold text-xs text-indigo-900">Teacher evaluations:</h4>
                    <p className="text-xs text-slate-700 leading-relaxed italic">"{report.notes}"</p>
                  </div>

                  {/* Gaps / Strengths summary */}
                  <div className="grid sm:grid-cols-2 gap-4 text-xs font-medium">
                    <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                      <span className="text-emerald-700 font-bold block mb-1.5">Key Strengths</span>
                      {report.strengths.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {report.strengths.map((str, sIdx) => (
                            <span key={sIdx} className="bg-white border border-emerald-200 px-2 py-0.5 rounded text-[10px]">{str}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[10px]">No major strengths compiled</span>
                      )}
                    </div>

                    <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl">
                      <span className="text-rose-700 font-bold block mb-1.5">Action Areas (Gaps)</span>
                      {report.gaps.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {report.gaps.map((gap, gIdx) => (
                            <span key={gIdx} className="bg-white border border-rose-200 px-2 py-0.5 rounded text-[10px]">{gap.topic} ({gap.score}% mastery)</span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[10px]">All subjects in good standing</span>
                      )}
                    </div>
                  </div>

                  {/* Feedback Signature flow */}
                  {report.signed ? (
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50/50 border border-emerald-100 px-4 py-2.5 rounded-2xl text-xs font-bold">
                        <CheckCircle2 size={16} />
                        Signed & Acknowledged by {report.signature}
                      </div>
                      {report.signedAt && (
                        <span className="text-[10px] text-slate-400 font-semibold">
                          Approved on {new Date(report.signedAt).toLocaleDateString()} at {new Date(report.signedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 bg-slate-50/50 -mx-6 -mb-6 p-6 rounded-b-3xl">
                      <div className="text-xs">
                        <h4 className="font-bold text-slate-800">Acknowledge Weekly Report</h4>
                        <p className="text-slate-500 mt-0.5">Please review the comments above and sign to verify receipt.</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <input 
                          type="text" 
                          placeholder="Type parent name (e.g. Eleanor Miller)" 
                          value={signatures[report.id] || ''}
                          onChange={(e) => setSignatures(prev => ({ ...prev, [report.id]: e.target.value }))}
                          className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs w-full sm:w-56 outline-none focus:border-primary font-semibold text-slate-700"
                        />
                        <button 
                          onClick={() => {
                            const sig = signatures[report.id];
                            if (sig && sig.trim()) {
                              signWeeklyReport(report.id, sig.trim());
                            }
                          }}
                          disabled={!signatures[report.id]?.trim()}
                          className="bg-primary hover:bg-primary/95 text-white px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-50 transition-all whitespace-nowrap"
                        >
                          Sign Report
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center text-slate-400 text-xs">
                No weekly summaries have been sent by the teacher yet. You can compile one from the Teacher Dashboard to populate this.
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Child Profile summary */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center text-3xl font-bold backdrop-blur-sm shadow-inner">
                LM
              </div>
              <div>
                <h2 className="text-2xl font-poppins font-bold mb-1">Lucas Miller</h2>
                <div className="flex flex-wrap gap-4 text-indigo-100 text-xs font-semibold">
                  <span>Grade 8</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/50 my-auto"></span>
                  <span>Lincoln Middle School</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/50 my-auto"></span>
                  <span>GPA: {lucasProfile.gpa}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => handleTabChange('child')}
              className="absolute bottom-6 right-6 bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-xl text-xs font-bold backdrop-blur-sm border border-white/10"
            >
              View Profile
            </button>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {/* Attendance card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-800 text-sm">Attendance Record</h3>
                  <Clock className="text-emerald-500" size={20} />
                </div>
                <div className="flex items-end gap-3 mb-3">
                  <div className="text-4xl font-extrabold text-slate-900">{lucasProfile.attendance}%</div>
                  <div className="text-xs text-emerald-600 font-semibold mb-1">Excellent standing</div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${lucasProfile.attendance}%` }}></div>
                </div>
              </div>
              <button onClick={() => handleTabChange('attendance')} className="w-full mt-6 text-xs text-slate-500 font-bold border border-slate-200 hover:bg-slate-50 py-2.5 rounded-xl transition-all">
                Review Details
              </button>
            </motion.div>

            {/* GPA card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-800 text-sm">Grades & Gaps</h3>
                  <TrendingUp className="text-blue-500" size={20} />
                </div>
                <div className="space-y-2 text-xs font-semibold">
                  {lucasProfile.knowledgeGaps.slice(0, 3).map((gap, gIdx) => (
                    <div key={gIdx} className="flex justify-between items-center p-2 rounded-xl hover:bg-slate-50/50">
                      <span className="text-slate-600">{gap.topic}</span>
                      <span className={`font-bold ${gap.score >= 80 ? 'text-emerald-600' : 'text-amber-500'}`}>{gap.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => handleTabChange('progress')} className="w-full mt-4 text-xs text-primary font-bold bg-primary/5 hover:bg-primary/10 py-2.5 rounded-xl transition-all">
                View Gap Mappings
              </button>
            </motion.div>

            {/* Gamification Hub card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800 text-sm">Gamification</h3>
                  <Award className="text-indigo-500" size={20} />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500 flex items-center gap-1"><Flame size={14} className="text-amber-500 fill-amber-500" /> Streak:</span>
                    <strong className="text-slate-800">{lucasProfile.streak} Days</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500">Level:</span>
                    <strong className="text-slate-800">Lvl {Math.floor(lucasProfile.xp / 500) + 1}</strong>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-bold text-slate-450">
                      <span>{lucasProfile.xp} XP</span>
                      <span>Next Level: {500 - (lucasProfile.xp % 500)} XP</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-500 to-primary h-1.5 rounded-full" style={{ width: `${(lucasProfile.xp % 500) / 500 * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <button onClick={() => handleTabChange('child')} className="w-full mt-4 text-xs text-indigo-600 font-bold bg-indigo-50 hover:bg-indigo-100 py-2.5 rounded-xl transition-all">
                View Badges & Streak Details
              </button>
            </motion.div>
          </div>
        </div>

        {/* Side Panel: Notifications feed */}
        <div className="space-y-6">
          
          {/* Latest report preview */}
          {lucasReports.length > 0 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-3xl border border-indigo-100">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={18} className="text-primary" />
                <h4 className="font-bold text-indigo-950 text-sm">Weekly progress card</h4>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed mb-4">
                Lucas's teacher sent a progress report evaluate card. Math gaps are shrinking.
              </p>
              <button onClick={() => handleTabChange('reports')} className="text-xs text-primary font-extrabold flex items-center gap-1 hover:underline">
                Read evaluation summary <ArrowRight size={14} />
              </button>
            </motion.div>
          )}

          {/* Alert Feed */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">Smart Alerts & Logs</h3>
            <div className="space-y-4">
              {parentNotifs.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex gap-3 text-xs leading-snug border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                    item.type === 'success' ? 'bg-emerald-500' :
                    item.type === 'warning' ? 'bg-amber-500' : 'bg-indigo-500'
                  }`}></div>
                  <div>
                    <p className="font-semibold text-slate-700">{item.text}</p>
                    <span className="text-[10px] text-slate-400 block mt-1">{item.time}</span>
                  </div>
                </div>
              ))}
              {parentNotifs.length === 0 && (
                <div className="text-center text-xs text-slate-400 py-6">No warnings or logs recorded.</div>
              )}
            </div>
          </motion.div>
        </div>

      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-background relative select-none">
      
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#1E1B4B] text-white h-screen sticky top-0 shrink-0">
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-primary p-1.5 rounded-lg">
              <BookOpen size={20} className="text-white" />
            </div>
            <span className="font-poppins font-bold text-lg tracking-tight">SmartLearn Portal</span>
          </div>
          
          <nav className="space-y-2 flex-1">
            {navItems.map((item) => (
              <button 
                key={item.id} 
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <button 
            onClick={() => navigate('/arivo')}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl border border-indigo-500/30 transition-all shadow-md mb-4"
          >
            🚀 Switch to Arivo Platform
          </button>

          {/* Dev Shortcut */}
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 mb-4 text-center">
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider mb-2">Simulate Other Views</span>
            <div className="grid grid-cols-2 gap-1.5">
              <button 
                onClick={() => {
                  login('student', 'student@arivo.com');
                  navigate('/student/dashboard');
                }} 
                className="text-[11px] py-1 bg-primary/20 hover:bg-primary/40 rounded-lg font-medium text-indigo-200 border border-primary/30"
              >
                Student
              </button>
              <button 
                onClick={() => {
                  login('teacher', 'teacher@arivo.com');
                  navigate('/teacher/dashboard');
                }} 
                className="text-[11px] py-1 bg-emerald-500/20 hover:bg-emerald-500/40 rounded-lg font-medium text-emerald-200 border border-emerald-500/30"
              >
                Teacher
              </button>
            </div>
          </div>
          
          <div className="mt-auto">
            <button 
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content frame */}
      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-poppins font-bold text-slate-900 capitalize">
              {activeTab === 'dashboard' ? `Hello, Parent ${userName}!` : navItems.find(t=>t.id===activeTab)?.label}
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Review and audit your child's weekly academic logs and reports.
            </p>
          </div>
          
          <div className="flex items-center gap-4 relative">
            <button 
              onClick={handleBellClick}
              className="p-2.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-primary transition-colors relative"
            >
              <Bell size={20} />
              {unreadParentNotifs > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotificationDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-12 top-14 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-40 overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <span className="font-bold text-sm text-slate-800">Notifications</span>
                    <span className="text-xs text-primary font-semibold">{unreadParentNotifs} New</span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                    {parentNotifs.length > 0 ? (
                      parentNotifs.map((notif) => (
                        <div key={notif.id} className="p-3.5 hover:bg-slate-50/50 transition-colors flex gap-2.5">
                          <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            notif.type === 'success' ? 'bg-emerald-500' :
                            notif.type === 'warning' ? 'bg-rose-500' : 'bg-blue-500'
                          }`}></span>
                          <div>
                            <p className="text-xs text-slate-700 leading-snug">{notif.text}</p>
                            <span className="text-[10px] text-slate-400 block mt-1">{notif.time}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-xs text-slate-400">No notifications</div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold shadow-md">
              {userName.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ParentDashboard;
