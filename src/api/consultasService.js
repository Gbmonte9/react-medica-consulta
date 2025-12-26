import api from './api';
import { getUserId, getRole } from './authService';

const handleApiError = (error) => {
    if (error.response) {
        const data = error.response.data;
        if (data.errors && Array.isArray(data.errors)) {
            throw new Error(data.errors.map(err => err.defaultMessage || err.message).join('; '));
        }
        throw new Error(data.message || data.error || `Erro ${error.response.status}`);
    }
    throw new Error("Falha na comunicação com o servidor.");
};

export const buscarAgendaDoDia = async () => {
    const userId = getUserId();
    if (!userId) return [];
    try {
        const response = await api.get(`/consultas/medico/${userId}/hoje`);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        if (error.response?.status === 404) return [];
        console.error("Erro ao buscar agenda:", error);
        return [];
    }
};

export const buscarEstatisticasMedico = async () => {
    const userId = getUserId();
    if (!userId) return { consultasHoje: 0, pacientesAtendidos: 0, consultasCanceladas: 0 };
    try {
        const response = await api.get(`/consultas/medico/${userId}/estatisticas`);
        return response.data;
    } catch (error) {
        return { consultasHoje: 0, pacientesAtendidos: 0, consultasCanceladas: 0 };
    }
};

export const buscarConsultaPorId = async (id) => {
    try {
        const response = await api.get(`/consultas/${id}`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const listarMinhasConsultas = async () => {
    const userId = getUserId();
    const role = getRole()?.toUpperCase();
    if (!userId) throw new Error("Usuário não identificado.");

    const endpoint = role === 'MEDICO' ? 'medico' : 'paciente';
    try {
        const response = await api.get(`/consultas/${endpoint}/${userId}`);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        handleApiError(error);
    }
};

export const listarMeusPacientes = async () => {
    const userId = getUserId();
    if (!userId) throw new Error("Médico não identificado.");
    try {
        const response = await api.get(`/consultas/medico/${userId}/pacientes`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const agendarConsulta = async (agendamentoData) => {
    try {
        const response = await api.post('/consultas', agendamentoData);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const atualizarConsulta = async (id, agendamentoData) => {
    try {
        const response = await api.put(`/consultas/${id}`, agendamentoData);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const cancelarConsulta = async (id) => {
    try {
        await api.put(`/consultas/${id}/cancelar`);
        return true;
    } catch (error) {
        handleApiError(error);
    }
};

export const finalizarConsulta = async (id) => {
    try {
        await api.put(`/consultas/${id}/finalizar`);
        return true;
    } catch (error) {
        handleApiError(error);
    }
};

export const removerConsulta = async (id) => {
    try {
        await api.delete(`/consultas/${id}`);
        return true;
    } catch (error) {
        handleApiError(error);
    }
};

export const listarTodasConsultas = async () => {
    try {
        const response = await api.get('/consultas');
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};