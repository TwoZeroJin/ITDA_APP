import React, { createContext, ReactNode, useContext, useState } from 'react';

interface LoadingProviderProps {
    children: ReactNode
}

/**
 * 로딩 바 컨텍스트
 * @description 로딩 바의 상태를 관리하는 컨텍스트입니다.
 * @example
 * const { loading, setLoading } = useLoading();
 */
const LoadingContext = createContext({
  loading: false,
  setLoading: (value: boolean) => {},
});

export const LoadingProvider = ({children}: LoadingProviderProps ) => {
  const [loading, setLoading] = useState(false);
  return (
    <LoadingContext.Provider value={{ loading , setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);