import { createContext, useContext, useState, useEffect } from 'react';
import { observeAuthState } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.error('useAuth hook llamado fuera de AuthProvider');
    console.trace(); // Esto nos ayudará a debuggear
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log('🔐 AuthProvider inicializado');

  useEffect(() => {
    console.log('🔐 AuthProvider: configurando observador de autenticación');
    // Escuchar cambios en el estado de autenticación
    const unsubscribe = observeAuthState((user) => {
      console.log('🔐 AuthProvider: cambio de estado de autenticación:', user ? 'autenticado' : 'no autenticado');
      setUser(user);
      setIsLoading(false);
    });

    return () => {
      console.log('🔐 AuthProvider: limpiando observador');
      unsubscribe();
    };
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = () => {
    return user && user.isAdmin === true;
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const value = {
    user,
    login,
    logout,
    isAdmin,
    isAuthenticated,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};