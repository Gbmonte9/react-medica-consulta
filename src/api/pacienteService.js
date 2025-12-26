import api from './api';

const handleApiError = (error) => {
    if (error.response) {
        const data = error.response.data;
        const status = error.response.status;

        if (status === 401) {
            throw new Error('Sessão expirada. Por favor, faça login novamente.');
        }
        if (status === 403) {
            throw new Error('Acesso negado. Seu usuário não tem permissão para esta ação.');
        }
        
        if (data.errors && Array.isArray(data.errors)) {
            throw new Error(data.errors.map(err => err.defaultMessage || err.message).join('; '));
        }

        throw new Error(data.message || data.error || `Erro ${status}`);
    }
    throw new Error("Não foi possível conectar ao servidor. Verifique sua internet.");
};


const sanitizarDados = (dados) => {
    const limpos = { ...dados };
    if (limpos.cpf) limpos.cpf = limpos.cpf.replace(/\D/g, '');
    if (limpos.telefone) limpos.telefone = limpos.telefone.replace(/\D/g, '');
    
    if (limpos.senha === "" || limpos.senha === undefined) {
        delete limpos.senha;
    }
    return limpos;
};

export const listarPacientes = async () => {
    try {
        const response = await api.get('/pacientes');
        const data = response.data;
        return Array.isArray(data) ? data : (data.content || []);
    } catch (error) {
        console.error('Erro em listarPacientes:', error);
        handleApiError(error);
    }
};


export const criarPaciente = async (pacienteData) => { 
    try {
        const payload = sanitizarDados(pacienteData);
        const response = await api.post('/pacientes', payload);
        return response.data;
    } catch (error) {
        console.error('Erro em criarPaciente:', error);
        handleApiError(error);
    }
};

export const atualizarPaciente = async (id, pacienteData) => {
    try {
        const payload = sanitizarDados(pacienteData);
        const response = await api.put(`/pacientes/${id}`, payload);
        return response.data;
    } catch (error) {
        console.error('Erro em atualizarPaciente:', error);
        handleApiError(error);
    }
};

export const removerPaciente = async (id) => {
    try {
        await api.delete(`/pacientes/${id}`);
        return true; 
    } catch (error) {
        console.error('Erro em removerPaciente:', error);
        handleApiError(error);
    }
};

export const buscarPacientePorId = async (id) => {
    try {
        const response = await api.get(`/pacientes/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro em buscarPacientePorId:', error);
        handleApiError(error);
    }
};