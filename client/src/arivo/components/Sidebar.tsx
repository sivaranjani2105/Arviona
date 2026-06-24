
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile } from '../types';

interface SidebarProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  isCollapsed: boolean;
  onToggle: () => void;
  activeView: 'dashboard' | 'assessment' | 'profile' | 'settings' | 'add-lecture' | 'lectures' | 'assignments' | 'submit-assignment' | 'assignment-detail' | 'achievements' | 'rewards' | 'analytics' | 'schedule';
  onNavigate: (view: 'dashboard' | 'assessment' | 'profile' | 'settings' | 'add-lecture' | 'lectures' | 'assignments' | 'submit-assignment' | 'assignment-detail' | 'achievements' | 'rewards' | 'analytics' | 'schedule') => void;
  onOpenSearch: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Home', icon: (active: boolean) => (
    <svg className={`w-6 h-6 ${active ? 'text-indigo-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )},
  { id: 'add-lecture', label: 'Add Lecture', icon: (active: boolean) => (
    <svg className={`w-6 h-6 ${active ? 'text-indigo-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )},
  { id: 'assessment', label: 'Take Assessment', icon: (active: boolean) => (
    <svg className={`w-6 h-6 ${active ? 'text-indigo-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  )},
  { id: 'lectures', label: 'Lectures', icon: (active: boolean) => (
    <svg className={`w-6 h-6 ${active ? 'text-indigo-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  )},
  { id: 'assignments', label: 'Assignments', icon: (active: boolean) => (
    <svg className={`w-6 h-6 ${active ? 'text-indigo-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )},
  { id: 'analytics', label: 'Analytics', icon: (active: boolean) => (
    <svg className={`w-6 h-6 ${active ? 'text-indigo-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )},
  { id: 'schedule', label: 'Schedule', icon: (active: boolean) => (
    <svg className={`w-6 h-6 ${active ? 'text-indigo-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )},
  { id: 'achievements', label: 'Achievements', icon: (active: boolean) => (
    <svg className={`w-6 h-6 ${active ? 'text-indigo-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.703 2.703 0 01-3 0 2.703 2.703 0 01-3 0 2.703 2.703 0 01-3 0 2.704 2.704 0 01-1.5-.454M21 15.546V6a2 2 0 00-2-2H5a2 2 0 00-2 2v9.546m18 0v3.454a2 2 0 01-2 2H5a2 2 0 01-2-2v-3.454m18 0h-2M3 15.546h2m11-8.546a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )},
  { id: 'rewards', label: 'Rewards', icon: (active: boolean) => (
    <svg className={`w-6 h-6 ${active ? 'text-indigo-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  )},
];

const secondaryItems = [
  { id: 'profile', label: 'Profile', icon: (active: boolean) => (
    <svg className={`w-6 h-6 ${active ? 'text-indigo-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )},
  { id: 'settings', label: 'Settings', icon: (active: boolean) => (
    <svg className={`w-6 h-6 ${active ? 'text-indigo-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )},
];

const NavButton: React.FC<{ 
  item: any; 
  isCollapsed: boolean; 
  activeView: string; 
  onNavigate: (view: any) => void;
}> = ({ item, isCollapsed, activeView, onNavigate }) => {
  const isActive = activeView === item.id || (item.id === 'assignments' && (activeView === 'submit-assignment' || activeView === 'assignment-detail'));
  return (
    <button
      onClick={() => {
        if (['dashboard', 'assessment', 'profile', 'settings', 'add-lecture', 'lectures', 'assignments', 'achievements', 'rewards', 'analytics', 'schedule'].includes(item.id)) {
          onNavigate(item.id as any);
        }
      }}
      className={`w-full group flex items-center p-3 rounded-xl transition-all duration-300 relative mb-1 ${
        isActive 
          ? 'bg-indigo-600/10 text-indigo-400' 
          : 'text-slate-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <div className="min-w-[40px] flex justify-center">
        {item.icon(isActive)}
      </div>
      {!isCollapsed && (
        <motion.span 
          initial={{ opacity: 0, x: -10 }} 
          animate={{ opacity: 1, x: 0 }}
          className={`ml-3 text-sm font-semibold whitespace-nowrap`}
        >
          {item.label}
        </motion.span>
      )}
      {isActive && !isCollapsed && (
        <motion.div 
          layoutId="sidebar-active-pill"
          className="absolute right-0 w-1 h-6 bg-indigo-500 rounded-l-full"
        />
      )}
    </button>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ profile, onUpdateProfile, isCollapsed, onToggle, activeView, onNavigate, onOpenSearch }) => {
  const firstName = profile.fullName.split(' ')[0] || 'Student';

  return (
    <aside 
      className={`fixed left-0 top-0 h-full bg-[#0F172A] text-white transition-all duration-300 z-50 flex flex-col border-r border-slate-800 ${
        isCollapsed ? 'w-20' : 'w-72'
      } hidden lg:flex`}
    >
      <div className="h-24 flex items-center px-6 mb-2">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div 
            onClick={() => onNavigate('dashboard')}
            className="min-w-[40px] w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20 cursor-pointer hover:bg-indigo-500 transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-xl font-bold tracking-tight text-white cursor-pointer"
              onClick={() => onNavigate('dashboard')}
            >
              Arivo
            </motion.span>
          )}
        </div>
      </div>

      {/* Search Trigger */}
      <div className="px-4 mb-6">
        <button 
          onClick={onOpenSearch}
          className={`w-full flex items-center p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-600 transition-all group ${isCollapsed ? 'justify-center' : ''}`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {!isCollapsed && (
            <div className="ml-3 flex-1 flex items-center justify-between">
              <span className="text-sm font-medium">Search...</span>
              <div className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-slate-900 text-[10px] font-bold text-slate-500 border border-slate-700">
                <span>⌘</span>
                <span>K</span>
              </div>
            </div>
          )}
        </button>
      </div>

      <button 
        onClick={onToggle}
        className="absolute -right-3 top-10 bg-[#1E293B] border border-slate-700 w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-white shadow-xl hover:bg-indigo-600 hover:border-indigo-500 transition-all z-[60]"
      >
        <svg className={`w-3 h-3 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-hide">
        <p className={`text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 px-2 ${isCollapsed ? 'text-center' : ''}`}>
          {isCollapsed ? '•••' : 'Main Menu'}
        </p>
        {navItems.map((item) => (
          <NavButton 
            key={item.id} 
            item={item} 
            isCollapsed={isCollapsed} 
            activeView={activeView} 
            onNavigate={onNavigate} 
          />
        ))}

        <div className="pt-8 pb-4">
          <p className={`text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 px-2 ${isCollapsed ? 'text-center' : ''}`}>
            {isCollapsed ? '•••' : 'Account'}
          </p>
          {secondaryItems.map((item) => (
            <NavButton 
              key={item.id} 
              item={item} 
              isCollapsed={isCollapsed} 
              activeView={activeView} 
              onNavigate={onNavigate} 
            />
          ))}
        </div>
      </div>

      {/* Crystals Counter */}
      <div className="px-4 mb-4">
        <div className="group relative">
          <div className={`flex items-center p-3 rounded-2xl bg-slate-900/40 border border-slate-800/50 transition-all duration-300 hover:border-cyan-500/30 ${isCollapsed ? 'justify-center' : ''}`}>
            <div 
              className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-xl relative"
              style={{ 
                animation: 'gem-pulse 3s infinite, gem-scale 5s infinite'
              }}
            >
              💎
            </div>
            {!isCollapsed && (
              <div className="ml-3">
                <p className="text-sm font-black text-white tracking-tight">1,240 <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest ml-1">Crystals</span></p>
              </div>
            )}
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-800 shadow-2xl z-50">
            Earn crystals by completing lessons and assessments
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
          </div>
        </div>
      </div>

      <div className="p-4 mt-auto border-t border-slate-800/50 bg-slate-900/50 flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onNavigate('profile')}
            className={`flex-1 group relative flex items-center p-2 rounded-2xl transition-all duration-300 ${
              activeView === 'profile' ? 'bg-indigo-600/10 ring-1 ring-indigo-500/20' : 'hover:bg-white/5'
            }`}
          >
            <div className="min-w-[40px] w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center font-bold text-sm shadow-lg ring-2 ring-indigo-500/20 group-hover:scale-110 transition-transform">
              {firstName[0]}
            </div>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="ml-3 flex-1 min-w-0 text-left"
              >
                <p className={`text-sm font-bold truncate ${activeView === 'profile' ? 'text-indigo-400' : 'text-white'}`}>
                  {profile.fullName}
                </p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{profile.userType}</p>
              </motion.div>
            )}
          </button>

          {!isCollapsed && (
            <button
              onClick={() => onUpdateProfile({ 
                preferences: { ...profile.preferences, darkMode: !profile.preferences.darkMode } 
              })}
              className="ml-2 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all shadow-lg"
              title={profile.preferences.darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {profile.preferences.darkMode ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          )}
        </div>
        
        {isCollapsed && (
          <button
            onClick={() => onUpdateProfile({ 
              preferences: { ...profile.preferences, darkMode: !profile.preferences.darkMode } 
            })}
            className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all shadow-lg flex justify-center"
            title={profile.preferences.darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {profile.preferences.darkMode ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </aside>
  );
};