// src/contexts/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import * as authService from '../api/authService'; 

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(authService.getRole());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = authService.getToken();
        const storedRole = authService.getRole();
        const userId = authService.getUserId();

        if (token && storedRole) {
            setUser({ id: userId, email: 'sessao_ativa' }); 
            setRole(storedRole);
        }
        setIsLoading(false);
    }, []);

    const handleLogin = async (email, senha) => {
        setIsLoading(true);
        try {

            const responseData = await authService.login(email, senha); 
            
            setRole(responseData.role);
            setUser({ id: responseData.userId, email: email });

            return true; 
        } catch (error) {
            authService.logout();
            setUser(null);
            setRole(null);
            throw error; 
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        setUser(null);
        setRole(null);
    };

    const value = {
        user,
        role,
        isLoggedIn: !!user || !!role, 
        isLoading,
        login: handleLogin,
        logout: handleLogout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};