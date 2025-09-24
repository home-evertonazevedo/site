import React, { createContext, useState, useContext } from 'react';

const RaffleContext = createContext();

export const RaffleProvider = ({ children }) => {
  const [selectedRaffle, setSelectedRaffle] = useState(null);
  const [quantity, setQuantity] = useState(0);

  const value = {
    selectedRaffle,
    setSelectedRaffle,
    quantity,
    setQuantity,
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


