import React, { createContext, useContext, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('arivo_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email, password) => {
    try {
      const data = await api.post('/auth/login', { email, password }, { skipAuth: true });
      
      const sessionUser = {
        id: data.id,
        name: data.name,
        email: data.email,
        roles: data.roles,
        role: data.roles.includes('ROLE_STUDENT') 
          ? 'student' 
          : data.roles.includes('ROLE_TEACHER') 
          ? 'teacher' 
          : 'parent'
      };

      setUser(sessionUser);
      localStorage.setItem('arivo_access_token', data.accessToken);
      localStorage.setItem('arivo_refresh_token', data.refreshToken);
      localStorage.setItem('arivo_user', JSON.stringify(sessionUser));
      
      return sessionUser;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (name, email, password, role, institutionId) => {
    try {
      await api.post('/auth/register', { name, email, password, role, institutionId }, { skipAuth: true });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
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
