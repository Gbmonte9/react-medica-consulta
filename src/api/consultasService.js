// src/api/consultasService.js

import { getToken, getUserId, getRole } from './authService'; 

const CONSULTAS_API_BASE_URL = 'http://localhost:8080/api/consultas';

const getAuthHeaders = (contentType = 'application/json') => {
    const token = getToken();
    const headers = {
        'Authorization': token ? `Bearer ${token}` : '', 
    };
    if (contentType) {
        headers['Content-Type'] = contentType;
    }
    return headers;
};

export const extractErrorMessage = async (response) => {
    if (response.status === 204) return null;
    
    if (!response.ok) {
        try {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                if (errorData.errors && Array.isArray(errorData.errors)) {
                    return errorData.errors.map(err => err.defaultMessage || err.message).join('; ');
                }
                return errorData.message || errorData.error || `Erro ${response.status}`;
            }
        } catch (jsonError) {
            console.warn('Falha ao processar erro JSON:', jsonError);
        }
        return `Falha na requisição: ${response.status} ${response.statusText}`;
    }
    return null; 
};

/**
 * BUSCA AGENDA DO DIA PARA O DASHBOARD MÉDICO
 */
export const buscarAgendaDoDia = async () => {
    const userId = getUserId();
    if (!userId) {
        console.error("ID do médico não encontrado no storage");
        return [];
    }

    try {
        const response = await fetch(`${CONSULTAS_API_BASE_URL}/medico/${userId}/hoje`, {
            method: 'GET',
            headers: getAuthHeaders(null)
        });

        if (response.status === 404) return [];
        
        const errorMessage = await extractErrorMessage(response);
        if (errorMessage) throw new Error(errorMessage);

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Erro ao buscar agenda:", error);
        return [];
    }
};

/**
 * BUSCA ESTATÍSTICAS PARA O DASHBOARD MÉDICO
 */
export const buscarEstatisticasMedico = async () => {
    const userId = getUserId();
    if (!userId) return { consultasHoje: 0, pacientesAtendidos: 0, consultasCanceladas: 0 };

    try {
        const response = await fetch(`${CONSULTAS_API_BASE_URL}/medico/${userId}/estatisticas`, {
            method: 'GET',
            headers: getAuthHeaders(null)
        });

        if (!response.ok) return { consultasHoje: 0, pacientesAtendidos: 0, consultasCanceladas: 0 };
        
        return await response.json();
    } catch (error) {
        return { consultasHoje: 0, pacientesAtendidos: 0, consultasCanceladas: 0 };
    }
};

/**
 * BUSCA UMA CONSULTA ESPECÍFICA POR ID
 */
export const buscarConsultaPorId = async (id) => {
    const response = await fetch(`${CONSULTAS_API_BASE_URL}/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(null)
    });

    const errorMessage = await extractErrorMessage(response);
    if (errorMessage) throw new Error(errorMessage);

    return await response.json();
};

/**
 * Busca as consultas do usuário logado (Paciente ou Médico).
 */
export const listarMinhasConsultas = async () => {
    const userId = getUserId();
    const role = getRole()?.toUpperCase(); 
    
    if (!userId) throw new Error("Usuário não identificado.");

    const endpoint = role === 'MEDICO' ? 'medico' : 'paciente';

    const response = await fetch(`${CONSULTAS_API_BASE_URL}/${endpoint}/${userId}`, {
        method: 'GET',
        headers: getAuthHeaders(null)
    });

    const errorMessage = await extractErrorMessage(response);
    if (errorMessage) throw new Error(errorMessage);

    const data = await response.json();
    return Array.isArray(data) ? data : [];
};

/**
 * BUSCA A LISTA DE PACIENTES ÚNICOS ATENDIDOS PELO MÉDICO
 */
export const listarMeusPacientes = async () => {
    const userId = getUserId();
    if (!userId) throw new Error("Médico não identificado.");

    const response = await fetch(`${CONSULTAS_API_BASE_URL}/medico/${userId}/pacientes`, {
        method: 'GET',
        headers: getAuthHeaders(null)
    });

    const errorMessage = await extractErrorMessage(response);
    if (errorMessage) throw new Error(errorMessage);

    return await response.json();
};

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

export const listarTodasConsultas = async () => {
    const response = await fetch(CONSULTAS_API_BASE_URL, {
        method: 'GET',
        headers: getAuthHeaders(null),
    });

    const errorMessage = await extractErrorMessage(response);
    if (errorMessage) throw new Error(errorMessage);

    return await response.json(); 
};

export const cancelarConsulta = async (id) => {
    const response = await fetch(`${CONSULTAS_API_BASE_URL}/${id}/cancelar`, {
        method: 'PUT',
        headers: getAuthHeaders(null),
    });

    const errorMessage = await extractErrorMessage(response);
    if (errorMessage) throw new Error(errorMessage);

    return true; 
};

export const finalizarConsulta = async (id) => {
    const response = await fetch(`${CONSULTAS_API_BASE_URL}/${id}/finalizar`, {
        method: 'PUT',
        headers: getAuthHeaders(null),
    });

    const errorMessage = await extractErrorMessage(response);
    if (errorMessage) throw new Error(errorMessage);

    return true; 
};

export const removerConsulta = async (id) => {
    const response = await fetch(`${CONSULTAS_API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(null),
    });

    const errorMessage = await extractErrorMessage(response);
    if (errorMessage) throw new Error(errorMessage);

    return true; 
};