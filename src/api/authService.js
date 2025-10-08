import apiClient from './apiClient';

const authService = {
  forgotPassword: async (inscricao) => {
    try {
      const response = await apiClient.post('/forgot-password', { inscricao });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  resetPassword: async (token, password) => {
    try {
      const response = await apiClient.post('/reset-password', { token, password });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  login: async (inscricao, password) => {
    try {
      const response = await apiClient.post('/login', { inscricao, password });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  register: async (userData) => {
    try {
      const response = await apiClient.post('/register', userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default authService;


