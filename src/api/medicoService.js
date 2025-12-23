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
        const response = await fetch(MEDICOS_API_BASE_URL, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            if (response.status === 403) throw new Error('Acesso negado. Requer papel de Administrador.');
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

export const buscarMedicosPorEspecialidade = async (especialidade) => {
    try {
        const url = `${MEDICOS_API_BASE_URL}/especialidade?nome=${encodeURIComponent(especialidade)}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Erro ao buscar médicos por especialidade.`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro em buscarMedicosPorEspecialidade:', error);
        throw error;
    }
};

export const buscarMedicoPorId = async (id) => {
    try {
        const response = await fetch(`${MEDICOS_API_BASE_URL}/${id}`, {
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

export const criarMedico = async (medicoData) => { 
    try {
        const response = await fetch(MEDICOS_API_BASE_URL, {
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

export const atualizarMedico = async (id, medicoData) => {
    try {
        const response = await fetch(`${MEDICOS_API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(medicoData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Erro ao atualizar médico.');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro em atualizarMedico:', error);
        throw error;
    }
};

export const removerMedico = async (id) => {
    try {
        const response = await fetch(`${MEDICOS_API_BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (response.status === 204) {
            return true; 
        }

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