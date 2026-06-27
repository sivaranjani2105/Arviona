import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  LayoutDashboard, BookOpen, FileText, Brain, Award, User, 
  LogOut, Bell, Search, PlayCircle, Clock, X, Send, 
  CheckCircle2, AlertTriangle, Book, Flame, Trophy, Sparkles, CheckSquare, Plus, Activity,
  Trash2, Edit, Calendar, Download, ArrowLeft, Check, Play, Pause, Star
} from 'lucide-react';

const CLASSROOM_TOPICS = [
  {
    chapter: 'Chapter 1: Quantum Foundations',
    chapterTitle: 'Quantum Foundations',
    tag: 'CHAPTER 1',
    items: [
      { id: 'Wave-Particle Duality', label: 'Wave-Particle Duality', desc: 'Explore the particle-wave interface duality concept.', duration: '4 min' },
      { id: 'Wave Function & Born Rule', label: 'Wave Function & Born Rule', desc: 'Understanding the amplitude probabilities vector state.', duration: '5 min' }
    ]
  },
  {
    chapter: 'Chapter 2: Core Principles',
    chapterTitle: 'Core Principles',
    tag: 'CHAPTER 2',
    items: [
      { id: 'Heisenberg Uncertainty', label: 'Heisenberg Uncertainty', desc: 'Fourier trade-offs of physical attributes.', duration: '6 min' },
      { id: 'Quantum Superposition', label: 'Quantum Superposition', desc: 'Simultaneous state dynamics before projection collapse.', duration: '6 min' },
      { id: 'Schrödinger Equation', label: 'Schrödinger Equation', desc: 'Formulate wave mechanics in potential wells.', duration: '8 min' }
    ]
  }
];

const CLASSROOM_CONCEPTS = {
  'Wave-Particle Duality': [
    {
      title: 'What is a Wave?',
      text: 'A wave is a disturbance that propagates through space and time, transferring energy without transferring matter. Waves are characterized by amplitude, wavelength, frequency, and speed. Examples include sound waves, light waves, and water waves. In classical mechanics, wave propagation is continuous and exhibits interference and diffraction patterns.'
    },
    {
      title: 'What is a Particle?',
      text: 'A particle is a localized object that can be described by physical properties such as mass, position, velocity, and charge. Unlike waves, classical particles are discrete and move along defined trajectories. They carry energy and momentum in localized packets. In collision experiments, particles bounce off one another in accordance with conservation laws.'
    },
    {
      title: 'Dual Nature',
      text: 'Wave-particle duality is the fundamental quantum mechanical principle that every particle or quantum entity may be described as either a particle or a wave. It addresses the inadequacy of classical concepts like "particle" or "wave" to fully describe the behavior of quantum-scale objects. Light exhibits wave properties in diffraction and particle properties in the photoelectric effect.'
    },
    {
      title: 'Experimental Evidence',
      text: 'The double-slit experiment is the classic demonstration of wave-particle duality. When individual particles (like electrons or photons) are fired through two slits one at a time, they still construct an interference pattern over time on a detector screen. This proves that each quantum particle propagates as a wave through both slits simultaneously, yet detects as a localized particle.'
    }
  ],
  'Wave Function & Born Rule': [
    {
      title: 'The Wave Function (Ψ)',
      text: 'The wave function is a mathematical description of the quantum state of a physical system. It is a complex-valued probability amplitude, and the absolute square of it describes the probability density of finding a particle at a given point in space.'
    },
    {
      title: 'Born Interpretation',
      text: 'Proposed by Max Born, this rule states that the probability of finding a particle is proportional to the square of the magnitude of its wave function at that point. It bridges the gap between the wave-like description and the particle-like detection.'
    },
    {
      title: 'Normalization',
      text: 'Since the particle must exist somewhere in the universe, the integral of the probability density over all space must equal exactly 1. This mathematical constraint is called normalization.'
    }
  ],
  'Heisenberg Uncertainty': [
    {
      title: 'Uncertainty Principle',
      text: 'Formulated by Werner Heisenberg, this principle asserts a fundamental limit to the precision with which certain pairs of physical properties of a particle, known as complementary variables, such as position (x) and momentum (p), can be known.'
    },
    {
      title: 'Mathematical Formulation',
      text: 'The relation is expressed as Δx * Δp >= ħ / 2, meaning the more precisely the position of some particle is determined, the less precisely its momentum can be known, and vice versa.'
    },
    {
      title: 'Quantum Fluctuations',
      text: 'This uncertainty is not a result of technological measurement limits, but a fundamental characteristic of quantum systems and the wave nature of matter.'
    }
  ],
  'Quantum Superposition': [
    {
      title: 'Principle of Superposition',
      text: 'This principle states that a physical system exists partly in all its theoretically possible states simultaneously; but, when measured, it gives a result corresponding to only one of the possible configurations.'
    },
    {
      title: 'Schrödinger\'s Cat',
      text: 'A famous thought experiment illustrating superposition. A cat in a sealed box can be considered simultaneously both alive and dead until the box is opened and the state is observed.'
    },
    {
      title: 'Quantum Bits (Qubits)',
      text: 'In quantum computing, qubits take advantage of superposition to represent a 0, a 1, or any quantum proportion of both simultaneously, allowing for parallel computations.'
    },
    {
      title: 'Coherence & Decoherence',
      text: 'Coherence is the maintenance of the superposition state. Decoherence occurs when the system interacts with its environment, collapsing the superposition state into a single classical state.'
    }
  ],
  'Schrödinger Equation': [
    {
      title: 'Time-Dependent Equation',
      text: 'The equation developed by Erwin Schrödinger in 1925 that governs the wave function of a quantum-mechanical system. It describes how the quantum state of a physical system changes over time.'
    },
    {
      title: 'Hamiltonian Operator',
      text: 'The Hamiltonian operator (H) represents the total energy of the system (sum of kinetic and potential energy). The Schrödinger equation is mathematically represented as HΨ = EΨ.'
    },
    {
      title: 'Stationary States',
      text: 'States of constant energy that do not change in probability density over time. They are solved using the Time-Independent Schrödinger Equation.'
    },
    {
      title: 'Wavefunction Collapse',
      text: 'The process by which a superposition of states reduces to a single eigenstate due to interaction with an external observer or measurement apparatus.'
    },
    {
      title: 'Tunneling Effect',
      text: 'A quantum phenomenon where a particle penetrates a potential energy barrier that is higher than the particle\'s kinetic energy. This is classically impossible but allowed in quantum mechanics.'
    }
  ]
};

const COURSE_DATA = {
  math: {
    title: 'Advanced Mathematics',
    subjectKey: 'MATH',
    chapterTag: 'CALCULUS FUNDAMENTALS',
    chapters: [
      {
        chapter: 'Chapter 1: Calculus Fundamentals',
        chapterTitle: 'Calculus Fundamentals',
        tag: 'CHAPTER 1',
        items: [
          { id: 'Limits & Continuity', label: 'Limits & Continuity', desc: 'Explore limit laws, one-sided limits, and definition of continuity.', duration: '6 min' },
          { id: 'Derivatives & Rates of Change', label: 'Derivatives & Rates of Change', desc: 'Understanding instantaneous rate of change and basic derivative rules.', duration: '8 min' }
        ]
      },
      {
        chapter: 'Chapter 2: Integration',
        chapterTitle: 'Integration',
        tag: 'CHAPTER 2',
        items: [
          { id: 'Definite Integrals', label: 'Definite Integrals', desc: 'Riemann sums and the fundamental theorem of calculus.', duration: '10 min' },
          { id: 'Integration Techniques', label: 'Integration Techniques', desc: 'Substitution, integration by parts, and trigonometric integration.', duration: '12 min' }
        ]
      }
    ],
    concepts: {
      'Limits & Continuity': [
        {
          title: 'Understanding Limits',
          text: 'The limit of a function is a fundamental concept in calculus concerning the behavior of that function near a particular input. We write lim_{x->c} f(x) = L to mean that f(x) can be made arbitrarily close to L by making x sufficiently close to c. Limits allow us to define derivatives and integrals.'
        },
        {
          title: 'One-Sided Limits',
          text: 'One-sided limits consider the behavior of a function as the input approaches a value either from the left (negative direction) or from the right (positive direction). For a two-sided limit to exist at a point, both one-sided limits must exist and be equal.'
        },
        {
          title: 'Definition of Continuity',
          text: 'A function f(x) is continuous at a point x = c if three conditions are met: f(c) is defined, the limit of f(x) as x approaches c exists, and the limit of f(x) as x approaches c equals f(c). Graphically, a continuous function has no holes, jumps, or vertical asymptotes.'
        }
      ],
      'Derivatives & Rates of Change': [
        {
          title: 'Rate of Change',
          text: 'The derivative represents the instantaneous rate of change of a function with respect to one of its variables. It is geometrically represented as the slope of the tangent line to the graph of the function at a point.'
        },
        {
          title: 'Power and Sum Rules',
          text: 'Basic derivative rules allow us to differentiate polynomial functions without using the limit definition. The Power Rule states that the derivative of x^n is n*x^(n-1). The Sum Rule states that the derivative of a sum of functions is the sum of their derivatives.'
        }
      ],
      'Definite Integrals': [
        {
          title: 'Riemann Sums',
          text: 'A Riemann sum is an approximation of the area under a curve by dividing the region into vertical rectangles. As the width of the rectangles approaches zero, the limit of the Riemann sum defines the definite integral.'
        },
        {
          title: 'Fundamental Theorem of Calculus',
          text: 'The Fundamental Theorem of Calculus establishes a connection between differentiation and integration. It states that if F(x) is an antiderivative of f(x), then the definite integral of f(x) from a to b is equal to F(b) - F(a).'
        }
      ],
      'Integration Techniques': [
        {
          title: 'U-Substitution',
          text: 'Integration by substitution (or u-substitution) is the reverse of the Chain Rule for differentiation. It involves substituting a variable u for a part of the integrand to simplify the integration process.'
        },
        {
          title: 'Integration by Parts',
          text: 'Integration by parts is the reverse of the Product Rule for differentiation. It is mathematically expressed as the integral of u dv equals u*v minus the integral of v du.'
        }
      ]
    }
  },
  physics: {
    title: 'Physics & Science',
    subjectKey: 'PHYSICS',
    chapterTag: 'QUANTUM FOUNDATIONS',
    chapters: CLASSROOM_TOPICS,
    concepts: CLASSROOM_CONCEPTS
  }
};

const StudentDashboard = () => {
  const { user, login, logout } = useAuth();
  const { 
    students, 
    assignments, 
    notifications, 
    questionsPool, 
    updateStudentQuizResult,
    generateStudyPlan,
    toggleStudyTask,
    logEngagementTime,
    submitAssignment,
    markNotificationsAsRead,
    addStudyTask,
    deleteStudyTask,
    updateStudyTask,
    writtenNotes,
    scheduleEvents,
    sendNotification,
    gamificationProfile,
    housesScoreboard,
    renamePet,
    submitQuest,
    dailyJourney,
    storeItems,
    activeEvents,
    activeQuests,
    completeDailyMission,
    claimDailyBonus,
    purchaseStoreItem,
    equipStoreItem
  } = useData();

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  
  // Find current student profile
  const student = students.find(s => s.email === user?.email) || students[0];

  const level = gamificationProfile?.level || 1;
  const xpTotal = gamificationProfile?.xpTotal || student?.xp || 0;
  const xpNextLevel = gamificationProfile?.xpNextLevel || 1000;
  const currentStreak = gamificationProfile?.currentStreak || student?.streak || 0;
  const houseName = gamificationProfile?.house || "None";
  const pet = gamificationProfile?.pet || null;
  const badgesList = gamificationProfile?.badges || [];
  const knowledgeMap = gamificationProfile?.knowledgeMap || [];

  const activeTab = searchParams.get('tab') || 'dashboard';

  // State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiChat, setAiChat] = useState([
    { role: 'assistant', text: `Hi ${student.name}! I'm your AI Study Partner. I noticed you have a gap in Quantum Mechanics. Would you like to study it today?` }
  ]);

  // Interactive Classroom State
  const [selectedCourse, setSelectedCourse] = useState(null); // 'physics' or null
  const [activeTopic, setActiveTopic] = useState('Wave-Particle Duality');
  const [activeConceptIdx, setActiveConceptIdx] = useState(0);
  const [confidenceRatings, setConfidenceRatings] = useState({
    'Wave-Particle Duality-0': 3,
    'Wave-Particle Duality-1': 4,
    'Wave-Particle Duality-2': 3,
    'Wave-Particle Duality-3': 5,
    'Wave Function & Born Rule-0': 3,
    'Wave Function & Born Rule-1': 2,
    'Wave Function & Born Rule-2': 4,
    'Heisenberg Uncertainty-0': 3,
    'Heisenberg Uncertainty-1': 3,
    'Heisenberg Uncertainty-2': 4,
    'Quantum Superposition-0': 4,
    'Quantum Superposition-1': 3,
    'Quantum Superposition-2': 4,
    'Quantum Superposition-3': 5,
    'Schrödinger Equation-0': 2,
    'Schrödinger Equation-1': 3,
    'Schrödinger Equation-2': 4,
    'Schrödinger Equation-3': 3,
    'Schrödinger Equation-4': 5
  });
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0); // 0 to 180 (seconds)
  const [completedConcepts, setCompletedConcepts] = useState({
    'Wave-Particle Duality-0': true,
    'Wave-Particle Duality-2': true,
    'Wave Function & Born Rule-0': true,
    'Quantum Superposition-0': true,
    'Quantum Superposition-1': true
  });

  useEffect(() => {
    let interval = null;
    if (isVideoPlaying) {
      interval = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 180) {
            setIsVideoPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isVideoPlaying]);

  const getCourseProgress = (courseKey) => {
    const courseData = COURSE_DATA[courseKey];
    if (!courseData) return 0;
    const topicsList = courseData.chapters;
    const conceptsList = courseData.concepts;
    let totalConcepts = 0;
    let completedCount = 0;
    topicsList.forEach(ch => {
      ch.items.forEach(item => {
        const itemConcepts = conceptsList[item.id] || [];
        totalConcepts += itemConcepts.length;
        itemConcepts.forEach((_, idx) => {
          if (completedConcepts[`${item.id}-${idx}`]) {
            completedCount++;
          }
        });
      });
    });
    if (totalConcepts === 0) return 0;
    return Math.round((completedCount / totalConcepts) * 100);
  };

  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  
  // Adaptive Quiz State
  const [activeQuiz, setActiveQuiz] = useState(null); // { assignId, subject, questions: [], currentIdx, answers: [], difficulty: 'Medium' }
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  // Simulation State
  const [studySessionTime, setStudySessionTime] = useState(15);
  const [studySubject, setStudySubject] = useState('Quadratic Equations');
  const [studyMessage, setStudyMessage] = useState('');

  // Student Study Plan Modal states
  const [showStudentTaskModal, setShowStudentTaskModal] = useState(false);
  const [studentTaskModalType, setTaskModalType] = useState('create'); // 'create' or 'edit'
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [taskFormTitle, setTaskFormTitle] = useState('');
  const [taskFormDay, setTaskFormDay] = useState('Monday');
  const [taskFormDuration, setTaskFormDuration] = useState('30 mins');
  const [taskFormDescription, setTaskFormDescription] = useState('');

  const handleOpenCreateTask = () => {
    setTaskFormTitle('');
    setTaskFormDay('Monday');
    setTaskFormDuration('30 mins');
    setTaskFormDescription('');
    setTaskModalType('create');
    setShowStudentTaskModal(true);
  };

  const handleOpenEditTask = (task) => {
    setEditingTaskId(task.id || task.day);
    setTaskFormTitle(task.topic);
    setTaskFormDay(task.day);
    setTaskFormDuration(task.duration);
    setTaskFormDescription(task.description || '');
    setTaskModalType('edit');
    setShowStudentTaskModal(true);
  };

  const handleSaveTask = (e) => {
    e.preventDefault();
    if (!taskFormTitle.trim()) return;

    if (studentTaskModalType === 'create') {
      addStudyTask(student.email, {
        day: taskFormDay,
        topic: taskFormTitle,
        duration: taskFormDuration,
        source: 'Custom',
        description: taskFormDescription
      });
    } else {
      updateStudyTask(student.email, editingTaskId, {
        day: taskFormDay,
        topic: taskFormTitle,
        duration: taskFormDuration,
        description: taskFormDescription
      });
    }
    setShowStudentTaskModal(false);
  };

  const handleDeleteTask = (taskId) => {
    if (confirm('Are you sure you want to delete this study task?')) {
      deleteStudyTask(student.email, taskId);
    }
  };

  // Handle Notifications Read
  const handleBellClick = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
    if (!showNotificationDropdown) {
      markNotificationsAsRead('student');
    }
  };

  // Nav Items
  const navItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: 'learn', icon: <BookOpen size={20} />, label: 'Learn' },
    { id: 'assessments', icon: <CheckSquare size={20} />, label: 'Assessments' },
    { id: 'assignments', icon: <FileText size={20} />, label: 'Assignments' },
    { id: 'tutor', icon: <Brain size={20} />, label: 'AI Tutor' },
    { id: 'store', icon: <Award size={20} />, label: 'Reward Store' },
    { id: 'analytics', icon: <Activity size={20} />, label: 'Analytics' },
    { id: 'progress', icon: <Activity size={20} />, label: 'Progress' },
    { id: 'achievements', icon: <Award size={20} />, label: 'Achievements' },
    { id: 'schedule', icon: <Calendar size={20} />, label: 'Schedule' },
    { id: 'settings', icon: <User size={20} />, label: 'Settings' }
  ];

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  // AI Chat submission
  const handleAskAi = (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    
    const newChat = [...aiChat, { role: 'user', text: aiInput }];
    setAiChat(newChat);
    const question = aiInput;
    setAiInput('');

    setTimeout(() => {
      // Custom responses depending on student's current needs
      let reply = "I can definitely help you with that! Let's break down the formulas step by step.";
      if (question.toLowerCase().includes('quadratic')) {
        reply = "A quadratic equation is standardly written as ax² + bx + c = 0. The discriminant is b² - 4ac. Since your score is 65% in this area, try focusing on factoring. Do you want me to give you a practice problem?";
      } else if (question.toLowerCase().includes('thermodynamics')) {
        reply = "Thermodynamics deals with heat, work, and temperature. The First Law states ΔU = Q - W. Your efficiency is good but you can review isothermal work calculations.";
      } else if (question.toLowerCase().includes('schedule') || question.toLowerCase().includes('study')) {
        reply = "Based on your gaps, I recommend spending 30 minutes on Quadratic Equations on Monday and 45 minutes on Thermodynamics on Tuesday. I have synced this to your AI Study Planner tab.";
      }
      setAiChat([...newChat, { role: 'assistant', text: reply }]);
    }, 1000);
  };

  // Quiz Trigger
  const startQuiz = (assign) => {
    const subject = assign.subject === 'Mathematics' ? 'Mathematics' : 'Physics';
    const pool = questionsPool[subject];
    const initialDifficulty = 'Medium';
    
    // Pick the first question of medium difficulty
    const firstQ = pool[initialDifficulty][0];
    
    setActiveQuiz({
      assignId: assign.id,
      subject,
      currentIdx: 0,
      difficulty: initialDifficulty,
      questions: [firstQ],
      answers: [], // boolean values (true if correct)
      correctCount: 0
    });
    setSelectedOption(null);
    setQuizSubmitted(false);
    setQuizFinished(false);
  };

  // Answer Quiz Option
  const handleAnswerSubmit = () => {
    if (selectedOption === null || quizSubmitted) return;
    
    const currentQ = activeQuiz.questions[activeQuiz.currentIdx];
    const isCorrect = selectedOption === currentQ.correct;
    
    const updatedAnswers = [...activeQuiz.answers, isCorrect];
    const newCorrectCount = activeQuiz.correctCount + (isCorrect ? 1 : 0);
    
    setQuizSubmitted(true);
    
    setActiveQuiz(prev => ({
      ...prev,
      answers: updatedAnswers,
      correctCount: newCorrectCount
    }));
  };

  // Next Quiz Question (Adaptive logic resides here!)
  const nextQuizQuestion = () => {
    const nextIdx = activeQuiz.currentIdx + 1;
    
    if (nextIdx >= 5) {
      // Quiz Finished!
      setQuizFinished(true);
      return;
    }

    const lastAnswerCorrect = activeQuiz.answers[activeQuiz.currentIdx];
    let nextDifficulty = activeQuiz.difficulty;

    if (lastAnswerCorrect) {
      if (activeQuiz.difficulty === 'Easy') nextDifficulty = 'Medium';
      else if (activeQuiz.difficulty === 'Medium') nextDifficulty = 'Hard';
    } else {
      if (activeQuiz.difficulty === 'Hard') nextDifficulty = 'Medium';
      else if (activeQuiz.difficulty === 'Medium') nextDifficulty = 'Easy';
    }

    const pool = questionsPool[activeQuiz.subject][nextDifficulty];
    // Pick a question that hasn't been used yet if possible, or cycle
    const usedIds = activeQuiz.questions.map(q => q.id);
    let nextQ = pool.find(q => !usedIds.includes(q.id)) || pool[0];

    setActiveQuiz(prev => ({
      ...prev,
      currentIdx: nextIdx,
      difficulty: nextDifficulty,
      questions: [...prev.questions, nextQ]
    }));

    setSelectedOption(null);
    setQuizSubmitted(false);
  };

  // Finish Quiz and update global state
  const finishQuiz = () => {
    const percentage = Math.round((activeQuiz.correctCount / 5) * 100);
    
    // Submit assignment score
    submitAssignment(activeQuiz.assignId, student.email, percentage);
    
    // Update student XP, gaps, predicted score, etc.
    updateStudentQuizResult(student.email, activeQuiz.subject, percentage, activeQuiz.correctCount);
    
    setActiveQuiz(null);
  };

  // Run AI Study Planner generation
  const handleGeneratePlan = () => {
    generateStudyPlan(student.email);
  };

  // Simulate Page engagement session
  const handleSimulateStudy = () => {
    // Randomize a day/hour index
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const randomDay = days[Math.floor(Math.random() * days.length)];
    const randomHourIdx = Math.floor(Math.random() * 8); // index 0-7

    logEngagementTime(student.email, randomDay, randomHourIdx, studySessionTime);
    setStudyMessage(`Successfully logged ${studySessionTime} minutes of study for ${studySubject} on ${randomDay}! Check your updated engagement heatmap in the grades tab.`);
    setTimeout(() => setStudyMessage(''), 5000);
  };

  const getHeatmapColor = (minutes) => {
    if (!minutes) return 'bg-slate-100';
    if (minutes < 15) return 'bg-indigo-200';
    if (minutes < 30) return 'bg-indigo-400';
    if (minutes < 45) return 'bg-indigo-600';
    return 'bg-indigo-900';
  };

  const renderInteractiveClassroom = () => {
    const courseKey = selectedCourse && selectedCourse.startsWith('math') ? 'math' : 'physics';
    const courseData = COURSE_DATA[courseKey];
    const topics = courseData.chapters;
    const concepts = courseData.concepts;

    const activeConceptList = concepts[activeTopic] || concepts[Object.keys(concepts)[0]];
    const activeConcept = activeConceptList[activeConceptIdx] || activeConceptList[0];

    const currentConceptKey = `${activeTopic}-${activeConceptIdx}`;
    const isConceptCompleted = completedConcepts[currentConceptKey];

    const handleToggleComplete = () => {
      const isNowCompleted = !isConceptCompleted;
      setCompletedConcepts(prev => ({
        ...prev,
        [currentConceptKey]: isNowCompleted
      }));

      if (isNowCompleted) {
        student.xp += 25;
        sendNotification('student', `Completed concept "${activeConcept.title}"! Earned +25 XP!`, 'success');
      } else {
        student.xp = Math.max(0, student.xp - 25);
      }
    };

    const handleRateConfidence = (rating) => {
      setConfidenceRatings(prev => ({
        ...prev,
        [currentConceptKey]: rating
      }));
    };

    const activeConfidence = confidenceRatings[currentConceptKey] || 3;
    const completedCountInTopic = activeConceptList.filter((_, idx) => completedConcepts[`${activeTopic}-${idx}`]).length;
    const activeTopicPacing = Math.round((completedCountInTopic / activeConceptList.length) * 100);

    const totalTopicsCount = topics.reduce((acc, curr) => acc + curr.items.length, 0);
    const completedTopicsCount = topics.reduce((acc, curr) => {
      return acc + curr.items.filter(item => {
        const itemConcepts = concepts[item.id] || [];
        return itemConcepts.length > 0 && itemConcepts.every((_, idx) => completedConcepts[`${item.id}-${idx}`]);
      }).length;
    }, 0);

    const activeChapter = topics.find(ch => ch.items.some(item => item.id === activeTopic)) || topics[0];
    const chapterTopicsCount = activeChapter.items.length;
    const completedChapterTopicsCount = activeChapter.items.filter(item => {
      const itemConcepts = concepts[item.id] || [];
      return itemConcepts.length > 0 && itemConcepts.every((_, idx) => completedConcepts[`${item.id}-${idx}`]);
    }).length;

    const handleAskAiAboutConcept = () => {
      setAiChat(prev => [
        ...prev,
        { role: 'user', text: `Explain the concept of "${activeConcept.title}" under "${activeTopic}" to me in simple terms.` },
        { role: 'assistant', text: `Certainly! In "${activeTopic}", the concept of "${activeConcept.title}" is key. Let's break it down: \n\n1. Core Idea: ${activeConcept.text}\n\n2. Key Takeaway: It bridges our classical intuition with advanced quantum observations. Would you like me to elaborate on some experimental calculations?` }
      ]);
      setSearchParams({ tab: 'tutor' });
    };

    return (
      <div className="bg-[#0A0B16] text-[#F3F4F6] rounded-3xl border border-[#1E293B] shadow-2xl p-0 flex flex-col font-sans overflow-hidden min-h-[680px] select-none">
        {/* Top Header Row */}
        <div className="bg-[#0F172A] px-6 py-4 border-b border-[#1E293B] flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] tracking-widest text-[#A78BFA] font-extrabold uppercase font-poppins">Interactive Classroom</span>
            <div className="flex items-center gap-2 text-xs text-[#94A3B8] font-bold">
              <span>{courseData.subjectKey}</span>
              <span>&gt;</span>
              <span>{courseData.chapterTag}</span>
              <span>&gt;</span>
              <span className="text-white uppercase">{activeTopic}</span>
            </div>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-[#6366F1]/20 to-[#A78BFA]/20 border border-[#818CF8]/30 hover:border-[#818CF8]/60 text-[#C7D2FE] font-bold rounded-xl text-xs tracking-wider uppercase transition-all shadow-md">
            Smart Textbook Mode
          </button>
        </div>

        {/* 3-Column Content Layout */}
        <div className="flex flex-col lg:flex-row flex-1">
          
          {/* Column 1: Syllabus Navigation */}
          <div className="w-full lg:w-64 bg-[#0E0F1E] border-r border-[#1E293B] p-5 flex flex-col select-none justify-between shrink-0">
            <div className="space-y-6">
              <button 
                onClick={() => setSelectedCourse(courseKey)}
                className="flex items-center gap-2 text-xs font-bold text-[#818CF8] hover:text-[#A78BFA] transition-colors"
              >
                <ArrowLeft size={16} /> BACK TO CHAPTERS
              </button>
              
              <div>
                <span className="text-[9px] text-[#64748B] font-extrabold uppercase tracking-widest block mb-4">Syllabus Topics</span>
                <div className="space-y-6">
                  {topics.map((ch, chIdx) => (
                    <div key={chIdx} className="space-y-2">
                      <h4 className="text-[10px] text-[#94A3B8] font-extrabold tracking-wider uppercase font-poppins">{ch.chapter}</h4>
                      <div className="space-y-1">
                        {ch.items.map((item) => {
                          const isActive = activeTopic === item.id;
                          const isFullyCompleted = (concepts[item.id] || []).every((_, idx) => completedConcepts[`${item.id}-${idx}`]);
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                setActiveTopic(item.id);
                                setActiveConceptIdx(0);
                                setIsVideoPlaying(false);
                                setVideoProgress(0);
                              }}
                              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                                isActive 
                                  ? 'bg-[#1E1B4B]/60 border border-[#6366F1]/40 text-white shadow-lg' 
                                  : 'text-[#94A3B8] hover:bg-white/5 hover:text-white border border-transparent'
                              }`}
                            >
                              <span className="truncate">{item.label}</span>
                              {isFullyCompleted ? (
                                <Check size={14} className="text-emerald-400 shrink-0 ml-1.5" />
                              ) : (
                                isActive && <span className="w-1.5 h-1.5 bg-[#818CF8] rounded-full animate-ping shrink-0 ml-1.5"></span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#1E293B] mt-6 text-center text-[10px] text-[#64748B] font-semibold">
              Course Progress: {completedTopicsCount}/{totalTopicsCount} Topics
            </div>
          </div>

          {/* Column 2: Video Player & Textbook Reader */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[750px]">
            
            {/* Simulated Interactive Video Player */}
            <div className="bg-gradient-to-br from-[#1E1B4B] to-[#0A0B16] border border-[#1E293B] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-56 shadow-lg group">
              {isVideoPlaying ? (
                <div className="absolute inset-0 bg-[#0F172A] flex flex-col justify-between p-4 z-10">
                  <div className="flex justify-between items-center text-xs text-[#94A3B8] font-bold">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse"></span> Video Lecture Active</span>
                    <span className="bg-[#1E293B] px-2 py-0.5 rounded text-white text-[10px]">{courseData.title}</span>
                  </div>
                  
                  <div className="flex justify-center items-center h-24 w-full gap-1 opacity-80">
                    {Array.from({ length: 40 }).map((_, idx) => {
                      const h = Math.abs(Math.sin((idx + videoProgress) / 5) * 60) + 10;
                      return (
                        <div 
                          key={idx} 
                          className="w-1 bg-gradient-to-t from-[#6366F1] to-[#A78BFA] rounded-full transition-all duration-300"
                          style={{ height: `${h}px` }}
                        ></div>
                      );
                    })}
                  </div>

                  <div className="space-y-2">
                    <div className="w-full bg-[#334155] h-1 rounded-full relative overflow-hidden">
                      <div className="bg-[#6366F1] h-1 rounded-full animate-pulse" style={{ width: `${(videoProgress / 180) * 100}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-[#94A3B8] font-bold">
                      <div className="flex items-center gap-3">
                        <button onClick={() => setIsVideoPlaying(false)} className="text-white hover:text-[#A78BFA] transition-colors"><Pause size={16} /></button>
                        <span>{Math.floor(videoProgress / 60)}:{(videoProgress % 60).toString().padStart(2, '0')} / 3:00</span>
                      </div>
                      <span className="text-[10px] text-[#A78BFA] uppercase tracking-wider font-extrabold animate-pulse">Watch to earn bonus XP</span>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center z-10">
                    <span className="bg-[#6366F1]/20 border border-[#6366F1]/40 px-3 py-1 rounded-xl text-[10px] font-bold text-[#C7D2FE] uppercase tracking-wider">
                      Interactive Video Lecture
                    </span>
                    <span className="text-xs font-bold text-[#94A3B8] bg-black/40 px-2 py-1 rounded-lg">
                      Video Lesson
                    </span>
                  </div>

                  <button 
                    onClick={() => {
                      setIsVideoPlaying(true);
                    }}
                    className="self-center w-14 h-14 bg-[#6366F1]/80 hover:bg-[#6366F1] border-4 border-white/20 text-white rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-105 z-10"
                  >
                    <Play size={20} className="fill-white ml-1 shrink-0" />
                  </button>

                  <div className="flex justify-between items-center z-10 text-xs text-[#94A3B8] font-bold">
                    <span>Click play to watch supplementary AI-tutor walkthrough</span>
                    <span>3:00 mins</span>
                  </div>
                </>
              )}
            </div>

            {/* Title & Metadata */}
            <div className="border-b border-[#1E293B] pb-4">
              <h2 className="text-2xl font-extrabold text-white font-poppins">{activeTopic}</h2>
              <div className="flex gap-4 text-xs font-bold text-[#94A3B8] mt-2">
                <span>📚 4 min read</span>
                <span>•</span>
                <span>💡 Concepts count: {activeConceptList.length}</span>
              </div>
            </div>

            {/* Pacing, Status and Course Progress Metrics Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0E0F1E] border border-[#1E293B] rounded-2xl p-4">
              <div className="space-y-1">
                <span className="text-[9px] text-[#64748B] font-extrabold uppercase tracking-wider block">Concept Pacing</span>
                <div className="flex justify-between text-xs font-bold text-white">
                  <span>Pacing Rate</span>
                  <span className="text-[#818CF8]">{activeTopicPacing}%</span>
                </div>
                <div className="w-full bg-[#1E293B] h-1 rounded-full overflow-hidden">
                  <div className="bg-[#6366F1] h-1 rounded-full transition-all duration-300" style={{ width: `${activeTopicPacing}%` }}></div>
                </div>
              </div>

              <div className="space-y-1 md:border-l md:border-r md:border-[#1E293B] md:px-4">
                <span className="text-[9px] text-[#64748B] font-extrabold uppercase tracking-wider block">Chapter Status</span>
                <div className="flex justify-between text-xs font-bold text-white">
                  <span>Progress</span>
                  <span className="text-emerald-400">{completedChapterTopicsCount}/{chapterTopicsCount} Topics</span>
                </div>
                <div className="w-full bg-[#1E293B] h-1 rounded-full overflow-hidden">
                  <div className="bg-[#10B981] h-1 rounded-full transition-all duration-300" style={{ width: `${chapterTopicsCount > 0 ? (completedChapterTopicsCount / chapterTopicsCount) * 100 : 0}%` }}></div>
                </div>
              </div>

              <div className="space-y-1 md:pl-2">
                <span className="text-[9px] text-[#64748B] font-extrabold uppercase tracking-wider block">Course Progress</span>
                <div className="flex justify-between text-xs font-bold text-white">
                  <span>Overall</span>
                  <span className="text-[#A78BFA]">{Math.round((completedTopicsCount / totalTopicsCount) * 100)}%</span>
                </div>
                <div className="w-full bg-[#1E293B] h-1 rounded-full overflow-hidden">
                  <div className="bg-[#A78BFA] h-1 rounded-full transition-all duration-300" style={{ width: `${(completedTopicsCount / totalTopicsCount) * 100}%` }}></div>
                </div>
              </div>
            </div>

            {/* Active Concept Textbook Content Card */}
            <div className="bg-[#0E0F1E] border border-[#1E293B] rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#1E293B] pb-3">
                <span className="w-1.5 h-6 bg-[#6366F1] rounded-full inline-block"></span>
                <h3 className="text-base font-bold text-white">{activeConcept.title}</h3>
                <span className="text-[10px] text-[#94A3B8] font-bold ml-auto uppercase tracking-wider">Concept {activeConceptIdx + 1} of {activeConceptList.length}</span>
              </div>
              
              <p className="text-xs text-[#94A3B8] leading-relaxed font-sans">{activeConcept.text}</p>

              {/* Completion Action / Star Rating */}
              <div className="pt-4 border-t border-[#1E293B] flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#94A3B8]">Rate Confidence:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        onClick={() => handleRateConfidence(star)}
                        className={`text-sm hover:scale-110 transition-transform ${star <= activeConfidence ? 'text-[#F59E0B]' : 'text-slate-600'}`}
                      >
                        <Star size={16} className={star <= activeConfidence ? 'fill-[#F59E0B]' : ''} />
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleToggleComplete}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all flex items-center gap-2 ${
                    isConceptCompleted 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30' 
                      : 'bg-[#6366F1] hover:bg-[#6366F1]/90 text-white shadow-lg'
                  }`}
                >
                  {isConceptCompleted ? (
                    <>✓ Completed (+25 XP)</>
                  ) : (
                    <>Mark Concept as Completed</>
                  )}
                </button>
              </div>
            </div>

            {/* AI Prompter Intervention Area */}
            <div className="p-4 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#6366F1]/10 rounded-xl text-[#818CF8] shrink-0"><Brain size={18} /></div>
                <div>
                  <h4 className="text-xs font-extrabold text-white">Need a deeper explanation?</h4>
                  <p className="text-[10px] text-[#94A3B8]">Prompt our AI Tutor about "{activeConcept.title}" instantly.</p>
                </div>
              </div>
              <button 
                onClick={handleAskAiAboutConcept}
                className="text-[10px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-2 rounded-xl transition-all shadow-md shrink-0"
              >
                Explain Concept
              </button>
            </div>

          </div>

          {/* Column 3: Concept Map & Understanding Metrics */}
          <div className="w-full lg:w-64 bg-[#0E0F1E] border-l border-[#1E293B] p-5 space-y-6 flex flex-col justify-between shrink-0">
            <div className="space-y-6">
              
              {/* Concept Map List */}
              <div>
                <h4 className="text-[10px] text-[#64748B] font-extrabold uppercase tracking-widest block mb-4 font-poppins">Concept Map</h4>
                <p className="text-[10px] text-[#94A3B8] mb-4 font-bold">Navigate current topic concepts:</p>
                
                <div className="space-y-2">
                  {activeConceptList.map((concept, idx) => {
                    const isActive = activeConceptIdx === idx;
                    const isKeyCompleted = completedConcepts[`${activeTopic}-${idx}`];
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveConceptIdx(idx)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                          isActive 
                            ? 'bg-[#1E1B4B]/80 border-[#6366F1] text-white shadow-lg' 
                            : 'bg-white/5 border-transparent text-[#94A3B8] hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 border ${
                          isKeyCompleted 
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                            : isActive ? 'bg-[#6366F1] text-white border-transparent' : 'bg-[#1E293B] text-[#94A3B8] border-transparent'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold truncate leading-none">{concept.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Understanding Metrics Widget */}
              <div className="pt-6 border-t border-[#1E293B]">
                <h4 className="text-[10px] text-[#64748B] font-extrabold uppercase tracking-widest block mb-4 font-poppins">Understanding Metrics</h4>
                <div className="space-y-3 bg-[#0A0B16] border border-[#1E293B] p-4 rounded-2xl">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#94A3B8] font-bold">Comprehension:</span>
                    <strong className="text-white font-extrabold">{isConceptCompleted ? '85%' : '70%'}</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#94A3B8] font-bold">Confidence:</span>
                    <strong className="text-[#F59E0B] font-extrabold">{activeConfidence} / 5</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#94A3B8] font-bold">Mastery Score:</span>
                    <strong className="text-indigo-400 font-extrabold">50 pts</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#94A3B8] font-bold">Predicted Retention:</span>
                    <strong className="text-emerald-400 font-extrabold">{isConceptCompleted ? '80%' : '75%'}</strong>
                  </div>
                </div>
              </div>

            </div>

            <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-center text-[9px] text-[#64748B] font-bold uppercase tracking-wider">
              {student.name} | Stanford High
            </div>

          </div>

        </div>
      </div>
    );
  };

  const renderCourseChapters = () => {
    const courseKey = selectedCourse && selectedCourse.startsWith('math') ? 'math' : 'physics';
    const courseData = COURSE_DATA[courseKey];
    const chapters = courseData.chapters;
    const concepts = courseData.concepts;

    return (
      <div className="bg-[#0A0B16] text-[#F3F4F6] rounded-3xl border border-[#1E293B] shadow-2xl p-8 flex flex-col font-sans overflow-hidden min-h-[680px]">
        {/* Back navigation */}
        <div className="mb-6">
          <button 
            onClick={() => setSelectedCourse(null)}
            className="flex items-center gap-2 text-xs font-bold text-[#818CF8] hover:text-[#A78BFA] transition-colors"
          >
            <ArrowLeft size={16} /> BACK TO SUBJECTS
          </button>
        </div>

        {/* Header section */}
        <div className="mb-8">
          <span className="px-3 py-1 bg-[#818CF8]/10 text-[#818CF8] rounded-full text-[10px] font-bold uppercase tracking-wider">
            Syllabus Pathway
          </span>
          <h2 className="text-3xl font-poppins font-bold text-white mt-3">{courseData.title} Chapters & Lessons</h2>
          <p className="text-xs text-[#94A3B8] mt-1.5">
            Review the chapters below and select a topic to start your concept reading workspace.
          </p>
        </div>

        {/* Chapters list */}
        <div className="space-y-6">
          {chapters.map((ch) => (
            <div key={ch.chapter} className="bg-[#0E0F1E] border border-[#1E293B] rounded-3xl p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-[#1E293B]/50 pb-4">
                <div>
                  <span className="text-[10px] text-[#818CF8] font-bold uppercase tracking-wider block">{ch.tag}</span>
                  <h3 className="text-xl font-bold text-white mt-1">{ch.chapterTitle}</h3>
                </div>
                <button 
                  onClick={() => {
                    setActiveTopic(ch.items[0].id);
                    setActiveConceptIdx(0);
                    setSelectedCourse(`${courseKey}-active`);
                    setIsVideoPlaying(false);
                    setVideoProgress(0);
                  }}
                  className="bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95"
                >
                  Start Chapter
                </button>
              </div>

              <div className="divide-y divide-[#1E293B]/30">
                {ch.items.map((topic) => {
                  const isFullyCompleted = (concepts[topic.id] || []).every((_, idx) => completedConcepts[`${topic.id}-${idx}`]);
                  return (
                    <div 
                      key={topic.id}
                      onClick={() => {
                        setActiveTopic(topic.id);
                        setActiveConceptIdx(0);
                        setSelectedCourse(`${courseKey}-active`);
                        setIsVideoPlaying(false);
                        setVideoProgress(0);
                      }}
                      className="py-4 first:pt-0 last:pb-0 flex justify-between items-center cursor-pointer group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white group-hover:text-[#818CF8] transition-colors">{topic.label}</span>
                          {isFullyCompleted && (
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[9px] font-bold uppercase tracking-wider">
                              Completed
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#64748B] font-medium leading-relaxed">{topic.desc}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-semibold text-[#64748B] group-hover:text-white transition-colors shrink-0">
                        <span>{topic.duration}</span>
                        <span>&gt;</span>
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
  };

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen flex bg-background relative overflow-x-hidden font-sans">
      
      {/* AI Tutor Floating Modal */}
      <AnimatePresence>
        {showAiModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col h-[550px] max-h-full border border-slate-100"
            >
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl text-primary"><Brain size={24} /></div>
                  <div>
                    <h2 className="font-poppins font-bold text-slate-900 text-lg">Arivo AI Tutor</h2>
                    <p className="text-xs text-slate-500">Intelligent Study Assistant</p>
                  </div>
                </div>
                <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                {aiChat.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary text-white font-bold text-xs' : 'bg-secondary/10 text-secondary'}`}>
                      {msg.role === 'user' ? student.name.charAt(0) : <Brain size={14} />}
                    </div>
                    <div className={`p-3.5 rounded-2xl text-sm max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white border border-slate-200/60 text-slate-700 shadow-sm rounded-tl-none'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              
              <form onSubmit={handleAskAi} className="p-4 border-t border-slate-100 bg-white">
                <div className="relative">
                  <input 
                    type="text" 
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Ask about Quadratic Equations, schedules or formulas..."
                    className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                  />
                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-primary p-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50" disabled={!aiInput.trim()}>
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Adaptive Quiz Full Screen Modal */}
      <AnimatePresence>
        {activeQuiz && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-primary/5 to-indigo-500/5 flex justify-between items-center">
                <div>
                  <span className="text-xs uppercase font-extrabold tracking-wider bg-primary/10 text-primary px-3 py-1 rounded-full">
                    Adaptive {activeQuiz.subject} Quiz
                  </span>
                  <h3 className="font-poppins font-bold text-slate-800 text-lg mt-1">Real-time Adjusting Difficulty</h3>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider border ${
                    activeQuiz.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    activeQuiz.difficulty === 'Medium' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    'bg-rose-50 text-rose-600 border-rose-100'
                  }`}>
                    Level: {activeQuiz.difficulty}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-1.5">
                <div className="bg-primary h-1.5 transition-all duration-300" style={{ width: `${((activeQuiz.currentIdx) / 5) * 100}%` }}></div>
              </div>

              {!quizFinished ? (
                <div className="p-8 overflow-y-auto space-y-6">
                  {/* Question Index */}
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Question {activeQuiz.currentIdx + 1} of 5</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> Auto-Saving</span>
                  </div>

                  {/* Question Text */}
                  <h2 className="text-xl font-bold text-slate-800 leading-snug">
                    {activeQuiz.questions[activeQuiz.currentIdx].text}
                  </h2>

                  {/* Options */}
                  <div className="space-y-3">
                    {activeQuiz.questions[activeQuiz.currentIdx].options.map((option, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrectAnswer = idx === activeQuiz.questions[activeQuiz.currentIdx].correct;
                      
                      let optionStyle = "border-slate-200 hover:border-primary/40 bg-white";
                      if (isSelected) optionStyle = "border-primary bg-indigo-50/50 text-primary ring-2 ring-primary/20";
                      
                      if (quizSubmitted) {
                        if (isCorrectAnswer) {
                          optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-700 font-medium";
                        } else if (isSelected) {
                          optionStyle = "border-rose-500 bg-rose-50 text-rose-700";
                        } else {
                          optionStyle = "border-slate-200 opacity-50 bg-white";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={quizSubmitted}
                          onClick={() => setSelectedOption(idx)}
                          className={`w-full text-left p-4 rounded-2xl border transition-all text-sm flex items-center justify-between ${optionStyle}`}
                        >
                          <span>{option}</span>
                          {quizSubmitted && isCorrectAnswer && <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />}
                          {quizSubmitted && isSelected && !isCorrectAnswer && <X className="text-rose-500 shrink-0" size={18} />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation / Feedback */}
                  <AnimatePresence>
                    {quizSubmitted && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-2xl border text-sm ${
                          activeQuiz.answers[activeQuiz.currentIdx] ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800' : 'bg-rose-50/50 border-rose-100 text-rose-800'
                        }`}
                      >
                        <h4 className="font-bold mb-1 flex items-center gap-1.5">
                          {activeQuiz.answers[activeQuiz.currentIdx] ? (
                            <>🎉 Correct!</>
                          ) : (
                            <>❌ Incorrect</>
                          )}
                        </h4>
                        <p>{activeQuiz.questions[activeQuiz.currentIdx].explanation}</p>
                        <p className="mt-2 text-xs font-semibold text-slate-500 border-t border-slate-200/50 pt-2">
                          Adaptive Shift: {activeQuiz.answers[activeQuiz.currentIdx] ? 'Heading to harder concepts next' : 'Calibrating to simpler math concepts next'}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Results summary */
                <div className="p-8 text-center space-y-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                    <Sparkles size={40} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-poppins font-bold text-slate-900">Quiz Completed!</h2>
                    <p className="text-slate-500 text-sm mt-1">Excellent performance. Your adaptive profile has been recalculated.</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <span className="text-xs text-slate-400 block mb-1">Score</span>
                      <strong className="text-2xl text-slate-800 font-extrabold">{activeQuiz.correctCount} / 5</strong>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <span className="text-xs text-slate-400 block mb-1">Percentage</span>
                      <strong className="text-2xl text-primary font-extrabold">{Math.round((activeQuiz.correctCount / 5) * 100)}%</strong>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <span className="text-xs text-slate-400 block mb-1">XP Gained</span>
                      <strong className="text-2xl text-emerald-500 font-extrabold">+{Math.round((activeQuiz.correctCount / 5) * 100) * 2}</strong>
                    </div>
                  </div>

                  <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl text-sm text-slate-700 max-w-md mx-auto">
                    🚀 <strong>Student Trajectory update:</strong> Math & Physics predicted grades improved by <strong>+2.5%</strong>. Check the Grades tab for full gaps review.
                  </div>

                  <button 
                    onClick={finishQuiz}
                    className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md shadow-primary/20"
                  >
                    Finish and Update Profile
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              {!quizFinished && (
                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                  {!quizSubmitted ? (
                    <button
                      disabled={selectedOption === null}
                      onClick={handleAnswerSubmit}
                      className="bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-6 rounded-xl transition-colors disabled:opacity-50"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      onClick={nextQuizQuestion}
                      className="bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-6 rounded-xl transition-colors"
                    >
                      {activeQuiz.currentIdx === 4 ? 'View Final Results' : 'Next Question →'}
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Student Study Planner Modal */}
      <AnimatePresence>
        {showStudentTaskModal && (
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
                    {studentTaskModalType === 'create' ? 'Add Custom Task' : 'Edit Study Task'}
                  </span>
                  <h2 className="font-poppins font-bold text-slate-800 text-lg mt-1">
                    {studentTaskModalType === 'create' ? 'Create New Study Task' : 'Modify Study Task'}
                  </h2>
                </div>
                <button onClick={() => setShowStudentTaskModal(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveTask} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-poppins">Task Title / Topic</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Read Physics thermodynamics section"
                    value={taskFormTitle}
                    onChange={(e) => setTaskFormTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-poppins">Day</label>
                    <select 
                      value={taskFormDay}
                      onChange={(e) => setTaskFormDay(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xs"
                    >
                      <option>Monday</option>
                      <option>Tuesday</option>
                      <option>Wednesday</option>
                      <option>Thursday</option>
                      <option>Friday</option>
                      <option>Saturday</option>
                      <option>Sunday</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-poppins">Duration</label>
                    <select 
                      value={taskFormDuration}
                      onChange={(e) => setTaskFormDuration(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xs"
                    >
                      <option>15 mins</option>
                      <option>30 mins</option>
                      <option>45 mins</option>
                      <option>60 mins</option>
                      <option>90 mins</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-poppins">Notes / Description</label>
                  <textarea 
                    rows={3}
                    placeholder="Describe what you want to study..."
                    value={taskFormDescription}
                    onChange={(e) => setTaskFormDescription(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xs leading-relaxed"
                  />
                </div>

                <button type="submit" className="w-full bg-primary hover:bg-primary/95 text-white py-3 rounded-xl font-bold text-xs shadow-md mt-4 transition-all">
                  {studentTaskModalType === 'create' ? 'Create Task' : 'Save Changes'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#1E1B4B] text-white h-screen sticky top-0 shrink-0 select-none">
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-primary p-1.5 rounded-lg text-white">
              <BookOpen size={20} />
            </div>
            <span className="font-poppins font-bold text-lg tracking-tight">SmartLearn AI</span>
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

          {/* Dev Shortcut */}
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 mb-4 text-center">
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider mb-2">Simulate Other Views</span>
            <div className="grid grid-cols-2 gap-1.5">
              <button 
                onClick={() => {
                  login('teacher', 'teacher@arivo.com');
                  navigate('/teacher/dashboard');
                }} 
                className="text-[11px] py-1 bg-primary/20 hover:bg-primary/40 rounded-lg font-medium text-indigo-200 border border-primary/30"
              >
                Teacher
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
          {/* User Profile Block */}
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mb-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 border-2 border-indigo-400 flex items-center justify-center text-white font-bold font-poppins text-sm shrink-0">
                {student.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="overflow-hidden">
                <span className="font-poppins font-bold text-xs text-white block truncate">{student.name}</span>
                <span className="text-[10px] text-slate-300 block truncate">Level {level} • {houseName}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-white/5 text-center">
              <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider mb-0.5">Streak</span>
                <span className="text-xs font-extrabold text-amber-400 flex items-center justify-center gap-1 font-poppins">🔥 {currentStreak}d</span>
              </div>
              <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider mb-0.5">XP Points</span>
                <span className="text-xs font-extrabold text-indigo-400 flex items-center justify-center gap-1 font-poppins">⚡ {xpTotal}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                <span>XP Progress</span>
                <span>{xpTotal} / {xpNextLevel}</span>
              </div>
              <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                <div className="bg-indigo-400 h-1 rounded-full" style={{ width: `${Math.min(100, (xpTotal / xpNextLevel) * 100)}%` }}></div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => navigate('/arivo')}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl border border-indigo-500/30 transition-all shadow-md mb-4"
          >
            🚀 Switch to Arivo Platform
          </button>

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

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-poppins font-bold text-slate-900 capitalize">
              {activeTab === 'dashboard' ? `Welcome back, ${student.name}!` : navItems.find(t=>t.id===activeTab)?.label}
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              {activeTab === 'dashboard' ? "Track your progress, take quizzes and bridge knowledge gaps." : `Manage your ${activeTab} data.`}
            </p>
          </div>
          
          {/* Header Actions */}
          <div className="flex items-center gap-4 relative">
            <button 
              onClick={handleBellClick}
              className="p-2.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-primary transition-colors relative"
            >
              <Bell size={20} />
              {unreadNotifCount > 0 && (
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
                    <span className="text-xs text-primary font-semibold">{unreadNotifCount} New</span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div key={notif.id} className="p-3.5 hover:bg-slate-50/50 transition-colors flex gap-2.5">
                          <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            notif.type === 'success' ? 'bg-emerald-500' :
                            notif.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                          }`}></span>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{notif.title || "Notification"}</p>
                            <p className="text-xs text-slate-600 leading-snug mt-0.5">{notif.message}</p>
                            <span className="text-[10px] text-slate-400 block mt-1">Just now</span>
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

            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold shadow-md">
              {student.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                
                {/* Gamification Summary bar */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Streak */}
                  <div className={`p-5 rounded-2xl shadow-sm border flex items-center gap-4 relative overflow-hidden transition-all ${
                    currentStreak >= 10 
                      ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-200 text-amber-900' 
                      : 'bg-white border-slate-100 text-slate-800'
                  }`}>
                    <div className={`p-3.5 rounded-xl ${currentStreak >= 10 ? 'bg-amber-100 text-amber-600' : 'bg-amber-50 text-amber-500'}`}>
                      <Flame size={28} className={`fill-amber-500 ${currentStreak >= 10 ? 'animate-bounce' : 'animate-pulse'}`} />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium block">Daily Streak</span>
                      <strong className="text-2xl text-slate-800 font-bold">{currentStreak} Days</strong>
                      {currentStreak >= 10 && <span className="text-[9px] font-extrabold text-amber-600 uppercase tracking-widest block mt-0.5 animate-pulse">🔥 On Fire!</span>}
                    </div>
                  </div>

                  {/* XP */}
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="p-3.5 bg-indigo-50 rounded-xl text-indigo-500">
                      <Trophy size={28} className="fill-indigo-100" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium block">Total XP</span>
                      <strong className="text-2xl text-slate-800 font-bold">{xpTotal} pts</strong>
                    </div>
                  </div>

                  {/* Class Rank */}
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="p-3.5 bg-emerald-50 rounded-xl text-emerald-500">
                      <Award size={28} />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium block">Leaderboard Rank</span>
                      <strong className="text-2xl text-slate-800 font-bold">{student.rank}</strong>
                    </div>
                  </div>

                  {/* Learning Trajectory Midterm Prediction */}
                  <div className={`p-5 rounded-2xl shadow-sm border ${
                    student.atRisk ? 'bg-rose-50 border-rose-100 text-rose-800' : 'bg-indigo-50/50 border-indigo-100 text-indigo-900'
                  } relative overflow-hidden`}>
                    <div className="absolute right-0 top-0 p-4 opacity-5"><Brain size={70} /></div>
                    <span className="text-xs font-semibold uppercase tracking-wider block mb-1">Midterm Prediction (ML)</span>
                    <div className="flex items-baseline gap-2">
                      <strong className="text-3xl font-extrabold">{student.predictedScore}%</strong>
                      <span className="text-xs font-medium">Predicted GPA</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-2 border ${
                      student.atRisk ? 'bg-rose-100 border-rose-200 text-rose-700' : 'bg-indigo-100 border-indigo-200 text-indigo-700'
                    }`}>
                      {student.atRisk ? '⚠️ At Risk - Action Needed' : '✅ Good Standing'}
                    </span>
                  </div>
                </div>

                {/* 🌟 Today's Learning Journey Timeline */}
                {dailyJourney && (
                  <div className="bg-[#0B0D23] border border-[#1E293B] p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2">
                        <Sparkles className="text-[#818CF8]" size={20} />
                        <h3 className="text-lg font-poppins font-bold text-white">🌟 Today's Learning Journey</h3>
                      </div>
                      {!dailyJourney.dailyBonusClaimed ? (
                        <div className="text-xs text-[#94A3B8] font-bold">
                          Complete all missions to claim the <strong className="text-amber-400">200 XP & 50 Coins Bonus</strong>!
                        </div>
                      ) : (
                        <div className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-xl flex items-center gap-1.5 border border-emerald-500/20">
                          <Check size={14} /> Daily Completion Bonus Claimed!
                        </div>
                      )}
                    </div>

                    {/* Nodes Road */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                      {/* Connection Lines (visual representation) */}
                      <div className="hidden md:block absolute top-7 left-[15%] right-[15%] h-0.5 bg-slate-800 z-0"></div>
                      
                      {/* Mission 1 */}
                      <div className="flex flex-col items-center text-center relative z-10 p-4 bg-black/20 border border-slate-800/80 rounded-2xl">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-3 ${
                          dailyJourney.mission1Completed 
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                            : 'bg-[#1E293B] text-slate-400 border border-slate-700'
                        }`}>
                          {dailyJourney.mission1Completed ? <Check size={16} /> : "1"}
                        </div>
                        <h4 className="text-xs font-extrabold uppercase tracking-wide text-slate-300">Mission 1</h4>
                        <p className="text-xs font-semibold text-slate-400 mt-1 max-w-[200px]">
                          {dailyJourney.mission1Text || "Solve 5 calculus derivatives practice questions"}
                        </p>
                        {!dailyJourney.mission1Completed && (
                          <button 
                            onClick={async () => {
                              await completeDailyMission(1);
                            }}
                            className="mt-3 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-[10px] uppercase tracking-wide transition-all"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>

                      {/* Mission 2 */}
                      <div className="flex flex-col items-center text-center relative z-10 p-4 bg-black/20 border border-slate-800/80 rounded-2xl">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-3 ${
                          dailyJourney.mission2Completed 
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                            : 'bg-[#1E293B] text-slate-400 border border-slate-700'
                        }`}>
                          {dailyJourney.mission2Completed ? <Check size={16} /> : "2"}
                        </div>
                        <h4 className="text-xs font-extrabold uppercase tracking-wide text-slate-300">Mission 2</h4>
                        <p className="text-xs font-semibold text-slate-400 mt-1 max-w-[200px]">
                          {dailyJourney.mission2Text || "Complete a 3-minute AI Study Companion challenge"}
                        </p>
                        {!dailyJourney.mission2Completed && (
                          <button 
                            onClick={async () => {
                              await completeDailyMission(2);
                            }}
                            className="mt-3 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-[10px] uppercase tracking-wide transition-all"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>

                      {/* Mission 3 */}
                      <div className="flex flex-col items-center text-center relative z-10 p-4 bg-black/20 border border-slate-800/80 rounded-2xl">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-3 ${
                          dailyJourney.mission3Completed 
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                            : 'bg-[#1E293B] text-slate-400 border border-slate-700'
                        }`}>
                          {dailyJourney.mission3Completed ? <Check size={16} /> : "3"}
                        </div>
                        <h4 className="text-xs font-extrabold uppercase tracking-wide text-slate-300">Mission 3</h4>
                        <p className="text-xs font-semibold text-slate-400 mt-1 max-w-[200px]">
                          {dailyJourney.mission3Text || "Purchase and equip a cosmetic skin/theme from the Store"}
                        </p>
                        {!dailyJourney.mission3Completed && (
                          <button 
                            onClick={async () => {
                              await completeDailyMission(3);
                            }}
                            className="mt-3 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-[10px] uppercase tracking-wide transition-all"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Claim Bonus CTA */}
                    {dailyJourney.mission1Completed && dailyJourney.mission2Completed && dailyJourney.mission3Completed && !dailyJourney.dailyBonusClaimed && (
                      <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mt-6 flex justify-center"
                      >
                        <button 
                          onClick={claimDailyBonus}
                          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold rounded-2xl text-xs uppercase tracking-widest transition-all shadow-lg shadow-amber-500/20"
                        >
                          🎁 Claim Daily Completion Bonus (200 XP & 50 Coins)
                        </button>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Badge Gallery */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Sparkles size={18} className="text-amber-500" /> Active Badges & Achievements
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {(badgesList.length > 0 ? badgesList : student.badges).map((badge, idx) => {
                      const iconEmoji = 
                        badge.iconName === 'Calculator' ? '🧮' :
                        badge.iconName === 'Compass' ? '🧭' :
                        badge.iconName === 'Code' ? '💻' :
                        badge.icon || '🏆';
                      return (
                        <div key={idx} className="bg-slate-50 border border-slate-150 p-3 rounded-2xl flex items-center gap-3 max-w-[200px] shrink-0">
                          <span className="text-2xl">{iconEmoji}</span>
                          <div>
                            <h4 className="font-bold text-xs text-slate-800">{badge.name}</h4>
                            <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{badge.description || badge.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Core Sections Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    {/* Simulator widget for demo */}
                    <div className="bg-gradient-to-r from-[#1E1B4B] to-[#312E81] p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
                      <div className="absolute right-0 top-0 opacity-10 p-4"><Activity size={100} /></div>
                      <h3 className="font-poppins font-bold text-lg mb-2">Simulate Real-Time Engagement</h3>
                      <p className="text-indigo-200 text-xs mb-4 leading-relaxed">
                        Log learning session logs dynamically. Doing this updates the teacher's engagement tracking system and your heatmap immediately.
                      </p>

                      <div className="flex flex-wrap items-center gap-3">
                        <div>
                          <label className="text-[10px] text-indigo-300 block uppercase font-bold mb-1">Time Spent</label>
                          <select 
                            value={studySessionTime} 
                            onChange={(e) => setStudySessionTime(Number(e.target.value))}
                            className="bg-white/10 text-white border border-white/20 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                          >
                            <option value={15} className="text-slate-800">15 Minutes</option>
                            <option value={30} className="text-slate-800">30 Minutes</option>
                            <option value={45} className="text-slate-800">45 Minutes</option>
                            <option value={60} className="text-slate-800">60 Minutes</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] text-indigo-300 block uppercase font-bold mb-1">Subject Topic</label>
                          <select 
                            value={studySubject} 
                            onChange={(e) => setStudySubject(e.target.value)}
                            className="bg-white/10 text-white border border-white/20 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                          >
                            <option value="Quadratic Equations" className="text-slate-800">Quadratic Equations</option>
                            <option value="Thermodynamics" className="text-slate-800">Thermodynamics</option>
                            <option value="Calculus Limits" className="text-slate-800">Calculus Limits</option>
                            <option value="Shakespeare Analysis" className="text-slate-800">Shakespeare Analysis</option>
                          </select>
                        </div>

                        <button 
                          onClick={handleSimulateStudy}
                          className="bg-white text-indigo-900 hover:bg-slate-100 font-bold px-4 py-2 rounded-xl text-xs shadow-md mt-4 sm:mt-0"
                        >
                          Simulate Study Session
                        </button>
                      </div>

                      {studyMessage && (
                        <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-xs p-2.5 rounded-xl mt-4">
                          {studyMessage}
                        </div>
                      )}
                    </div>

                    {/* Today's Tasks & Mini planner */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800">Today's Study Checklist</h3>
                        <button onClick={() => handleTabChange('planner')} className="text-xs font-semibold text-primary hover:underline">View AI Planner</button>
                      </div>
                      <div className="space-y-3">
                        {student.studyPlan.slice(0, 3).map((task, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 text-sm">
                            <div className="flex items-center gap-3">
                              <input 
                                type="checkbox" 
                                checked={task.completed} 
                                onChange={() => toggleStudyTask(student.email, task.id || task.day)}
                                className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary" 
                              />
                              <span className={task.completed ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}>
                                {task.topic}
                              </span>
                            </div>
                            <span className="text-xs font-semibold text-slate-400 bg-white border border-slate-100 px-2.5 py-1 rounded-lg">
                              {task.duration}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Learning Pet Companion Card */}
                    <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-[#334155] rounded-3xl p-6 shadow-xl text-white relative overflow-hidden">
                      <div className="absolute right-0 top-0 opacity-10 p-4">
                        <Sparkles size={80} className="text-[#818CF8]" />
                      </div>
                      
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-[9px] tracking-widest text-[#818CF8] font-extrabold uppercase font-poppins">Your Learning Companion</span>
                          <h3 className="text-lg font-poppins font-bold flex items-center gap-1.5 mt-1">
                            {pet?.nickname || "Baby Companion"} 
                          </h3>
                          <span className="text-[10px] bg-[#6366F1]/20 border border-[#818CF8]/30 px-2 py-0.5 rounded-full text-[#C7D2FE] font-bold uppercase tracking-wider mt-1.5 inline-block">
                            {pet?.evolutionStage || "BABY"} STAGE
                          </span>
                        </div>
                        <div className="text-3xl">
                          {pet?.petType === 'DRAGON' ? '🐉' :
                           pet?.petType === 'LION' ? '🦁' :
                           pet?.petType === 'PANDA' ? '🐼' :
                           pet?.petType === 'OWL' ? '🦉' :
                           pet?.petType === 'PENGUIN' ? '🐧' :
                           pet?.petType === 'TIGER' ? '🐯' : '🐱'}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-[11px] font-semibold text-slate-300">
                          <span>Pet Experience</span>
                          <span>{pet?.petXp || 0} XP</span>
                        </div>
                        <div className="w-full bg-[#334155] h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-[#6366F1] to-[#A78BFA] h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${Math.min(100, ((pet?.petXp || 0) % 1000) / 10)}%` }}
                          ></div>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Earn pet XP by completing Daily Missions and Boss Battles to evolve your companion.
                        </p>
                      </div>

                      {/* Rename Pet Form */}
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const fd = new FormData(e.target);
                        const nickname = fd.get('nickname');
                        if (nickname && nickname.trim()) {
                          renamePet(nickname.trim())
                            .then(() => alert("Pet renamed successfully!"))
                            .catch(err => alert("Error: " + err.message));
                        }
                      }} className="mt-4 pt-4 border-t border-[#334155]/60 flex gap-2">
                        <input 
                          type="text" 
                          name="nickname"
                          placeholder="New nickname..." 
                          defaultValue={pet?.nickname || ""}
                          className="bg-black/30 text-white border border-[#334155] rounded-xl px-3 py-1.5 text-xs flex-1 focus:outline-none focus:border-[#818CF8] placeholder-slate-500"
                        />
                        <button 
                          type="submit"
                          className="px-3 py-1.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold rounded-xl transition-all"
                        >
                          Rename
                        </button>
                      </form>
                    </div>

                    {/* Tutor Box */}
                    <div className="bg-gradient-to-br from-primary to-secondary p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10"><Brain size={100} /></div>
                      <h3 className="font-poppins font-bold text-lg mb-2">Stuck on Homework?</h3>
                      <p className="text-indigo-100 text-xs mb-6 leading-relaxed">
                        Arivo AI Tutor is loaded with your profile data and ready to help you close your understanding gaps.
                      </p>
                      <button 
                        onClick={() => setShowAiModal(true)}
                        className="bg-white text-primary w-full py-2.5 rounded-xl font-bold text-sm shadow-sm hover:shadow-md hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                      >
                        <Brain size={16} /> Ask AI Tutor
                      </button>
                    </div>

                    {/* Pending Assignments Summary */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800">Next Assignments</h3>
                        <button onClick={() => handleTabChange('assignments')} className="text-xs font-semibold text-primary hover:underline">View All</button>
                      </div>
                      <div className="space-y-3">
                        {assignments.filter(a => a.status === 'Pending').slice(0, 2).map((item, idx) => (
                          <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center">
                            <div>
                              <h4 className="font-bold text-xs text-slate-800">{item.title}</h4>
                              <span className="text-[10px] text-slate-500 block mt-0.5">{item.subject} • Due {item.due}</span>
                            </div>
                            <button 
                              onClick={() => startQuiz(item)}
                              className="text-xs bg-primary hover:bg-primary/95 text-white font-bold py-1.5 px-3 rounded-lg transition-colors"
                            >
                              Solve
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Teacher Notes & Resources */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-1.5"><FileText size={18} className="text-primary" /> Teacher Notes & Materials</h3>
                      <div className="space-y-3">
                        {writtenNotes && writtenNotes.filter(n => n.studentId === student.id).length > 0 ? (
                          writtenNotes.filter(n => n.studentId === student.id).map((note) => (
                            <div key={note.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                              <h4 className="font-bold text-xs text-slate-800">{note.title}</h4>
                              <p className="text-[11px] text-slate-500 leading-normal">{note.content}</p>
                              {note.fileName && (
                                <div className="flex items-center justify-between p-2 bg-white border border-slate-100 rounded-xl text-[10px] text-slate-500 font-semibold">
                                  <span className="truncate max-w-[120px]">{note.fileName}</span>
                                  <button 
                                    onClick={() => alert(`Downloading file: ${note.fileName}`)}
                                    className="p-1 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded transition-colors"
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

                    {/* Scheduled Events */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-1.5"><Calendar size={18} className="text-amber-500" /> Upcoming Scheduled Classes</h3>
                      <div className="space-y-3">
                        {scheduleEvents && scheduleEvents.length > 0 ? (
                          scheduleEvents.map((evt) => (
                            <div key={evt.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                              <div className="flex justify-between items-start">
                                <h4 className="font-bold text-xs text-slate-800 leading-tight">{evt.title}</h4>
                                <span className="text-[9px] font-bold text-primary bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 uppercase tracking-wide shrink-0">
                                  {evt.type}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-1">{evt.desc}</p>
                              <span className="text-[9px] text-slate-400 block mt-2 font-semibold">📅 {evt.date} at {evt.time}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400 italic">No live sessions scheduled yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'learn' && (
              <div className="space-y-6">
                {['physics-active', 'math-active'].includes(selectedCourse) ? (
                  renderInteractiveClassroom()
                ) : ['physics', 'math'].includes(selectedCourse) ? (
                  renderCourseChapters()
                ) : (
                  <div>
                    <h2 className="text-2xl font-poppins font-bold text-slate-900 mb-4">Course Modules</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[
                        { name: "Advanced Mathematics", progress: getCourseProgress('math'), module: "Calculus Fundamentals", color: "indigo" },
                        { name: "Physics & Science", progress: getCourseProgress('physics'), module: "Thermodynamics Ch 4", color: "purple" },
                        { name: "English Literature", progress: 90, module: "Shakespeare Analysis", color: "amber" },
                        { name: "World History", progress: 15, module: "The Renaissance", color: "rose" },
                      ].map((course, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary mb-4">
                            <Book size={24} />
                          </div>
                          <h3 className="text-lg font-bold text-slate-800 mb-1">{course.name}</h3>
                          <p className="text-xs text-slate-500 mb-4">Current Module: {course.module}</p>
                          
                          <div className="space-y-1.5 mb-6">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-slate-600">Progress</span>
                              <span className="text-primary">{course.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                              <div className="bg-primary h-1.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                            </div>
                          </div>

                          <button 
                            onClick={() => {
                              setIsVideoPlaying(false);
                              setVideoProgress(0);
                              if (course.name.includes("Physics")) {
                                setSelectedCourse('physics');
                                setActiveTopic('Wave-Particle Duality');
                              } else if (course.name.includes("Mathematics")) {
                                setSelectedCourse('math');
                                setActiveTopic('Limits & Continuity');
                              } else {
                                alert(`${course.name} interactive classroom is currently being compiled by the teacher. Please resume Physics or Mathematics!`);
                              }
                            }}
                            className="w-full bg-slate-50 hover:bg-primary hover:text-white border border-slate-200 hover:border-primary text-slate-600 font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
                          >
                            <PlayCircle size={16} /> Resume Module
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'assignments' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-poppins font-bold text-slate-900">Assignments & Assessments</h2>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 text-xs font-bold rounded-full">
                      {assignments.filter(a => a.status === 'Pending').length} Pending
                    </span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-bold rounded-full">
                      {assignments.filter(a => a.status === 'Graded' || a.status === 'Submitted').length} Done
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="divide-y divide-slate-100">
                    {assignments.map((task, i) => (
                      <div key={i} className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                            task.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            task.status === 'Submitted' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            'bg-emerald-50 text-emerald-600 border-emerald-100'
                          }`}>
                            {task.status === 'Pending' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">{task.title}</h4>
                            <div className="flex items-center flex-wrap gap-2.5 mt-1 text-xs text-slate-400">
                              <span className="font-semibold text-slate-500">{task.subject}</span>
                              <span>•</span>
                              <span>{task.type}</span>
                              <span>•</span>
                              <span>Difficulty: <strong className={
                                task.difficulty === 'Easy' ? 'text-emerald-500' :
                                task.difficulty === 'Medium' ? 'text-blue-500' : 'text-rose-500'
                              }>{task.difficulty}</strong></span>
                              <span>•</span>
                              <span className={task.status === 'Pending' ? 'text-rose-500 font-semibold' : ''}>Due: {task.due}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          {task.status === 'Pending' ? (
                            <button 
                              onClick={() => startQuiz(task)}
                              className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all"
                            >
                              Start Adaptive Quiz
                            </button>
                          ) : task.status === 'Submitted' ? (
                            <span className="px-3 py-2 border border-slate-200 text-slate-400 rounded-xl text-xs font-bold flex items-center gap-1.5">
                              <Clock size={14} /> Grading Pending
                            </span>
                          ) : (
                            <div className="text-right">
                              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold rounded-xl mb-1">
                                Score: {task.score}/100 ({task.grade})
                              </span>
                              {task.feedback && <p className="text-[10px] text-slate-400">{task.feedback}</p>}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'assessments' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-poppins font-bold text-slate-900 mb-4">Adaptive Assessments</h2>
                <p className="text-xs text-slate-500 mt-1 mb-6">Take adaptive quizzes that dynamically calibrate their difficulty based on your answers to test your topic mastery.</p>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { id: 'math_q', subject: 'Mathematics', title: 'Calculus & Algebra Practice', difficulty: 'Medium', questions: 5 },
                    { id: 'phys_q', subject: 'Physics', title: 'Thermodynamics & Heat Practice', difficulty: 'Easy', questions: 5 },
                    { id: 'eng_q', subject: 'English', title: 'Shakespeare & Grammar Practice', difficulty: 'Medium', questions: 5 }
                  ].map((quiz, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary mb-4">
                          <CheckSquare size={20} />
                        </div>
                        <h3 className="text-base font-bold text-slate-800 mb-1">{quiz.subject} Quiz</h3>
                        <p className="text-xs text-slate-500 mb-4">{quiz.title}</p>
                        <div className="flex gap-2 mb-6">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">5 Questions</span>
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold">Adaptive</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          const pool = questionsPool[quiz.subject === 'Mathematics' ? 'Mathematics' : 'Physics']?.[quiz.difficulty] || [];
                          if (pool.length > 0) {
                            setActiveQuiz({
                              assignId: quiz.id,
                              subject: quiz.subject === 'Mathematics' ? 'Mathematics' : 'Physics',
                              questions: pool.slice(0, 5),
                              currentIdx: 0,
                              answers: [],
                              correctCount: 0,
                              difficulty: quiz.difficulty
                            });
                            setSelectedOption(null);
                            setQuizSubmitted(false);
                            setQuizFinished(false);
                          } else {
                            alert(`Practice quiz for ${quiz.subject} is currently being compiled by the teacher.`);
                          }
                        }}
                        className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-2 rounded-xl text-xs transition-all shadow-md"
                      >
                        Start Practice Quiz
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tutor' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl shadow-sm w-full overflow-hidden flex flex-col h-[550px] border border-slate-100">
                  <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-primary/5 to-transparent">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-xl text-primary"><Brain size={24} /></div>
                      <div>
                        <h2 className="font-poppins font-bold text-slate-900 text-lg">Arivo AI Tutor</h2>
                        <p className="text-xs text-slate-500">Intelligent Study Assistant</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                    {aiChat.map((msg, i) => (
                      <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary text-white font-bold text-xs' : 'bg-indigo-600 text-white'}`}>
                          {msg.role === 'user' ? student.name.charAt(0) : <Brain size={14} />}
                        </div>
                        <div className={`p-3.5 rounded-2xl text-sm max-w-[85%] ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white border border-slate-200/60 text-slate-700 shadow-sm rounded-tl-none'}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <form onSubmit={handleAskAi} className="p-4 border-t border-slate-100 bg-white">
                    <div className="relative">
                      <input 
                        type="text" 
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        placeholder="Ask about Wave-Particle Duality, limits, formulas or explanations..."
                        className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                      />
                      <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-primary p-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50" disabled={!aiInput.trim()}>
                        <Send size={16} />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-8">
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center">
                    <p className="text-xs text-slate-400 font-medium mb-1 uppercase tracking-wider">{student.name.split(' ')[0]}'s overall gpa</p>
                    <h3 className="text-4xl font-extrabold text-primary font-poppins">{student.gpa}</h3>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center">
                    <p className="text-xs text-slate-400 font-medium mb-1 uppercase tracking-wider">completed credits</p>
                    <h3 className="text-4xl font-extrabold text-slate-800 font-poppins">{student.credits} / 24</h3>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center">
                    <p className="text-xs text-slate-400 font-medium mb-1 uppercase tracking-wider">class rank</p>
                    <h3 className="text-4xl font-extrabold text-emerald-500 font-poppins">{student.rank}</h3>
                  </div>
                </div>

                {/* Arivo AI Knowledge Map Canvas */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <div>
                      <h3 className="font-poppins font-bold text-slate-900 text-lg">Arivo AI Knowledge Map</h3>
                      <p className="text-xs text-slate-500 mt-1">Real-time mastery status of your subjects and subtopics. Click any subtopic to study it with Arivo AI.</p>
                    </div>
                    <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-600 font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider mt-2 sm:mt-0">
                      Adaptive Tracking Active
                    </span>
                  </div>

                  {knowledgeMap && knowledgeMap.length > 0 ? (
                    <div className="space-y-8">
                      {/* Group by Subject */}
                      {Object.entries(
                        knowledgeMap.reduce((acc, k) => {
                          if (!acc[k.subject]) acc[k.subject] = {};
                          if (!acc[k.subject][k.topic]) acc[k.subject][k.topic] = [];
                          acc[k.subject][k.topic].push(k);
                          return acc;
                        }, {})
                      ).map(([subject, topics]) => (
                        <div key={subject} className="space-y-4">
                          <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">{subject}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Object.entries(topics).map(([topic, subtopics]) => (
                              <div key={topic} className="p-5 bg-slate-50 rounded-2xl border border-slate-150 space-y-4">
                                <span className="text-xs font-bold text-slate-800 block">{topic}</span>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {subtopics.map((sub, sIdx) => {
                                    const statusColors = 
                                      sub.status === 'MASTERED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                      sub.status === 'LEARNING' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                      sub.status === 'WEAK' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                      'bg-rose-50 text-rose-700 border-rose-200';
                                      
                                    return (
                                      <button 
                                        key={sIdx}
                                        onClick={() => {
                                          setAiInput(`Hi Arivo, I want to study ${subject} > ${topic} > ${sub.subtopic}. It is currently marked as ${sub.status}.`);
                                          setShowAiModal(true);
                                        }}
                                        className="p-3 bg-white hover:bg-slate-50/50 border border-slate-150 rounded-xl text-left transition-all hover:scale-[1.02] shadow-sm flex flex-col gap-2 w-full"
                                      >
                                        <div className="flex justify-between items-start gap-1 w-full">
                                          <span className="text-xs font-bold text-slate-700 truncate">{sub.subtopic}</span>
                                        </div>
                                        <div className="flex items-center justify-between w-full">
                                          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border uppercase tracking-wider ${statusColors}`}>
                                            {sub.status}
                                          </span>
                                          <span className="text-[10px] font-bold text-slate-400">
                                            {sub.scorePercentage}%
                                          </span>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 border border-dashed border-slate-200 rounded-3xl">
                      <p className="text-sm text-slate-400 font-medium">No knowledge map records found.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="font-poppins font-bold text-slate-900 text-lg mb-2">Weekly Learning Engagement</h3>
                  <p className="text-xs text-slate-500 mb-6">Heatmap visualization of study minutes recorded on the platform (by day and hour block).</p>
                  
                  <div className="overflow-x-auto">
                    <div className="min-w-[600px] space-y-2">
                      <div className="flex text-xs font-semibold text-slate-400 text-center py-1">
                        <div className="w-16 text-left">Day</div>
                        {['9 AM', '11 AM', '1 PM', '3 PM', '5 PM', '7 PM', '9 PM', '11 PM'].map((h, idx) => (
                          <div key={idx} className="flex-1">{h}</div>
                        ))}
                      </div>

                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                        <div key={day} className="flex items-center text-center">
                          <div className="w-16 text-left text-xs font-bold text-slate-600 uppercase">{day}</div>
                          {Array.from({ length: 8 }).map((_, hourIdx) => {
                            const minutes = student?.heatmap?.[day]?.[hourIdx] || 0;
                            return (
                              <div 
                                key={hourIdx} 
                                title={`${day} at Hour Block ${hourIdx + 1}: ${minutes} mins studied`}
                                className="flex-1 px-1"
                              >
                                <div className={`h-8 rounded-lg ${getHeatmapColor(minutes)} border border-white/60 shadow-sm flex items-center justify-center text-[10px] font-bold ${minutes >= 45 ? 'text-white' : 'text-slate-700'}`}>
                                  {minutes > 0 ? `${minutes}m` : '-'}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-4 justify-end text-[10px] font-semibold text-slate-400 mt-4">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-slate-100 rounded-sm inline-block"></span> 0m</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-indigo-200 rounded-sm inline-block"></span> 1-15m</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-indigo-400 rounded-sm inline-block"></span> 15-30m</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-indigo-600 rounded-sm inline-block"></span> 30-45m</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-indigo-900 rounded-sm inline-block"></span> 45m+</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="font-poppins font-bold text-slate-900 text-lg mb-2">My Gamification Badges</h3>
                  <p className="text-xs text-slate-500 mb-6">Complete quizzes, complete daily study plans, and maintain streaks to unlock rewards.</p>
                  
                  {student.badges.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {student.badges.map((badge, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center flex flex-col items-center">
                          <span className="text-4xl mb-2">{badge.icon}</span>
                          <h4 className="font-bold text-xs text-slate-800">{badge.name}</h4>
                          <p className="text-[10px] text-slate-400 mt-1">{badge.desc}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
                      No badges unlocked yet. Keep studying to earn badges!
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-poppins font-bold text-slate-900 mb-4">Class Schedule</h2>
                <div className="space-y-4">
                  {scheduleEvents.length > 0 ? (
                    scheduleEvents.map((item, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[9px] font-bold uppercase tracking-wider">{item.type}</span>
                          <h3 className="font-bold text-slate-800 text-sm mt-1">{item.title}</h3>
                          <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                          <span className="text-[10px] text-slate-500 block mt-2">Instructor: {item.instructor}</span>
                        </div>
                        <div className="sm:text-right flex flex-col justify-center shrink-0">
                          <span className="text-sm font-extrabold text-slate-700">{item.date}</span>
                          <span className="text-xs font-semibold text-slate-400 mt-0.5">at {item.time}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No scheduled events found.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 max-w-lg">
                  <h3 className="font-poppins font-bold text-slate-900 text-lg mb-4">Student Profile</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block mb-1">Full Name</span>
                      <input type="text" readOnly value={student.name} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs text-slate-700 font-medium" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block mb-1">Email Address</span>
                      <input type="text" readOnly value={student.email} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs text-slate-700 font-medium" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block mb-1">Institution</span>
                      <input type="text" readOnly value="Stanford High School" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs text-slate-700 font-medium" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block mb-1">Grade Level</span>
                      <input type="text" readOnly value="Grade 11 (Junior Year)" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs text-slate-700 font-medium" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'planner' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-poppins font-bold text-slate-900">Personalized Weekly Study Planner</h2>
                    <p className="text-xs text-slate-500 mt-1">Manage study tasks, customize your schedule, and follow teacher-recommended paths.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleOpenCreateTask}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-sm transition-all flex items-center gap-1.5 font-poppins"
                    >
                      <Plus size={14} /> Add Custom Task
                    </button>
                    <button 
                      onClick={handleGeneratePlan}
                      className="bg-primary hover:bg-primary/95 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-sm transition-all flex items-center gap-1.5 font-poppins"
                    >
                      <Sparkles size={14} /> Re-Generate AI Planner
                    </button>
                  </div>
                </div>

                {/* Progress Bar Widget */}
                {(() => {
                  const totalTasks = student.studyPlan?.length || 0;
                  const completedTasks = student.studyPlan?.filter(t => t.completed).length || 0;
                  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                  return (
                    <div className="bg-gradient-to-r from-primary/5 to-indigo-500/5 p-6 rounded-3xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-extrabold tracking-wider bg-primary/10 text-primary px-3 py-1 rounded-full font-poppins">
                          Study Plan Metrics
                        </span>
                        <h3 className="font-poppins font-bold text-slate-800 text-sm mt-2">Planner Progress Summary</h3>
                        <p className="text-xs text-slate-400">Complete all recommendations to build your daily streak and earn maximum XP.</p>
                      </div>
                      
                      <div className="flex items-center gap-4 w-full md:w-80">
                        <div className="flex-1">
                          <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-1.5">
                            <span>Tasks Completed ({completedTasks}/{totalTasks})</span>
                            <span className="text-primary font-bold">{percentage}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                  <div className="space-y-4">
                    {student.studyPlan && student.studyPlan.length > 0 ? (
                      student.studyPlan.map((task, idx) => {
                        const isTeacher = task.source === 'Teacher';
                        const xpBonus = isTeacher ? 30 : 15;
                        return (
                          <div 
                            key={task.id || idx} 
                            className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl border transition-all gap-4 ${
                              task.completed ? 'bg-slate-50/50 border-slate-100 opacity-75' : 
                              isTeacher ? 'bg-amber-50/45 border-amber-200 shadow-sm' : 'bg-slate-50/50 border-slate-100 hover:border-slate-200 shadow-sm'
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center font-bold text-primary font-poppins shrink-0 shadow-sm">
                                {task.day.substring(0, 3).toUpperCase()}
                              </div>
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className={`font-bold text-sm ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                                    {task.topic}
                                  </h4>
                                  {isTeacher ? (
                                    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded border bg-amber-100/60 text-amber-700 border-amber-200 uppercase tracking-wider flex items-center gap-0.5 font-poppins">
                                      <Sparkles size={10} className="fill-amber-500 text-amber-600" /> Teacher Recommended
                                    </span>
                                  ) : task.source === 'AI' ? (
                                    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded border bg-blue-50 text-blue-700 border-blue-200 uppercase tracking-wider flex items-center gap-0.5 font-poppins">
                                      <Brain size={10} /> AI Target Gap
                                    </span>
                                  ) : (
                                    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded border bg-emerald-50 text-emerald-700 border-emerald-200 uppercase tracking-wider font-poppins">
                                      Custom Goal
                                    </span>
                                  )}
                                </div>
                                <p className={`text-xs ${task.completed ? 'text-slate-400' : 'text-slate-500'}`}>
                                  {task.description || 'Weekly customized learning module.'}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 pt-3 md:pt-0">
                              <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-xl">
                                ⏱ {task.duration}
                              </span>
                              <button
                                onClick={() => toggleStudyTask(student.email, task.id || task.day)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                  task.completed ? 'bg-emerald-50 border border-emerald-200 text-emerald-700 font-poppins' : 'bg-primary text-white hover:bg-primary/95 shadow-sm font-poppins'
                                }`}
                              >
                                {task.completed ? `✓ Completed (+${xpBonus} XP)` : `Mark Complete (+${xpBonus} XP)`}
                              </button>
                              
                              <div className="flex items-center gap-1">
                                <button 
                                  onClick={() => handleOpenEditTask(task)}
                                  className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-xl transition-all"
                                  title="Edit Task"
                                >
                                  <Edit size={14} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteTask(task.id || task.day)}
                                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                  title="Delete Task"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
                        No study tasks scheduled yet. Click "Re-Generate AI Planner" to automatically build a schedule based on your knowledge gaps!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'store' && (() => {
              const coins = storeItems?.coinsBalance ?? 0;
              const items = storeItems?.items ?? [];
              const [storeTab, setStoreTab] = React.useState('all'); // 'all' | 'owned'

              const categories = ['all', 'skin', 'theme', 'powerup', 'accessory'];
              const filteredItems = storeTab === 'owned'
                ? items.filter(it => it.owned)
                : storeTab === 'all'
                ? items
                : items.filter(it => it.category?.toLowerCase() === storeTab);

              const categoryEmoji = { skin: '🎨', theme: '🌈', powerup: '⚡', accessory: '💎', all: '🛒' };

              return (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="text-2xl font-poppins font-bold text-slate-900">Reward Store</h2>
                      <p className="text-xs text-slate-500 mt-1">Spend your coins on skins, themes, and power-ups!</p>
                    </div>
                    <div className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 px-5 py-3 rounded-2xl shadow-sm">
                      <span className="text-2xl">🪙</span>
                      <div>
                        <div className="text-xs text-amber-600 font-bold uppercase tracking-wider">Coins Balance</div>
                        <div className="text-2xl font-extrabold font-poppins text-amber-700">{coins.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>

                  {/* Category Tabs */}
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setStoreTab(cat)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                          storeTab === cat
                            ? 'bg-primary text-white border-primary shadow-md'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary'
                        }`}
                      >
                        <span>{categoryEmoji[cat] || '🛒'}</span>
                        {cat === 'all' ? 'All Items' : cat === 'owned' ? 'My Items' : cat.charAt(0).toUpperCase() + cat.slice(1) + 's'}
                      </button>
                    ))}
                    <button
                      onClick={() => setStoreTab('owned')}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                        storeTab === 'owned'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-500 hover:text-emerald-600'
                      }`}
                    >
                      ✅ My Collection
                    </button>
                  </div>

                  {/* Items Grid */}
                  {filteredItems.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center">
                      <div className="text-5xl mb-4">
                        {storeTab === 'owned' ? '🧺' : '🛒'}
                      </div>
                      <h3 className="font-bold text-slate-800 mb-2">
                        {storeTab === 'owned' ? 'No items owned yet' : 'No items in this category'}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {storeTab === 'owned'
                          ? 'Purchase items from the store to build your collection!'
                          : 'Check back later for new items!'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredItems.map((item, idx) => {
                        const canAfford = coins >= (item.price || 0);
                        const isOwned = item.owned;
                        const isEquipped = item.equipped;
                        const categoryColors = {
                          skin: 'from-purple-500/10 to-indigo-500/10 border-purple-100',
                          theme: 'from-pink-500/10 to-rose-500/10 border-pink-100',
                          powerup: 'from-amber-500/10 to-yellow-500/10 border-amber-100',
                          accessory: 'from-teal-500/10 to-cyan-500/10 border-teal-100',
                        };
                        const catColor = categoryColors[item.category?.toLowerCase()] || 'from-slate-50 to-white border-slate-100';

                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.04 }}
                            className={`bg-gradient-to-br ${catColor} border rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
                          >
                            {isEquipped && (
                              <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full tracking-wider">
                                Equipped
                              </div>
                            )}

                            {/* Item Icon */}
                            <div className="w-full h-24 bg-white/60 rounded-xl flex items-center justify-center border border-white/80 text-4xl">
                              {item.iconEmoji || (item.category === 'skin' ? '🎨' : item.category === 'theme' ? '🌈' : item.category === 'powerup' ? '⚡' : '💎')}
                            </div>

                            {/* Item Info */}
                            <div className="flex-1">
                              <h4 className="font-bold text-slate-800 text-sm leading-tight">{item.name || `Item #${idx + 1}`}</h4>
                              <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed line-clamp-2">{item.description || 'A rare collectible item.'}</p>
                              <span className="inline-block mt-1.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 border border-slate-200 text-slate-500">
                                {item.category || 'Item'}
                              </span>
                            </div>

                            {/* Price + Action */}
                            <div className="flex flex-col gap-2">
                              {!isOwned && (
                                <div className="flex items-center gap-1 text-sm font-extrabold text-amber-600">
                                  <span>🪙</span>
                                  <span>{(item.price || 0).toLocaleString()}</span>
                                </div>
                              )}

                              {isOwned ? (
                                isEquipped ? (
                                  <button
                                    onClick={() => equipStoreItem(item.id)}
                                    className="w-full py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    disabled
                                  >
                                    ✓ Currently Equipped
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => equipStoreItem(item.id)}
                                    className="w-full py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm"
                                  >
                                    Equip Now
                                  </button>
                                )
                              ) : (
                                <button
                                  onClick={() => purchaseStoreItem(item.id)}
                                  disabled={!canAfford}
                                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                                    canAfford
                                      ? 'bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow-md'
                                      : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                  }`}
                                >
                                  {canAfford ? 'Purchase' : 'Not enough coins'}
                                </button>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                  {/* How to earn coins */}
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100 rounded-3xl p-6">
                    <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                      <span className="text-xl">🪙</span> How to Earn Coins
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { action: 'Complete Daily Mission', coins: '+50', emoji: '🎯' },
                        { action: 'Submit a Quest', coins: '+30', emoji: '⚔️' },
                        { action: 'Win a Boss Battle', coins: '+100', emoji: '👑' },
                        { action: 'Maintain 7-day Streak', coins: '+75', emoji: '🔥' },
                      ].map((reward, i) => (
                        <div key={i} className="bg-white/80 border border-amber-100 rounded-xl p-3 text-center">
                          <div className="text-2xl mb-1">{reward.emoji}</div>
                          <div className="text-xs font-bold text-slate-700 leading-tight">{reward.action}</div>
                          <div className="text-sm font-extrabold text-amber-600 mt-1">{reward.coins}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {activeTab === 'leaderboard' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-poppins font-bold text-slate-900 mb-4">Class Leaderboard</h2>
                
                {/* House Scoreboard Standings */}
                {housesScoreboard && housesScoreboard.length > 0 && (
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-8">
                    <h3 className="font-poppins font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                      🏆 House Competition Standings
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {housesScoreboard.map((house, idx) => (
                        <div key={idx} className="p-4 rounded-2xl border border-slate-100 flex flex-col items-center text-center relative overflow-hidden" style={{ background: `${house.colorHex}08`, borderLeft: `4px solid ${house.colorHex}` }}>
                          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-1">{house.name}</span>
                          <strong className="text-2xl font-bold font-poppins" style={{ color: house.colorHex }}>{house.totalPoints} pts</strong>
                          {idx === 0 && <span className="absolute top-1 right-1 text-[10px]">👑</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {/* Top 3 Podiums */}
                  {students.slice(0, 3).map((item, idx) => (
                    <div key={idx} className={`p-6 rounded-3xl shadow-sm border border-slate-100 text-center relative overflow-hidden ${
                      idx === 0 ? 'bg-gradient-to-br from-amber-500/10 to-transparent border-amber-200' :
                      idx === 1 ? 'bg-gradient-to-br from-slate-400/10 to-transparent border-slate-200' :
                      'bg-gradient-to-br from-amber-700/10 to-transparent border-amber-700/20'
                    }`}>
                      <div className="text-4xl mb-2">
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                      </div>
                      <h3 className="font-bold text-slate-800">{item.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider">Rank {idx + 1}</p>
                      
                      <span className="inline-block mt-4 px-4 py-1.5 bg-white border border-slate-100 rounded-xl text-xs font-extrabold text-slate-700">
                        {item.xp} XP
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                    <span className="font-bold text-sm text-slate-800">Classmates Standings</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {students.map((item, idx) => {
                      const isMe = item.email === student.email;
                      return (
                        <div key={idx} className={`p-4 flex justify-between items-center ${isMe ? 'bg-indigo-50/40' : ''}`}>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-bold text-slate-400 w-8">{idx + 1}</span>
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs">
                              {item.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-sm">
                                {item.name} {isMe && <span className="ml-1.5 text-[9px] uppercase tracking-wider font-extrabold bg-primary text-white px-2 py-0.5 rounded-full">Me</span>}
                              </h4>
                              <span className="text-[10px] text-slate-400 block mt-0.5">Streak: {item.streak} days</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="text-xs font-extrabold text-slate-700">{item.xp} XP</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              item.grade.startsWith('A') ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                              item.grade.startsWith('B') ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                              'bg-amber-50 text-amber-700 border-amber-100'
                            }`}>
                              {item.grade}
                            </span>
                          </div>
                        </div>
                      );
                    })}
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

export default StudentDashboard;
