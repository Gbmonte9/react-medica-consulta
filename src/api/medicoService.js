// src/api/medicoService.js

import { getToken } from './authService'; // Para obter o token do Admin

const MEDICOS_API_BASE_URL = 'http://localhost:8080/api/medicos';

// ----------------------------------------------------
// Função Auxiliar para Requisições Autenticadas
// ----------------------------------------------------
const getAuthHeaders = () => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        // O token é essencial para autenticar o Admin
        'Authorization': `Bearer ${token}`, 
    };
};

// ----------------------------------------------------
// 1. LISTAR Todos os Médicos (GET /api/medicos)
// ----------------------------------------------------
export const listarMedicos = async () => {
    try {
        const response = await fetch(MEDICOS_API_BASE_URL, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('Acesso negado. Requer papel de Administrador.');
            }
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao listar médicos.');
        }

        return await response.json(); // Retorna List<MedicoResponseDTO>
    } catch (error) {
        console.error('Erro em listarMedicos:', error);
        throw error;
    }
};

// ----------------------------------------------------
// 2. BUSCAR por Especialidade (GET /api/medicos/especialidade?nome={especialidade})
// ----------------------------------------------------
export const buscarMedicosPorEspecialidade = async (especialidade) => {
    try {
        const url = `${MEDICOS_API_BASE_URL}/especialidade?nome=${encodeURIComponent(especialidade)}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro ao buscar médicos por especialidade (${especialidade}).`);
        }

        return await response.json(); // Retorna List<MedicoResponseDTO>
    } catch (error) {
        console.error('Erro em buscarMedicosPorEspecialidade:', error);
        throw error;
    }
};

// ----------------------------------------------------
// 3. CRIAR Novo Médico (POST /api/medicos)
// ----------------------------------------------------
export const criarMedico = async (medicoData) => { 
    try {
        const response = await fetch(MEDICOS_API_BASE_URL, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(medicoData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao criar médico. Verifique os campos.');
        }

        return await response.json(); // Retorna MedicoResponseDTO
    } catch (error) {
        console.error('Erro em criarMedico:', error);
        throw error;
    }
};

// ----------------------------------------------------
// 4. ATUALIZAR Médico (PUT /api/medicos/{id})
// ----------------------------------------------------
export const atualizarMedico = async (id, medicoData) => {
    try {
        const response = await fetch(`${MEDICOS_API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(medicoData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao atualizar médico.');
        }

        return await response.json(); // Retorna MedicoResponseDTO
    } catch (error) {
        console.error('Erro em atualizarMedico:', error);
        throw error;
    }
};

// ----------------------------------------------------
// 5. REMOVER Médico (DELETE /api/medicos/{id})
// ----------------------------------------------------
export const removerMedico = async (id) => {
    try {
        const response = await fetch(`${MEDICOS_API_BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        // Espera-se 204 No Content
        if (response.status !== 204) { 
             if (response.headers.get('content-length') !== '0') {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao remover médico.');
            }
            if (!response.ok) {
                 throw new Error('Erro desconhecido ao remover médico.');
            }
        }
        
        return true; 
    } catch (error) {
        console.error('Erro em removerMedico:', error);
        throw error;
    }
};