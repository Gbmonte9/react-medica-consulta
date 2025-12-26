import api from './api';

const handleApiError = (error) => {
    if (error.response) {
        const data = error.response.data;
        if (data.errors && Array.isArray(data.errors)) {
            throw new Error(data.errors.map(err => err.defaultMessage || err.message).join('; '));
        }
        throw new Error(data.message || data.error || `Erro ${error.response.status}`);
    }
    throw new Error("Falha na comunicação com o servidor ao integrar agendamento.");
};

/**
 * Envia dados para o endpoint de orquestração que agenda a consulta (finalizada) 
 * e registra o histórico simultaneamente.
 * * @param {object} dataIntegrada - Deve conter pacienteId, medicoId, dataHora, observacoes e receita.
 */
export const agendarEFinalizarConsulta = async (dataIntegrada) => { 
    console.log("Iniciando Agendamento Integrado via Axios...");
    
    try {
        const response = await api.post('/consultas/agendar-e-finalizar', dataIntegrada);
        
        return response.data; 
    } catch (error) {
        console.error('Erro ao agendar e finalizar consulta:', error);
        handleApiError(error);
    }
};