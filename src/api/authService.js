// src/api/authService.js

// Nota: Assumimos que as funções getToken, getRole, getUserId e logout estão
// definidas e exportadas neste arquivo.

const API_BASE_URL = 'http://localhost:8080/api/auth';
const ROLE_ADMIN = 'ADMIN';

// Função auxiliar para salvar dados de autenticação (token e role) no localStorage
export const setAuthData = (token, role, userId) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', userId);
};

// Funções para leitura (necessárias para o AuthContext)
export const getToken = () => localStorage.getItem('token');
export const getRole = () => localStorage.getItem('role');
export const getUserId = () => localStorage.getItem('userId');
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
};


export const login = async (email, password) => {
    
    // 🚨 1. LÓGICA DE SIMULAÇÃO TEMPORÁRIA PARA O ADMIN
    // (Útil para testes, mas deve ser removida antes de PROD)
    if (email === 'admin@admin.com' && password === '1234') {
        const SIMULATED_TOKEN = 'SIMULATED_ADMIN_TOKEN_12345';
        const SIMULATED_USER_ID = 999; 
        
        // Salva os dados simulados
        setAuthData(SIMULATED_TOKEN, ROLE_ADMIN, SIMULATED_USER_ID);
        
        // Retorna a resposta que o AuthContext espera
        return { 
            token: SIMULATED_TOKEN, 
            role: ROLE_ADMIN, 
            userId: SIMULATED_USER_ID
        };
    }
    // 🚨 FIM DA LÓGICA DE SIMULAÇÃO TEMPORÁRIA
    
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            // Tenta ler a mensagem de erro do Backend
            const errorData = await response.json();
            throw new Error(errorData.message || 'Falha na autenticação. Verifique e-mail e senha.');
        }

        // Se o login real for bem-sucedido:
        // data = { token, id, nome, email, tipo, mensagem } (AuthResponseDTO)
        const data = await response.json(); 
        
        // Mapeamento: data.tipo (Backend) -> 'role' (Frontend localStorage)
        setAuthData(data.token, data.tipo, data.id); 
        
        // Retorna o objeto simplificado que o AuthContext espera
        return { 
             token: data.token,
             role: data.tipo, // Retorna 'tipo' como 'role'
             userId: data.id
        };

    } catch (error) {
        console.error('Erro no serviço de login:', error);
        
        // Tratamento de erro de rede
        if (error.message && error.message.includes('Failed to fetch')) {
            throw new Error('Servidor da API desconectado. Por favor, ligue o Backend (Spring Boot).');
        }
        
        throw error;
    }
};

// Se o seu arquivo tiver mais funções como 'register', elas devem ser definidas e exportadas aqui:
// export const register = async (name, email, password, cpf, phone) => { ... };