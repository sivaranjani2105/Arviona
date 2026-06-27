import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Sword, Shield, Trophy, Clock, Zap, ChevronRight, Star, X, CheckCircle2, XCircle } from 'lucide-react';

const DIFFICULTY_CONFIG = {
  EASY:      { color: '#22C55E', label: 'Easy',      emoji: '🌱', timeBonus: 1.2 },
  MEDIUM:    { color: '#F59E0B', label: 'Medium',    emoji: '⚔️',  timeBonus: 1.0 },
  HARD:      { color: '#EF4444', label: 'Hard',      emoji: '🔥',  timeBonus: 0.8 },
  LEGENDARY: { color: '#8B5CF6', label: 'Legendary', emoji: '👑',  timeBonus: 0.6 },
};

const BossBattle = ({ battle, onClose, onComplete }) => {
  const { questionsPool, submitBossBattle } = useData();
  const navigate = useNavigate();

  const [phase, setPhase]     = useState('intro');    // intro | battle | result
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected]   = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers]     = useState([]);     // array of booleans
  const [timeLeft, setTimeLeft]   = useState(0);
  const [result, setResult]       = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const diffCfg = DIFFICULTY_CONFIG[battle.difficulty] || DIFFICULTY_CONFIG.MEDIUM;
  const totalTime = (battle.timeLimitMins || 30) * 60;

  // Build question list from pool
  const buildQuestions = useCallback(() => {
    const pool = questionsPool[battle.subject] || {};
    const difficulties = ['Easy', 'Medium', 'Hard'];
    const all = [];
    difficulties.forEach(d => { if (pool[d]) all.push(...pool[d]); });
    // Shuffle and pick totalQuestions
    const shuffled = [...all].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, battle.totalQuestions || 5);
  }, [questionsPool, battle]);

  const startBattle = () => {
    const qs = buildQuestions();
    setQuestions(qs);
    setTimeLeft(totalTime);
    setPhase('battle');
    setCurrentIdx(0);
    setAnswers([]);
    setSelected(null);
    setConfirmed(false);
  };

  // Countdown timer
  useEffect(() => {
    if (phase !== 'battle' || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { handleFinish(answers); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, timeLeft]);

  const handleConfirm = () => {
    if (selected === null || confirmed) return;
    setConfirmed(true);
    setShowAnswer(true);
    const q = questions[currentIdx];
    const correct = selected === q.correct;
    setAnswers(prev => [...prev, correct]);
  };

  const handleNext = () => {
    if (currentIdx + 1 >= questions.length) {
      handleFinish([...answers]);
    } else {
      setCurrentIdx(prev => prev + 1);
      setSelected(null);
      setConfirmed(false);
      setShowAnswer(false);
    }
  };

  const handleFinish = async (finalAnswers) => {
    const correctCount = finalAnswers.filter(Boolean).length;
    setPhase('result');
    try {
      const res = await submitBossBattle(battle.id, correctCount);
      setResult({ ...res, correctCount, total: questions.length });
    } catch {
      const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
      setResult({ won: score >= 60, score, correctCount, total: questions.length,
                  xpAwarded: score >= 60 ? battle.xpReward : Math.round(battle.xpReward / 4),
                  coinsAwarded: score >= 60 ? battle.coinsReward : Math.round(battle.coinsReward / 4) });
    }
  };

  const pct = questions.length > 0 ? Math.round((timeLeft / totalTime) * 100) : 100;
  const timeColor = pct > 50 ? '#22C55E' : pct > 25 ? '#F59E0B' : '#EF4444';
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');
  const currentQ = questions[currentIdx];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <AnimatePresence mode="wait">

        {/* ── INTRO ── */}
        {phase === 'intro' && (
          <motion.div key="intro"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gradient-to-br from-[#0F172A] to-[#1E1B4B] border border-[#334155] rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl relative"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={20}/></button>
            <div className="text-7xl mb-4">{diffCfg.emoji}</div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3"
              style={{ background: diffCfg.color + '20', color: diffCfg.color, border: `1px solid ${diffCfg.color}40` }}>
              {diffCfg.label} Difficulty
            </div>
            <h1 className="text-3xl font-extrabold text-white font-poppins mb-2">{battle.title}</h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">{battle.description}</p>

            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { label: 'Questions', val: battle.totalQuestions || 5, icon: '❓' },
                { label: 'Time Limit', val: `${battle.timeLimitMins}m`, icon: '⏱' },
                { label: 'XP Reward', val: `+${battle.xpReward}`, icon: '⚡' },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-3">
                  <div className="text-xl mb-1">{s.icon}</div>
                  <div className="text-white font-bold text-lg">{s.val}</div>
                  <div className="text-slate-500 text-xs">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 mb-6 text-xs text-amber-300">
              ⚠️ Score ≥ 60% to WIN and claim full rewards. Below that earns 25% rewards.
            </div>

            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={startBattle}
              className="w-full py-4 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-extrabold rounded-2xl text-lg shadow-lg flex items-center justify-center gap-3"
            >
              <Sword size={22}/> Begin Boss Battle
            </motion.button>
          </motion.div>
        )}

        {/* ── BATTLE ── */}
        {phase === 'battle' && currentQ && (
          <motion.div key="battle"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-gradient-to-br from-[#0F172A] to-[#1E1B4B] border border-[#334155] rounded-3xl p-6 max-w-2xl w-full shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Q {currentIdx + 1} / {questions.length}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: diffCfg.color + '20', color: diffCfg.color }}>
                  {currentQ.difficulty}
                </span>
              </div>
              {/* Timer */}
              <div className="flex items-center gap-1.5" style={{ color: timeColor }}>
                <Clock size={16}/>
                <span className="font-extrabold font-mono text-lg">{mins}:{secs}</span>
              </div>
            </div>

            {/* Timer bar */}
            <div className="w-full bg-slate-700 h-1.5 rounded-full mb-6 overflow-hidden">
              <motion.div className="h-1.5 rounded-full" animate={{ width: `${pct}%` }}
                style={{ background: timeColor }} transition={{ duration: 0.5 }}/>
            </div>

            {/* Question */}
            <h2 className="text-white text-xl font-bold leading-relaxed mb-6 min-h-[60px]">
              {currentQ.question}
            </h2>

            {/* Options */}
            <div className="grid grid-cols-1 gap-3 mb-6">
              {(currentQ.options || []).map((opt, idx) => {
                let cls = 'border border-[#334155] bg-white/5 text-slate-300 hover:border-[#6366F1] hover:bg-[#6366F1]/10 hover:text-white';
                if (selected === idx && !confirmed) cls = 'border-[#6366F1] bg-[#6366F1]/20 text-white';
                if (confirmed) {
                  if (idx === currentQ.correct)   cls = 'border-emerald-500 bg-emerald-500/20 text-emerald-300';
                  else if (idx === selected && selected !== currentQ.correct)
                    cls = 'border-red-500 bg-red-500/20 text-red-300';
                  else cls = 'border-[#334155] bg-white/5 text-slate-500';
                }
                return (
                  <motion.button key={idx} whileHover={!confirmed ? { scale: 1.01 } : {}}
                    onClick={() => !confirmed && setSelected(idx)}
                    className={`w-full text-left px-5 py-3.5 rounded-2xl font-semibold text-sm transition-all border ${cls} flex items-center justify-between`}
                  >
                    <span><span className="font-bold mr-3 text-slate-400">{String.fromCharCode(65 + idx)}.</span>{opt}</span>
                    {confirmed && idx === currentQ.correct && <CheckCircle2 size={18} className="text-emerald-400 shrink-0"/>}
                    {confirmed && idx === selected && selected !== currentQ.correct && <XCircle size={18} className="text-red-400 shrink-0"/>}
                  </motion.button>
                );
              })}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              {!confirmed ? (
                <motion.button whileTap={{ scale: 0.97 }}
                  onClick={handleConfirm}
                  disabled={selected === null}
                  className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${
                    selected !== null
                      ? 'bg-[#6366F1] text-white hover:bg-[#4F46E5]'
                      : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Confirm Answer
                </motion.button>
              ) : (
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleNext}
                  className="flex-1 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white flex items-center justify-center gap-2"
                >
                  {currentIdx + 1 >= questions.length ? '🏁 Finish Battle' : <>Next Question <ChevronRight size={16}/></>}
                </motion.button>
              )}
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-1.5 mt-5">
              {questions.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all ${
                  i < answers.length
                    ? (answers[i] ? 'bg-emerald-400' : 'bg-red-400')
                    : i === currentIdx ? 'bg-[#818CF8] scale-125' : 'bg-slate-600'
                }`}/>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── RESULT ── */}
        {phase === 'result' && result && (
          <motion.div key="result"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="bg-gradient-to-br from-[#0F172A] to-[#1E1B4B] border border-[#334155] rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl"
          >
            {/* Win/Loss banner */}
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
              className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto mb-4 ${
                result.won ? 'bg-gradient-to-br from-amber-400 to-yellow-500' : 'bg-gradient-to-br from-slate-600 to-slate-700'
              }`}>
              {result.won ? '🏆' : '💀'}
            </motion.div>

            <h2 className={`text-3xl font-extrabold font-poppins mb-1 ${ result.won ? 'text-amber-400' : 'text-slate-300'}`}>
              {result.won ? 'Victory!' : 'Defeated!'}
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              {result.won
                ? 'Outstanding! You conquered the Boss Battle!'
                : 'You fought bravely. Train harder and return stronger!'}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: 'Score',      val: `${result.score}%`,          icon: '📊', color: result.won ? '#22C55E' : '#EF4444' },
                { label: 'Correct',    val: `${result.correctCount}/${result.total}`, icon: '✅', color: '#818CF8' },
                { label: 'XP Earned',  val: `+${result.xpAwarded || 0}`, icon: '⚡', color: '#F59E0B' },
                { label: 'Coins',      val: `+${result.coinsAwarded || 0}`, icon: '🪙', color: '#F59E0B' },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="font-extrabold text-xl" style={{ color: s.color }}>{s.val}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{s.label}</div>
                </motion.div>
              ))}
            </div>

            {result.levelUp && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/40 rounded-2xl px-4 py-3 mb-5 text-amber-300 font-bold text-sm">
                🎉 LEVEL UP! You are now Level {result.level}!
              </motion.div>
            )}

            <div className="flex gap-3">
              <button onClick={onClose}
                className="flex-1 py-3 rounded-2xl text-sm font-bold border border-slate-600 text-slate-300 hover:border-slate-400 transition-all">
                Back to Dashboard
              </button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => { setPhase('intro'); setResult(null); setAnswers([]); }}
                className="flex-1 py-3 rounded-2xl text-sm font-bold bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white">
                ⚔️ Try Again
              </motion.button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default BossBattle;
