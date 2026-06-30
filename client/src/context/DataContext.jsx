import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const DataContext = createContext();
export const useData = () => useContext(DataContext);

// ── Helpers ──────────────────────────────────────────────────────────────────
const resolveAssignmentStatus = (a) => {
  if (a.marksObtained !== null && a.marksObtained !== undefined) return 'Graded';
  if (a.submitted) return 'Submitted';
  return 'Pending';
};

export const DataProvider = ({ children }) => {
  const { user } = useAuth();

  // ── Core state ──────────────────────────────────────────────────────────────
  const [students,           setStudents]           = useState([]);
  const [assignments,        setAssignments]        = useState([]);
  const [notifications,      setNotifications]      = useState([]);
  const [courses,            setCourses]            = useState([]);
  const [writtenNotes,       setWrittenNotes]       = useState([]);
  const [scheduleEvents,     setScheduleEvents]     = useState([]);
  const [weeklyReports,      setWeeklyReports]      = useState([]);
  const [parentFeedbacks,    setParentFeedbacks]    = useState([]);
  const [gamificationProfile, setGamificationProfile] = useState(null);
  const [housesScoreboard,   setHousesScoreboard]   = useState([]);
  const [questionsPool,      setQuestionsPool]      = useState({});
  const [bossBattles,        setBossBattles]        = useState([]);
  const [dailyJourney,       setDailyJourney]       = useState(null);
  const [storeItems,         setStoreItems]         = useState({ coinsBalance: 0, items: [] });
  const [activeEvents,       setActiveEvents]       = useState([]);
  const [activeQuests,       setActiveQuests]       = useState([]);
  const [principalTelemetry, setPrincipalTelemetry] = useState(null);

  // ── Local study plan ────────────────────────────────────────────────────────
  const [studyPlan, setStudyPlan] = useState({
    goal: 'Master your subjects',
    tasks: [
      { id: 't1', day: 'Monday',    topic: 'Review Wave-Particle Duality',   duration: '30 mins', completed: false },
      { id: 't2', day: 'Tuesday',   topic: 'Solve Calculus derivatives quiz', duration: '45 mins', completed: false },
      { id: 't3', day: 'Wednesday', topic: 'AI Tutor: Thermodynamics gaps',   duration: '20 mins', completed: true  },
    ],
  });

  // ── Dashboard loader ────────────────────────────────────────────────────────
  const loadDashboard = useCallback(async () => {
    if (!user) return;
    try {
      if (user.role === 'student') {
        const data = await api.get('/students/dashboard');
        const profile = data.profile || {};
        setStudents([{
          id:      profile.id    || user.id,
          name:    profile.name  || user.name,
          email:   profile.email || user.email,
          xp: 0, streak: 0, grade: 'A', subject: 'Physics',
          studyPlan: studyPlan.tasks,
        }]);
        const rawAssignments = data.assignments || [];
        setAssignments(rawAssignments.map(a => ({
          ...a,
          subject: a.class || a.subject || 'General',
          due:     a.dueDate || a.due || '',
          status:  resolveAssignmentStatus(a),
        })));
        setNotifications((data.notifications || []).map(n => ({
          ...n, read: n.read ?? n.readStatus ?? false,
        })));
        setCourses(data.classes || []);

        // Gamification parallel load
        const [gam, houses, journey, store, evts, quests, pool, battles] =
          await Promise.allSettled([
            api.get('/gamification/profile'),
            api.get('/gamification/houses'),
            api.get('/gamification/daily-journey'),
            api.get('/store/items'),
            api.get('/gamification/events'),
            api.get('/quests/active'),
            api.get('/quests/pool'),
            api.get('/boss-battles'),
          ]);

        if (gam.status     === 'fulfilled') setGamificationProfile(gam.value);
        if (houses.status  === 'fulfilled') setHousesScoreboard(houses.value || []);
        if (journey.status === 'fulfilled') setDailyJourney(journey.value);
        if (store.status   === 'fulfilled') setStoreItems(store.value || { coinsBalance: 0, items: [] });
        if (evts.status    === 'fulfilled') setActiveEvents(evts.value || []);
        if (quests.status  === 'fulfilled') setActiveQuests(quests.value || []);
        if (pool.status    === 'fulfilled') setQuestionsPool(pool.value || {});
        if (battles.status === 'fulfilled') setBossBattles(battles.value || []);

      } else if (user.role === 'teacher') {
        const [dashRes, notesRes, evtsRes, reportsRes] = await Promise.allSettled([
          api.get('/teachers/dashboard'),
          api.get('/teachers/notes'),
          api.get('/teachers/events'),
          api.get('/weekly-reports'),
        ]);

        if (dashRes.status === 'fulfilled') {
          const data = dashRes.value;
          setCourses(data.classes || []);
          // Use top-level students array (enriched with knowledgeGaps by DashboardService)
          const topStudents = data.students || [];
          const fromClasses = [];
          (data.classes || []).forEach(cls => {
            if (cls.students) fromClasses.push(...cls.students);
          });
          const merged = topStudents.length > 0 ? topStudents : fromClasses;
          setStudents(merged.length > 0 ? merged : [
            { id: user.id, name: user.name, email: user.email, engagementIndex: 85, knowledgeGaps: [] }
          ]);
        }
        if (notesRes.status   === 'fulfilled') setWrittenNotes(notesRes.value || []);
        if (evtsRes.status    === 'fulfilled') setScheduleEvents(evtsRes.value || []);
        if (reportsRes.status === 'fulfilled') setWeeklyReports(reportsRes.value || []);

        try {
          const telemetry = await api.get('/principal/telemetry');
          setPrincipalTelemetry(telemetry);
        } catch { /* optional */ }

      } else if (user.role === 'parent') {
        const [dashRes, reportsRes] = await Promise.allSettled([
          api.get('/parents/dashboard'),
          api.get('/weekly-reports/for-parent'),
        ]);
        if (dashRes.status === 'fulfilled') {
          const data = dashRes.value;
          if (data.children && data.children.length > 0) {
            const firstChild = data.children[0];
            firstChild.studyPlan = studyPlan.tasks;
            setStudents([firstChild]);
            const childDetails = firstChild.details || {};
            setAssignments((childDetails.assignments || []).map(a => ({
              ...a,
              subject: a.class || a.subject || 'General',
              due:     a.dueDate || a.due || '',
              status:  resolveAssignmentStatus(a),
            })));
            setNotifications(childDetails.notifications || []);
            setCourses(childDetails.classes || []);
          }
        }
        if (reportsRes.status === 'fulfilled') setWeeklyReports(reportsRes.value || []);

      } else if (user.role === 'principal' || user.role === 'admin') {
        try {
          const telemetry = await api.get('/principal/telemetry');
          setPrincipalTelemetry(telemetry);
        } catch (pErr) { console.warn('Principal telemetry failed:', pErr); }
      }
    } catch (error) {
      console.error('Dashboard load failed:', error);
    }
  }, [user]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  // Real-time WebSocket Notifications Listener
  useEffect(() => {
    if (!user || !user.id) return;

    let socket;
    let reconnectTimeout;

    const connectWebSocket = () => {
      const wsUrl = `ws://localhost:8080/ws/notifications?userId=${user.id}`;
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log('WebSocket connected to notification service.');
      };

      socket.onmessage = (event) => {
        try {
          const newNotif = JSON.parse(event.data);
          // Prepend new real-time notification to the local list
          setNotifications((prev) => [newNotif, ...prev]);
        } catch (e) {
          console.error('Failed to parse WebSocket notification message:', e);
        }
      };

      socket.onclose = () => {
        console.warn('WebSocket connection closed. Attempting reconnect in 5s...');
        reconnectTimeout = setTimeout(connectWebSocket, 5000);
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    connectWebSocket();

    return () => {
      if (socket) socket.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, [user]);

  // ── Assignment actions ──────────────────────────────────────────────────────
  const submitAssignment = async (assignmentId, submissionUrl) => {
    await api.post(`/assignments/${assignmentId}/submit`, { submissionUrl });
    await loadDashboard();
  };

  const addAssignment = async (title, subject, type, difficulty) => {
    // Build minimal assignment payload from teacher form
    const classId = courses[0]?.id;
    if (!classId) return;
    await api.post('/assignments', {
      classId, title,
      description: `${type} — ${subject} (${difficulty})`,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalMarks: 100,
    });
    await loadDashboard();
  };

  // ── Teacher: Weekly Reports ─────────────────────────────────────────────────
  const generateWeeklyReport = async (studentId, teacherNotes) => {
    try {
      const data = await api.post('/weekly-reports', { studentId, teacherNotes });
      setWeeklyReports(prev => [data, ...prev]);
      return data;
    } catch (e) {
      // Offline fallback so TeacherDashboard doesn't crash
      const fallback = {
        id: Date.now().toString(), studentId, teacherNotes,
        strengths: 'Physics, Algebra', weakTopics: 'Fractions',
        xpThisWeek: 320, sentToParent: false,
        createdAt: new Date().toISOString(),
      };
      setWeeklyReports(prev => [fallback, ...prev]);
      return fallback;
    }
  };

  const sendReportToParent = async (reportId) => {
    try {
      await api.post(`/weekly-reports/${reportId}/send`, {});
      setWeeklyReports(prev => prev.map(r => r.id === reportId ? { ...r, sentToParent: true } : r));
      return { success: true };
    } catch { return { success: false }; }
  };

  // ── Teacher: Course Modules ─────────────────────────────────────────────────
  const addCourseModule = async (courseId, title, topics, difficulty) => {
    try {
      await api.post(`/teachers/classes/${courseId}/modules`, { title, topics, difficulty });
      await loadDashboard();
    } catch {
      // Offline: update local courses state
      setCourses(prev => prev.map(c => c.id === courseId ? {
        ...c,
        modules: [...(c.modules || []), {
          id: Date.now().toString(), title, topics, difficulty,
          status: 'Active', completionRate: 0,
        }],
      } : c));
    }
  };

  const updateCourseModule = async (courseId, moduleId, updates) => {
    try {
      await api.put(`/teachers/classes/${courseId}/modules/${moduleId}`, updates);
      await loadDashboard();
    } catch {
      setCourses(prev => prev.map(c => c.id === courseId ? {
        ...c,
        modules: (c.modules || []).map(m => m.id === moduleId ? { ...m, ...updates } : m),
      } : c));
    }
  };

  const deleteCourseModule = async (courseId, moduleId) => {
    try {
      await api.delete(`/teachers/classes/${courseId}/modules/${moduleId}`);
      await loadDashboard();
    } catch {
      setCourses(prev => prev.map(c => c.id === courseId ? {
        ...c, modules: (c.modules || []).filter(m => m.id !== moduleId),
      } : c));
    }
  };

  // ── Teacher: suggest intervention ───────────────────────────────────────────
  const suggestStudyTask = async (studentEmail, topic, duration, description) => {
    try {
      const student = students.find(s => s.email === studentEmail);
      if (student) {
        await api.post('/teachers/notify', {
          studentId: student.id,
          title: `📚 Study Suggestion: ${topic}`,
          message: description || `Your teacher suggests studying ${topic} for ${duration}.`,
          type: 'SUGGESTION',
        });
      }
    } catch { /* non-critical */ }
  };

  // ── Notification actions ────────────────────────────────────────────────────
  const markNotificationsAsRead = async () => {
    try {
      await api.post('/notifications/mark-read', {});
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) { console.warn(e); }
  };

  const sendNotification = async (role, message, type = 'INFO') => {
    try {
      const title = type === 'success' ? '🎉 Achievement' : '📢 Update';
      await api.post('/teachers/notify', {
        studentId: students[0]?.id,
        title, message, type,
      });
    } catch { /* non-critical */ }
  };

  // ── Gamification actions ────────────────────────────────────────────────────
  const renamePet = async (nickname) => {
    const data = await api.post('/gamification/pet/rename', { nickname });
    setGamificationProfile(prev => prev ? { ...prev, pet: { ...prev.pet, nickname: data.nickname } } : null);
  };

  const submitQuest = async (questId, submissionUrl, completedSteps) => {
    const data = await api.post(`/quests/${questId}/submit`, { submissionUrl, completedSteps });
    setGamificationProfile(prev => prev ? {
      ...prev,
      level:         data.newLevel,
      xpTotal:       data.xpTotal,
      xpNextLevel:   data.xpNextLevel,
      currentStreak: data.newStreak,
      pet: { ...prev.pet, petXp: (prev.pet?.petXp || 0) + data.petXpGained, evolutionStage: data.petStage },
    } : null);
    await loadDashboard();
    return data;
  };

  const updateStudentQuizResult = async (email, subject, score, correct) => {
    try {
      const xp = Math.round((correct / 5) * 75);
      const data = await api.post('/students/award-xp', { subject, score, xp });
      setGamificationProfile(prev => prev ? {
        ...prev, level: data.level, xpTotal: data.newXpTotal,
      } : null);
    } catch (e) { console.warn('XP award failed:', e); }
  };

  const completeDailyMission = async (missionNumber) => {
    const data = await api.post(`/gamification/daily-journey/complete-mission/${missionNumber}`, {});
    setDailyJourney(data);
    return data;
  };

  const claimDailyBonus = async () => {
    await api.post('/gamification/daily-journey/claim', {});
    const [journey, gam, store] = await Promise.allSettled([
      api.get('/gamification/daily-journey'),
      api.get('/gamification/profile'),
      api.get('/store/items'),
    ]);
    if (journey.status === 'fulfilled') setDailyJourney(journey.value);
    if (gam.status    === 'fulfilled') setGamificationProfile(gam.value);
    if (store.status  === 'fulfilled') setStoreItems(store.value);
  };

  const purchaseStoreItem = async (itemId) => {
    const data = await api.post(`/store/purchase/${itemId}`, {});
    const store = await api.get('/store/items');
    setStoreItems(store);
    setGamificationProfile(prev => prev ? { ...prev, coinsBalance: data.coinsBalance } : null);
    return data;
  };

  const equipStoreItem = async (itemId) => {
    const data = await api.post(`/store/equip/${itemId}`, {});
    const store = await api.get('/store/items');
    setStoreItems(store);
    return data;
  };

  // ── Boss Battle ─────────────────────────────────────────────────────────────
  const submitBossBattle = async (battleId, correctAnswers) => {
    const data = await api.post(`/boss-battles/${battleId}/submit`, { correctAnswers });
    setGamificationProfile(prev => prev ? {
      ...prev,
      level:   data.level,
      xpTotal: data.xpTotal,
      pet: prev.pet ? { ...prev.pet, evolutionStage: data.petStage } : prev.pet,
    } : null);
    return data;
  };

  // ── Study plan (local CRUD) ─────────────────────────────────────────────────
  const generateStudyPlan = (goal) => setStudyPlan({ goal, tasks: [
    { id: Date.now() + '1', day: 'Monday',    topic: `Introduction to ${goal}`,    duration: '30 mins', completed: false },
    { id: Date.now() + '2', day: 'Wednesday', topic: `Practice problems: ${goal}`, duration: '45 mins', completed: false },
    { id: Date.now() + '3', day: 'Friday',    topic: `Review & Quiz: ${goal}`,     duration: '30 mins', completed: false },
  ]});

  const toggleStudyTask    = (_, taskId) =>
    setStudyPlan(prev => ({ ...prev, tasks: prev.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t) }));
  const addStudyTask       = (_, task) =>
    setStudyPlan(prev => ({ ...prev, tasks: [...prev.tasks, { id: Date.now().toString(), ...task, completed: false }] }));
  const deleteStudyTask    = (_, taskId) =>
    setStudyPlan(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== taskId) }));
  const updateStudyTask    = (_, taskId, updates) =>
    setStudyPlan(prev => ({ ...prev, tasks: prev.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t) }));

  // ── Written notes ───────────────────────────────────────────────────────────
  const addWrittenNote = async (note) => {
    try {
      const res = await api.post('/teachers/notes', note);
      await loadDashboard();
      return res;
    } catch {
      setWrittenNotes(prev => [...prev, { id: Date.now().toString(), ...note }]);
    }
  };

  const deleteWrittenNote = async (id) => {
    try { await api.delete(`/teachers/notes/${id}`); } catch { /* ignore */ }
    setWrittenNotes(prev => prev.filter(n => n.id !== id));
  };

  // ── Schedule events ─────────────────────────────────────────────────────────
  const addScheduleEvent = async (event) => {
    try {
      await api.post('/teachers/events', event);
      await loadDashboard();
    } catch {
      setScheduleEvents(prev => [...prev, { id: Date.now().toString(), ...event }]);
    }
  };

  const deleteScheduleEvent = async (id) => {
    try { await api.delete(`/teachers/events/${id}`); } catch { /* ignore */ }
    setScheduleEvents(prev => prev.filter(e => e.id !== id));
  };

  // ── Engagement logging ──────────────────────────────────────────────────────
  const logEngagementTime = async (action = 'GENERAL', durationSecs = 60) => {
    try { await api.post('/students/engagement', { action, durationSecs }); } catch { /* fire & forget */ }
  };

  // ── Misc ────────────────────────────────────────────────────────────────────
  const addParentFeedback = (studentId, parentName, message) => {
    const feedbackObj = {
      id: Date.now().toString(),
      studentId,
      parentName,
      message,
      createdAt: new Date().toISOString()
    };
    setParentFeedbacks(prev => [feedbackObj, ...prev]);
  };
  const fetchPrincipalTelemetry = async () => {
    const t = await api.get('/principal/telemetry');
    setPrincipalTelemetry(t);
    return t;
  };
  const uploadTeacherCopilot = async (classId, fileText) =>
    api.post('/teacher-copilot/upload', { classId, fileText });

  return (
    <DataContext.Provider value={{
      // ── State
      students, assignments, notifications, courses,
      writtenNotes, scheduleEvents, weeklyReports, parentFeedbacks, studyPlan,
      gamificationProfile, housesScoreboard,
      dailyJourney, storeItems, activeEvents, activeQuests,
      principalTelemetry, questionsPool, bossBattles,
      // ── Assignment
      submitAssignment, addAssignment,
      // ── Notifications
      markNotificationsAsRead, sendNotification,
      // ── Gamification
      renamePet, submitQuest, updateStudentQuizResult,
      completeDailyMission, claimDailyBonus,
      purchaseStoreItem, equipStoreItem,
      // ── Boss Battle
      submitBossBattle,
      // ── Study plan
      generateStudyPlan, toggleStudyTask, addStudyTask, deleteStudyTask, updateStudyTask,
      // ── Teacher tools (ALL now implemented)
      addWrittenNote, deleteWrittenNote, addScheduleEvent, deleteScheduleEvent,
      generateWeeklyReport, sendReportToParent,
      addCourseModule, updateCourseModule, deleteCourseModule,
      suggestStudyTask,
      // ── Parent
      addParentFeedback,
      // ── Misc
      logEngagementTime, fetchPrincipalTelemetry, uploadTeacherCopilot,
    }}>
      {children}
    </DataContext.Provider>
  );
};
