import { Course, User, Quiz, QuizAttempt, Progress, Certificate } from "../types";

export const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Admin DigitalCursos",
    email: "admin@digitalcursos.com",
    role: "ADMIN",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
  },
  {
    id: "2",
    name: "Prof. Ricardo Silva",
    email: "ricardo@digitalcursos.com",
    role: "INSTRUCTOR",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ricardo",
  },
  {
    id: "3",
    name: "Ana Oliveira",
    email: "ana@student.com",
    role: "STUDENT",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
    progress: [
      { id: "p1", userId: "3", lessonId: "l1", completed: true, updatedAt: "2024-01-10T11:00:00Z" },
      { id: "p2", userId: "3", lessonId: "l2", completed: true, updatedAt: "2024-01-11T09:00:00Z" },
    ],
    certificates: [],
    notifications: [
      { id: "n1", title: "Novo Curso!", message: "O curso de Next.js 15 já está disponível.", type: "info", read: false, createdAt: new Date().toISOString() },
      { id: "n2", title: "Parabéns!", message: "Você ganhou a medalha 'Mestre do React'.", type: "success", read: true, createdAt: new Date().toISOString() },
    ],
  }
];

export const MOCK_COURSES: Course[] = [
  {
    id: "c1",
    title: "Mastering React 19 & Next.js",
    description: "Este curso completo leva você do zero ao avançado no ecossistema React, cobrindo Server Components, Actions, e as novas APIs do React 19.",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
    category: "Desenvolvimento Web",
    instructorId: "2",
    instructor: { name: "Prof. Ricardo Silva" },
    status: "PUBLISHED",
    price: 199.90,
    level: "INTERMEDIATE",
    createdAt: "2024-01-01T10:00:00Z",
    modules: [
      {
        id: "m1",
        title: "Introdução ao React 19",
        order: 1,
        courseId: "c1",
        lessons: [
          { id: "l1", title: "O que há de novo?", type: "VIDEO", duration: 10, order: 1, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", moduleId: "m1" },
          { id: "l2", title: "Configurando o Ambiente", type: "TEXT", duration: 15, order: 2, content: "# Configuração\n\nUse `npm create vite@latest`...", moduleId: "m1" },
          { id: "l-q1", title: "Avaliação de Introdução", type: "QUIZ", duration: 10, order: 3, moduleId: "m1" },
        ]
      },
      {
        id: "m2",
        title: "Hooks Avançados",
        order: 2,
        courseId: "c1",
        lessons: [
          { id: "l3", title: "useActionState na prática", type: "VIDEO", duration: 20, order: 1, moduleId: "m2" },
          { id: "l4", title: "Otimizando Performance", type: "VIDEO", duration: 25, order: 2, moduleId: "m2" },
        ]
      }
    ]
  },
  {
    id: "c2",
    title: "Design de Interface com Figma",
    description: "Domine o Figma e aprenda os princípios de UI/UX para criar designs que encantam os usuários.",
    thumbnail: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=800&auto=format&fit=crop&q=60",
    category: "Design",
    instructorId: "2",
    instructor: { name: "Prof. Ricardo Silva" },
    status: "PUBLISHED",
    price: 149.90,
    level: "BEGINNER",
    createdAt: "2023-12-01T08:00:00Z",
    modules: [
      {
        id: "m3",
        title: "Fundamentos do Design",
        order: 1,
        courseId: "c2",
        lessons: [
          { id: "l5", title: "Cores e Tipografia", type: "VIDEO", duration: 30, order: 1, moduleId: "m3" },
        ]
      }
    ]
  }
];

export const MOCK_QUIZZES: Quiz[] = [
  {
    id: "q1",
    lessonId: "l-q1",
    title: "Avaliação de Introdução ao React 19",
    description: "Teste seus conhecimentos sobre as novidades do React 19.",
    minGrade: 70,
    maxAttempts: 3,
    questions: [
      {
        id: "q1-1",
        type: "multiple-choice",
        question: "Qual hook foi introduzido no React 19 para lidar com estados de ações?",
        options: ["useActionState", "useTransition", "useFormStatus", "useOptimistic"],
        correctAnswer: "useActionState",
        points: 40
      },
      {
        id: "q1-2",
        type: "true-false",
        question: "O React 19 removeu completamente o suporte para Class Components.",
        correctAnswer: false,
        points: 30
      },
      {
        id: "q1-3",
        type: "essay",
        question: "Explique brevemente a vantagem de usar Server Components.",
        points: 30
      }
    ]
  }
];

export const MOCK_QUIZ_ATTEMPTS: QuizAttempt[] = [
  {
    id: "att1",
    quizId: "q1",
    userId: "3",
    answers: {
      "q1-1": "useActionState",
      "q1-2": false,
      "q1-3": "Server Components permitem renderizar componentes no servidor, reduzindo o bundle size enviado ao cliente e melhorando o tempo de carregamento inicial."
    },
    score: 70,
    status: "pending",
    createdAt: "2024-03-20T15:30:00Z"
  }
];
