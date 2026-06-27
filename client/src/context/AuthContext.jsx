import React, { createContext, useContext, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Map Spring role strings → short role keys used throughout the frontend
const resolveRole = (roles = []) => {
  if (roles.includes('ROLE_PRINCIPAL')) return 'principal';
  if (roles.includes('ROLE_ADMIN'))     return 'admin';
  if (roles.includes('ROLE_TEACHER'))   return 'teacher';
  if (roles.includes('ROLE_PARENT'))    return 'parent';
  if (roles.includes('ROLE_STUDENT'))   return 'student';
  return 'student'; // safe fallback
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('arivo_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = async (email, password) => {
    const data = await api.post('/auth/login', { email, password }, { skipAuth: true });

    const sessionUser = {
      id:    data.id,
      name:  data.name,
      email: data.email,
      roles: data.roles,
      role:  resolveRole(data.roles),
    };

    setUser(sessionUser);
    localStorage.setItem('arivo_access_token',  data.accessToken);
    localStorage.setItem('arivo_refresh_token', data.refreshToken);
    localStorage.setItem('arivo_user', JSON.stringify(sessionUser));

    return sessionUser;
  };

  const register = async (name, email, password, role, institutionId) => {
    await api.post('/auth/register', { name, email, password, role, institutionId }, { skipAuth: true });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('arivo_access_token');
    localStorage.removeItem('arivo_refresh_token');
    localStorage.removeItem('arivo_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
