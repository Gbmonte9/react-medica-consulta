// src/api/authService.js

const API_BASE_URL = 'http://localhost:8080/api/auth';

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
 * Conecta com o backend real para obter um token JWT válido
 */
export const login = async (email, senha) => {
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

        // 1. TRATAMENTO DE ERROS (401, 403, 500)
        if (!response.ok) {
            let errorMessage = 'Falha na autenticação. Verifique e-mail e senha.';
            
            // Verifica se o erro é 401 (Credenciais erradas)
            if (response.status === 401) {
                throw new Error('E-mail ou senha incorretos.');
            }

            // Tenta ler a mensagem de erro detalhada do Spring
            try {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                }
            } catch (e) {
                console.warn("Não foi possível processar o corpo do erro.");
            }
            
            throw new Error(errorMessage);
        }

        const data = await response.json(); 
        
        const token = data.token;
        const role = data.tipo || data.role; // Tenta pegar tipo ou role
        const userId = data.id || data.userId;

        if (!token) {
            throw new Error('Token não recebido do servidor.');
        }

        setAuthData(token, role, userId); 
        
        return { token, role, userId };

    } catch (error) {
        console.error('Erro no authService:', error);
        
        if (error.message.includes('Failed to fetch')) {
            throw new Error('Servidor offline. Verifique se o Java está rodando na porta 8080.');
        }
        
        throw error;
    }
};