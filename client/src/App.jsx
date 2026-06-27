import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage        from './pages/LoginPage';
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import ParentDashboard  from './pages/parent/ParentDashboard';
import PrincipalDashboard from './pages/student/PrincipalDashboard';
import AdminDashboard   from './pages/admin/AdminDashboard';
import ArivoApp         from './arivo/ArivoApp';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/"      element={<LoginPage />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/arivo" element={<ArivoApp />} />

            {/* Student */}
            <Route path="/student/dashboard"
              element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>}
            />

            {/* Teacher */}
            <Route path="/teacher/dashboard"
              element={<ProtectedRoute allowedRole="teacher"><TeacherDashboard /></ProtectedRoute>}
            />

            {/* Parent */}
            <Route path="/parent/dashboard"
              element={<ProtectedRoute allowedRole="parent"><ParentDashboard /></ProtectedRoute>}
            />

            {/* Principal */}
            <Route path="/principal/dashboard"
              element={<ProtectedRoute allowedRole="principal"><PrincipalDashboard /></ProtectedRoute>}
            />

            {/* Admin */}
            <Route path="/admin/dashboard"
              element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>}
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
