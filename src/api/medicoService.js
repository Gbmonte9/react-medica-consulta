// src/api/medicoService.js

import { getToken } from './authService';

const MEDICOS_API_BASE_URL = 'http://localhost:8080/api/medicos';

const getAuthHeaders = () => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
    };
};

// 1. LISTAR Todos os Médicos
export const listarMedicos = async () => {
    try {
        const response = await fetch(`${MEDICOS_API_BASE_URL}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            if (response.status === 403) throw new Error('Acesso negado. Requer permissão de administrador.');
            const errorData = await response.json().catch(() => ({})); 
            throw new Error(errorData.message || 'Erro ao listar médicos.');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro em listarMedicos:', error);
        throw error;
    }
};

export const listarTodosMedicos = listarMedicos;

// 2. BUSCAR por Especialidade
export const buscarMedicosPorEspecialidade = async (especialidade) => {
    try {
        const url = `${MEDICOS_API_BASE_URL}/especialidade?nome=${encodeURIComponent(especialidade)}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Erro ao buscar médicos por especialidade.');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro em buscarMedicosPorEspecialidade:', error);
        throw error;
    }
};

// 3. BUSCAR Médico por ID
export const buscarMedicoPorId = async (id) => {
    if (!id) throw new Error("ID do médico não fornecido.");
    try {
        const response = await fetch(`${MEDICOS_API_BASE_URL}/${id.toString().trim()}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Erro ao buscar dados do médico.');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro em buscarMedicoPorId:', error);
        throw error;
    }
};

// 4. CRIAR Novo Médico
export const criarMedico = async (medicoData) => { 
    try {
        const response = await fetch(`${MEDICOS_API_BASE_URL}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(medicoData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Erro ao criar médico. Verifique os campos.');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro em criarMedico:', error);
        throw error;
    }
};

// 5. ATUALIZAÇÃO GERAL (PUT)
export const atualizarMedico = async (id, medicoData) => {
    if (!id) throw new Error("ID não identificado para atualização.");
    
    try {
        const url = `${MEDICOS_API_BASE_URL}/${id.toString().trim()}`;
        
        const response = await fetch(url, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(medicoData),
        });

        if (response.status === 404) {
            throw new Error('Médico não encontrado no servidor. O registro pode ter sido removido.');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Erro ao atualizar dados do médico.');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro em atualizarMedico:', error);
        throw error;
    }
};

// 6. ATUALIZAÇÃO DE PERFIL
export const atualizarPerfilMedico = async (id, dadosPerfil) => {
    return await atualizarMedico(id, dadosPerfil);
};

// 7. REMOVER Médico
export const removerMedico = async (id) => {
    if (!id) throw new Error("ID necessário para remoção.");
    try {
        const response = await fetch(`${MEDICOS_API_BASE_URL}/${id.toString().trim()}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (response.status === 204) return true; 

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Erro ao remover médico.');
        }
        
        return true; 
    } catch (error) {
        console.error('Erro em removerMedico:', error);
        throw error;
    }
};