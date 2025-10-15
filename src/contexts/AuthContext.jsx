import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../api/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar se há token salvo no localStorage ao inicializar
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erro ao parsear dados do usuário:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    setLoading(false);
  }, []);

  const login = async (inscricao, password) => {
    try {
      setLoading(true);
      const response = await authService.login(inscricao, password);
      
      if (response.token) {
        // Salvar token
        localStorage.setItem('authToken', response.token);
        
        // Decodificar o token JWT para obter dados do usuário
        try {
          const tokenPayload = JSON.parse(atob(response.token.split('.')[1]));
          
          // Buscar dados completos do usuário da API
          try {
            const fullUserData = await authService.getUser(tokenPayload.id);
            
            const userData = {
              id: fullUserData.id,
              name: fullUserData.name,
              email: fullUserData.email,
              inscricao: fullUserData.inscricao,
              cellphone: fullUserData.cellphone,
              role: fullUserData.role || tokenPayload.role,
              createdAt: fullUserData.createdAt
            };
            
            localStorage.setItem('userData', JSON.stringify(userData));
            setUser(userData);
            setIsAuthenticated(true);
            
            return { success: true, user: userData };
          } catch (userFetchError) {
            console.warn('Erro ao buscar dados do usuário, usando dados do token:', userFetchError);
            
            // Fallback: usar dados do token se não conseguir buscar da API
            const userData = {
              id: tokenPayload.id,
              inscricao: tokenPayload.inscricao,
              role: tokenPayload.role,
              name: tokenPayload.inscricao, // Usar CPF como nome temporário
              email: '',
              cellphone: ''
            };
            
            localStorage.setItem('userData', JSON.stringify(userData));
            setUser(userData);
            setIsAuthenticated(true);
            
            return { success: true, user: userData };
          }
        } catch (decodeError) {
          console.error('Erro ao decodificar token:', decodeError);
          throw new Error('Token inválido');
        }
      } else {
        throw new Error('Token não encontrado na resposta');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { 
        success: false, 
        error: error.message || 'Credenciais inválidas' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      
      // Após registro bem-sucedido, fazer login automaticamente
      if (response.id) {
        const loginResult = await login(userData.inscricao, userData.password);
        return loginResult;
      }
      
      return { success: true, user: response };
    } catch (error) {
      console.error('Erro no registro:', error);
      return { 
        success: false, 
        error: error.message || 'Erro ao registrar usuário' 
      };
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser));
  };

  const getFirstName = () => {
    if (!user || !user.name) return '';
    return user.name.split(' ')[0];
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    register,
    updateUser,
    getFirstName
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
