import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const raffleService = {
  getAllRaffles: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/raffles`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default raffleService;


