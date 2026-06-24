
export type UserType = 'school' | 'college' | 'self-learner' | 'teacher' | null;

export interface UserProfile {
  userType: UserType;
  fullName: string;
  email?: string;
  class?: string;
  board?: string;
  degree?: string;
  department?: string;
  yearOfStudy?: string;
  learningGoal?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  selectedSubjects: string[];
  xp: number;
  level: number;
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    weeklyDigest: boolean;
    examAlerts: boolean;
    fontSize: number;
  };
}

export interface Lecture {
  id: string;
  title: string;
  description: string;
  subject: string;
  youtubeId: string;
  duration: string;
  date: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'Pending' | 'Submitted' | 'Graded';
  score?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'Academic' | 'Streak' | 'Social' | 'Special';
  isEarned: boolean;
  unlockRequirement?: string;
  earnedDate?: string;
}

export enum OnboardingStep {
  USER_TYPE = 0,
  ABOUT_YOU = 1,
  SUBJECTS = 2,
  PREFERENCES = 3,
  COMPLETE = 4
}
