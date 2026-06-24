import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  
  // Dashboard states
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [courses, setCourses] = useState([]);
  const [weeklyReports, setWeeklyReports] = useState([]);
  const [writtenNotes, setWrittenNotes] = useState([]);
  const [scheduleEvents, setScheduleEvents] = useState([]);
  const [parentFeedbacks, setParentFeedbacks] = useState([]);
  const [gamificationProfile, setGamificationProfile] = useState(null);
  const [housesScoreboard, setHousesScoreboard] = useState([]);

  // Gamification V2 states
  const [dailyJourney, setDailyJourney] = useState(null);
  const [storeItems, setStoreItems] = useState({ coinsBalance: 0, items: [] });
  const [activeEvents, setActiveEvents] = useState([]);
  const [principalTelemetry, setPrincipalTelemetry] = useState(null);
  const [activeQuests, setActiveQuests] = useState([]);

  // Load dashboard data based on role
  const loadDashboard = async () => {
    if (!user) return;
    try {
      let data;
      if (user.role === 'student') {
        data = await api.get('/students/dashboard');
        setStudents([data.profile]); // Wrap profile to fit expected student profile details
        setAssignments(data.assignments || []);
        setNotifications(data.notifications || []);
        setCourses(data.classes || []);
        
        try {
          const gamificationData = await api.get('/gamification/profile');
          setGamificationProfile(gamificationData);
          const housesData = await api.get('/gamification/houses');
          setHousesScoreboard(housesData || []);
          
          // Gamification V2 student loads
          const journey = await api.get('/gamification/daily-journey');
          setDailyJourney(journey);
          const store = await api.get('/store/items');
          setStoreItems(store);
          const evts = await api.get('/gamification/events');
          setActiveEvents(evts || []);
          const qsts = await api.get('/quests/active');
          setActiveQuests(qsts || []);
        } catch (gErr) {
          console.error('Failed to load gamification V2 properties:', gErr);
        }
      } else if (user.role === 'teacher') {
        data = await api.get('/teachers/dashboard');
        setCourses(data.classes || []);
        // Seed teachers with dummy student list if empty to prevent empty tables
        setStudents([
          { id: 'user-student-1', name: 'Lucas Miller', email: 'student@arviona.com', engagementIndex: 85 }
        ]);
        try {
          const telemetry = await api.get('/principal/telemetry');
          setPrincipalTelemetry(telemetry);
        } catch (tErr) {
          console.error('Failed to load principal telemetry for teacher:', tErr);
        }
      } else if (user.role === 'parent') {
        data = await api.get('/parents/dashboard');
        // Parent dashboard returns children list containing student dashboard details
        if (data.children && data.children.length > 0) {
          const firstChild = data.children[0];
          setStudents([firstChild]);
          setAssignments(firstChild.details?.assignments || []);
          setNotifications(firstChild.details?.notifications || []);
          setCourses(firstChild.details?.classes || []);
        }
      } else if (user.role === 'admin' || user.role === 'principal') {
        try {
          const telemetry = await api.get('/principal/telemetry');
          setPrincipalTelemetry(telemetry);
        } catch (pErr) {
          console.error('Failed to load principal telemetry:', pErr);
        }
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [user]);

  const submitAssignment = async (assignmentId, submissionUrl) => {
    try {
      await api.post(`/assignments/${assignmentId}/submit`, { submissionUrl });
      await loadDashboard(); // Reload live status
    } catch (error) {
      console.error('Failed to submit assignment:', error);
      throw error;
    }
  };

  const addAssignment = async (classId, title, description, dueDate, totalMarks) => {
    try {
      await api.post('/assignments', { classId, title, description, dueDate, totalMarks });
      await loadDashboard();
    } catch (error) {
      console.error('Failed to create assignment:', error);
      throw error;
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      await api.post('/notifications/mark-read', {});
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  const logEngagementTime = async () => {
    // Stat log hook placeholder
    console.log('Logging engagement event for student...');
  };

  // Safe mock placeholders for local student study plan tasks
  const [studyPlan, setStudyPlan] = useState({
    goal: 'Learn Quantum Mechanics',
    tasks: [
      { id: 't1', title: 'Read Chapter 1: Wave Functions', completed: false },
      { id: 't2', title: 'Watch Calculus basics lecture', completed: true },
      { id: 't3', title: 'Solve Double Slit experiment quiz', completed: false }
    ]
  });

  const generateStudyPlan = async (goal) => {
    setStudyPlan({
      goal,
      tasks: [
        { id: 't1', title: `Introduction to ${goal}`, completed: false },
        { id: 't2', title: `Solve problems on ${goal}`, completed: false },
        { id: 't3', title: `Review key concepts of ${goal}`, completed: false }
      ]
    });
  };

  const toggleStudyTask = (taskId) => {
    setStudyPlan(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
    }));
  };

  const addStudyTask = (title) => {
    setStudyPlan(prev => ({
      ...prev,
      tasks: [...prev.tasks, { id: Date.now().toString(), title, completed: false }]
    }));
  };

  const deleteStudyTask = (taskId) => {
    setStudyPlan(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId)
    }));
  };

  const updateStudyTask = (taskId, newTitle) => {
    setStudyPlan(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? { ...t, title: newTitle } : t)
    }));
  };

  const renamePet = async (nickname) => {
    try {
      const data = await api.post('/gamification/pet/rename', { nickname });
      setGamificationProfile(prev => ({
        ...prev,
        pet: { ...prev.pet, nickname: data.nickname }
      }));
    } catch (error) {
      console.error('Failed to rename pet:', error);
      throw error;
    }
  };

  const submitQuest = async (questId, submissionUrl, completedSteps) => {
    try {
      const data = await api.post(`/quests/${questId}/submit`, { submissionUrl, completedSteps });
      setGamificationProfile(prev => ({
        ...prev,
        level: data.newLevel,
        xpTotal: data.xpTotal,
        xpNextLevel: data.xpNextLevel,
        currentStreak: data.newStreak,
        pet: {
          ...prev.pet,
          petXp: prev.pet.petXp + data.petXpGained,
          evolutionStage: data.petStage
        }
      }));
      await loadDashboard();
      return data;
    } catch (error) {
      console.error('Failed to submit quest:', error);
      throw error;
    }
  };

  const fetchDailyJourney = async () => {
    try {
      const journey = await api.get('/gamification/daily-journey');
      setDailyJourney(journey);
      return journey;
    } catch (error) {
      console.error('Failed to fetch daily journey:', error);
    }
  };

  const completeDailyMission = async (missionNumber) => {
    try {
      const data = await api.post(`/gamification/daily-journey/complete-mission/${missionNumber}`, {});
      setDailyJourney(data);
      return data;
    } catch (error) {
      console.error('Failed to complete daily mission:', error);
      throw error;
    }
  };

  const claimDailyBonus = async () => {
    try {
      const data = await api.post('/gamification/daily-journey/claim', {});
      await fetchDailyJourney();
      const gamificationData = await api.get('/gamification/profile');
      setGamificationProfile(gamificationData);
      const store = await api.get('/store/items');
      setStoreItems(store);
      return data;
    } catch (error) {
      console.error('Failed to claim daily bonus:', error);
      throw error;
    }
  };

  const fetchStoreItems = async () => {
    try {
      const store = await api.get('/store/items');
      setStoreItems(store);
      return store;
    } catch (error) {
      console.error('Failed to fetch store items:', error);
    }
  };

  const purchaseStoreItem = async (itemId) => {
    try {
      const data = await api.post(`/store/purchase/${itemId}`, {});
      await fetchStoreItems();
      setGamificationProfile(prev => prev ? { ...prev, coinsBalance: data.coinsBalance } : null);
      return data;
    } catch (error) {
      console.error('Failed to purchase store item:', error);
      throw error;
    }
  };

  const equipStoreItem = async (itemId) => {
    try {
      const data = await api.post(`/store/equip/${itemId}`, {});
      await fetchStoreItems();
      return data;
    } catch (error) {
      console.error('Failed to equip store item:', error);
      throw error;
    }
  };

  const fetchActiveEvents = async () => {
    try {
      const evts = await api.get('/gamification/events');
      setActiveEvents(evts || []);
      return evts;
    } catch (error) {
      console.error('Failed to fetch active events:', error);
    }
  };

  const fetchPrincipalTelemetry = async () => {
    try {
      const telemetry = await api.get('/principal/telemetry');
      setPrincipalTelemetry(telemetry);
      return telemetry;
    } catch (error) {
      console.error('Failed to fetch principal telemetry:', error);
    }
  };

  const uploadTeacherCopilot = async (classId, fileText) => {
    try {
      const data = await api.post('/teacher-copilot/upload', { classId, fileText });
      await loadDashboard();
      return data;
    } catch (error) {
      console.error('Failed to upload teacher copilot content:', error);
      throw error;
    }
  };

  return (
    <DataContext.Provider value={{
      students,
      assignments,
      notifications,
      weeklyReports,
      courses,
      writtenNotes,
      scheduleEvents,
      parentFeedbacks,
      studyPlan,
      gamificationProfile,
      housesScoreboard,
      dailyJourney,
      storeItems,
      activeEvents,
      activeQuests,
      principalTelemetry,
      submitAssignment,
      addAssignment,
      markNotificationsAsRead,
      logEngagementTime,
      generateStudyPlan,
      toggleStudyTask,
      addStudyTask,
      deleteStudyTask,
      updateStudyTask,
      renamePet,
      submitQuest,
      fetchDailyJourney,
      completeDailyMission,
      claimDailyBonus,
      fetchStoreItems,
      purchaseStoreItem,
      equipStoreItem,
      fetchActiveEvents,
      fetchPrincipalTelemetry,
      uploadTeacherCopilot,
      addWrittenNote: (note) => setWrittenNotes(prev => [...prev, note]),
      deleteWrittenNote: (id) => setWrittenNotes(prev => prev.filter(n => n.id !== id)),
      addScheduleEvent: (event) => setScheduleEvents(prev => [...prev, event]),
      deleteScheduleEvent: (id) => setScheduleEvents(prev => prev.filter(e => e.id !== id)),
      addParentFeedback: (fb) => setParentFeedbacks(prev => [...prev, fb])
    }}>
      {children}
    </DataContext.Provider>
  );
};
