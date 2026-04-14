/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import StudentLayout from "./layouts/StudentLayout";
import AdminLayout from "./layouts/AdminLayout";

// Pages
import HomePage from "./pages/public/HomePage";
import CoursesPage from "./pages/public/CoursesPage";
import LoginPage from "./pages/public/LoginPage";
import RegisterPage from "./pages/public/RegisterPage";
import CourseDetail from "./pages/public/CourseDetail";

import StudentDashboard from "./pages/student/Dashboard";
import MyCourses from "./pages/student/MyCourses";
import CoursePlayer from "./pages/student/CoursePlayer";
import CertificatesPage from "./pages/student/Certificates";
import ProfilePage from "./pages/student/Profile";

import AdminDashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import CourseManagement from "./pages/admin/CourseManagement";
import CourseEditor from "./pages/admin/CourseEditor";
import ReportsPage from "./pages/admin/Reports";
import SettingsPage from "./pages/admin/Settings";
import CorrectionsPage from "./pages/instructor/Corrections";

import { User } from "./types";
import { api } from "./lib/api";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = await api.auth.me();
          setUser(userData);
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) return <div className="h-screen w-screen flex items-center justify-center">Carregando...</div>;

  return (
    <TooltipProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout user={user} setUser={setUser} />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:courseId" element={<CourseDetail user={user} />} />
            <Route path="/login" element={<LoginPage setUser={setUser} />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Student Routes */}
          <Route path="/student" element={user?.role === 'STUDENT' ? <StudentLayout user={user} setUser={setUser} /> : <Navigate to="/login" />}>
            <Route index element={<StudentDashboard user={user} />} />
            <Route path="courses" element={<MyCourses user={user} />} />
            <Route path="course/:courseId" element={<CoursePlayer user={user} />} />
            <Route path="certificates" element={<CertificatesPage user={user} />} />
            <Route path="profile" element={<ProfilePage user={user} />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={user?.role === 'ADMIN' ? <AdminLayout user={user} setUser={setUser} /> : <Navigate to="/login" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="courses" element={<CourseManagement />} />
            <Route path="courses/edit/:courseId" element={<CourseEditor />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="corrections" element={<CorrectionsPage />} />
          </Route>

          {/* Instructor Routes (Shared with Admin for now) */}
          <Route path="/instructor" element={user?.role === 'INSTRUCTOR' ? <AdminLayout user={user} setUser={setUser} /> : <Navigate to="/login" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="courses" element={<CourseManagement />} />
            <Route path="courses/edit/:courseId" element={<CourseEditor />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="corrections" element={<CorrectionsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </TooltipProvider>
  );
}

