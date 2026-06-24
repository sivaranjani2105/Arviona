
import React, { useState, useCallback } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginScreen } from './components/LoginScreen';
import { UserTypeSelection } from './components/UserTypeSelection';
import { AboutYouStep } from './components/AboutYouStep';
import { SubjectsStep } from './components/SubjectsStep';
import { PreferencesStep } from './components/PreferencesStep';
import { Dashboard } from './components/Dashboard';
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import { Stepper } from './components/Stepper';
import { Layout } from './components/Layout';
import { AssessmentView } from './components/AssessmentView';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { AddLectureView } from './components/AddLectureView';
import { LecturesView } from './components/LecturesView';
import { AnalyticsView } from './components/AnalyticsView';
import { ScheduleView } from './components/ScheduleView';
import { AssignmentsView } from './components/AssignmentsView';
import { SubmitAssignmentView } from './components/SubmitAssignmentView';
import { AssignmentDetailView } from './components/AssignmentDetailView';
import { AchievementsView } from './components/AchievementsView';
import { RewardsView } from './components/RewardsView';
import { OnboardingStep, UserProfile, UserType, Assignment } from './types';
import { AnimatePresence, motion } from 'framer-motion';
import { ChatProvider } from './components/ChatContext';

const INITIAL_PROFILE: UserProfile = {
  userType: null,
  fullName: '',
  email: 'student@learnway.edu',
  selectedSubjects: [],
  difficulty: 'Intermediate',
  xp: 425,
  level: 7,
  preferences: {
    notifications: true,
    darkMode: false,
    weeklyDigest: true,
    examAlerts: true,
    fontSize: 16,
  }
};

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'login' | 'onboarding' | 'dashboard' | 'assessment' | 'profile' | 'settings' | 'add-lecture' | 'lectures' | 'assignments' | 'submit-assignment' | 'assignment-detail' | 'achievements' | 'rewards' | 'analytics' | 'schedule'>('landing');
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(OnboardingStep.USER_TYPE);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const handleLogin = useCallback(() => {
    setView('onboarding');
  }, []);

  const handleUserTypeSelect = useCallback((type: UserType) => {
    setProfile(prev => ({ ...prev, userType: type }));
  }, []);

  const handleNextStep = useCallback(() => {
    setCurrentStep(prev => prev + 1);
  }, []);

  const handlePrevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  }, []);

  const handleFinish = useCallback(() => {
    setView('dashboard');
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, []);

  const navigateTo = useCallback((newView: 'dashboard' | 'assessment' | 'profile' | 'settings' | 'add-lecture' | 'lectures' | 'assignments' | 'submit-assignment' | 'assignment-detail' | 'achievements' | 'rewards' | 'analytics' | 'schedule') => {
    setView(newView);
  }, []);

  return (
    <ChatProvider>
      <div className={`min-h-screen transition-colors duration-500 ${profile.preferences.darkMode ? 'bg-slate-900' : 'animated-bg'}`}>
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <LandingPage onSignIn={() => setView('login')} />
            </motion.div>
          )}

          {view === 'login' && (
            <motion.div
              key="login"
              className="min-h-screen flex items-center justify-center p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <LoginScreen onLogin={handleLogin} />
            </motion.div>
          )}

          {view === 'onboarding' && (
            <motion.div
              key="onboarding"
              className="min-h-screen flex items-center justify-center p-4 w-full max-w-4xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-full">
                {currentStep > OnboardingStep.USER_TYPE && (
                  <Stepper currentStep={currentStep} />
                )}

                <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/40 p-8 md:p-12 relative overflow-hidden min-h-[500px] flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    {currentStep === OnboardingStep.USER_TYPE && (
                      <UserTypeSelection 
                        key="type" 
                        selected={profile.userType} 
                        onSelect={handleUserTypeSelect} 
                        onNext={handleNextStep} 
                      />
                    )}
                    {currentStep === OnboardingStep.ABOUT_YOU && (
                      <AboutYouStep 
                        key="about" 
                        profile={profile} 
                        onUpdate={updateProfile} 
                        onNext={handleNextStep} 
                        onBack={handlePrevStep}
                      />
                    )}
                    {currentStep === OnboardingStep.SUBJECTS && (
                      <SubjectsStep 
                        key="subjects" 
                        profile={profile} 
                        onUpdate={updateProfile} 
                        onNext={handleNextStep} 
                        onBack={handlePrevStep}
                      />
                    )}
                    {currentStep === OnboardingStep.PREFERENCES && (
                      <PreferencesStep 
                        key="preferences" 
                        profile={profile} 
                        onUpdate={updateProfile} 
                        onFinish={handleFinish} 
                        onBack={handlePrevStep}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {['dashboard', 'assessment', 'profile', 'settings', 'add-lecture', 'lectures', 'assignments', 'submit-assignment', 'assignment-detail', 'achievements', 'rewards', 'analytics', 'schedule'].includes(view) && (
            <motion.div
              key="main"
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Layout 
                profile={profile} 
                onUpdateProfile={updateProfile} 
                activeView={view as any}
                onNavigate={navigateTo}
              >
                {view === 'dashboard' && profile.userType === 'teacher' && <TeacherDashboard isIntegrated={true} />}
                {view === 'dashboard' && profile.userType !== 'teacher' && <Dashboard profile={profile} onStartAssessment={() => setView('assessment')} onNavigate={navigateTo} />}
                {view === 'assessment' && <AssessmentView profile={profile} onBack={() => setView('dashboard')} />}
                {view === 'profile' && <ProfileView profile={profile} onUpdate={updateProfile} />}
                {view === 'settings' && <SettingsView profile={profile} onUpdate={updateProfile} onBack={() => setView('dashboard')} />}
                {view === 'add-lecture' && <AddLectureView profile={profile} onBack={() => setView('dashboard')} />}
                {view === 'lectures' && <LecturesView profile={profile} onUpdateProfile={updateProfile} onBack={() => setView('dashboard')} />}
                {view === 'achievements' && <AchievementsView profile={profile} />}
                {view === 'rewards' && <RewardsView profile={profile} />}
                {view === 'assignments' && (
                  <AssignmentsView 
                    profile={profile} 
                    onStartAssignment={(assignment) => {
                      setSelectedAssignment(assignment);
                      setView('submit-assignment');
                    }} 
                    onViewAssignment={(assignment) => {
                      setSelectedAssignment(assignment);
                      setView('assignment-detail');
                    }}
                  />
                )}
                {view === 'submit-assignment' && selectedAssignment && (
                  <SubmitAssignmentView 
                    profile={profile} 
                    assignment={selectedAssignment} 
                    onBack={() => setView('assignments')}
                    onSubmit={() => setView('assignments')}
                  />
                )}
                {view === 'assignment-detail' && selectedAssignment && (
                  <AssignmentDetailView 
                    profile={profile} 
                    assignment={selectedAssignment} 
                    onBack={() => setView('assignments')}
                  />
                )}
                {view === 'analytics' && <AnalyticsView profile={profile} />}
                {view === 'schedule' && <ScheduleView profile={profile} />}
              </Layout>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ChatProvider>
  );
};

export default App;
