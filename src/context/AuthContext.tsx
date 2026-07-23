import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_PASSWORD = 'Zulybeth97@';
const STORAGE_KEY = 'biol2401_admin_auth_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    try {
      if (isAdmin) {
        localStorage.setItem(STORAGE_KEY, 'true');
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error('Storage error:', e);
    }
  }, [isAdmin]);

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setIsLoginModalOpen(false);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        login,
        logout,
        isLoginModalOpen,
        setIsLoginModalOpen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
