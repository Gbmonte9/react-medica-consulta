// src/api/pacienteService.js

import { getToken } from './authService'; // Importamos a função para obter o token JWT

const PACIENTES_API_BASE_URL = 'http://localhost:8080/api/pacientes';

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
// 1. LISTAR Todos os Pacientes (GET /api/pacientes)
// ----------------------------------------------------
export const listarPacientes = async () => {
    try {
        const response = await fetch(PACIENTES_API_BASE_URL, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('Acesso negado. Você não tem permissão de Administrador.');
            }
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao listar pacientes.');
        }

        return await response.json(); // Retorna List<PacienteResponseDTO>
    } catch (error) {
        console.error('Erro em listarPacientes:', error);
        throw error;
    }
};

// ----------------------------------------------------
// 2. CRIAR Novo Paciente (POST /api/pacientes)
// Usado pelo Admin, enviando todos os dados necessários
// ----------------------------------------------------
// src/api/pacienteService.js (Função CRIAR/REGISTRAR)

export const criarPaciente = async (pacienteData) => { 
    // pacienteData deve conter: nome, email, senha, cpf, telefone, etc.
    
    // 🚨 CORREÇÃO APLICADA: Headers sem autenticação (sem Token JWT)
    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        const response = await fetch(PACIENTES_API_BASE_URL, {
            method: 'POST',
            // 🚨 Usamos headers simples para o registro público
            headers: headers, 
            body: JSON.stringify(pacienteData),
        });

        if (!response.ok) {
            // Se o Back-end retornar 4xx (ex: email já existe)
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao criar paciente.');
        }

        return await response.json(); // Retorna o PacienteResponseDTO criado
    } catch (error) {
        console.error('Erro em criarPaciente:', error);
        
        if (error.message && error.message.includes('Failed to fetch')) {
             throw new Error('Servidor da API desconectado ou rota de registro incorreta.');
        }
        
        throw error;
    }
};

// ----------------------------------------------------
// 3. ATUALIZAR Paciente (PUT /api/pacientes/{id})
// ----------------------------------------------------
export const atualizarPaciente = async (id, pacienteData) => {
    try {
        const response = await fetch(`${PACIENTES_API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(pacienteData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao atualizar paciente.');
        }

        return await response.json(); // Retorna PacienteResponseDTO
    } catch (error) {
        console.error('Erro em atualizarPaciente:', error);
        throw error;
    }
};

// ----------------------------------------------------
// 4. DELETAR Paciente (DELETE /api/pacientes/{id})
// ----------------------------------------------------
export const removerPaciente = async (id) => {
    try {
        const response = await fetch(`${PACIENTES_API_BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        // O Spring Boot retorna 204 No Content para DELETE bem-sucedido
        if (response.status !== 204) { 
            // Se não for sucesso, tenta ler o erro (se houver corpo)
             if (response.headers.get('content-length') !== '0') {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao remover paciente.');
            }
            // Se o status for diferente de 204 e 4xx/5xx, ainda pode ser um erro
            if (!response.ok) {
                 throw new Error('Erro desconhecido ao remover paciente.');
            }
        }
        
        // Retorna true ou nada para indicar sucesso (204)
        return true; 
    } catch (error) {
        console.error('Erro em removerPaciente:', error);
        throw error;
    }
};