
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Book, GraduationCap, PlayCircle, X, Command } from 'lucide-react';
import { UserProfile, Lecture } from '../types';
import { MOCK_LECTURES } from '../constants';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onNavigate: (view: any) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, profile, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Combine data for searching
  const subjects = profile.selectedSubjects.map(s => ({ type: 'subject', title: s, id: s }));
  const lectures = MOCK_LECTURES.map(l => ({ type: 'lecture', title: l.title, id: l.id, subtitle: l.subject }));
  const assessments = profile.selectedSubjects.map(s => ({ type: 'assessment', title: `${s} Assessment`, id: s }));

  const allItems = [...subjects, ...lectures, ...assessments];

  const filteredItems = query.trim() === '' 
    ? [] 
    : allItems.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 8);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // This will be handled by the parent if we want global Cmd+K
          // But for now, if it's already rendered, we can toggle it
        }
      }

      if (e.key === 'Escape') {
        onClose();
      }

      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % filteredItems.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
        } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
          handleSelect(filteredItems[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSelect = (item: any) => {
    if (item.type === 'subject' || item.type === 'lecture') {
      onNavigate('lectures');
    } else if (item.type === 'assessment') {
      onNavigate('assessment');
    }
    onClose();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'subject': return <Book className="w-4 h-4" />;
      case 'lecture': return <PlayCircle className="w-4 h-4" />;
      case 'assessment': return <GraduationCap className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className={`relative w-full max-w-2xl overflow-hidden rounded-2xl border shadow-2xl ${
              profile.preferences.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center px-4 py-4 border-b border-slate-100 dark:border-slate-700">
              <Search className={`w-5 h-5 mr-3 ${profile.preferences.darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Search lectures, subjects, assessments..."
                className={`flex-1 bg-transparent border-none outline-none text-lg font-medium ${
                  profile.preferences.darkMode ? 'text-white placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'
                }`}
              />
              <div className="flex items-center space-x-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                <Command className="w-3 h-3" />
                <span>K</span>
              </div>
              <button 
                onClick={onClose}
                className="ml-4 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {query.trim() === '' ? (
                <div className="p-8 text-center">
                  <p className={`text-sm font-medium ${profile.preferences.darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Start typing to search across your learning materials...
                  </p>
                </div>
              ) : filteredItems.length > 0 ? (
                <div className="space-y-1">
                  {filteredItems.map((item, index) => (
                    <button
                      key={`${item.type}-${item.id}`}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center px-4 py-3 rounded-xl transition-all text-left ${
                        index === selectedIndex 
                          ? profile.preferences.darkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                          : profile.preferences.darkMode ? 'text-slate-300 hover:bg-slate-700/50' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg mr-4 ${
                        index === selectedIndex 
                          ? profile.preferences.darkMode ? 'bg-indigo-500/20' : 'bg-white shadow-sm'
                          : profile.preferences.darkMode ? 'bg-slate-700' : 'bg-slate-100'
                      }`}>
                        {getIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{item.title}</div>
                        {item.subtitle && (
                          <div className={`text-[10px] font-medium uppercase tracking-wider ${
                            index === selectedIndex ? 'opacity-70' : 'text-slate-400'
                          }`}>
                            {item.subtitle}
                          </div>
                        )}
                      </div>
                      <div className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                        index === selectedIndex 
                          ? profile.preferences.darkMode ? 'bg-indigo-500/30 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                          : profile.preferences.darkMode ? 'bg-slate-700 text-slate-500' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {item.type}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className={`text-sm font-medium ${profile.preferences.darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    No results found for "{query}"
                  </p>
                </div>
              )}
            </div>

            <div className={`px-4 py-3 border-t flex items-center justify-between text-[10px] font-bold uppercase tracking-wider ${
              profile.preferences.darkMode ? 'bg-slate-900/50 border-slate-700 text-slate-500' : 'bg-slate-50 border-slate-100 text-slate-400'
            }`}>
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700">↑↓</span>
                  <span>Navigate</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700">Enter</span>
                  <span>Select</span>
                </span>
              </div>
              <span className="flex items-center space-x-1">
                <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700">Esc</span>
                <span>Close</span>
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
