import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const DataContext = createContext();
export const useData = () => useContext(DataContext);

// ── Helpers ──────────────────────────────────────────────────────────────────
// Map backend assignment shape → frontend status string
const resolveAssignmentStatus = (a) => {
  if (a.marksObtained !== null && a.marksObtained !== undefined) return 'Graded';
  if (a.submitted) return 'Submitted';
  return 'Pending';
};

export const DataProvider = ({ children }) => {
  const { user } = useAuth();

  // ── Core state ─────────────────────────────────────────────────────────────
  const [students,        setStudents]        = useState([]);
  const [assignments,     setAssignments]     = useState([]);
  const [notifications,   setNotifications]   = useState([]);
  const [courses,         setCourses]         = useState([]);
  const [writtenNotes,    setWrittenNotes]     = useState([]);
  const [scheduleEvents,  setScheduleEvents]   = useState([]);
  const [gamificationProfile, setGamificationProfile] = useState(null);
  const [housesScoreboard,    setHousesScoreboard]     = useState([]);
  const [questionsPool,   setQuestionsPool]   = useState({});
  const [bossBattles,     setBossBattles]     = useState([]);

  // ── Gamification V2 state ──────────────────────────────────────────────────
  const [dailyJourney,      setDailyJourney]      = useState(null);
  const [storeItems,        setStoreItems]         = useState({ coinsBalance: 0, items: [] });
  const [activeEvents,      setActiveEvents]       = useState([]);
  const [activeQuests,      setActiveQuests]       = useState([]);
  const [principalTelemetry, setPrincipalTelemetry] = useState(null);

  // ── Local study plan (kept local for snappy UX; synced to backend) ─────────
  const [studyPlan, setStudyPlan] = useState({
    goal: 'Master your subjects',
    tasks: [
      { id: 't1', day: 'Monday',    topic: 'Review Wave-Particle Duality',   duration: '30 mins', completed: false },
      { id: 't2', day: 'Tuesday',   topic: 'Solve Calculus derivatives quiz', duration: '45 mins', completed: false },
      { id: 't3', day: 'Wednesday', topic: 'AI Tutor: Thermodynamics gaps',   duration: '20 mins', completed: true  },
    ],
  });

  // ── Dashboard loader ───────────────────────────────────────────────────────
  const loadDashboard = useCallback(async () => {
    if (!user) return;
    try {
      if (user.role === 'student') {
        const data = await api.get('/students/dashboard');

        // Build a student profile object that matches what StudentDashboard expects
        const profile = data.profile || {};
        setStudents([{
          id:      profile.id      || user.id,
          name:    profile.name    || user.name,
          email:   profile.email   || user.email,
          xp:      0,
          streak:  0,
          grade:   'A',
          subject: 'Physics',
        }]);

        // Normalize assignment statuses
        const rawAssignments = data.assignments || [];
        setAssignments(rawAssignments.map(a => ({
          ...a,
          subject: a.class || a.subject || 'General',
          due:     a.dueDate || a.due || '',
          status:  resolveAssignmentStatus(a),
        })));

        setNotifications((data.notifications || []).map(n => ({
          ...n,
          read: n.read ?? n.readStatus ?? false,
        })));
        setCourses(data.classes || []);

        // Gamification
        try {
          const [gam, houses, journey, store, evts, quests, pool, battles] = await Promise.allSettled([
            api.get('/gamification/profile'),
            api.get('/gamification/houses'),
            api.get('/gamification/daily-journey'),
            api.get('/store/items'),
            api.get('/gamification/events'),
            api.get('/quests/active'),
            api.get('/quests/pool'),
            api.get('/boss-battles'),
          ]);

          if (gam.status === 'fulfilled')     setGamificationProfile(gam.value);
          if (houses.status === 'fulfilled')  setHousesScoreboard(houses.value || []);
          if (journey.status === 'fulfilled') setDailyJourney(journey.value);
          if (store.status === 'fulfilled')   setStoreItems(store.value || { coinsBalance: 0, items: [] });
          if (evts.status === 'fulfilled')    setActiveEvents(evts.value || []);
          if (quests.status === 'fulfilled')  setActiveQuests(quests.value || []);
          if (pool.status === 'fulfilled')    setQuestionsPool(pool.value || {});
          if (battles.status === 'fulfilled') setBossBattles(battles.value || []);
        } catch (gErr) {
          console.warn('Gamification partial load error:', gErr);
        }

      } else if (user.role === 'teacher') {
        const [dashRes, notesRes, evtsRes] = await Promise.allSettled([
          api.get('/teachers/dashboard'),
          api.get('/teachers/notes'),
          api.get('/teachers/events'),
        ]);

        if (dashRes.status === 'fulfilled') {
          const data = dashRes.value;
          setCourses(data.classes || []);
          // Build student list from classes
          const allStudents = [];
          (data.classes || []).forEach(cls => {
            if (cls.students) allStudents.push(...cls.students);
          });
          setStudents(allStudents.length > 0 ? allStudents : [
            { id: user.id, name: user.name, email: user.email, engagementIndex: 85 }
          ]);
        }
        if (notesRes.status === 'fulfilled') setWrittenNotes(notesRes.value || []);
        if (evtsRes.status === 'fulfilled')  setScheduleEvents(evtsRes.value || []);

        // Principal telemetry (teachers also see this)
        try {
          const telemetry = await api.get('/principal/telemetry');
          setPrincipalTelemetry(telemetry);
        } catch { /* optional */ }

      } else if (user.role === 'parent') {
        const data = await api.get('/parents/dashboard');
        if (data.children && data.children.length > 0) {
          const firstChild = data.children[0];
          const childDetails = firstChild.details || {};
          setStudents([firstChild]);
          const rawAssignments = childDetails.assignments || [];
          setAssignments(rawAssignments.map(a => ({
            ...a,
            subject: a.class || a.subject || 'General',
            due:     a.dueDate || a.due || '',
            status:  resolveAssignmentStatus(a),
          })));
          setNotifications(childDetails.notifications || []);
          setCourses(childDetails.classes || []);
        }

      } else if (user.role === 'principal' || user.role === 'admin') {
        try {
          const telemetry = await api.get('/principal/telemetry');
          setPrincipalTelemetry(telemetry);
        } catch (pErr) {
          console.warn('Principal telemetry failed:', pErr);
        }
      }
    } catch (error) {
      console.error('Dashboard load failed:', error);
    }
  }, [user]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  // ── Assignment actions ─────────────────────────────────────────────────────
  const submitAssignment = async (assignmentId, submissionUrl) => {
    await api.post(`/assignments/${assignmentId}/submit`, { submissionUrl });
    await loadDashboard();
  };

  const addAssignment = async (classId, title, description, dueDate, totalMarks) => {
    await api.post('/assignments', { classId, title, description, dueDate, totalMarks });
    await loadDashboard();
  };

  // ── Notification actions ───────────────────────────────────────────────────
  const markNotificationsAsRead = async () => {
    try {
      await api.post('/notifications/mark-read', {});
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) { console.warn(e); }
  };

  const sendNotification = async (role, message, type = 'INFO') => {
    // For teacher sending to a student — payload must include studentId
    try {
      if (role && role !== 'student') return; // only student notifications wired for now
      const title = type === 'success' ? '🎉 Achievement' : '📢 Update';
      await api.post('/teachers/notify', {
        studentId: students[0]?.id,
        title,
        message,
        type,
      });
    } catch { /* non-critical */ }
  };

  // ── Gamification actions ───────────────────────────────────────────────────
  const renamePet = async (nickname) => {
    const data = await api.post('/gamification/pet/rename', { nickname });
    setGamificationProfile(prev => prev ? { ...prev, pet: { ...prev.pet, nickname: data.nickname } } : null);
  };

  const submitQuest = async (questId, submissionUrl, completedSteps) => {
    const data = await api.post(`/quests/${questId}/submit`, { submissionUrl, completedSteps });
    setGamificationProfile(prev => prev ? {
      ...prev,
      level:   data.newLevel,
      xpTotal: data.xpTotal,
      xpNextLevel: data.xpNextLevel,
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
        ...prev,
        level:   data.level,
        xpTotal: data.newXpTotal,
      } : null);
    } catch (e) { console.warn('XP award failed:', e); }
  };

  const completeDailyMission = async (missionNumber) => {
    const data = await api.post(`/gamification/daily-journey/complete-mission/${missionNumber}`, {});
    setDailyJourney(data);
    return data;
  };

  const claimDailyBonus = async () => {
    const data = await api.post('/gamification/daily-journey/claim', {});
    const [journey, gam, store] = await Promise.allSettled([
      api.get('/gamification/daily-journey'),
      api.get('/gamification/profile'),
      api.get('/store/items'),
    ]);
    if (journey.status === 'fulfilled') setDailyJourney(journey.value);
    if (gam.status === 'fulfilled')    setGamificationProfile(gam.value);
    if (store.status === 'fulfilled')  setStoreItems(store.value);
    return data;
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

  // ── Boss Battle actions ────────────────────────────────────────────────────
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

  // ── Study plan (local CRUD, no backend yet) ────────────────────────────────
  const generateStudyPlan = (goal) => {
    setStudyPlan({ goal, tasks: [
      { id: Date.now() + '1', day: 'Monday',    topic: `Introduction to ${goal}`,    duration: '30 mins', completed: false },
      { id: Date.now() + '2', day: 'Wednesday', topic: `Practice problems: ${goal}`, duration: '45 mins', completed: false },
      { id: Date.now() + '3', day: 'Friday',    topic: `Review & Quiz: ${goal}`,     duration: '30 mins', completed: false },
    ]});
  };

  const toggleStudyTask = (studentEmail, taskId) =>
    setStudyPlan(prev => ({ ...prev, tasks: prev.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t) }));

  const addStudyTask = (studentEmail, task) =>
    setStudyPlan(prev => ({ ...prev, tasks: [...prev.tasks, { id: Date.now().toString(), ...task, completed: false }] }));

  const deleteStudyTask = (studentEmail, taskId) =>
    setStudyPlan(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== taskId) }));

  const updateStudyTask = (studentEmail, taskId, updates) =>
    setStudyPlan(prev => ({ ...prev, tasks: prev.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t) }));

  // ── Written notes (teacher) ────────────────────────────────────────────────
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
    try {
      await api.delete(`/teachers/notes/${id}`);
      setWrittenNotes(prev => prev.filter(n => n.id !== id));
    } catch {
      setWrittenNotes(prev => prev.filter(n => n.id !== id));
    }
  };

  // ── Schedule events (teacher) ──────────────────────────────────────────────
  const addScheduleEvent = async (event) => {
    try {
      await api.post('/teachers/events', event);
      await loadDashboard();
    } catch {
      setScheduleEvents(prev => [...prev, { id: Date.now().toString(), ...event }]);
    }
  };

  const deleteScheduleEvent = async (id) => {
    try {
      await api.delete(`/teachers/events/${id}`);
      setScheduleEvents(prev => prev.filter(e => e.id !== id));
    } catch {
      setScheduleEvents(prev => prev.filter(e => e.id !== id));
    }
  };

  // ── Misc ───────────────────────────────────────────────────────────────────
  const logEngagementTime = () => {};
  const addParentFeedback = (fb) => {};
  const fetchPrincipalTelemetry = async () => {
    const t = await api.get('/principal/telemetry');
    setPrincipalTelemetry(t);
    return t;
  };
  const uploadTeacherCopilot = async (classId, fileText) =>
    api.post('/teacher-copilot/upload', { classId, fileText });

  return (
    <DataContext.Provider value={{
      // State
      students, assignments, notifications, courses,
      writtenNotes, scheduleEvents, studyPlan,
      gamificationProfile, housesScoreboard,
      dailyJourney, storeItems, activeEvents, activeQuests,
      principalTelemetry, questionsPool, bossBattles,
      // Assignment
      submitAssignment, addAssignment,
      // Notifications
      markNotificationsAsRead, sendNotification,
      // Gamification
      renamePet, submitQuest, updateStudentQuizResult,
      completeDailyMission, claimDailyBonus,
      purchaseStoreItem, equipStoreItem,
      // Boss Battle
      submitBossBattle,
      // Study plan
      generateStudyPlan, toggleStudyTask, addStudyTask, deleteStudyTask, updateStudyTask,
      // Teacher tools
      addWrittenNote, deleteWrittenNote, addScheduleEvent, deleteScheduleEvent,
      addParentFeedback,
      // Misc
      logEngagementTime, fetchPrincipalTelemetry, uploadTeacherCopilot,
    }}>
      {children}
    </DataContext.Provider>
  );
};
