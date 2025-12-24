// src/api/historicosService.js

import { getToken } from './authService';

// Verifique se no seu Controller Java está @RequestMapping("/api/historicos") com 's'
const HISTORICO_API_BASE_URL = 'http://localhost:8080/api/historicos';

const getAuthHeaders = (contentType = 'application/json') => {
    const token = getToken();
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    if (contentType) {
        headers['Content-Type'] = contentType;
    }
    return headers;
};

const extractErrorMessage = async (response) => {
    if (response.status === 204) return null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        try {
            const errorData = await response.json();
            if (errorData.errors && Array.isArray(errorData.errors)) {
                return errorData.errors.map(err => err.defaultMessage || err.message).join('; ');
            }
            return errorData.message || errorData.error || `Erro ${response.status}`;
        } catch (e) { }
    }
    return `Erro na requisição: ${response.status}`;
};

/**
 * NOVO: Busca todos os registros de histórico de um paciente específico
 * Usado na tela de Prontuário Digital
 */
export const buscarHistoricosPorPacienteId = async (pacienteId) => {
    const response = await fetch(`${HISTORICO_API_BASE_URL}/paciente/${pacienteId}`, {
        method: 'GET',
        headers: getAuthHeaders(null),
    });
    
    if (response.status === 404) return []; // Retorna lista vazia se não houver registros
    
    if (!response.ok) {
        const error = await extractErrorMessage(response);
        throw new Error(error);
    }
    return await response.json();
};

export const registrarHistorico = async (historicoData) => {
    const response = await fetch(HISTORICO_API_BASE_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(historicoData),
    });
    if (!response.ok) {
        const error = await extractErrorMessage(response);
        throw new Error(error);
    }
    return await response.json();
};

export const buscarHistoricoPorId = async (id) => {
    const response = await fetch(`${HISTORICO_API_BASE_URL}/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(null),
    });
    if (!response.ok) {
        const error = await extractErrorMessage(response);
        throw new Error(error);
    }
    return await response.json();
};

export const buscarHistoricoPorConsultaId = async (consultaId) => {
    const response = await fetch(`${HISTORICO_API_BASE_URL}/consulta/${consultaId}`, {
        method: 'GET',
        headers: getAuthHeaders(null),
    });
    if (response.status === 404) return null;
    if (!response.ok) {
        const error = await extractErrorMessage(response);
        throw new Error(error);
    }
    return await response.json();
};

export const atualizarHistorico = async (id, historicoData) => {
    const response = await fetch(`${HISTORICO_API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(historicoData),
    });
    if (!response.ok) {
        const error = await extractErrorMessage(response);
        throw new Error(error);
    }
    return await response.json();
};

export const removerHistorico = async (id) => {
    const response = await fetch(`${HISTORICO_API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(null),
    });
    if (!response.ok) {
        const error = await extractErrorMessage(response);
        throw new Error(error);
    }
    return true;
};

export const gerarPdfHistoricoConsultas = async () => {
    const response = await fetch(`${HISTORICO_API_BASE_URL}/pdf/consultas`, {
        method: 'GET',
        headers: {
            ...getAuthHeaders(null),
            'Accept': 'application/pdf'
        },
    });
    if (!response.ok) {
        const error = await extractErrorMessage(response);
        throw new Error(error || 'Falha ao gerar PDF');
    }
    return await response.blob(); 
};