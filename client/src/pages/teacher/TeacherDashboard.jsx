import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  LayoutDashboard, Users, BookOpen, FileText, BarChart2, User, 
  LogOut, Search, Bell, Plus, CheckCircle2, X, Edit, Trash2, 
  Send, AlertTriangle, ChevronRight, Sparkles, MessageSquare, ClipboardList,
  ArrowLeft, Calendar, Download, Clock, Sword, Target, Zap
} from 'lucide-react';

const TeacherDashboard = () => {
  const { user, login, logout } = useAuth();
  const { 
    students, 
    assignments, 
    weeklyReports,
    courses,
    writtenNotes,
    scheduleEvents,
    parentFeedbacks,
    notifications,
    addAssignment, 
    generateWeeklyReport, 
    sendReportToParent, 
    sendNotification,
    submitAssignment,
    suggestStudyTask,
    addCourseModule,
    updateCourseModule,
    deleteCourseModule,
    addWrittenNote,
    deleteWrittenNote,
    addScheduleEvent,
    deleteScheduleEvent,
    markNotificationsAsRead
  } = useData();

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const userName = user?.email?.split('@')[0] || 'Teacher';
  
  const activeTab = searchParams.get('tab') || 'dashboard';

  // State

  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Create Assignment State
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Mathematics');
  const [newType, setNewType] = useState('Homework');
  const [newDifficulty, setNewDifficulty] = useState('Medium');

  // Weekly Report Form State
  const [activeReportStudent, setActiveReportStudent] = useState(null); // student object
  const [teacherNotes, setTeacherNotes] = useState('');

  // Selected Student for Heatmap view
  const [selectedStudentForHeatmap, setSelectedStudentForHeatmap] = useState(students[0]);

  // Selected Course / Module for interactive Lesson Planner
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);

  // Module Modal states
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [moduleModalType, setModuleModalType] = useState('create'); // 'create' or 'edit'
  const [editingModuleId, setEditingModuleId] = useState(null);
  const [moduleFormTitle, setModuleFormTitle] = useState('');
  const [moduleFormTopics, setModuleFormTopics] = useState('');
  const [moduleFormDifficulty, setModuleFormDifficulty] = useState('Medium');

  // Suggest Intervention Modal states
  const [showInterventionModal, setShowInterventionModal] = useState(false);
  const [interventionStudent, setInterventionStudent] = useState(null);
  const [interventionTopic, setInterventionTopic] = useState('');
  const [interventionDuration, setInterventionDuration] = useState('30 mins');
  const [interventionDescription, setInterventionDescription] = useState('');

  // Notification dropdown state
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  // Written Notes Form states
  const [noteStudentId, setNoteStudentId] = useState(students[0]?.id || '');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteFileName, setNoteFileName] = useState('');

  // Class Schedule Form states
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventType, setEventType] = useState('Live Class');
  const [eventDesc, setEventDesc] = useState('');

  // ── Boss Battle Creator State ────────────────────────────────────────────
  const [bbTitle, setBbTitle] = useState('');
  const [bbSubject, setBbSubject] = useState('Mathematics');
  const [bbDifficulty, setBbDifficulty] = useState('MEDIUM');
  const [bbTimeLimit, setBbTimeLimit] = useState(30);
  const [bbQuestions, setBbQuestions] = useState(5);
  const [bbXpReward, setBbXpReward] = useState(300);
  const [bbCreated, setBbCreated] = useState([]);
  const [bbSubmitting, setBbSubmitting] = useState(false);

  const handleOpenCreateModule = () => {
    setModuleFormTitle('');
    setModuleFormTopics('');
    setModuleFormDifficulty('Medium');
    setModuleModalType('create');
    setShowModuleModal(true);
  };

  const handleOpenEditModule = (mod) => {
    setEditingModuleId(mod.id);
    setModuleFormTitle(mod.title);
    setModuleFormTopics(mod.topics);
    setModuleFormDifficulty(mod.difficulty);
    setModuleModalType('edit');
    setShowModuleModal(true);
  };

  const handleSaveModule = (e) => {
    e.preventDefault();
    if (!moduleFormTitle.trim()) return;

    if (moduleModalType === 'create') {
      addCourseModule(selectedCourseId, moduleFormTitle, moduleFormTopics, moduleFormDifficulty);
    } else {
      updateCourseModule(selectedCourseId, editingModuleId, {
        title: moduleFormTitle,
        topics: moduleFormTopics,
        difficulty: moduleFormDifficulty
      });
    }
    setShowModuleModal(false);
  };

  const handleDeleteModule = (modId) => {
    if (confirm('Are you sure you want to delete this module?')) {
      deleteCourseModule(selectedCourseId, modId);
      if (selectedModuleId === modId) {
        setSelectedModuleId(null);
      }
    }
  };

  // Intervention handlers
  const handleOpenIntervention = (studentObj, topic) => {
    setInterventionStudent(studentObj);
    setInterventionTopic(topic);
    setInterventionDuration('30 mins');
    setInterventionDescription(`Complete review questions and practice problems on ${topic}.`);
    setShowInterventionModal(true);
  };

  const handleSendIntervention = (e) => {
    e.preventDefault();
    if (!interventionStudent) return;

    suggestStudyTask(
      interventionStudent.email,
      interventionTopic,
      interventionDuration,
      interventionDescription
    );

    alert(`Suggested "${interventionTopic}" study intervention to ${interventionStudent.name}.`);
    setShowInterventionModal(false);
  };

  // Handle Tab Switch
  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
    setShowNotificationDropdown(false);
  };

  const handleBellClick = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
    if (!showNotificationDropdown) {
      markNotificationsAsRead('teacher');
    }
  };

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!noteStudentId || !noteTitle || !noteContent) return;
    addWrittenNote({ studentId: noteStudentId, title: noteTitle, content: noteContent, fileName: noteFileName || null });
    alert('Note saved successfully!');
    setNoteTitle('');
    setNoteContent('');
    setNoteFileName('');
  };

  const handleMockFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNoteFileName(file.name);
    }
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!eventTitle || !eventDate || !eventTime) return;
    addScheduleEvent({ title: eventTitle, date: eventDate, time: eventTime, type: eventType, desc: eventDesc });
    alert('Event scheduled successfully!');
    setEventTitle('');
    setEventDate('');
    setEventTime('');
    setEventDesc('');
  };

  // Grade student paper simulation
  const handleMarkGraded = (assignId, studentEmail) => {
    const randomScore = Math.floor(Math.random() * 20) + 80; // 80 - 100
    submitAssignment(assignId, studentEmail, randomScore);
  };

  // Create assignment handler
  const handleCreateAssignment = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addAssignment(newTitle, newSubject, newType, newDifficulty);
    setNewTitle('');
    setShowCreateModal(false);
  };

  // Compile Report Handler
  const triggerCompileReportModal = (studentObj) => {
    setActiveReportStudent(studentObj);
    const weakTopics = studentObj.knowledgeGaps.filter(g => g.score < 80).map(g => g.topic).join(', ');
    const strengths = studentObj.knowledgeGaps.filter(g => g.score >= 80).map(g => g.topic).join(', ');
    
    let defaultNotes = `${studentObj.name} has demonstrated excellent classroom behavior. `;
    if (strengths) defaultNotes += `Strong comprehension noted in ${strengths}. `;
    if (weakTopics) defaultNotes += `We recommend extra practice at home focusing on: ${weakTopics}.`;
    
    setTeacherNotes(defaultNotes);
  };

  const handleSaveAndSendReport = async (e) => {
    e.preventDefault();
    if (!activeReportStudent) return;
    const report = await generateWeeklyReport(activeReportStudent.id, teacherNotes);
    if (report && report.id) {
      await sendReportToParent(report.id);
    }
    setActiveReportStudent(null);
    setTeacherNotes('');
    alert(`Report generated and sent to parent for ${activeReportStudent.name}!`);
  };

  // Send ML Intervention alert
  const sendInterventionAlert = (studentObj) => {
    sendNotification('parent', `ML Trajectory alert: Teacher suggests intervention study plan for ${studentObj.name} in weak algebra topics.`, 'warning');
    sendNotification('student', `Teacher suggested you refresh your AI Study Planner to target low understanding modules.`, 'info');
    alert(`Sent parent alert & suggested study plan refresh for ${studentObj.name}`);
  };



  const getHeatmapColor = (minutes) => {
    if (!minutes) return 'bg-slate-100';
    if (minutes < 15) return 'bg-indigo-200';
    if (minutes < 30) return 'bg-indigo-400';
    if (minutes < 45) return 'bg-indigo-600';
    return 'bg-indigo-900';
  };

  const renderContent = () => {
    if (activeTab === 'classes') {
      const selectedCourse = courses.find(c => c.id === selectedCourseId);
      const selectedModule = selectedCourse?.modules.find(m => m.id === selectedModuleId);

      // Helper to find lagging students
      const getLaggingStudents = (moduleTitle) => {
        return students.filter(student => {
          return student.knowledgeGaps.some(gap => 
            (gap.topic.toLowerCase().includes(moduleTitle.toLowerCase()) || 
             moduleTitle.toLowerCase().includes(gap.topic.toLowerCase())) &&
            gap.score < 80
          );
        });
      };

      if (selectedCourseId && selectedCourse) {
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={() => { setSelectedCourseId(null); setSelectedModuleId(null); }}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-xs font-bold transition-colors"
              >
                <ArrowLeft size={16} /> Back to Courses
              </button>
              <button 
                onClick={handleOpenCreateModule} 
                className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary/95 flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus size={14} /> Add Lesson Module
              </button>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border bg-blue-50 text-blue-600 border-blue-100`}>
                  {selectedCourse.subject}
                </span>
                <h2 className="text-2xl font-poppins font-bold text-slate-900 mt-2">{selectedCourse.name}</h2>
                <p className="text-xs text-slate-400 mt-1">Manage weekly lesson modules, topics, and assign targeted student intervention plans.</p>
              </div>
              <div className="flex gap-4 text-xs font-bold text-slate-500">
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl text-center min-w-[80px]">
                  <span className="text-slate-400 text-[10px] block mb-1">Students</span>
                  <span className="text-lg text-slate-800 font-extrabold">{selectedCourse.studentsCount}</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl text-center min-w-[80px]">
                  <span className="text-slate-400 text-[10px] block mb-1">Modules</span>
                  <span className="text-lg text-slate-800 font-extrabold">{selectedCourse.modules.length}</span>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-poppins font-bold text-slate-800 text-sm">Course Modules & Learning Trajectories</h3>
                
                {selectedCourse.modules.length > 0 ? (
                  selectedCourse.modules.map((mod) => {
                    const lagging = getLaggingStudents(mod.title);
                    const isExpanded = selectedModuleId === mod.id;
                    return (
                      <div 
                        key={mod.id}
                        className={`bg-white rounded-2xl border transition-all ${
                          isExpanded ? 'border-primary shadow-sm' : 'border-slate-100 hover:border-slate-200 shadow-sm'
                        }`}
                      >
                        <div className="p-5 flex items-center justify-between gap-4">
                          <div className="flex-1 cursor-pointer" onClick={() => setSelectedModuleId(isExpanded ? null : mod.id)}>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-slate-800 text-sm">{mod.title}</h4>
                              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                                mod.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                mod.difficulty === 'Medium' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                'bg-rose-50 text-rose-600 border-rose-100'
                              }`}>
                                {mod.difficulty}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">Topics: {mod.topics || 'Not specified'}</p>
                            <div className="flex items-center gap-3 mt-3">
                              <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-primary h-full rounded-full" style={{ width: `${mod.mastery}%` }}></div>
                              </div>
                              <span className="text-[10px] text-slate-500 font-semibold">{mod.mastery}% Average Mastery</span>
                              {lagging.length > 0 && (
                                <span className="text-[10px] text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.2 rounded-full font-bold">
                                  {lagging.length} Lagging
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => handleOpenEditModule(mod)}
                              className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-xl transition-all"
                              title="Edit Module"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteModule(mod.id)}
                              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                              title="Delete Module"
                            >
                              <Trash2 size={16} />
                            </button>
                            <button 
                              onClick={() => setSelectedModuleId(isExpanded ? null : mod.id)}
                              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                            >
                              <ChevronRight size={18} className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="px-5 pb-5 border-t border-slate-50 pt-4 bg-slate-50/30 rounded-b-2xl">
                            <h5 className="font-bold text-xs text-slate-600 uppercase tracking-wider mb-3">Diagnostic Gap Insights (Mastery &lt; 80%)</h5>
                            <div className="space-y-3">
                              {lagging.length > 0 ? (
                                lagging.map((student) => {
                                  const gap = student.knowledgeGaps.find(g => 
                                    g.topic.toLowerCase().includes(mod.title.toLowerCase()) || 
                                    mod.title.toLowerCase().includes(g.topic.toLowerCase())
                                  );
                                  return (
                                    <div key={student.id} className="bg-white p-3.5 rounded-xl border border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                                      <div>
                                        <h6 className="font-bold text-xs text-slate-800">{student.name}</h6>
                                        <span className="text-[10px] text-slate-400">Current Mastery: {gap ? gap.score : 65}%</span>
                                      </div>
                                      <button 
                                        onClick={() => handleOpenIntervention(student, mod.title)}
                                        className="bg-primary hover:bg-primary/95 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-all self-start"
                                      >
                                        Suggest Task
                                      </button>
                                    </div>
                                  );
                                })
                              ) : (
                                <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
                                  No student is lagging in this module! All students have &gt;80% understanding.
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-white p-12 text-center text-slate-400 text-xs rounded-2xl border border-slate-100 shadow-sm">
                    No lesson modules created yet. Click "Add Lesson Module" to create one.
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="font-poppins font-bold text-slate-800 text-sm">Module Details & Interventions</h3>
                {selectedModuleId && selectedModule ? (
                  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-primary bg-indigo-50 px-2 py-0.5 rounded">
                        Active Selection
                      </span>
                      <h4 className="font-poppins font-bold text-slate-800 text-sm mt-2">{selectedModule.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">Difficulty: {selectedModule.difficulty} | Topics: {selectedModule.topics}</p>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                      <h5 className="font-bold text-xs text-slate-600 uppercase tracking-wider mb-2">Lagging Student Interventions</h5>
                      <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                        {getLaggingStudents(selectedModule.title).length > 0 ? (
                          getLaggingStudents(selectedModule.title).map((student) => {
                            const gap = student.knowledgeGaps.find(g => 
                              g.topic.toLowerCase().includes(selectedModule.title.toLowerCase()) ||
                              selectedModule.title.toLowerCase().includes(g.topic.toLowerCase())
                            );
                            return (
                              <div key={student.id} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                                <div>
                                  <span className="font-bold text-slate-700 block">{student.name}</span>
                                  <span className="text-[10px] text-slate-400">Current Mastery: {gap ? gap.score : 65}%</span>
                                </div>
                                <button 
                                  onClick={() => handleOpenIntervention(student, selectedModule.title)}
                                  className="bg-primary hover:bg-primary/95 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-all self-start"
                                >
                                  Suggest Task
                                </button>
                              </div>
                            );
                          })
                        ) : (
                          <div className="p-4 text-center text-xs text-slate-400">All students meeting benchmarks.</div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 text-center text-xs text-slate-400">
                    Select a module to view diagnostic insights and suggest student intervention plans.
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-poppins font-bold text-slate-900">Course Modules Management</h2>
              <p className="text-xs text-slate-500 mt-1">Select a course to edit unit structures and manage student performance.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${course.bg} ${course.text} mb-4`}>
                    <BookOpen size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{course.name}</h3>
                  <div className="flex gap-4 text-xs text-slate-500 mb-6 font-medium">
                    <span className="flex items-center gap-1"><Users size={16} /> {course.studentsCount} Students</span>
                    <span className="flex items-center gap-1"><FileText size={16} /> {course.modules.length} Modules</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedCourseId(course.id)}
                    className="flex-1 bg-primary text-white py-2 rounded-xl text-xs font-bold hover:bg-primary/95 transition-all text-center"
                  >
                    View & Edit Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'gaps') {
      return (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-poppins font-bold text-slate-800 text-lg mb-2">Classroom Knowledge Gaps & Interventions</h3>
            <p className="text-xs text-slate-500">
              Review current student understanding gaps across subject modules. Underperforming areas are highlighted automatically to prompt teacher intervention.
            </p>
          </div>

          <div className="space-y-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                  <h4 className="font-poppins font-bold text-slate-800 text-md">{course.name}</h4>
                  <span className="text-xs font-semibold text-primary bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-xl">
                    Average: {Math.round(course.modules.reduce((acc, m) => acc + m.mastery, 0) / course.modules.length)}% Mastery
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {course.modules.map((mod) => {
                    const lagging = students.filter(student => 
                      student.knowledgeGaps?.some(gap => 
                        gap.topic.toLowerCase().includes(mod.title.toLowerCase()) && gap.score < 80
                      )
                    );

                    return (
                      <div key={mod.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                        <div className="flex justify-between items-center">
                          <h5 className="font-bold text-sm text-slate-800">{mod.title}</h5>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            mod.mastery >= 80 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                          }`}>
                            {mod.mastery}% Avg
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
                            Students Needing Assistance ({lagging.length})
                          </span>
                          {lagging.length > 0 ? (
                            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                              {lagging.map((student) => {
                                const studentGap = student.knowledgeGaps.find(g => g.topic.toLowerCase().includes(mod.title.toLowerCase()));
                                return (
                                  <div key={student.id} className="flex justify-between items-center text-xs p-2 bg-white rounded-xl border border-slate-100">
                                    <span className="font-semibold text-slate-700">{student.name} ({studentGap?.score || 60}%)</span>
                                    <button 
                                      onClick={() => handleOpenIntervention(student, mod.title)}
                                      className="text-[10px] bg-primary text-white px-2 py-1 rounded font-bold hover:bg-primary/95 transition-all"
                                    >
                                      Suggest Task
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 italic">All students in good standing for this module.</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'notes') {
      return (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 lg:col-span-1 h-fit">
            <h3 className="font-poppins font-bold text-slate-800 text-lg">Upload Progress Note</h3>
            <p className="text-xs text-slate-400">Add detailed comments or upload hand-written resources / worksheet files for your students.</p>
            
            <form onSubmit={handleSaveNote} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Select Student</label>
                <select 
                  value={noteStudentId}
                  onChange={(e) => setNoteStudentId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xs"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Note Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Midterm prep guide or Weak algebra formulas review"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Written Evaluation / Content</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Enter detailed suggestions or feedback on topics requiring focus..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Upload Attachment (mock)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="file"
                    id="note-file-upload"
                    onChange={handleMockFileChange}
                    className="hidden"
                  />
                  <label 
                    htmlFor="note-file-upload"
                    className="cursor-pointer px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors border border-slate-200 inline-block"
                  >
                    Choose File
                  </label>
                  <span className="text-xs text-slate-500 truncate max-w-[150px]">
                    {noteFileName || 'No file selected'}
                  </span>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/95 text-white py-3 rounded-xl font-bold text-xs shadow-md mt-4"
              >
                Upload & Share Note
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-poppins font-bold text-slate-800 text-sm">Notes History & Shared Materials</h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {writtenNotes.length > 0 ? (
                writtenNotes.map((note) => {
                  const student = students.find(s => s.id === note.studentId);
                  return (
                    <div key={note.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase bg-indigo-50 text-primary px-2.5 py-1 rounded-full border border-indigo-100">
                            Student: {student?.name || 'All'}
                          </span>
                          <h4 className="font-poppins font-bold text-slate-800 text-sm mt-2">{note.title}</h4>
                        </div>
                        <button 
                          onClick={() => deleteWrittenNote(note.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <p className="text-xs text-slate-600 leading-relaxed font-sans">{note.content}</p>

                      {note.fileName && (
                        <div className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-500 w-fit">
                          <FileText size={16} className="text-primary" />
                          <span className="font-semibold">{note.fileName}</span>
                          <button 
                            onClick={() => alert(`Mock download of ${note.fileName} complete.`)}
                            className="p-1 bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded border border-slate-200 transition-colors ml-2"
                            title="Mock Download File"
                          >
                            <Download size={12} />
                          </button>
                        </div>
                      )}

                      <span className="text-[10px] text-slate-400 block mt-2">Shared on: {note.date}</span>
                    </div>
                  );
                })
              ) : (
                <div className="bg-white p-12 text-center text-slate-400 text-xs rounded-3xl border border-slate-100 shadow-sm">
                  No notes uploaded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'schedule') {
      return (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 lg:col-span-1 h-fit">
            <h3 className="font-poppins font-bold text-slate-800 text-lg">Schedule Live Session</h3>
            <p className="text-xs text-slate-400">Schedule review sessions, live math lessons, or parent-teacher office hours.</p>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Session Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Thermodynamics Carnot efficiency live review"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date</label>
                  <input 
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Time</label>
                  <input 
                    type="time"
                    required
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Session Type</label>
                <select 
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xs"
                >
                  <option>Live Class</option>
                  <option>Q&A Session</option>
                  <option>Office Hours</option>
                  <option>Exam Review</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                <textarea 
                  rows={3}
                  placeholder="Provide meeting link details or preparation notes..."
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xs leading-relaxed"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/95 text-white py-3 rounded-xl font-bold text-xs shadow-md mt-4"
              >
                Schedule & Broadcast Session
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-poppins font-bold text-slate-800 text-sm">Scheduled Calendar Events</h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {scheduleEvents.length > 0 ? (
                scheduleEvents.map((evt) => (
                  <div key={evt.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4 hover:border-indigo-100 transition-all">
                    <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-primary font-bold text-center min-w-[70px]">
                      <span className="text-[10px] text-indigo-400 block uppercase font-bold mb-0.5">Time</span>
                      <span className="text-sm font-extrabold block">{evt.time}</span>
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-800 text-sm">{evt.title}</h4>
                          <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded border uppercase ${
                            evt.type === 'Live Class' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            evt.type === 'Q&A Session' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                            {evt.type}
                          </span>
                        </div>
                        <button 
                          onClick={() => deleteScheduleEvent(evt.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-slate-500">{evt.desc}</p>
                      <div className="flex gap-4 text-[10px] text-slate-400 pt-2 font-semibold">
                        <span>📅 Date: {evt.date}</span>
                        <span>👨‍🏫 Instructor: {evt.instructor}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white p-12 text-center text-slate-400 text-xs rounded-3xl border border-slate-100 shadow-sm">
                  No upcoming live sessions scheduled.
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'monitor') {
      const currentStudent = students.find(s => s.id === selectedStudentForHeatmap?.id) || students[0];

      const getStudentTotalMinutes = (student) => {
        if (!student?.heatmap || Object.keys(student.heatmap).length === 0) return 0;
        return Object.values(student.heatmap).reduce((acc, dayArray) => {
          return acc + (Array.isArray(dayArray) ? dayArray.reduce((daySum, val) => daySum + val, 0) : 0);
        }, 0);
      };

      const chartData = students.map(s => ({
        name: s.name.split(' ')[0],
        minutes: getStudentTotalMinutes(s)
      }));

      const topStreak = Math.max(...students.map(s => s.streak || 0));
      const totalMinutes = students.reduce((acc, s) => acc + getStudentTotalMinutes(s), 0);
      const flaggedLow = students.filter(s => getStudentTotalMinutes(s) < 60).length;

      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="p-3 bg-indigo-50 rounded-xl text-primary">
                <Clock size={24} />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium block">Total Classroom Study</span>
                <strong className="text-xl text-slate-800 font-bold">{totalMinutes} Minutes</strong>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="p-3 bg-amber-50 rounded-xl text-amber-500">
                <Flame size={24} className="fill-amber-500" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium block">Top Active Streak</span>
                <strong className="text-xl text-slate-800 font-bold">{topStreak} Days</strong>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="p-3 bg-rose-50 rounded-xl text-rose-500">
                <AlertTriangle size={24} />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium block">Low Study Alert (&lt;60m)</span>
                <strong className="text-xl text-slate-800 font-bold">{flaggedLow} Students</strong>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="font-poppins font-bold text-slate-800 text-sm mb-6">Weekly Study Time Comparison (Mins)</h3>
              <div className="h-[250px] w-full text-xs font-semibold">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="minutes" fill="#4F46E5" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.minutes < 60 ? '#EF4444' : '#4F46E5'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-full space-y-6">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Monitor Detail Heatmaps</h3>
                <p className="text-xs text-slate-400 mt-1 mb-4">View exact hour-by-hour logs for student login and active study time.</p>
                
                <select 
                  value={currentStudent?.id || ''}
                  onChange={(e) => {
                    const found = students.find(s => s.id === e.target.value);
                    if (found) setSelectedStudentForHeatmap(found);
                  }}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xs"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({getStudentTotalMinutes(s)} mins)</option>
                  ))}
                </select>
              </div>

              {/* Low Study Alerts */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-bold text-slate-800 text-xs mb-2 flex items-center gap-1.5"><AlertTriangle size={14} className="text-rose-500" /> Low Study Intervention Alerts</h4>
                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                  {students.filter(s => getStudentTotalMinutes(s) < 60).map(s => (
                    <div key={s.id} className="flex justify-between items-center text-xs p-2 bg-rose-50 border border-rose-100 rounded-xl">
                      <span className="font-semibold text-rose-700">{s.name} ({getStudentTotalMinutes(s)}m)</span>
                      <button 
                        onClick={() => sendInterventionAlert(s)}
                        className="text-[9px] bg-rose-600 hover:bg-rose-700 text-white font-bold px-2 py-1 rounded transition-colors"
                      >
                        Alert Parent
                      </button>
                    </div>
                  ))}
                  {students.filter(s => getStudentTotalMinutes(s) < 60).length === 0 && (
                    <p className="text-[10px] text-emerald-600 italic">All students have logged &gt;= 60 mins this week.</p>
                  )}
                </div>
              </div>
              
              <button 
                onClick={() => handleTabChange('monitor')} 
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors border border-slate-200"
              >
                Reload Logs
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-poppins font-bold text-slate-800 text-sm mb-4">Detailed Grid for {currentStudent?.name || ''}</h3>
            {currentStudent?.heatmap && Object.keys(currentStudent.heatmap).length > 0 ? (
              <div className="overflow-x-auto">
                <div className="min-w-[600px] space-y-2">
                  <div className="flex text-[10px] font-bold text-slate-400 text-center py-1">
                    <div className="w-16 text-left">Day</div>
                    {['9 AM', '11 AM', '1 PM', '3 PM', '5 PM', '7 PM', '9 PM', '11 PM'].map((h, idx) => (
                      <div key={idx} className="flex-1">{h}</div>
                    ))}
                  </div>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div key={day} className="flex items-center text-center">
                      <div className="w-16 text-left text-[10px] font-bold text-slate-600 uppercase">{day}</div>
                      {Array.from({ length: 8 }).map((_, hourIdx) => {
                        const minutes = currentStudent.heatmap?.[day]?.[hourIdx] || 0;
                        return (
                          <div key={hourIdx} className="flex-1 px-1">
                            <div className={`h-8 rounded-lg ${getHeatmapColor(minutes)} border border-white/60 shadow-sm flex items-center justify-center text-[10px] font-bold ${minutes >= 45 ? 'text-white' : 'text-slate-700'}`}>
                              {minutes > 0 ? `${minutes}m` : '-'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 justify-end text-[10px] font-semibold text-slate-400 mt-4">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-slate-100 rounded-sm inline-block"></span> 0m</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-indigo-200 rounded-sm inline-block"></span> 1-15m</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-indigo-400 rounded-sm inline-block"></span> 15-30m</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-indigo-600 rounded-sm inline-block"></span> 30-45m</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-indigo-900 rounded-sm inline-block"></span> 45m+</span>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 text-xs">
                No heatmap engagement records yet for {currentStudent?.name || 'student'}.
              </div>
            )}
          </div>
        </div>
      );
    }

    if (activeTab === 'reports') {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-poppins font-bold text-slate-900">Parent Weekly Progress Reports</h2>
              <p className="text-xs text-slate-500 mt-1">Compile and securely dispatch weekly academic summary emails/reports to parents.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4 text-sm">Select Student to Compile</h3>
              <div className="space-y-3">
                {students.map((studentItem) => {
                  const hasReport = weeklyReports.some(r => r.studentId === studentItem.id);
                  return (
                    <div key={studentItem.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-xs text-slate-800">{studentItem.name}</h4>
                        <span className="text-[10px] text-slate-400 block mt-0.5">GPA: {studentItem.gpa} • Attendance: {studentItem.attendance}%</span>
                      </div>
                      <button 
                        onClick={() => triggerCompileReportModal(studentItem)}
                        className={`text-xs font-bold py-1.5 px-3 rounded-lg transition-colors border ${
                          hasReport ? 'bg-indigo-50 border-indigo-200 text-primary' : 'bg-primary text-white hover:bg-primary/95'
                        }`}
                      >
                        {hasReport ? 'Re-compile' : 'Compile'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4 text-sm">Sent Reports Summary</h3>
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {weeklyReports.length > 0 ? (
                  weeklyReports.map((report) => (
                    <div key={report.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-xs text-slate-800">{report.studentName}</h4>
                        <span className="text-[9px] font-bold uppercase text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">
                          Sent
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2 italic">"{report.notes}"</p>
                      <span className="text-[10px] text-slate-400 block mt-2">Dispatched on: {new Date(report.compiledAt).toLocaleDateString()}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400">No reports generated yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'bossbattle') {
      const subjectOptions = ['Mathematics','Physics','Chemistry','Biology','English','History','Geography','Computer Science'];
      const difficultyMeta = {
        EASY:      { color: 'text-emerald-600 bg-emerald-50  border-emerald-200', xp: 150,  label: 'Easy',      emoji: '🟢' },
        MEDIUM:    { color: 'text-amber-600  bg-amber-50   border-amber-200',   xp: 300,  label: 'Medium',    emoji: '🟡' },
        HARD:      { color: 'text-rose-600   bg-rose-50    border-rose-200',    xp: 500,  label: 'Hard',      emoji: '🔴' },
        LEGENDARY: { color: 'text-purple-600 bg-purple-50  border-purple-200',  xp: 1000, label: 'Legendary', emoji: '👑' },
      };

      const handleCreateBossBattle = async (e) => {
        e.preventDefault();
        if (!bbTitle.trim()) return;
        setBbSubmitting(true);
        try {
          const { api } = await import('../../services/api');
          const data = await api.post('/boss-battles', {
            title: bbTitle, subject: bbSubject, difficulty: bbDifficulty,
            timeLimitMins: Number(bbTimeLimit), totalQuestions: Number(bbQuestions),
            xpReward: Number(bbXpReward), coinsReward: Math.round(Number(bbXpReward) / 3),
          });
          setBbCreated(prev => [{ id: data.id || Date.now(), title: bbTitle, subject: bbSubject, difficulty: bbDifficulty, xpReward: bbXpReward, timeLimitMins: bbTimeLimit, totalQuestions: bbQuestions, createdAt: new Date().toLocaleDateString() }, ...prev]);
          setBbTitle('');
        } catch {
          setBbCreated(prev => [{ id: Date.now(), title: bbTitle, subject: bbSubject, difficulty: bbDifficulty, xpReward: bbXpReward, timeLimitMins: bbTimeLimit, totalQuestions: bbQuestions, createdAt: new Date().toLocaleDateString() }, ...prev]);
          setBbTitle('');
        } finally {
          setBbSubmitting(false);
        }
      };

      return (
        <div className="space-y-6">
          {/* Header card */}
          <div className="relative overflow-hidden bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 rounded-3xl p-6 text-white shadow-xl">
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full" />
            <div className="absolute -right-4 -bottom-8 w-24 h-24 bg-white/10 rounded-full" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 rounded-xl p-2"><Sword size={22} /></div>
                <h2 className="font-poppins font-bold text-xl">Boss Battle Creator</h2>
              </div>
              <p className="text-white/80 text-sm max-w-md">Design epic challenge exams for your students. Each Boss Battle is a timed, high-stakes quiz that awards XP, coins, and accelerates pet evolution.</p>
              <div className="flex gap-4 mt-4">
                {[['🏟️',`${bbCreated.length} Created`],['⚡','XP on Win'],['🕐','Time Limited']].map(([icon,label]) => (
                  <div key={label} className="bg-white/15 rounded-xl px-3 py-1.5 text-xs font-semibold">{icon} {label}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Create Form */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-poppins font-bold text-slate-800 text-base mb-5 flex items-center gap-2"><Plus size={18} className="text-rose-500" /> New Boss Battle</h3>
              <form onSubmit={handleCreateBossBattle} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Battle Title *</label>
                  <input value={bbTitle} onChange={e => setBbTitle(e.target.value)} placeholder="e.g. Calculus Showdown" required
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-slate-50" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Subject</label>
                    <select value={bbSubject} onChange={e => setBbSubject(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-400">
                      {subjectOptions.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Difficulty</label>
                    <select value={bbDifficulty} onChange={e => setBbDifficulty(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-400">
                      {Object.entries(difficultyMeta).map(([k,v]) => <option key={k} value={k}>{v.emoji} {v.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">⏱️ Time Limit (mins)</label>
                    <input type="number" min={5} max={120} value={bbTimeLimit} onChange={e => setBbTimeLimit(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">❓ Questions</label>
                    <input type="number" min={3} max={30} value={bbQuestions} onChange={e => setBbQuestions(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">⚡ XP Reward</label>
                    <input type="number" min={50} max={2000} step={50} value={bbXpReward} onChange={e => setBbXpReward(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-400" />
                  </div>
                </div>
                {/* Preview card */}
                <div className={`border rounded-2xl p-4 ${difficultyMeta[bbDifficulty].color}`}>
                  <p className="text-xs font-bold mb-1">Preview</p>
                  <p className="font-poppins font-bold text-base">{bbTitle || 'Battle Title...'}</p>
                  <div className="flex gap-3 mt-2 text-xs font-semibold">
                    <span>📚 {bbSubject}</span>
                    <span>⏱ {bbTimeLimit} min</span>
                    <span>❓ {bbQuestions} Qs</span>
                    <span>⚡ {bbXpReward} XP</span>
                  </div>
                </div>
                <button type="submit" disabled={bbSubmitting}
                  className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-rose-200 flex items-center justify-center gap-2">
                  {bbSubmitting ? '⚔️ Creating...' : <><Sword size={16} /> Create Boss Battle</>}
                </button>
              </form>
            </div>

            {/* Created battles list */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-poppins font-bold text-slate-800 text-base mb-5 flex items-center gap-2"><Target size={18} className="text-orange-500" /> Your Boss Battles</h3>
              {bbCreated.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <div className="text-5xl mb-3">⚔️</div>
                  <p className="font-semibold text-slate-500 text-sm">No battles created yet</p>
                  <p className="text-xs text-slate-400 mt-1">Create your first Boss Battle to challenge your students!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                  {bbCreated.map(battle => (
                    <div key={battle.id} className="border border-slate-100 rounded-2xl p-4 hover:border-rose-200 hover:bg-rose-50/30 transition-all">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-poppins font-bold text-slate-800 text-sm">{battle.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{battle.subject} · Created {battle.createdAt}</p>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg border ${difficultyMeta[battle.difficulty]?.color}`}>
                          {difficultyMeta[battle.difficulty]?.emoji} {difficultyMeta[battle.difficulty]?.label}
                        </span>
                      </div>
                      <div className="flex gap-3 mt-3">
                        {[['⏱',`${battle.timeLimitMins}m`],['❓',`${battle.totalQuestions} Qs`],['⚡',`${battle.xpReward} XP`]].map(([icon,val]) => (
                          <span key={val} className="text-xs bg-slate-100 text-slate-600 font-semibold rounded-lg px-2 py-1">{icon} {val}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-5">
            <h4 className="font-poppins font-bold text-amber-800 text-sm mb-3 flex items-center gap-2"><Zap size={16} /> Boss Battle Tips</h4>
            <div className="grid sm:grid-cols-3 gap-3 text-xs text-amber-700">
              {[['🏆 Use LEGENDARY','For end-of-term exams. Rewards up to 1000 XP and triggers pet evolution.'],
                ['⚡ Schedule with Events','Link Boss Battles to Calendar events so students get notified.'],
                ['🧠 Mix Difficulties','Start with EASY warmups, escalate to HARD to build confidence progressively.']].map(([t,d]) => (
                <div key={t} className="bg-white/70 rounded-2xl p-3">
                  <p className="font-bold mb-1">{t}</p>
                  <p>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'assignments') {
      return (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h3 className="font-poppins font-bold text-slate-800 text-lg">Classroom Assignments</h3>
              <p className="text-xs text-slate-500 mt-1">Create, view, and track grading for homework, quizzes, and exams.</p>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-primary hover:bg-primary/95 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-100 flex items-center gap-1.5"
            >
              <Plus size={16} /> Create Assignment
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Title</th>
                    <th className="px-6 py-4 font-semibold">Subject</th>
                    <th className="px-6 py-4 font-semibold">Type</th>
                    <th className="px-6 py-4 font-semibold">Difficulty</th>
                    <th className="px-6 py-4 font-semibold">Due Date</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {assignments.map((assign) => (
                    <tr key={assign.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">{assign.title}</td>
                      <td className="px-6 py-4 text-slate-600">{assign.subject}</td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 border border-slate-150 px-2 py-0.5 rounded-lg text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          {assign.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          assign.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600' :
                          assign.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600' :
                          'bg-rose-50 text-rose-600'
                        }`}>
                          {assign.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-550 text-xs">{assign.due}</td>
                      <td className="px-6 py-4">
                        {assign.status === 'Graded' ? (
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                            Graded ({assign.score}%)
                          </span>
                        ) : assign.status === 'Submitted' ? (
                          <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">
                            Submitted
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {assign.status === 'Submitted' ? (
                          <button 
                            onClick={() => handleMarkGraded(assign.id, 'student@arivo.com')}
                            className="bg-primary hover:bg-primary/90 text-white font-bold text-xs px-2.5 py-1 rounded-xl transition-all"
                          >
                            Grade (Simulate)
                          </button>
                        ) : assign.status === 'Graded' ? (
                          <span className="text-xs text-slate-400 italic">No action needed</span>
                        ) : (
                          <button 
                            onClick={() => submitAssignment(assign.id, 'student@arivo.com')}
                            className="bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-600 font-bold text-xs px-2.5 py-1 rounded-xl transition-all"
                          >
                            Simulate Submit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'students') {
      return (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-poppins font-bold text-slate-800 text-lg">Student Directory</h3>
            <p className="text-xs text-slate-500 mt-1">Manage student profiles, review academic averages, and trigger notifications.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Student Name</th>
                    <th className="px-6 py-4 font-semibold">Grade Level</th>
                    <th className="px-6 py-4 font-semibold">Attendance</th>
                    <th className="px-6 py-4 font-semibold">GPA</th>
                    <th className="px-6 py-4 font-semibold">ML Predicted Score</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">{student.name}</td>
                      <td className="px-6 py-4 text-slate-600">Grade 8</td>
                      <td className="px-6 py-4 text-slate-500">{student.attendance}%</td>
                      <td className="px-6 py-4 text-slate-650 font-bold">{student.gpa}</td>
                      <td className="px-6 py-4 text-primary font-bold">{student.predictedScore}%</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          student.atRisk ? 'text-rose-600 bg-rose-50 border-rose-200' :
                          student.predictedScore >= 90 ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
                          'text-blue-600 bg-blue-50 border-blue-200'
                        }`}>
                          {student.atRisk ? 'At Risk' : student.predictedScore >= 90 ? 'Excel' : 'Normal'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button 
                          onClick={() => triggerCompileReportModal(student)}
                          className="text-xs text-primary font-bold hover:underline"
                        >
                          Compile Report
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedStudentForHeatmap(student);
                            handleTabChange('monitor');
                          }}
                          className="text-xs text-slate-500 font-bold hover:underline"
                        >
                          View Heatmap
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Students", value: students.length, trend: "Lincoln Middle School", icon: <Users size={24} />, color: "text-blue-600", bg: "bg-blue-100" },
            { label: "Pending Submissions", value: assignments.filter(a => a.status === 'Submitted').length, trend: "Awaiting Grading", icon: <FileText size={24} />, color: "text-amber-600", bg: "bg-amber-100" },
            { label: "ML Flagged At-Risk", value: students.filter(s => s.atRisk).length, trend: "Requires attention", icon: <AlertTriangle size={24} />, color: "text-rose-600", bg: "bg-rose-100 animate-pulse" },
            { label: "Avg Class mastery", value: "84%", trend: "Calculated from gaps", icon: <Sparkles size={24} />, color: "text-indigo-600", bg: "bg-indigo-150" }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-xs text-slate-400 mt-2">{stat.trend}</p>
            </div>
          ))}
        </div>

        {/* Quick action grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800">Pending Student Actions</h2>
              </div>
              <div className="divide-y divide-slate-100 min-h-[300px]">
                {assignments.filter(a => a.status === 'Submitted' || a.status === 'Pending').length > 0 ? (
                  assignments.filter(a => a.status === 'Submitted' || a.status === 'Pending').map((row) => (
                    <div key={row.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-all">
                      <div>
                        <h4 className="font-bold text-xs text-slate-800">{row.title}</h4>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{row.subject} • Status: <strong className="text-amber-500 font-semibold">{row.status}</strong></span>
                      </div>
                      
                      {row.status === 'Submitted' ? (
                        <button 
                          onClick={() => handleMarkGraded(row.id, 'student@arivo.com')}
                          className="bg-primary hover:bg-primary/95 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all"
                        >
                          Auto Grade (simulate)
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">Awaiting student completion</span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-slate-400 text-xs">No pending student actions. All grades up to date!</div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4">Quick Classroom Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-primary text-white hover:bg-primary/90 transition-all font-bold text-xs shadow-sm hover:shadow-md"
                >
                  <Plus size={18} /> Create Test/Assignment
                </button>
                <button 
                  onClick={() => handleTabChange('reports')}
                  className="w-full flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors font-semibold text-xs"
                >
                  <ClipboardList size={18} className="text-indigo-500" /> Compile Parent Progress Reports
                </button>
                <button 
                  onClick={() => handleTabChange('monitor')}
                  className="w-full flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors font-semibold text-xs"
                >
                  <BarChart2 size={18} className="text-emerald-500" /> Review Engagement Heatmaps
                </button>
              </div>
            </div>

            {/* Parent Feedback Log feed */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-1.5"><MessageSquare size={18} className="text-primary" /> Parent Feedback Log</h3>
              <div className="space-y-4 divide-y divide-slate-100 max-h-[300px] overflow-y-auto pr-1">
                {parentFeedbacks && parentFeedbacks.length > 0 ? (
                  parentFeedbacks.map((fb, idx) => {
                    const student = students.find(s => s.id === fb.studentId);
                    return (
                      <div key={fb.id} className={`pt-4 ${idx === 0 ? 'pt-0' : ''} space-y-1.5`}>
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-slate-700 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-lg">{fb.parentName}</span>
                          <span className="text-slate-400">{fb.date}</span>
                        </div>
                        <p className="text-xs text-slate-655 italic leading-relaxed">"{fb.text}"</p>
                        {student && (
                          <div className="text-[9px] text-slate-400 font-semibold">
                            Regarding student: <span className="text-slate-500 font-bold">{student.name}</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-xs text-slate-400 py-6">No parent feedback logged yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen flex bg-background relative select-none">
      
      {/* Create Assignment Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="font-poppins font-bold text-lg text-slate-800">Publish New Assignment/Assessment</h2>
                <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreateAssignment} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Assignment Title</label>
                  <input 
                    type="text" 
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                    placeholder="e.g. Chapter 4 Practice Quiz"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Subject</label>
                    <select 
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xs"
                    >
                      <option>Mathematics</option>
                      <option>Physics</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Assessment Mode</label>
                    <select 
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xs"
                    >
                      <option>Homework</option>
                      <option>Quiz</option>
                      <option>Exam</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Adaptive Difficulty Basis</label>
                  <select 
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xs"
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>

                <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-bold text-xs hover:bg-primary/95 transition-all shadow-md mt-4">
                  Publish to Classroom
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Compile Weekly Progress Report Modal */}
      <AnimatePresence>
        {activeReportStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-primary/5 to-indigo-500/5">
                <div>
                  <span className="text-[10px] uppercase font-extrabold tracking-wider bg-primary/10 text-primary px-3 py-1 rounded-full">
                    Compile Parent Report
                  </span>
                  <h2 className="font-poppins font-bold text-slate-800 text-lg mt-1">Weekly Summary for {activeReportStudent.name}</h2>
                </div>
                <button onClick={() => setActiveReportStudent(null)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveAndSendReport} className="p-6 space-y-4">
                <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-2xl text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Attendance Term:</span>
                    <strong className="text-slate-700">{activeReportStudent.attendance}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">GPA Trend:</span>
                    <strong className="text-primary font-bold">{activeReportStudent.gpa}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">ML Predicted Grade:</span>
                    <strong className="text-slate-700 font-bold">{activeReportStudent.predictedScore}%</strong>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Teacher Evaluations & Notes</label>
                  <textarea 
                    rows={4}
                    required
                    value={teacherNotes}
                    onChange={(e) => setTeacherNotes(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xs leading-relaxed"
                  />
                </div>

                <button type="submit" className="w-full bg-primary hover:bg-primary/95 text-white py-3 rounded-xl font-bold text-xs shadow-md mt-4 flex items-center justify-center gap-1.5">
                  <Send size={14} /> Send Progress Summary to Parent
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#1E1B4B] text-white h-screen sticky top-0 shrink-0">
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-primary p-1.5 rounded-lg">
              <BookOpen size={20} className="text-white" />
            </div>
            <span className="font-poppins font-bold text-lg tracking-tight">SmartLearn Teacher</span>
          </div>
          
          <nav className="space-y-2 flex-1">
            {/* Standard side navigation items */}
            {[
              { id: 'dashboard',   icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
              { id: 'classes',     icon: <BookOpen size={20} />,       label: 'Course Modules' },
              { id: 'gaps',        icon: <AlertTriangle size={20} />,  label: 'Learning Gaps' },
              { id: 'bossbattle',  icon: <Sword size={20} />,          label: 'Boss Battles' },
              { id: 'notes',       icon: <FileText size={20} />,       label: 'Written Notes' },
              { id: 'schedule',    icon: <Calendar size={20} />,       label: 'Class Schedule' },
              { id: 'monitor',     icon: <Clock size={20} />,          label: 'Study-Time Monitor' },
              { id: 'assignments', icon: <FileText size={20} />,       label: 'Assignments' },
              { id: 'students',    icon: <Users size={20} />,          label: 'Students' },
              { id: 'reports',     icon: <ClipboardList size={20} />,  label: 'Weekly Parent Reports' }
            ].map((item) => (
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
                  login('parent', 'parent@arivo.com');
                  navigate('/parent/dashboard');
                }} 
                className="text-[11px] py-1 bg-emerald-500/20 hover:bg-emerald-500/40 rounded-lg font-medium text-emerald-200 border border-emerald-500/30"
              >
                Parent
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
              {activeTab === 'dashboard' ? `Good morning, Dr. ${userName}!` : 
               activeTab === 'classes'     ? 'Course Modules' : 
               activeTab === 'gaps'        ? 'Learning Gaps Tracker' :
               activeTab === 'bossbattle'  ? '⚔️ Boss Battle Creator' :
               activeTab === 'notes'       ? 'Written Notes' :
               activeTab === 'schedule'    ? 'Class Schedule' :
               activeTab === 'monitor'     ? 'Study-Time Monitor' :
               activeTab === 'assignments' ? 'Assignments' :
               activeTab === 'students'    ? 'Student Directory' :
               'Weekly Parent Reports'}
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Manage student study profiles, compile parent reports, and monitor real-time heatmaps.
            </p>
          </div>
          
          <div className="flex items-center gap-4 relative">
            <button 
              onClick={handleBellClick}
              className="p-2.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-primary transition-colors relative"
            >
              <Bell size={20} />
              {notifications.filter(n => n.recipient === 'teacher' && !n.read).length > 0 && (
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
                    <span className="text-xs text-primary font-semibold">
                      {notifications.filter(n => n.recipient === 'teacher' && !n.read).length} New
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                    {notifications.filter(n => n.recipient === 'teacher').length > 0 ? (
                      notifications.filter(n => n.recipient === 'teacher').map((notif) => (
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
                      <div className="p-8 text-center text-xs text-slate-400">No notifications.</div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-secondary to-primary flex items-center justify-center text-white font-bold shadow-md">
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
      {/* Create / Edit Module Modal */}
      <AnimatePresence>
        {showModuleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-primary/5 to-indigo-500/5">
                <div>
                  <span className="text-[10px] uppercase font-extrabold tracking-wider bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {moduleModalType === 'create' ? 'Create Module' : 'Edit Module'}
                  </span>
                  <h2 className="font-poppins font-bold text-slate-800 text-lg mt-1">
                    {moduleModalType === 'create' ? 'Add New Lesson Plan' : 'Modify Lesson Plan'}
                  </h2>
                </div>
                <button onClick={() => setShowModuleModal(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveModule} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-poppins">Module Title</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Quadratic Equations"
                    value={moduleFormTitle}
                    onChange={(e) => setModuleFormTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-poppins">Topics Covered</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Factoring, Quadratic Formula, Roots"
                    value={moduleFormTopics}
                    onChange={(e) => setModuleFormTopics(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-poppins">Difficulty</label>
                  <select 
                    value={moduleFormDifficulty}
                    onChange={(e) => setModuleFormDifficulty(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xs"
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>

                <button type="submit" className="w-full bg-primary hover:bg-primary/95 text-white py-3 rounded-xl font-bold text-xs shadow-md mt-4 transition-all">
                  {moduleModalType === 'create' ? 'Create Module' : 'Save Changes'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Suggest Study Intervention Modal */}
      <AnimatePresence>
        {showInterventionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-amber-500/5 to-primary/5">
                <div>
                  <span className="text-[10px] uppercase font-extrabold tracking-wider bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                    Suggest Intervention
                  </span>
                  <h2 className="font-poppins font-bold text-slate-800 text-lg mt-1">
                    Recommend Task for {interventionStudent?.name}
                  </h2>
                </div>
                <button onClick={() => setShowInterventionModal(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSendIntervention} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-poppins">Recommended Topic</label>
                  <input 
                    type="text"
                    required
                    readOnly
                    value={interventionTopic}
                    className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl outline-none text-xs text-slate-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-poppins">Recommended Duration</label>
                  <select 
                    value={interventionDuration}
                    onChange={(e) => setInterventionDuration(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xs"
                  >
                    <option>15 mins</option>
                    <option>30 mins</option>
                    <option>45 mins</option>
                    <option>60 mins</option>
                    <option>90 mins</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-poppins">Task Description</label>
                  <textarea 
                    rows={3}
                    required
                    value={interventionDescription}
                    onChange={(e) => setInterventionDescription(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xs leading-relaxed"
                  />
                </div>

                <button type="submit" className="w-full bg-primary hover:bg-primary/95 text-white py-3 rounded-xl font-bold text-xs shadow-md mt-4 transition-all">
                  Send Study Suggestion
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </main>
    </div>
  );
};

export default TeacherDashboard;
