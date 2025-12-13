// src/contexts/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
// 🚨 CORREÇÃO AQUI: Importa todas as exportações nomeadas como 'authService'
import * as authService from '../api/authService'; 

// 1. Cria o Contexto
const AuthContext = createContext();

// 2. Cria o Hook customizado para fácil acesso
export const useAuth = () => {
    return useContext(AuthContext);
};

// 3. Cria o Provedor de Contexto
export const AuthProvider = ({ children }) => {
    // Estado inicial: Tenta carregar dados do localStorage
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(authService.getRole());
    const [isLoading, setIsLoading] = useState(true); // Para checar o token na inicialização

    // ----------------------------------------------------
    // Efeito: Checar o Token na Inicialização
    // ----------------------------------------------------
    useEffect(() => {
        const token = authService.getToken();
        const storedRole = authService.getRole();

        if (token && storedRole) {
            // Por simplicidade, apenas definimos o papel e um usuário básico
            setUser({ id: authService.getUserId(), email: 'loaded' }); 
            setRole(storedRole);
        }
        setIsLoading(false); // A checagem inicial terminou
    }, []); // Executa apenas uma vez, ao montar o componente

    // ----------------------------------------------------
    // Função: Login (Chamada pelo formulário de Login)
    // ----------------------------------------------------
    const handleLogin = async (email, password) => {
        setIsLoading(true);
        try {
            // Chama a função de login da nossa API service
            const responseData = await authService.login(email, password); 
            
            // Sucesso: Atualiza o estado
            setRole(responseData.role);
            setUser({ id: responseData.userId, email: email });

            setIsLoading(false);
            return true; // Login bem-sucedido

        } catch (error) {
            // Falha: Limpa tudo e propaga o erro
            authService.logout();
            setUser(null);
            setRole(null);
            setIsLoading(false);
            throw error; // Deixa o componente de login lidar com a mensagem de erro
        }
    };

    // ----------------------------------------------------
    // Função: Logout (Chamada pelo Header/Sidebar)
    // ----------------------------------------------------
    const handleLogout = () => {
        authService.logout(); // Limpa o localStorage
        setUser(null);
        setRole(null);
        // Não é necessário setIsLoading, pois o usuário deslogou intencionalmente
    };

    // ----------------------------------------------------
    // Objeto de Valor (Value Object)
    // ----------------------------------------------------
    const value = {
        user,
        role,
        isLoggedIn: !!user, // Booleano: True se 'user' não for null
        isLoading,
        login: handleLogin,
        logout: handleLogout,
    };

    // 4. Retorna o Provedor
    return (
        <AuthContext.Provider value={value}>
            {/* Opcionalmente, pode-se descomentar a linha abaixo para mostrar um loading
            {isLoading ? <div>Carregando...</div> : children} 
            */}
            {children}
        </AuthContext.Provider>
    );
};