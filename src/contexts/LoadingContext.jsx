import React, { createContext, useState, useContext } from 'react';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
            
            {/* Overlay de carregamento que aparece sobre todo o app */}
            {isLoading && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
                    <div className="flex flex-col items-center">
                        {/* Spinner estilo Bootstrap/Tailwind */}
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-blue-600"></div>
                        <p className="mt-2 font-semibold text-white">Processando...</p>
                    </div>
                </div>
            )}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);