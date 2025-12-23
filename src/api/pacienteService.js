// src/api/pacienteService.js

import { getToken } from './authService';

const PACIENTES_API_BASE_URL = 'http://localhost:8080/api/pacientes';

const getAuthHeaders = () => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
    };
};

export const listarPacientes = async () => {
    try {
        const response = await fetch(PACIENTES_API_BASE_URL, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Erro ao listar pacientes.');
        }

        const data = await response.json();
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
            headers: getAuthHeaders(), 
            body: JSON.stringify(pacienteData),
        });

        if (!response.ok) {
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
        const dadosParaEnviar = { ...pacienteData };

        if (!dadosParaEnviar.senha || dadosParaEnviar.senha.trim() === "") {
            delete dadosParaEnviar.senha;
        }

        const response = await fetch(`${PACIENTES_API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
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
            headers: getAuthHeaders(),
        });

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