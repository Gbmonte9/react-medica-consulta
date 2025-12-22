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
            const errorData = await response.json().catch(() => ({})); // Evita erro se o body vier vazio
            throw new Error(errorData.message || 'Erro ao listar médicos.');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro em listarMedicos:', error);
        throw error;
    }
};

// 2. BUSCAR por Especialidade
export const buscarMedicosPorEspecialidade = async (especialidade) => {
    try {
        // Ajustado para garantir que a barra não falte na URL
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

// 3. CRIAR Novo Médico
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

// 4. ATUALIZAR Médico
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

// 5. REMOVER Médico (CORRIGIDO)
export const removerMedico = async (id) => {
    try {
        const response = await fetch(`${MEDICOS_API_BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        // Correção na lógica do 204 No Content
        if (response.status === 204) {
            return true; // Sucesso total, nada para ler no body
        }

        if (!response.ok) {
            // Tenta ler o erro se o status não for sucesso
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Erro ao remover médico.');
        }
        
        return true; 
    } catch (error) {
        console.error('Erro em removerMedico:', error);
        throw error;
    }
};