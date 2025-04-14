import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    token: null,
    user: null,
    role: null,
    isAuthenticated: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const user = sessionStorage.getItem('user');
    const role = sessionStorage.getItem('role');

    if (token && user && role) {
      setAuthState({
        token,
        user: JSON.parse(user),
        role,
        isAuthenticated: true,
      });
    }
  }, []);

  const login = async (token, user, role) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('role', role);
    
    setAuthState({
      token,
      user,
      role,
      isAuthenticated: true,
    });
    
    navigate('/dashboard');
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('role');
    
    setAuthState({
      token: null,
      user: null,
      role: null,
      isAuthenticated: false,
    });
    
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);