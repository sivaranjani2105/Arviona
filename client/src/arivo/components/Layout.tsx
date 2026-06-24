
import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { UserProfile } from '../types';
import { motion } from 'framer-motion';
import { CommandPalette } from './CommandPalette';
import { ChatAIPanel } from './ChatAI';

interface LayoutProps {
  children: React.ReactNode;
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  activeView: 'dashboard' | 'assessment' | 'profile' | 'settings' | 'add-lecture' | 'lectures' | 'assignments' | 'submit-assignment' | 'assignment-detail' | 'achievements' | 'rewards' | 'analytics' | 'schedule';
  onNavigate: (view: 'dashboard' | 'assessment' | 'profile' | 'settings' | 'add-lecture' | 'lectures' | 'assignments' | 'submit-assignment' | 'assignment-detail' | 'achievements' | 'rewards' | 'analytics' | 'schedule') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, profile, onUpdateProfile, activeView, onNavigate }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`flex min-h-screen w-full transition-colors duration-500 ${profile.preferences.darkMode ? 'dark bg-slate-900' : 'bg-[#F8FAFC]'}`}>
      <Sidebar 
        profile={profile} 
        onUpdateProfile={onUpdateProfile}
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        activeView={activeView}
        onNavigate={onNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
      
      <CommandPalette 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        profile={profile}
        onNavigate={onNavigate}
      />

      <ChatAIPanel profile={profile} />

      {/* Content Container */}
      <main 
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        } ml-0`}
      >
        <div className="min-h-screen p-4 md:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
