import api from './api';

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

export const buscarHistoricosPorPacienteId = async (pacienteId) => {
    try {
        const response = await api.get(`/historicos/paciente/${pacienteId}`);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        if (error.response?.status === 404) return [];
        handleApiError(error);
    }
};

export const registrarHistorico = async (historicoData) => {
    try {
        const response = await api.post('/historicos', historicoData);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const buscarHistoricoPorId = async (id) => {
    try {
        const response = await api.get(`/historicos/${id}`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const buscarHistoricoPorConsultaId = async (consultaId) => {
    try {
        const response = await api.get(`/historicos/consulta/${consultaId}`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) return null;
        handleApiError(error);
    }
};

export const atualizarHistorico = async (id, historicoData) => {
    try {
        const response = await api.put(`/historicos/${id}`, historicoData);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const removerHistorico = async (id) => {
    try {
        await api.delete(`/historicos/${id}`);
        return true;
    } catch (error) {
        handleApiError(error);
    }
};

export const gerarPdfHistoricoConsultas = async () => {
    try {
        const response = await api.get('/historicos/pdf/consultas', {
            responseType: 'blob', 
            headers: {
                'Accept': 'application/pdf'
            }
        });
        return response.data; 
    } catch (error) {
        handleApiError(error);
    }
};