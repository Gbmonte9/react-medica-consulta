import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import * as authService from '../api/authService'; 

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const getInitialState = () => {
        const token = authService.getToken();
        const storedRole = authService.getRole();
        const userId = authService.getUserId();
        
        if (token && storedRole && userId) {
            return {
                user: {
                    id: userId,
                    nome: authService.getUserName() || 'Usuário',
                    email: localStorage.getItem('userEmail'),
                    telefone: localStorage.getItem('userTelefone'),
                    cpf: localStorage.getItem('userCpf'),
                    crm: localStorage.getItem('userCrm'),
                    especialidade: localStorage.getItem('userEspecialidade')
                },
                role: storedRole.toUpperCase()
            };
        }
        return { user: null, role: null };
    };

    const [authState, setAuthState] = useState(getInitialState);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (email, senha) => {
        setIsLoading(true);
        try {

            const responseData = await authService.login(email, senha); 
            
            const userRole = responseData.role.toUpperCase();
            
            const newState = {
                role: userRole,
                user: { 
                    id: responseData.id, 
                    nome: responseData.nome, 
                    email: responseData.email,
                    telefone: responseData.telefone,
                    cpf: responseData.cpf,             
                    crm: responseData.crm,             
                    especialidade: responseData.especialidade 
                }
            };

            setAuthState(newState);
            
            return { 
                nome: responseData.nome, 
                role: userRole,
                id: responseData.id 
            }; 
        } catch (error) {
            console.error("Erro no login (AuthContext):", error);
            throw error; 
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = useCallback(() => {
        authService.logout();
        setAuthState({ user: null, role: null });
    }, []);

    const value = useMemo(() => ({
        user: authState.user,
        role: authState.role,
        setUser: (newUser) => setAuthState(prev => ({ 
            ...prev, 
            user: { ...prev.user, ...newUser } 
        })),
        isLoggedIn: !!authState.user, 
        isLoading,
        login: handleLogin,
        logout: handleLogout,
    }), [authState, isLoading, handleLogout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};