import React, { createContext, ReactNode, useContext, useState } from 'react';

interface LoadingProviderProps {
    children: ReactNode
}

const LoadingContext = createContext({
  loading: false,
  setLoading: (value: boolean) => {},
});

export const LoadingProvider = ({children}: LoadingProviderProps ) => {
  const [loading, setLoading] = useState(false);
  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);