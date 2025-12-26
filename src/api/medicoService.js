import api from './api';

const handleApiError = (error) => {
    if (error.response) {
        const data = error.response.data;
        if (data.errors && Array.isArray(data.errors)) {
            throw new Error(data.errors.map(err => err.defaultMessage || err.message).join('; '));
        }
        if (error.response.status === 403) {
            throw new Error('Acesso negado. Você não tem permissão para realizar esta ação.');
        }
        throw new Error(data.message || data.error || `Erro ${error.response.status}`);
    }
    throw new Error("Falha na comunicação com o servidor.");
};

export const listarMedicos = async () => {
    try {
        const response = await api.get('/medicos');
        return response.data;
    } catch (error) {
        console.error('Erro em listarMedicos:', error);
        handleApiError(error);
    }
};

export const listarTodosMedicos = listarMedicos;

export const buscarMedicosPorEspecialidade = async (especialidade) => {
    try {
        const response = await api.get('/medicos/especialidade', {
            params: { nome: especialidade }
        });
        return response.data;
    } catch (error) {
        console.error('Erro em buscarMedicosPorEspecialidade:', error);
        handleApiError(error);
    }
};

export const buscarMedicoPorId = async (id) => {
    if (!id) throw new Error("ID do médico não fornecido.");
    try {
        const response = await api.get(`/medicos/${id.toString().trim()}`);
        return response.data;
    } catch (error) {
        console.error('Erro em buscarMedicoPorId:', error);
        handleApiError(error);
    }
};

export const criarMedico = async (medicoData) => { 
    try {
        const response = await api.post('/medicos', medicoData);
        return response.data;
    } catch (error) {
        console.error('Erro em criarMedico:', error);
        handleApiError(error);
    }
};

export const atualizarMedico = async (id, medicoData) => {
    if (!id) throw new Error("ID não identificado para atualização.");
    try {
        const response = await api.put(`/medicos/${id.toString().trim()}`, medicoData);
        return response.data;
    } catch (error) {
        console.error('Erro em atualizarMedico:', error);
        if (error.response?.status === 404) {
            throw new Error('Médico não encontrado no servidor.');
        }
        handleApiError(error);
    }
};

export const atualizarPerfilMedico = async (id, dadosPerfil) => {
    return await atualizarMedico(id, dadosPerfil);
};

export const removerMedico = async (id) => {
    if (!id) throw new Error("ID necessário para remoção.");
    try {
        await api.delete(`/medicos/${id.toString().trim()}`);
        return true; 
    } catch (error) {
        console.error('Erro em removerMedico:', error);
        handleApiError(error);
    }
};