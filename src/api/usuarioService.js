// src/api/usuarioService.js

import { getToken } from './authService'; 

const USUARIOS_API_BASE_URL = 'http://localhost:8080/api/usuarios';

/**
 * Gera os headers padrão com o Token JWT.
 */
const getAuthHeaders = () => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '', 
    };
};

/**
 * ATUALIZAR PERFIL / USUÁRIO
 * Usado pelo Gabriel para salvar as alterações do formulário de Perfil.
 */
export const atualizarUsuario = async (id, dados) => {
    try {
        const response = await fetch(`${USUARIOS_API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(dados),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao atualizar dados do usuário.');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro em atualizarUsuario:', error);
        throw error;
    }
};

/**
 * LISTAR TODOS (Geralmente uso administrativo)
 */
export const listarTodosUsuarios = async () => {
    try {
        const response = await fetch(USUARIOS_API_BASE_URL, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('Acesso negado. Requer papel de Administrador.');
            }
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao listar todos os usuários.');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro em listarTodosUsuarios:', error);
        throw error;
    }
};

/**
 * BUSCAR POR TIPO (PACIENTE ou MEDICO)
 */
export const buscarUsuariosPorTipo = async (tipo) => {
    const tipoUpper = tipo.toUpperCase(); 
    try {
        const response = await fetch(`${USUARIOS_API_BASE_URL}/tipo/${tipoUpper}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro ao buscar usuários do tipo ${tipoUpper}.`);
        }

        return await response.json(); 
    } catch (error) {
        console.error(`Erro em buscarUsuariosPorTipo (${tipoUpper}):`, error);
        throw error;
    }
};

/**
 * REMOVER USUÁRIO
 */
export const removerUsuario = async (id) => {
    try {
        const response = await fetch(`${USUARIOS_API_BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        // Se o status for 204 (No Content), significa sucesso absoluto
        if (response.status === 204) return true;

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao remover usuário.');
        }
        
        return true; 
    } catch (error) {
        console.error('Erro em removerUsuario:', error);
        throw error;
    }
};