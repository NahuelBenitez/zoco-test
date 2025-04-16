import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    token: null,
    user: null,
    role: null,
    isAuthenticated: false,
    loading: true // Para manejar estado de carga inicial
  });

  const navigate = useNavigate();

  // Cargar sesión al iniciar
  useEffect(() => {
    const loadSession = () => {
      try {
        const token = sessionStorage.getItem('token');
        const user = sessionStorage.getItem('user');
        const role = sessionStorage.getItem('role');

        if (token && user && role) {
          setAuthState({
            token,
            user: JSON.parse(user),
            role,
            isAuthenticated: true,
            loading: false
          });
        } else {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Error loading session:', error);
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };

    loadSession();
  }, []);

  // Login 
  const login = useCallback(async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('user', JSON.stringify(response.user));
        sessionStorage.setItem('role', response.role);
        
        setAuthState({
          token: response.token,
          user: response.user,
          role: response.role,
          isAuthenticated: true,
          loading: false
        });
        
        navigate('/dashboard');
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Error en el servidor' };
    }
  }, [navigate]);

  // Logout 
  const logout = useCallback(() => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('role');
    
    setAuthState({
      token: null,
      user: null,
      role: null,
      isAuthenticated: false,
      loading: false
    });
    
    navigate('/login');
  }, [navigate]);

  // Verificar rol de usuario
  const hasRole = useCallback((requiredRole) => {
    return authState.role === requiredRole;
  }, [authState.role]);

  return (
    <AuthContext.Provider 
      value={{ 
        ...authState, 
        login, 
        logout, 
        hasRole 
      }}
    >
      {!authState.loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};