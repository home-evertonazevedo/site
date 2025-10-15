import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Configurar instância centralizada do axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
  timeout: 15000, // 15 segundos de timeout
});

// Interceptor para requisições
apiClient.interceptors.request.use(
  (config) => {
    // Adicionar token de autorização se existir
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log da requisição para debug
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Interceptor para respostas
apiClient.interceptors.response.use(
  (response) => {
    // Log da resposta para debug
    console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    // Log detalhado do erro
    if (error.response) {
      console.error(`[API Error] ${error.response.status} ${error.response.config.url}`, {
        data: error.response.data,
        headers: error.response.headers,
        status: error.response.status,
        statusText: error.response.statusText
      });
    } else if (error.request) {
      console.error('[API Network Error]', {
        message: error.message,
        code: error.code,
        config: error.config
      });
    } else {
      console.error('[API Setup Error]', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
