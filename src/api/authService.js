// src/api/authService.js

const API_BASE_URL = 'http://localhost:8080/api/auth';

/**
 * Salva os dados de autenticação com segurança no localStorage.
 * Normaliza os dados para evitar erros de comparação no Front-end.
 */
export const setAuthData = (token, role, userId, nome, email, telefone, cpf, crm, especialidade) => {
    if (token) localStorage.setItem('token', token);
    
    // Salva o Role sempre em MAIÚSCULO para evitar erros de rota
    if (role) localStorage.setItem('role', role.toUpperCase());
    
    if (userId) localStorage.setItem('userId', userId);
    if (nome) localStorage.setItem('userName', nome);
    
    // Salva campos opcionais apenas se existirem (evita salvar a string "null" ou "undefined")
    localStorage.setItem('userEmail', email?.trim() || '');
    localStorage.setItem('userTelefone', telefone || '');
    localStorage.setItem('userCpf', cpf || '');           
    localStorage.setItem('userCrm', crm || '');           
    localStorage.setItem('userEspecialidade', especialidade || ''); 
};

// Funções de busca de dados (Getters)
export const getToken = () => localStorage.getItem('token');
export const getRole = () => localStorage.getItem('role');
export const getUserId = () => localStorage.getItem('userId');
export const getUserName = () => localStorage.getItem('userName');
export const getUserEmail = () => localStorage.getItem('userEmail');
export const getUserTelefone = () => localStorage.getItem('userTelefone');
export const getUserCpf = () => localStorage.getItem('userCpf'); 
export const getUserCrm = () => localStorage.getItem('userCrm');
export const getUserEspecialidade = () => localStorage.getItem('userEspecialidade'); 

/**
 * Remove todos os dados e encerra a sessão.
 */
export const logout = () => {
    localStorage.clear(); 
};

/**
 * Conecta com o backend Java Spring Boot para realizar o login.
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

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('E-mail ou senha incorretos.');
            }
            
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Falha na autenticação.');
        }

        const data = await response.json(); 
        
        // Verifica se o token veio na resposta (Proteção contra resposta vazia do backend)
        if (!data.token) {
            throw new Error('Token não recebido do servidor.');
        }

        // Salva no localStorage usando a função auxiliar
        // Mapeamos data.id ou data.userId para garantir compatibilidade com o Spring
        setAuthData(
            data.token, 
            data.role, 
            data.id || data.userId, 
            data.nome, 
            data.email, 
            data.telefone, 
            data.cpf, 
            data.crm, 
            data.especialidade
        ); 
        
        return data; 

    } catch (error) {
        console.error('Erro no authService:', error);
        
        if (error.message.includes('Failed to fetch')) {
            throw new Error('Servidor offline. Verifique se o backend está rodando na porta 8080.');
        }
        
        throw error;
    }
};