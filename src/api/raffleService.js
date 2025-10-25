import apiClient from './apiClient';

const raffleService = {
  getAllRaffles: async () => {
    try {
      const response = await apiClient.get('/raffles');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  createRaffle: async (raffleData) => {
    try {
      const response = await apiClient.post('/raffles', raffleData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  getRaffleById: async (id) => {
    try {
      const response = await apiClient.get(`/raffles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  createPurchase: async (purchaseData) => {
    try {
      const response = await apiClient.post('/purchases', purchaseData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default raffleService;

