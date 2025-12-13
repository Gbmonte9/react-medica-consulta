// src/api/historicoService.js

import { getToken } from './authService'; // Para obter o token de autenticação (Médico ou Admin)

const HISTORICO_API_BASE_URL = 'http://localhost:8080/api/historico';

// ----------------------------------------------------
// Função Auxiliar para Requisições Autenticadas
// ----------------------------------------------------
const getAuthHeaders = (contentType = 'application/json') => {
    const token = getToken();
    return {
        'Content-Type': contentType,
        'Authorization': `Bearer ${token}`, 
    };
};

// ----------------------------------------------------
// 1. REGISTRAR Histórico (POST /api/historico) - Usado pelo Médico
// ----------------------------------------------------
export const registrarHistorico = async (historicoData) => { 
    try {
        const response = await fetch(HISTORICO_API_BASE_URL, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(historicoData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao registrar histórico.');
        }

        return await response.json(); // Retorna HistoricoResponseDTO
    } catch (error) {
        console.error('Erro em registrarHistorico:', error);
        throw error;
    }
};

// ----------------------------------------------------
// 2. BUSCAR Histórico por ID (GET /api/historico/{id})
// ----------------------------------------------------
export const buscarHistoricoPorId = async (id) => {
    try {
        const response = await fetch(`${HISTORICO_API_BASE_URL}/${id}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro ao buscar histórico ID ${id}.`);
        }

        return await response.json(); // Retorna HistoricoResponseDTO
    } catch (error) {
        console.error('Erro em buscarHistoricoPorId:', error);
        throw error;
    }
};

// ----------------------------------------------------
// 3. BUSCAR Histórico por Consulta ID (GET /api/historico/consulta/{consultaId})
// ----------------------------------------------------
export const buscarHistoricoPorConsultaId = async (consultaId) => {
    try {
        const response = await fetch(`${HISTORICO_API_BASE_URL}/consulta/${consultaId}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro ao buscar histórico da consulta ID ${consultaId}.`);
        }

        return await response.json(); // Retorna HistoricoResponseDTO
    } catch (error) {
        console.error('Erro em buscarHistoricoPorConsultaId:', error);
        throw error;
    }
};

// ----------------------------------------------------
// 4. ATUALIZAR Histórico (PUT /api/historico/{id}) - Usado pelo Médico
// ----------------------------------------------------
export const atualizarHistorico = async (id, historicoData) => {
    try {
        const response = await fetch(`${HISTORICO_API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(historicoData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao atualizar histórico.');
        }

        return await response.json(); // Retorna HistoricoResponseDTO
    } catch (error) {
        console.error('Erro em atualizarHistorico:', error);
        throw error;
    }
};

// ----------------------------------------------------
// 5. REMOVER Histórico (DELETE /api/historico/{id}) - Geralmente Admin
// ----------------------------------------------------
export const removerHistorico = async (id) => {
    try {
        const response = await fetch(`${HISTORICO_API_BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (response.status !== 204) { 
             if (response.headers.get('content-length') !== '0') {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao remover histórico.');
            }
            if (!response.ok) {
                 throw new Error('Erro desconhecido ao remover histórico.');
            }
        }
        
        return true; 
    } catch (error) {
        console.error('Erro em removerHistorico:', error);
        throw error;
    }
};

// ----------------------------------------------------
// 6. GERAR PDF (GET /api/historico/pdf/consultas) - Retorna um blob binário
// ----------------------------------------------------
export const gerarPdfHistoricoConsultas = async () => {
    try {
        const response = await fetch(`${HISTORICO_API_BASE_URL}/pdf/consultas`, {
            method: 'GET',
            // Não defina Content-Type para JSON, pois esperamos um blob/pdf
            headers: getAuthHeaders(''), 
        });

        if (!response.ok) {
            // Tenta ler o erro como JSON se não for um PDF binário
            if (response.headers.get('content-type')?.includes('application/json')) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao gerar PDF.');
            }
            throw new Error('Falha ao obter o arquivo PDF do servidor.');
        }
        
        // Retorna o blob binário (ArrayBuffer) do PDF
        return await response.blob(); 
    } catch (error) {
        console.error('Erro em gerarPdfHistoricoConsultas:', error);
        throw error;
    }
};