import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, BookOpen, Users, Lock, Mail, ArrowRight } from 'lucide-react';

const ROLES = [
  { id: 'student', label: 'Student', icon: <GraduationCap size={20} /> },
  { id: 'teacher', label: 'Teacher', icon: <BookOpen size={20} /> },
  { id: 'parent', label: 'Parent', icon: <Users size={20} /> },
  { id: 'principal', label: 'Principal', icon: <Users size={20} /> }
];

const LoginPage = () => {
  const [activeRole, setActiveRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, login } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate(`/${user.role}/dashboard`, { replace: true });
    }
  }, [user, navigate]);

  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const loggedUser = await login(email, password);
      navigate(`/${loggedUser.role}/dashboard`, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const setDemoCredentials = (role) => {
    setActiveRole(role);
    setEmail(`${role}@arviona.com`);
    setPassword('password');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center p-4">
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 font-poppins font-bold text-xl text-primary hover:opacity-80 transition-opacity">
        <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
          <BookOpen size={20} strokeWidth={2.5} />
        </div>
        Teacher & Arivo
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-3xl shadow-xl shadow-indigo-100/50 border border-slate-100 overflow-hidden"
      >
        <div className="p-8 pb-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-poppins font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-500 text-sm">Please sign in to continue your journey</p>
          </div>

          {/* Role Tabs */}
          <div className="flex bg-slate-100/80 p-1 rounded-xl mb-8 relative">
            {ROLES.map((role) => (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg relative z-10 transition-colors ${
                  activeRole === role.id ? 'text-primary' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {role.icon}
                <span className="hidden sm:inline">{role.label}</span>
                {activeRole === role.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200/50 -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {errorMsg && (
            <div className="p-3 mb-4 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRole}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                      placeholder={`Enter ${activeRole} email`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 accent-primary" />
                <span className="text-slate-600 group-hover:text-slate-900 transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-primary hover:text-primary/80 font-medium">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-medium transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] mt-4"
            >
              Sign In <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account? <a href="#" className="text-primary font-medium hover:underline">Sign up</a>
          </p>

          <div className="mt-8 border-t border-slate-100 pt-6">
            <button
              onClick={() => navigate('/arivo')}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-indigo-100 hover:shadow-indigo-200 active:scale-[0.98]"
            >
              🚀 Enter Premium Arivo Learning App <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="bg-slate-50 p-6 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 text-center">Demo Credentials</p>
          <div className="grid grid-cols-4 gap-2">
            {['student', 'teacher', 'parent', 'principal'].map((role) => (
              <button
                key={role}
                onClick={() => setDemoCredentials(role)}
                className="text-xs py-1.5 px-2 bg-white border border-slate-200 rounded-md text-slate-600 hover:border-primary hover:text-primary transition-colors font-medium capitalize shadow-sm"
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
