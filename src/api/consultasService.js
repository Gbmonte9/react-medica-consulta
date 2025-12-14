// src/api/consultasService.js

import { getToken } from './authService'; // Para obter o token de autenticação

const CONSULTAS_API_BASE_URL = 'http://localhost:8080/api/consultas';

// ----------------------------------------------------
// Função Auxiliar para Requisições Autenticadas
// ----------------------------------------------------
const getAuthHeaders = () => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
    };
};

// ----------------------------------------------------
// Função Auxiliar para Extração Robusta de Mensagens de Erro
// ----------------------------------------------------
const extractErrorMessage = async (response) => {
    // Se não for um erro 2xx, tenta extrair a mensagem detalhada do corpo
    if (!response.ok) {
        // Tenta ler o corpo JSON
        if (response.headers.get('content-type')?.includes('application/json')) {
            try {
                const errorData = await response.json();
                
                // 1. Verifica se há um array de erros (comum em falhas de validação @Valid)
                if (errorData.errors && Array.isArray(errorData.errors)) {
                    // Concatena as mensagens de erro de cada campo
                    const validationMessages = errorData.errors
                        .map(err => err.defaultMessage || err.message)
                        .join('; ');
                    return validationMessages;
                }

                // 2. Prioriza a mensagem principal (comum em ResponseStatusException)
                if (errorData.message) {
                    return errorData.message;
                }
                
                // 3. Fallback para o campo 'error'
                if (errorData.error) {
                    return errorData.error;
                }

            } catch (jsonError) {
                // Falha ao parsear o JSON de erro
                console.warn('Falha ao ler o corpo JSON do erro:', jsonError);
            }
        }
        
        // Fallback genérico (para erros sem corpo JSON ou falhas não capturadas)
        return `Falha na requisição: ${response.status} ${response.statusText}`;
    }
    return null; // Não há erro
};


// ----------------------------------------------------
// 1. AGENDAR Consulta (POST /api/consultas)
// ----------------------------------------------------
export const agendarConsulta = async (agendamentoData) => { 
    try {
        const response = await fetch(CONSULTAS_API_BASE_URL, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(agendamentoData),
        });

        const errorMessage = await extractErrorMessage(response);
        if (errorMessage) {
            throw new Error(errorMessage);
        }

        return await response.json(); // Retorna ConsultaResponseDTO
    } catch (error) {
        console.error('Erro em agendarConsulta:', error);
        throw error;
    }
};

// ----------------------------------------------------
// 2. LISTAR Todas as Consultas (GET /api/consultas)
// ----------------------------------------------------
export const listarTodasConsultas = async () => {
    try {
        const response = await fetch(CONSULTAS_API_BASE_URL, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        const errorMessage = await extractErrorMessage(response);
        if (errorMessage) {
            throw new Error(errorMessage);
        }

        return await response.json(); 
    } catch (error) {
        console.error('Erro em listarTodasConsultas:', error);
        throw error;
    }
};

// ----------------------------------------------------
// 3. BUSCAR Consulta por ID (GET /api/consultas/{id})
// ----------------------------------------------------
export const buscarConsultaPorId = async (id) => {
    try {
        const response = await fetch(`${CONSULTAS_API_BASE_URL}/${id}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        const errorMessage = await extractErrorMessage(response);
        if (errorMessage) {
            throw new Error(errorMessage);
        }

        return await response.json(); // Retorna ConsultaResponseDTO
    } catch (error) {
        console.error('Erro em buscarConsultaPorId:', error);
        throw error;
    }
};

// ----------------------------------------------------
// 4. CANCELAR Consulta (PUT /api/consultas/{id}/cancelar)
// ----------------------------------------------------
export const cancelarConsulta = async (id) => {
    try {
        const response = await fetch(`${CONSULTAS_API_BASE_URL}/${id}/cancelar`, {
            method: 'PUT',
            headers: getAuthHeaders(),
        });
        
        const errorMessage = await extractErrorMessage(response);
        if (errorMessage) {
            throw new Error(errorMessage);
        }

        // 204 No Content, retorna true se tudo OK
        return true; 
    } catch (error) {
        console.error('Erro em cancelarConsulta:', error);
        throw error;
    }
};

// ----------------------------------------------------
// 5. FINALIZAR Consulta (PUT /api/consultas/{id}/finalizar)
// ----------------------------------------------------
export const finalizarConsulta = async (id) => {
    try {
        const response = await fetch(`${CONSULTAS_API_BASE_URL}/${id}/finalizar`, {
            method: 'PUT',
            headers: getAuthHeaders(),
        });

        const errorMessage = await extractErrorMessage(response);
        if (errorMessage) {
            throw new Error(errorMessage);
        }

        return true; 
    } catch (error) {
        console.error('Erro em finalizarConsulta:', error);
        throw error;
    }
};

// ----------------------------------------------------
// 6. REMOVER Consulta (DELETE /api/consultas/{id})
// ----------------------------------------------------
export const removerConsulta = async (id) => {
    try {
        const response = await fetch(`${CONSULTAS_API_BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        
        const errorMessage = await extractErrorMessage(response);
        if (errorMessage) {
            throw new Error(errorMessage);
        }

        return true; 
    } catch (error) {
        console.error('Erro em removerConsulta:', error);
        throw error;
    }
};