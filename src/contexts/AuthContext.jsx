// src/contexts/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import * as authService from '../api/authService'; 

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = authService.getToken();
        const storedRole = authService.getRole();
        const userId = authService.getUserId();
        const userName = authService.getUserName();
        
        const userEmail = localStorage.getItem('userEmail');
        const userTelefone = localStorage.getItem('userTelefone');
        const userCpf = localStorage.getItem('userCpf');           
        const userCrm = localStorage.getItem('userCrm');           
        const userEspecialidade = localStorage.getItem('userEspecialidade'); 

        if (token && storedRole && userId) {
            setUser({ 
                id: userId, 
                nome: userName,
                email: userEmail,
                telefone: userTelefone,
                cpf: userCpf,             
                crm: userCrm,             
                especialidade: userEspecialidade 
            }); 
            setRole(storedRole);
        }
        setIsLoading(false);
    }, []);

    const handleLogin = async (email, senha) => {
        setIsLoading(true);
        try {
            const responseData = await authService.login(email, senha); 
            
            setRole(responseData.role);
            setUser({ 
                id: responseData.userId, 
                nome: responseData.nome,
                email: responseData.email,
                telefone: responseData.telefone,
                cpf: responseData.cpf,             
                crm: responseData.crm,             
                especialidade: responseData.especialidade 
            });

            return true; 
        } catch (error) {
            handleLogout();
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
        isLoggedIn: !!user, 
        isLoading,
        login: handleLogin,
        logout: handleLogout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};