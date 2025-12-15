// src/api/agendamentoIntegradoService.js

import { getToken } from './authService'; 
// Suponha que você tem uma função para extrair a mensagem de erro da resposta HTTP
import { extractErrorMessage } from './consultasService'; 

const CONSULTAS_API_BASE_URL = 'http://localhost:8080/api/consultas';

const getAuthHeaders = () => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
    };
};

/**
 * Envia dados para o endpoint de orquestração que agenda a consulta (finalizada) 
 * e registra o histórico simultaneamente.
 * * @param {object} dataIntegrada - Deve conter pacienteId, medicoId, dataHora, observacoes, e receita.
 */
export const agendarEFinalizarConsulta = async (dataIntegrada) => { 
    try {
        const response = await fetch(`${CONSULTAS_API_BASE_URL}/agendar-e-finalizar`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(dataIntegrada),
        });

        // Use a função de erro que você já tem (exemplo)
        const errorMessage = await extractErrorMessage(response);
        if (errorMessage) {
            throw new Error(errorMessage);
        }

        return await response.json(); 
    } catch (error) {
        console.error('Erro ao agendar e finalizar consulta:', error);
        throw error;
    }
};