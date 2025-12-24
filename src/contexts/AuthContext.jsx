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
        
        // Recupera dados adicionais (Médico ou Paciente)
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
            // Normaliza para facilitar as verificações de rota
            setRole(storedRole.toUpperCase());
        }
        setIsLoading(false);
    }, []);

    const handleLogin = async (email, senha) => {
        setIsLoading(true);
        try {
            const responseData = await authService.login(email, senha); 
            
            const userRole = responseData.role.toUpperCase();
            
            setRole(userRole);
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
            if (error.status === 401) handleLogout();
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

    // O segredo está aqui: incluímos o setUser no value para os componentes usarem
    const value = {
        user,
        setUser, // <--- Adicionado para permitir atualizações manuais do perfil
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