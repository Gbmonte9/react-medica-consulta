// src/api/consultasService.js
import { getToken, getUserId } from './authService'; 

const CONSULTAS_API_BASE_URL = 'http://localhost:8080/api/consultas';

/**
 * Gera os headers padrões com o Token JWT atualizado
 */
const getAuthHeaders = () => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '', 
    };
};

/**
 * Utilitário para extrair mensagens de erro amigáveis do Spring Boot
 */
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
 * Busca as consultas do paciente logado.
 * Rota: GET /api/consultas/paciente/{id}
 */
export const listarMinhasConsultas = async () => {
    const token = getToken();
    const userId = getUserId();
    
    // Esse log vai te mostrar EXATAMENTE a URL que o React está chamando
    const urlCompleta = `${CONSULTAS_API_BASE_URL}/paciente/${userId}`;
    console.log("Chamando a URL:", urlCompleta);

    const response = await fetch(urlCompleta, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    return data;
};

/**
 * Agenda uma nova consulta
 * Rota: POST /api/consultas
 */
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

/**
 * Lista todas as consultas (Uso administrativo)
 * Rota: GET /api/consultas
 */
export const listarTodasConsultas = async () => {
    const response = await fetch(CONSULTAS_API_BASE_URL, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    const errorMessage = await extractErrorMessage(response);
    if (errorMessage) throw new Error(errorMessage);
    return await response.json(); 
};

/**
 * Atualiza dados de uma consulta existente
 * Rota: PUT /api/consultas/{id}
 */
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

/**
 * Altera o status da consulta para CANCELADA
 * Rota: PUT /api/consultas/{id}/cancelar
 */
export const cancelarConsulta = async (id) => {
    const response = await fetch(`${CONSULTAS_API_BASE_URL}/${id}/cancelar`, {
        method: 'PUT',
        headers: getAuthHeaders(),
    });
    const errorMessage = await extractErrorMessage(response);
    if (errorMessage) throw new Error(errorMessage);
    return true; 
};

/**
 * Remove fisicamente uma consulta do banco
 * Rota: DELETE /api/consultas/{id}
 */
export const removerConsulta = async (id) => {
    const response = await fetch(`${CONSULTAS_API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    const errorMessage = await extractErrorMessage(response);
    if (errorMessage) throw new Error(errorMessage);
    return true; 
};