// src/utils/statusConstants.js

export const STATUS_CONSULTA = {
    AGENDADA: {
        value: 'AGENDADA',
        label: 'Agendada',
        style: 'bg-blue-100 text-blue-800', // Exemplo de Tailwind CSS
        actionable: true, // Pode ser cancelada
    },
    CANCELADA: {
        value: 'CANCELADA',
        label: 'Cancelada',
        style: 'bg-red-100 text-red-800',
        actionable: false, // Nenhuma ação permitida
    },
    REALIZADA: {
        value: 'REALIZADA',
        label: 'Realizada',
        style: 'bg-green-100 text-green-800',
        actionable: false, // Nenhuma ação permitida
    },
};

// Função auxiliar para buscar a definição
export const getStatusDetails = (statusValue) => {
    return STATUS_CONSULTA[statusValue] || {
        value: statusValue,
        label: 'Desconhecido',
        style: 'bg-gray-100 text-gray-800',
        actionable: false,
    };
};