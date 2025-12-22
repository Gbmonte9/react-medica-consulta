// src/api/historicoService.js
import { getToken } from './authService';

const HISTORICO_API_BASE_URL = 'http://localhost:8080/api/historico';

const getAuthHeaders = (contentType = 'application/json') => {
    const token = getToken();
    const headers = {
        'Authorization': `Bearer ${token}`,
    };
    if (contentType) {
        headers['Content-Type'] = contentType;
    }
    return headers;
};

// Reutilizando a lógica robusta de extração de erro que criamos antes
const extractErrorMessage = async (response) => {
    if (response.status === 204) return null;
    if (!response.ok) {
        if (response.headers.get('content-type')?.includes('application/json')) {
            try {
                const errorData = await response.json();
                if (errorData.errors && Array.isArray(errorData.errors)) {
                    return errorData.errors.map(err => err.defaultMessage || err.message).join('; ');
                }
                return errorData.message || errorData.error || `Erro ${response.status}`;
            } catch (e) { /* fallback */ }
        }
        return `Erro na requisição: ${response.status}`;
    }
    return null;
};

// 1. REGISTRAR Histórico
export const registrarHistorico = async (historicoData) => {
    const response = await fetch(HISTORICO_API_BASE_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(historicoData),
    });
    const error = await extractErrorMessage(response);
    if (error) throw new Error(error);
    return await response.json();
};

// 2. BUSCAR Histórico por ID
export const buscarHistoricoPorId = async (id) => {
    const response = await fetch(`${HISTORICO_API_BASE_URL}/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(null), // GET não precisa de Content-Type
    });
    const error = await extractErrorMessage(response);
    if (error) throw new Error(error);
    return await response.json();
};

// 3. BUSCAR Histórico por Consulta ID
export const buscarHistoricoPorConsultaId = async (consultaId) => {
    const response = await fetch(`${HISTORICO_API_BASE_URL}/consulta/${consultaId}`, {
        method: 'GET',
        headers: getAuthHeaders(null),
    });
    const error = await extractErrorMessage(response);
    if (error) throw new Error(error);
    return await response.json();
};

// 4. ATUALIZAR Histórico
export const atualizarHistorico = async (id, historicoData) => {
    const response = await fetch(`${HISTORICO_API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(historicoData),
    });
    const error = await extractErrorMessage(response);
    if (error) throw new Error(error);
    return await response.json();
};

// 5. REMOVER Histórico
export const removerHistorico = async (id) => {
    const response = await fetch(`${HISTORICO_API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(null),
    });
    const error = await extractErrorMessage(response);
    if (error) throw new Error(error);
    return true;
};

// 6. GERAR PDF
export const gerarPdfHistoricoConsultas = async () => {
    const response = await fetch(`${HISTORICO_API_BASE_URL}/pdf/consultas`, {
        method: 'GET',
        headers: {
            ...getAuthHeaders(null),
            'Accept': 'application/pdf' // Informa ao Java que queremos o PDF
        },
    });

    if (!response.ok) {
        const error = await extractErrorMessage(response);
        throw new Error(error || 'Falha ao gerar PDF');
    }
    
    return await response.blob(); 
};