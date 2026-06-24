
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, Lecture } from '../types';
import { MOCK_LECTURES } from '../constants';
import { Wand2, X, Check, Copy, Volume2, VolumeX, History } from 'lucide-react';

interface RephraseHistory {
  [lectureId: string]: {
    content: string;
    styleId: string;
    styleLabel: string;
    date: string;
  };
}

interface LecturesViewProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onBack: () => void;
}

export const LecturesView: React.FC<LecturesViewProps> = ({ profile, onUpdateProfile, onBack }) => {
  const [selectedSubject, setSelectedSubject] = useState<string | 'All'>('All');
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [isRephraseModalOpen, setIsRephraseModalOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [rephrasedContent, setRephrasedContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [rephraseHistory, setRephraseHistory] = useState<RephraseHistory>({});
  const [showXPToast, setShowXPToast] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem('arivo_rephrase_history');
    if (savedHistory) {
      try {
        setRephraseHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse rephrase history', e);
      }
    }
  }, []);

  const saveToHistory = (lectureId: string, content: string, styleId: string, styleLabel: string) => {
    const newHistory = {
      ...rephraseHistory,
      [lectureId]: {
        content,
        styleId,
        styleLabel,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }
    };
    setRephraseHistory(newHistory);
    localStorage.setItem('arivo_rephrase_history', JSON.stringify(newHistory));
  };

  const LEARNING_STYLES = [
    { id: 'simple', label: 'Simple & Easy', description: 'beginner' },
    { id: 'technical', label: 'Detailed & Technical', description: 'advanced' },
    { id: 'story', label: 'Story-based', description: 'narrative' },
    { id: 'bullets', label: 'Bullet Points', description: 'visual learner' },
    { id: 'examples', label: 'Real-life Examples', description: 'practical learner' },
  ];

  const subjects = ['All', ...profile.selectedSubjects];
  const filteredLectures = selectedSubject === 'All' 
    ? MOCK_LECTURES 
    : MOCK_LECTURES.filter(l => l.subject === selectedSubject);

  const renderRephrasedText = (text: string) => {
    return text.split('\n\n').map((paragraph, pIdx) => (
      <p key={pIdx} className="mb-4 last:mb-0">
        {paragraph.split(/(\*\*.*?\*\*)/g).map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <span key={i} className="font-bold text-[#5046e5]">
                {part.slice(2, -2)}
              </span>
            );
          }
          return part;
        })}
      </p>
    ));
  };

  const handleReadAloud = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(rephrasedContent.replace(/\*\*/g, ''));
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rephrasedContent.replace(/\*\*/g, ''));
    setShowCopyFeedback(true);
    setTimeout(() => setShowCopyFeedback(false), 2000);
  };

  const MOCK_QUIZ_QUESTIONS = [
    {
      id: 1,
      question: `What is the primary focus of this ${selectedLecture?.subject} lesson?`,
      options: [
        "Historical background and origins",
        "Fundamental principles and core concepts",
        "Advanced laboratory techniques",
        "Future predictions and trends"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "How does the rephrased content suggest applying these concepts?",
      options: [
        "By memorizing complex formulas",
        "Through real-world applications and daily life",
        "By reading academic journals only",
        "By attending more lectures"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "What is the key takeaway mentioned in the summary?",
      options: [
        "The subject is too difficult for beginners",
        "Consistency is not important for learning",
        "Understanding the basics is crucial for mastery",
        "Only technical details matter"
      ],
      correctAnswer: 2
    }
  ];

  const calculateScore = () => {
    let score = 0;
    MOCK_QUIZ_QUESTIONS.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Lectures</h2>
          <p className="text-slate-500 mt-1 text-sm">Explore your subjects and related video content</p>
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {subjects.map((subject) => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
                selectedSubject === subject
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Lecture List */}
        <div className={`${selectedLecture ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-4`}>
          <AnimatePresence mode="popLayout">
            {filteredLectures.map((lecture) => (
              <motion.div
                layout
                key={lecture.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => setSelectedLecture(lecture)}
                className={`group p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                  selectedLecture?.id === lecture.id
                    ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-200'
                    : 'bg-white border-slate-100 hover:border-indigo-300 hover:shadow-md hover:shadow-slate-200/50'
                }`}
              >
                <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsRephraseModalOpen(true);
                    }}
                    className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg border transition-all text-[9px] font-bold backdrop-blur-sm shadow-sm ${
                      selectedLecture?.id === lecture.id
                        ? 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                        : 'bg-white/90 border-[#5046e5] text-[#5046e5] hover:bg-[#5046e5] hover:text-white'
                    }`}
                  >
                    <Wand2 className="w-2.5 h-2.5" />
                    <span>Rephrase for Me</span>
                  </button>
                  {rephraseHistory[lecture.id] && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLecture(lecture);
                        setRephrasedContent(rephraseHistory[lecture.id].content);
                        setSelectedStyle(rephraseHistory[lecture.id].styleId);
                        setIsPanelOpen(true);
                        setIsGenerating(false);
                        setIsQuizActive(false);
                        setIsQuizFinished(false);
                      }}
                      className={`mt-1.5 flex items-center space-x-1 px-1.5 py-0.5 rounded-md border transition-all text-[8px] font-bold backdrop-blur-sm shadow-sm ${
                        selectedLecture?.id === lecture.id
                          ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                          : 'bg-indigo-50/80 border-indigo-100 text-indigo-600 hover:bg-indigo-100'
                      }`}
                    >
                      <History className="w-2 h-2" />
                      <span>{rephraseHistory[lecture.id].styleLabel} • {rephraseHistory[lecture.id].date}</span>
                    </button>
                  )}
                </div>
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        selectedLecture?.id === lecture.id ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
                      }`}>
                        {lecture.subject}
                      </span>
                      <span className={`text-[10px] font-medium ${
                        selectedLecture?.id === lecture.id ? 'text-indigo-100' : 'text-slate-400'
                      }`}>
                        {lecture.duration} • {lecture.date}
                      </span>
                    </div>
                    <h3 className={`text-base font-bold leading-tight mb-2 ${
                      selectedLecture?.id === lecture.id ? 'text-white' : 'text-slate-900'
                    }`}>
                      {lecture.title}
                    </h3>
                    <p className={`text-xs line-clamp-2 ${
                      selectedLecture?.id === lecture.id ? 'text-indigo-100' : 'text-slate-500'
                    }`}>
                      {lecture.description}
                    </p>
                  </div>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ml-4 transition-transform group-hover:scale-110 ${
                    selectedLecture?.id === lecture.id ? 'bg-white/20 text-white' : 'bg-slate-50 text-slate-400'
                  }`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                {selectedLecture?.id === lecture.id && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredLectures.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">No lectures found</h3>
              <p className="text-sm text-slate-500">Try selecting a different subject or check back later.</p>
            </div>
          )}
        </div>

        {/* Video Player */}
        <AnimatePresence>
          {selectedLecture && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden sticky top-8">
                <div className="aspect-video bg-slate-900 relative group">
                  <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setIsRephraseModalOpen(true)}
                      className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-[#5046e5] text-[#5046e5] bg-white/90 hover:bg-[#5046e5] hover:text-white transition-all text-xs font-bold shadow-lg"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>Rephrase for Me</span>
                    </button>
                    {rephraseHistory[selectedLecture.id] && (
                      <button 
                        onClick={() => {
                          setRephrasedContent(rephraseHistory[selectedLecture.id].content);
                          setSelectedStyle(rephraseHistory[selectedLecture.id].styleId);
                          setIsPanelOpen(true);
                          setIsGenerating(false);
                          setIsQuizActive(false);
                          setIsQuizFinished(false);
                        }}
                        className="flex items-center space-x-1.5 px-2 py-1 rounded-lg border border-indigo-100 bg-indigo-50/50 text-indigo-600 hover:bg-indigo-100 transition-all text-[10px] font-bold shadow-sm"
                      >
                        <History className="w-3 h-3" />
                        <span>{rephraseHistory[selectedLecture.id].styleLabel} • {rephraseHistory[selectedLecture.id].date}</span>
                      </button>
                    )}
                  </div>
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${selectedLecture.youtubeId}?autoplay=1`}
                    title={selectedLecture.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0"
                  ></iframe>
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      {selectedLecture.subject}
                    </span>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => setIsRephraseModalOpen(true)}
                        className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-[#5046e5] text-[#5046e5] hover:bg-[#5046e5] hover:text-white transition-all text-xs font-bold"
                      >
                        <Wand2 className="w-3.5 h-3.5" />
                        <span>Rephrase for Me</span>
                      </button>
                      {rephraseHistory[selectedLecture.id] && (
                        <button 
                          onClick={() => {
                            setRephrasedContent(rephraseHistory[selectedLecture.id].content);
                            setSelectedStyle(rephraseHistory[selectedLecture.id].styleId);
                            setIsPanelOpen(true);
                            setIsGenerating(false);
                            setIsQuizActive(false);
                            setIsQuizFinished(false);
                          }}
                          className="flex items-center space-x-1.5 px-2 py-1 rounded-lg border border-indigo-100 bg-indigo-50/50 text-indigo-600 hover:bg-indigo-100 transition-all text-[10px] font-bold"
                        >
                          <History className="w-3 h-3" />
                          <span>{rephraseHistory[selectedLecture.id].styleLabel} • {rephraseHistory[selectedLecture.id].date}</span>
                        </button>
                      )}
                      <button 
                        onClick={() => setSelectedLecture(null)}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                      >
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-3 tracking-tight leading-tight">
                    {selectedLecture.title}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {selectedLecture.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Duration</p>
                      <p className="text-base font-bold text-slate-900">{selectedLecture.duration}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Published</p>
                      <p className="text-base font-bold text-slate-900">{selectedLecture.date}</p>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                        A
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Arivo AI Assistant</p>
                        <p className="text-xs text-slate-500">Ready to help with this lecture</p>
                      </div>
                    </div>
                    <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                      Generate Notes
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Rephrase Modal */}
      <AnimatePresence>
        {isRephraseModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRephraseModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-[#5046e5]/10 flex items-center justify-center text-[#5046e5]">
                      <Wand2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Select Learning Style</h3>
                  </div>
                  <button 
                    onClick={() => setIsRephraseModalOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 mb-8">
                  {LEARNING_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        selectedStyle === style.id
                          ? 'bg-[#5046e5]/5 border-[#5046e5] shadow-sm'
                          : 'bg-white border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="text-left">
                        <p className={`text-sm font-bold ${selectedStyle === style.id ? 'text-[#5046e5]' : 'text-slate-900'}`}>
                          {style.label}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                          ({style.description})
                        </p>
                      </div>
                      {selectedStyle === style.id && (
                        <div className="w-5 h-5 rounded-full bg-[#5046e5] flex items-center justify-center text-white">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <button
                  disabled={!selectedStyle}
                  onClick={() => {
                    const style = LEARNING_STYLES.find(s => s.id === selectedStyle);
                    const content = selectedLecture?.description || "This lecture covers the fundamental principles of the subject, exploring key concepts and their applications in real-world scenarios.";
                    
                    let rephrased = "";
                    switch(selectedStyle) {
                      case 'simple':
                        rephrased = `Basically, this lesson is about the **main ideas** of ${selectedLecture?.subject}.\n\nWe'll look at how things work in a **very simple way** so anyone can understand it without needing to be an expert. It's like the **"ABC"** of the topic!`;
                        break;
                      case 'technical':
                        rephrased = `This **comprehensive module** provides an **in-depth analytical framework** for ${selectedLecture?.subject}.\n\nWe will rigorously examine the **underlying theoretical constructs**, **mathematical models**, and **empirical evidence** that define the current state of the field, focusing on **high-level integration** and **complex problem-solving**.`;
                        break;
                      case 'story':
                        rephrased = `Imagine you're an **explorer** in the world of ${selectedLecture?.subject}.\n\nYou start your journey by discovering a **mysterious pattern** that changes everything you thought you knew. As we move through the lesson, we'll follow the **trail of discovery** that led scientists to these amazing conclusions.`;
                        break;
                      case 'bullets':
                        rephrased = `• **Core Concept**: Understanding the basics of ${selectedLecture?.subject}\n\n• **Key Takeaway 1**: How it applies to daily life\n\n• **Key Takeaway 2**: Why it matters for your exams\n\n• **Summary**: A quick wrap-up of everything we learned today.`;
                        break;
                      case 'examples':
                        rephrased = `Think about when you're using your **phone** or **cooking dinner**. That's ${selectedLecture?.subject} in action!\n\nIn this lesson, we'll look at **5 specific things** you do every day that are actually governed by these principles, making the **theory** feel much more real.`;
                        break;
                      default:
                        rephrased = content;
                    }

                    setIsRephraseModalOpen(false);
                    setIsPanelOpen(true);
                    setIsGenerating(true);
                    
                    // Simulate generation time
                    setTimeout(() => {
                      setRephrasedContent(rephrased);
                      setIsGenerating(false);
                      if (selectedLecture) {
                        saveToHistory(selectedLecture.id, rephrased, selectedStyle, style?.label || '');
                      }
                    }, 2000);
                  }}
                  className={`w-full py-4 rounded-2xl font-bold text-sm transition-all shadow-lg ${
                    selectedStyle
                      ? 'bg-[#5046e5] text-white shadow-indigo-200 hover:bg-indigo-700'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  Rephrase Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Rephrased Content Panel */}
      <AnimatePresence>
        {isPanelOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPanelOpen(false)}
              className="fixed inset-0 z-[110] bg-slate-900/20 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-white z-[120] shadow-[-20px_0_50px_rgba(0,0,0,0.1)] flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">Rephrased for You</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="px-2 py-0.5 bg-[#5046e5]/10 text-[#5046e5] rounded-md text-[10px] font-bold uppercase tracking-wider">
                      {LEARNING_STYLES.find(s => s.id === selectedStyle)?.label}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsPanelOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <div className="prose prose-slate max-w-none">
                  {isGenerating ? (
                    <div className="space-y-4">
                      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-3 overflow-hidden relative">
                        <div className="h-4 bg-slate-200 rounded-full w-full relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                        </div>
                        <div className="h-4 bg-slate-200 rounded-full w-5/6 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                        </div>
                        <div className="h-4 bg-slate-200 rounded-full w-4/6 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                        </div>
                      </div>
                      <p className="text-sm text-slate-400 font-medium animate-pulse text-center">
                        Personalising content for your learning style…
                      </p>
                    </div>
                  ) : isQuizFinished ? (
                    <div className="space-y-8 pb-12">
                      {/* Score Circle */}
                      <div className="flex flex-col items-center justify-center py-4">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                          <svg className="w-full h-full -rotate-90">
                            <circle
                              cx="64"
                              cy="64"
                              r="58"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="8"
                              className="text-slate-100"
                            />
                            <motion.circle
                              cx="64"
                              cy="64"
                              r="58"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="8"
                              strokeDasharray={364.4}
                              initial={{ strokeDashoffset: 364.4 }}
                              animate={{ strokeDashoffset: 364.4 - (364.4 * calculateScore()) / 3 }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={
                                calculateScore() === 3 ? "text-emerald-500" :
                                calculateScore() >= 2 ? "text-amber-500" : "text-rose-500"
                              }
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <p className="text-2xl font-black text-slate-900">{calculateScore()} / 3</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Correct</p>
                          </div>
                        </div>
                        <h4 className="mt-4 text-lg font-bold text-slate-900">
                          {calculateScore() === 3 ? "Perfect Score!" : 
                           calculateScore() >= 2 ? "Great Job!" : "Keep Practicing!"}
                        </h4>
                      </div>

                      {/* Review Questions */}
                      <div className="space-y-6">
                        {MOCK_QUIZ_QUESTIONS.map((q, idx) => (
                          <div key={q.id} className="space-y-3">
                            <p className="text-xs font-bold text-slate-900 leading-tight">
                              {idx + 1}. {q.question}
                            </p>
                            <div className="space-y-2">
                              {q.options.map((option, oIdx) => {
                                const isSelected = quizAnswers[q.id] === oIdx;
                                const isCorrect = q.correctAnswer === oIdx;
                                
                                let style = "bg-white border-slate-100 text-slate-500";
                                if (isSelected && isCorrect) style = "bg-emerald-50 border-emerald-200 text-emerald-700 ring-1 ring-emerald-500/20";
                                else if (isSelected && !isCorrect) style = "bg-rose-50 border-rose-200 text-rose-700 ring-1 ring-rose-500/20";
                                else if (isCorrect) style = "bg-emerald-50/50 border-emerald-100 text-emerald-600";

                                return (
                                  <div key={oIdx} className={`p-3 rounded-xl border text-[11px] font-medium flex items-center justify-between ${style}`}>
                                    <span>{option}</span>
                                    {isSelected && isCorrect && <Check className="w-3 h-3 text-emerald-500" />}
                                    {isSelected && !isCorrect && <X className="w-3 h-3 text-rose-500" />}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : isQuizActive ? (
                    <div className="space-y-8 pb-8">
                      {/* Step Indicator and Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Question {currentQuestionIndex + 1} of {MOCK_QUIZ_QUESTIONS.length}
                          </p>
                          <p className="text-[10px] font-bold text-[#5046e5]">
                            {Math.round(((currentQuestionIndex + 1) / MOCK_QUIZ_QUESTIONS.length) * 100)}%
                          </p>
                        </div>
                        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentQuestionIndex + 1) / MOCK_QUIZ_QUESTIONS.length) * 100}%` }}
                            className="h-full bg-[#5046e5]"
                          />
                        </div>
                      </div>

                      {/* Current Question */}
                      <AnimatePresence mode="wait">
                        <motion.div 
                          key={currentQuestionIndex}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4"
                        >
                          <p className="text-sm font-bold text-slate-900 leading-tight">
                            {MOCK_QUIZ_QUESTIONS[currentQuestionIndex].question}
                          </p>
                          <div className="grid grid-cols-1 gap-2">
                            {MOCK_QUIZ_QUESTIONS[currentQuestionIndex].options.map((option, oIdx) => (
                              <button
                                key={oIdx}
                                onClick={() => setQuizAnswers(prev => ({ ...prev, [MOCK_QUIZ_QUESTIONS[currentQuestionIndex].id]: oIdx }))}
                                className={`w-full text-left p-4 rounded-2xl border transition-all text-xs font-medium ${
                                  quizAnswers[MOCK_QUIZ_QUESTIONS[currentQuestionIndex].id] === oIdx
                                    ? 'bg-[#5046e5]/5 border-[#5046e5] text-[#5046e5] shadow-sm'
                                    : 'bg-white border-slate-100 hover:border-slate-200 text-slate-600'
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      </AnimatePresence>

                      {/* Navigation Buttons */}
                      <div className="flex items-center space-x-3">
                        <button
                          disabled={currentQuestionIndex === 0}
                          onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                          className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all border ${
                            currentQuestionIndex === 0
                              ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          Previous
                        </button>
                        <button
                          disabled={currentQuestionIndex === MOCK_QUIZ_QUESTIONS.length - 1}
                          onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                          className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all border ${
                            currentQuestionIndex === MOCK_QUIZ_QUESTIONS.length - 1
                              ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                              : 'bg-[#5046e5]/10 text-[#5046e5] border-[#5046e5]/20 hover:bg-[#5046e5]/20'
                          }`}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="relative group/content">
                        <div className="absolute top-4 right-4 flex items-center space-x-2 z-20">
                          <button 
                            onClick={handleReadAloud}
                            className={`p-2 rounded-xl transition-all ${
                              isSpeaking 
                                ? 'bg-[#5046e5] text-white shadow-lg shadow-indigo-200' 
                                : 'bg-white text-slate-400 hover:text-[#5046e5] border border-slate-100 hover:border-indigo-100 shadow-sm'
                            }`}
                            title={isSpeaking ? "Stop Reading" : "Read Aloud"}
                          >
                            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          </button>
                          <button 
                            onClick={handleCopy}
                            className="p-2 bg-white text-slate-400 hover:text-[#5046e5] border border-slate-100 hover:border-indigo-100 rounded-xl transition-all shadow-sm relative"
                            title="Copy Text"
                          >
                            <Copy className="w-4 h-4" />
                            <AnimatePresence>
                              {showCopyFeedback && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: -30 }}
                                  exit={{ opacity: 0 }}
                                  className="absolute left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded font-bold whitespace-nowrap"
                                >
                                  Copied!
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </button>
                        </div>
                        <div className="bg-slate-50 rounded-3xl p-8 pt-12 border border-slate-100 italic text-slate-700 leading-relaxed">
                          {renderRephrasedText(rephrasedContent)}
                        </div>
                      </div>
                      
                      <div className="mt-8 space-y-6">
                        <p className="text-sm text-slate-500 leading-relaxed">
                          This content has been tailored to your <span className="font-bold text-[#5046e5]">{LEARNING_STYLES.find(s => s.id === selectedStyle)?.description}</span> learning style. 
                          Would you like to test your understanding of this rephrased version?
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="p-6 bg-white border-t border-slate-100">
                {isQuizFinished ? (
                  <div className="flex flex-col space-y-3">
                    <button 
                      onClick={() => {
                        setQuizAnswers({});
                        setCurrentQuestionIndex(0);
                        setIsQuizFinished(false);
                      }}
                      className="w-full py-4 bg-white text-[#5046e5] border-2 border-[#5046e5] rounded-2xl font-bold text-sm hover:bg-[#5046e5]/5 transition-all"
                    >
                      Try Again
                    </button>
                    <button 
                      onClick={() => {
                        setIsPanelOpen(false);
                        setIsQuizActive(false);
                        setIsQuizFinished(false);
                        setQuizAnswers({});
                        setCurrentQuestionIndex(0);
                      }}
                      className="w-full py-4 bg-[#5046e5] text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                    >
                      Back to Lecture
                    </button>
                  </div>
                ) : (
                  <button 
                    disabled={isGenerating || (isQuizActive && Object.keys(quizAnswers).length < 3)}
                    onClick={() => {
                      if (isQuizActive) {
                        const score = calculateScore();
                        if (score >= 2) {
                          setShowXPToast(true);
                          onUpdateProfile({ xp: profile.xp + 30 });
                          setTimeout(() => setShowXPToast(false), 3000);
                        }
                        setIsQuizFinished(true);
                      } else {
                        setIsQuizActive(true);
                        setCurrentQuestionIndex(0);
                      }
                    }}
                    className={`w-full py-4 rounded-2xl font-bold text-sm shadow-lg transition-all ${
                      isGenerating || (isQuizActive && Object.keys(quizAnswers).length < 3)
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                        : 'bg-[#5046e5] text-white shadow-indigo-100 hover:bg-indigo-700'
                    }`}
                  >
                    {isQuizActive ? 'Submit Answers' : 'Answer Questions'}
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* XP Toast Notification */}
      <AnimatePresence>
        {showXPToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: 50 }}
            animate={{ opacity: 1, y: 20, x: -20 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed top-4 right-4 z-[200] bg-white rounded-2xl shadow-2xl border border-indigo-100 p-4 flex items-center space-x-4 pr-8"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl">
              🎉
            </div>
            <div>
              <p className="text-sm font-bold text-indigo-600">+30 XP Earned!</p>
              <p className="text-[10px] text-slate-500 font-medium">Great understanding!</p>
            </div>
            <div className="absolute top-2 right-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
