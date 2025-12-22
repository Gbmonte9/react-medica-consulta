// src/api/authService.js

const API_BASE_URL = 'http://localhost:8080/api/auth';
const ROLE_ADMIN = 'ADMIN';

export const setAuthData = (token, role, userId) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', userId);
};

export const getToken = () => localStorage.getItem('token');
export const getRole = () => localStorage.getItem('role');
export const getUserId = () => localStorage.getItem('userId');

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
};

/**
 * FUNÇÃO PRINCIPAL DE LOGIN
 * @param {string} email 
 * @param {string} senha 
 */
export const login = async (email, senha) => {
    
    // 1. LÓGICA DE SIMULAÇÃO TEMPORÁRIA (Para testes rápidos)
    if (email === 'admin@admin.com' && senha === '1234') {
        const SIMULATED_TOKEN = 'SIMULATED_ADMIN_TOKEN_12345';
        const SIMULATED_USER_ID = 999; 
        
        setAuthData(SIMULATED_TOKEN, ROLE_ADMIN, SIMULATED_USER_ID);
        
        return { 
            token: SIMULATED_TOKEN, 
            role: ROLE_ADMIN, 
            userId: SIMULATED_USER_ID
        };
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: email.trim(), 
                senha: senha 
            })
        });

        // 2. TRATAMENTO DE ERROS DO BACKEND (400, 401, 403, 500)
        if (!response.ok) {
            let errorMessage = 'Falha na autenticação. Verifique e-mail e senha.';
            
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (jsonError) {
                console.warn("Resposta de erro não é um JSON válido.");
            }
            
            throw new Error(errorMessage);
        }

        const data = await response.json(); 
        
        setAuthData(data.token, data.tipo, data.id); 
        
        return { 
             token: data.token,
             role: data.tipo, 
             userId: data.id
        };

    } catch (error) {
        console.error('Erro no serviço de login:', error);
        
        // 4. TRATAMENTO DE ERRO DE REDE (Servidor desligado)
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            throw new Error('Servidor da API inacessível. Certifique-se de que o Java (Spring Boot) está rodando.');
        }
        
        throw error;
    }
};