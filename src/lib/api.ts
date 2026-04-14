const API_URL = '/api';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(error.message || 'Erro na requisição');
  }

  return response.json();
}

export const api = {
  auth: {
    login: (credentials: any) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (data: any) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    me: () => apiFetch('/users/me'),
  },
  courses: {
    list: () => apiFetch('/courses'),
    listAdmin: () => apiFetch('/courses/admin/all'),
    get: (id: string) => apiFetch(`/courses/${id}`),
    create: (data: any) => apiFetch('/courses', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch(`/courses/${id}`, { method: 'DELETE' }),
    enroll: (id: string) => apiFetch(`/users/enroll/${id}`, { method: 'POST' }),
    
    // Modules
    addModule: (courseId: string, data: any) => apiFetch(`/courses/${courseId}/modules`, { method: 'POST', body: JSON.stringify(data) }),
    updateModule: (moduleId: string, data: any) => apiFetch(`/courses/modules/${moduleId}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteModule: (moduleId: string) => apiFetch(`/courses/modules/${moduleId}`, { method: 'DELETE' }),
    
    // Lessons
    addLesson: (moduleId: string, data: any) => apiFetch(`/courses/modules/${moduleId}/lessons`, { method: 'POST', body: JSON.stringify(data) }),
    updateLesson: (lessonId: string, data: any) => apiFetch(`/courses/lessons/${lessonId}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteLesson: (lessonId: string) => apiFetch(`/courses/lessons/${lessonId}`, { method: 'DELETE' }),
  },
  users: {
    saveProgress: (lessonId: string, completed: boolean) => 
      apiFetch(`/users/progress/${lessonId}`, { method: 'POST', body: JSON.stringify({ completed }) }),
  },
  admin: {
    getStats: () => apiFetch('/admin/stats'),
    getUsers: () => apiFetch('/admin/users'),
  }
};
