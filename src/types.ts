export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  enrollments?: Enrollment[];
  progress?: Progress[];
  notifications?: Notification[];
  certificates?: Certificate[];
  badges?: Badge[];
  createdAt?: string;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'VIDEO' | 'TEXT' | 'QUIZ';
  content?: string;
  videoUrl?: string;
  duration: number; // in minutes
  order: number;
  moduleId: string;
}

export interface Module {
  id: string;
  title: string;
  order: number;
  courseId: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  category: string;
  price: number;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  instructorId: string;
  instructor?: Partial<User>;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  modules?: Module[];
  rating?: number;
  studentsCount?: number;
  createdAt: string;
  updatedAt?: string;
  duration?: number; // total hours
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  course?: Course;
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface Progress {
  id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  updatedAt: string;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  course?: Course;
  issuedAt: string;
  code: string;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: string | boolean | number;
  points: number;
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  minGrade: number;
  maxAttempts?: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  answers: Record<string, any>;
  score: number;
  status: 'pending' | 'approved' | 'failed';
  feedback?: string;
  createdAt: string;
}
