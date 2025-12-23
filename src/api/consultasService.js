import { getToken } from './authService'; 

const CONSULTAS_API_BASE_URL = 'http://localhost:8080/api/consultas';

const getAuthHeaders = () => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
    };
};

export const extractErrorMessage = async (response) => {
    if (response.status === 204) return null;
    if (!response.ok) {
        if (response.headers.get('content-type')?.includes('application/json')) {
            try {
                const errorData = await response.json();
                if (errorData.errors && Array.isArray(errorData.errors)) {
                    return errorData.errors.map(err => err.defaultMessage || err.message).join('; ');
                }
                return errorData.message || errorData.error || `Erro ${response.status}`;
            } catch (jsonError) {
                console.warn('Falha ao ler o corpo JSON do erro:', jsonError);
            }
        }
        return `Falha na requisição: ${response.status} ${response.statusText}`;
    }
    return null; 
};

/**
 * Busca as consultas vinculadas ao paciente logado
 * O backend deve identificar o usuário através do Token JWT
 */
export const listarMinhasConsultas = async () => {
    const response = await fetch(`${CONSULTAS_API_BASE_URL}/paciente`, { 
        method: 'GET',
        headers: getAuthHeaders(),
    });
    const errorMessage = await extractErrorMessage(response);
    if (errorMessage) throw new Error(errorMessage);
    return await response.json(); 
};

// --- FUNÇÕES EXISTENTES ---

export const agendarConsulta = async (agendamentoData) => { 
    const response = await fetch(CONSULTAS_API_BASE_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(agendamentoData),
    });
    const errorMessage = await extractErrorMessage(response);
    if (errorMessage) throw new Error(errorMessage);
    return await response.json(); 
};

export const listarTodasConsultas = async () => {
    const response = await fetch(CONSULTAS_API_BASE_URL, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    const errorMessage = await extractErrorMessage(response);
    if (errorMessage) throw new Error(errorMessage);
    return await response.json(); 
};

export const atualizarConsulta = async (id, agendamentoData) => {
    const response = await fetch(`${CONSULTAS_API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(agendamentoData),
    });
    const errorMessage = await extractErrorMessage(response);
    if (errorMessage) throw new Error(errorMessage);
    if (response.status === 204) return true;
    return await response.json(); 
};

export const cancelarConsulta = async (id) => {
    const response = await fetch(`${CONSULTAS_API_BASE_URL}/${id}/cancelar`, {
        method: 'PUT',
        headers: getAuthHeaders(),
    });
    const errorMessage = await extractErrorMessage(response);
    if (errorMessage) throw new Error(errorMessage);
    return true; 
};

export const removerConsulta = async (id) => {
    const response = await fetch(`${CONSULTAS_API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    const errorMessage = await extractErrorMessage(response);
    if (errorMessage) throw new Error(errorMessage);
    return true; 
};