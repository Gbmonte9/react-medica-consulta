// src/api/pacienteService.js

import { getToken } from './authService';

const PACIENTES_API_BASE_URL = 'http://localhost:8080/api/pacientes';

/**
 * Gera os headers necessários para as requisições.
 */
const getHeaders = () => {
    const headers = {
        'Content-Type': 'application/json',
    };
    
    const token = getToken();
    // Proteção robusta contra tokens inválidos ou strings de erro
    if (token && token !== 'null' && token !== 'undefined' && token.includes('.')) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
};

export const listarPacientes = async () => {
    try {
        const response = await fetch(PACIENTES_API_BASE_URL, {
            method: 'GET',
            headers: getHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Erro ${response.status}: Falha ao listar pacientes.`);
        }

        const data = await response.json();
        // Garante o retorno de um array mesmo se a API usar paginação (data.content)
        return Array.isArray(data) ? data : (data.content || []);
    } catch (error) {
        console.error('Erro em listarPacientes:', error);
        throw error;
    }
};

export const criarPaciente = async (pacienteData) => { 
    try {
        const response = await fetch(PACIENTES_API_BASE_URL, {
            method: 'POST',
            headers: getHeaders(), 
            body: JSON.stringify(pacienteData),
        });

        if (!response.ok) {
            // Se o status for 403, pode ser que o permitAll no backend falhou ou o token expirou
            if (response.status === 403) {
                throw new Error('Acesso negado. Verifique os dados ou permissões.');
            }
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Erro ao criar paciente.');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro em criarPaciente:', error);
        throw error;
    }
};

export const atualizarPaciente = async (id, pacienteData) => {
    try {
        // Clonamos os dados para não alterar o objeto original da tela (state)
        const dadosParaEnviar = { ...pacienteData };

        // Se a senha estiver vazia, removemos para o Hibernate não tentar atualizar para nulo
        if (!dadosParaEnviar.senha || dadosParaEnviar.senha.trim() === "") {
            delete dadosParaEnviar.senha;
        }

        const response = await fetch(`${PACIENTES_API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(dadosParaEnviar),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Erro ${response.status}: Falha ao atualizar.`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro em atualizarPaciente:', error);
        throw error;
    }
};

export const removerPaciente = async (id) => {
    try {
        const response = await fetch(`${PACIENTES_API_BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });

        // 204 No Content é o padrão de sucesso para DELETE
        if (response.status === 204 || response.ok) {
            return true;
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao remover paciente.');
    } catch (error) {
        console.error('Erro em removerPaciente:', error);
        throw error;
    }
};