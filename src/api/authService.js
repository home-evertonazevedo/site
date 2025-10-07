import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const authService = {
  forgotPassword: async (inscricao) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/forgot-password`, { inscricao });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  resetPassword: async (token, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/reset-password`, { token, password });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  login: async (inscricao, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { inscricao, password });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  register: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default authService;


