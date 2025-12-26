import api from './api';

const handleApiError = (error) => {
    if (error.response) {
        const data = error.response.data;
        if (data.errors && Array.isArray(data.errors)) {
            throw new Error(data.errors.map(err => err.defaultMessage || err.message).join('; '));
        }
        if (error.response.status === 403) {
            throw new Error('Acesso negado. Requer permissão de Administrador.');
        }
        throw new Error(data.message || data.error || `Erro ${error.response.status}`);
    }
    throw new Error("Falha na comunicação com o servidor.");
};

export const atualizarUsuario = async (id, dados) => {
    try {
        const response = await api.put(`/usuarios/${id}`, dados);
        return response.data;
    } catch (error) {
        console.error('Erro em atualizarUsuario:', error);
        handleApiError(error);
    }
};

export const listarTodosUsuarios = async () => {
    try {
        const response = await api.get('/usuarios');
        return response.data;
    } catch (error) {
        console.error('Erro em listarTodosUsuarios:', error);
        handleApiError(error);
    }
};

export const buscarUsuariosPorTipo = async (tipo) => {
    const tipoUpper = tipo.toUpperCase(); 
    try {
        const response = await api.get(`/usuarios/tipo/${tipoUpper}`);
        return response.data;
    } catch (error) {
        console.error(`Erro em buscarUsuariosPorTipo (${tipoUpper}):`, error);
        handleApiError(error);
    }
};

export const removerUsuario = async (id) => {
    try {
        await api.delete(`/usuarios/${id}`);
        return true; 
    } catch (error) {
        console.error('Erro em removerUsuario:', error);
        handleApiError(error);
    }
};