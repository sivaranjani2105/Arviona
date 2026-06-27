import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import ProtectedRoute from './components/ProtectedRoute';

// ── Eagerly loaded (always needed) ──────────────────────────────────────────
import LoginPage from './pages/LoginPage';

// ── Lazy-loaded per role (reduces initial bundle) ───────────────────────────
const StudentDashboard  = lazy(() => import('./pages/student/StudentDashboard'));
const TeacherDashboard  = lazy(() => import('./pages/teacher/TeacherDashboard'));
const ParentDashboard   = lazy(() => import('./pages/parent/ParentDashboard'));
const PrincipalDashboard = lazy(() => import('./pages/student/PrincipalDashboard'));
const AdminDashboard    = lazy(() => import('./pages/admin/AdminDashboard'));
const ArivoApp          = lazy(() => import('./arivo/ArivoApp'));

// ── Loading fallback ──────────────────────────────────────────────────────────
const PageLoader = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg,#1E1B4B 0%,#312e81 100%)',
    flexDirection: 'column',
    gap: '16px',
  }}>
    <div style={{
      width: 48, height: 48, borderRadius: '50%',
      border: '4px solid rgba(255,255,255,0.2)',
      borderTopColor: '#818cf8',
      animation: 'spin 0.8s linear infinite',
    }} />
    <p style={{ color: '#a5b4fc', fontFamily: 'sans-serif', fontSize: 14, fontWeight: 600 }}>
      Loading Arviona…
    </p>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
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
          </Suspense>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
