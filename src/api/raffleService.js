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

  getUserPurchases: async () => {
    try {
      const response = await apiClient.get('/purchases/user/me');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  addPrizeQuota: async (raffleId, prizeQuotaData) => {
    try {
      const response = await apiClient.post(`/raffles/${raffleId}/prize-quotas`, prizeQuotaData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  getPrizeQuotas: async (raffleId) => {
    try {
      const response = await apiClient.get(`/raffles/${raffleId}/prize-quotas`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  updatePrizeQuota: async (raffleId, prizeQuotaData) => {
    try {
      const response = await apiClient.put(`/raffles/${raffleId}/prize-quotas`, prizeQuotaData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  deletePrizeQuota: async (raffleId, prizeQuotaId) => {
    try {
      const response = await apiClient.delete(`/raffles/${raffleId}/prize-quotas/${prizeQuotaId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  getRaffleWithPrizeQuotas: async (raffleId) => {
    try {
      const response = await apiClient.get(`/raffles/${raffleId}/with-prize-quotas`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default raffleService;

