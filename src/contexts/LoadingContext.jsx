// src/contexts/LoadingContext.jsx
import React, { createContext, useState, useContext } from 'react';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
            
            {isLoading && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
                    <div className="flex flex-col items-center">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-blue-600"></div>
                        <p className="mt-2 font-semibold text-white">Processando...</p>
                    </div>
                </div>
            )}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);