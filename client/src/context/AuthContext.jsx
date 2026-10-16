import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => authService.getToken());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = authService.getToken();
      if (storedToken) {
        try {
          const res = await authService.getMe();
          setUser(res.data?.user || null);
        } catch {
          authService.logout();
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    setUser(res.user);
    setToken(res.token);
    return res;
  };

  const register = async (name, email, password) => {
    const res = await authService.register(name, email, password);
    setUser(res.user);
    setToken(res.token);
    return res;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
  };

  const updatePreferences = async (prefs) => {
    try {
      const res = await authService.updatePreferences(prefs);
      if (user) {
        setUser({ ...user, preferences: { ...user.preferences, ...prefs } });
      }
      return res;
    } catch (err) {
      console.warn('Could not update preferences on server:', err.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isGuest: !user,
        isLoading,
        login,
        register,
        logout,
        updatePreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
