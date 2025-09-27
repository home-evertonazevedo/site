import React, { createContext, useState, useContext, useEffect } from 'react';
import raffleService from '../api/raffleService';

const RaffleContext = createContext();

export const RaffleProvider = ({ children }) => {
  const [selectedRaffle, setSelectedRaffle] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [raffles, setRaffles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        const data = await raffleService.getAllRaffles();
        setRaffles(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRaffles();
  }, []);

  const value = {
    selectedRaffle,
    setSelectedRaffle,
    quantity,
    setQuantity,
    raffles,
    loading,
    error,
  };

  return (
    <RaffleContext.Provider value={value}>
      {children}
    </RaffleContext.Provider>
  );
};

export const useRaffle = () => {
  return useContext(RaffleContext);
};


