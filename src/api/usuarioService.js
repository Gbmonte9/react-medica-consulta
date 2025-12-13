// src/api/usuarioService.js

import { getToken } from './authService'; // Importa a função para obter o token JWT

const USUARIOS_API_BASE_URL = 'http://localhost:8080/api/usuarios';

// ----------------------------------------------------
// Função Auxiliar para Requisições Autenticadas
// ----------------------------------------------------
const getAuthHeaders = () => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
    };
};

// ----------------------------------------------------
// 1. LISTAR Todos os Usuários (GET /api/usuarios)
// ----------------------------------------------------
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

        return await response.json(); // Retorna List<UsuarioResponseDTO>
    } catch (error) {
        console.error('Erro em listarTodosUsuarios:', error);
        throw error;
    }
};

// ----------------------------------------------------
// 2. BUSCAR Usuários por Tipo (GET /api/usuarios/tipo/{tipo})
// O tipo deve ser 'PACIENTE' ou 'MEDICO'
// ----------------------------------------------------
export const buscarUsuariosPorTipo = async (tipo) => {
    // Garante que o tipo esteja em maiúsculas (como esperado pelo seu Backend)
    const tipoUpper = tipo.toUpperCase(); 
    
    try {
        const response = await fetch(`${USUARIOS_API_BASE_URL}/tipo/${tipoUpper}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('Acesso negado. Requer papel de Administrador.');
            }
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro ao buscar usuários do tipo ${tipoUpper}.`);
        }

        return await response.json(); // Retorna List<UsuarioResponseDTO>
    } catch (error) {
        console.error(`Erro em buscarUsuariosPorTipo (${tipoUpper}):`, error);
        throw error;
    }
};

// ----------------------------------------------------
// 3. REMOVER Usuário (DELETE /api/usuarios/{id})
// ----------------------------------------------------
export const removerUsuario = async (id) => {
    try {
        const response = await fetch(`${USUARIOS_API_BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (response.status !== 204) { 
             if (response.headers.get('content-length') !== '0') {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao remover usuário.');
            }
            if (!response.ok) {
                 throw new Error('Erro desconhecido ao remover usuário.');
            }
        }
        
        return true; 
    } catch (error) {
        console.error('Erro em removerUsuario:', error);
        throw error;
    }
};

// Você pode adicionar buscarPorId e outros endpoints se o Admin precisar