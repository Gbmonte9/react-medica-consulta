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
// 1. AGENDAR Consulta (POST /api/consultas) - Usado pelo Paciente
// ----------------------------------------------------
export const agendarConsulta = async (agendamentoData) => { 
    // agendamentoData deve conter médicoId, pacienteId, dataHora, etc.
    try {
        const response = await fetch(CONSULTAS_API_BASE_URL, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(agendamentoData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao agendar consulta. Verifique a disponibilidade.');
        }

        return await response.json(); // Retorna ConsultaResponseDTO
    } catch (error) {
        console.error('Erro em agendarConsulta:', error);
        throw error;
    }
};

// ----------------------------------------------------
// 2. LISTAR Todas as Consultas (GET /api/consultas) - Usado por Admin/Médico
// ----------------------------------------------------
export const listarTodasConsultas = async () => {
    try {
        const response = await fetch(CONSULTAS_API_BASE_URL, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('Acesso negado. Requer autenticação.');
            }
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao listar consultas.');
        }

        return await response.json(); // Retorna List<ConsultaResponseDTO>
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

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro ao buscar consulta ID ${id}.`);
        }

        return await response.json(); // Retorna ConsultaResponseDTO
    } catch (error) {
        console.error('Erro em buscarConsultaPorId:', error);
        throw error;
    }
};

// ----------------------------------------------------
// 4. CANCELAR Consulta (PUT /api/consultas/{id}/cancelar) - Usado por Paciente/Admin
// ----------------------------------------------------
export const cancelarConsulta = async (id) => {
    try {
        const response = await fetch(`${CONSULTAS_API_BASE_URL}/${id}/cancelar`, {
            method: 'PUT',
            headers: getAuthHeaders(),
        });

        if (response.status !== 204) { 
            // Tenta ler o erro se não for 204
             if (response.headers.get('content-length') !== '0') {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao cancelar consulta.');
            }
            if (!response.ok) {
                 throw new Error('Erro desconhecido ao cancelar consulta.');
            }
        }
        
        return true; 
    } catch (error) {
        console.error('Erro em cancelarConsulta:', error);
        throw error;
    }
};

// ----------------------------------------------------
// 5. FINALIZAR Consulta (PUT /api/consultas/{id}/finalizar) - Usado pelo Médico
// ----------------------------------------------------
export const finalizarConsulta = async (id) => {
    try {
        const response = await fetch(`${CONSULTAS_API_BASE_URL}/${id}/finalizar`, {
            method: 'PUT',
            headers: getAuthHeaders(),
        });

        if (response.status !== 204) { 
             if (response.headers.get('content-length') !== '0') {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao finalizar consulta.');
            }
            if (!response.ok) {
                 throw new Error('Erro desconhecido ao finalizar consulta.');
            }
        }
        
        return true; 
    } catch (error) {
        console.error('Erro em finalizarConsulta:', error);
        throw error;
    }
};

// ----------------------------------------------------
// 6. REMOVER Consulta (DELETE /api/consultas/{id}) - Geralmente Admin
// ----------------------------------------------------
export const removerConsulta = async (id) => {
    try {
        const response = await fetch(`${CONSULTAS_API_BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (response.status !== 204) { 
             if (response.headers.get('content-length') !== '0') {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao remover consulta.');
            }
            if (!response.ok) {
                 throw new Error('Erro desconhecido ao remover consulta.');
            }
        }
        
        return true; 
    } catch (error) {
        console.error('Erro em removerConsulta:', error);
        throw error;
    }
};