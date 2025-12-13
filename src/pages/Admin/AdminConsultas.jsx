// src/pages/Admin/AdminConsultas.jsx (CÓDIGO CORRETO PARA COPIAR)
import React, { useState, useEffect, useMemo } from 'react';

import { 
    listarTodasConsultas, 
    cancelarConsulta,
} from '../../api/consultasService'; 

// 🚨 CAMINHO PADRÃO CORRIGIDO: Assume que o modal está em components/modals
import AdminAgendamentoModal from '../../pages/Admin/AdminAgendamentoModal'; 


function AdminConsultas() {
    const [consultas, setConsultas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para o Modal
    
    // Filtro inicial focado nas consultas ativas/agendadas
    const [filtroStatus, setFiltroStatus] = useState('AGENDADA'); 
    const [filtroBusca, setFiltroBusca] = useState(''); 

    // Lógica de Carregamento de Dados
    const fetchConsultas = async () => {
        // ... (lógica de carregamento de dados)
        try {
            setLoading(true);
            setError(null);
            const data = await listarTodasConsultas();
            setConsultas(data);
        } catch (err) {
            console.error("Erro ao buscar consultas ativas:", err);
            setError(err.message || 'Erro desconhecido ao carregar a lista de consultas.');
        } finally {
            setLoading(false);
        }
    };

    // Callback para recarregar a lista após um agendamento bem-sucedido
    const handleAgendamentoSuccess = () => {
        setIsModalOpen(false); // Fecha o modal
        fetchConsultas(); // Recarrega os dados
    };

    useEffect(() => {
        fetchConsultas();
    }, []);

    // Lógica de Ações (Cancelar)
    const handleCancelar = async (id, pacienteNome) => {
        if (!window.confirm(`Tem certeza que deseja CANCELAR a consulta do(a) paciente ${pacienteNome}?`)) {
            return;
        }
        try {
            await cancelarConsulta(id);
            fetchConsultas(); 
            alert(`Consulta do(a) paciente ${pacienteNome} cancelada com sucesso.`);
        } catch (err) {
            console.error("Erro ao cancelar consulta:", err);
            alert(`Falha ao cancelar consulta: ${err.message}`);
        }
    };
    
    // Lógica de Filtragem (mantida)
    const consultasFiltradas = useMemo(() => {
        let lista = consultas;
        if (filtroStatus !== 'TODAS') {
            lista = lista.filter(c => c.status === filtroStatus);
        }
        if (filtroBusca) {
            const buscaNormalizada = filtroBusca.toLowerCase();
            lista = lista.filter(c => 
                c.pacienteNome.toLowerCase().includes(buscaNormalizada) || 
                c.medicoNome.toLowerCase().includes(buscaNormalizada)
            );
        }
        lista.sort((a, b) => new Date(a.dataConsulta) - new Date(b.dataConsulta));
        return lista;
    }, [consultas, filtroStatus, filtroBusca]);

    // Funções Auxiliares de Visual (Status)
    const getStatusClasses = (status) => {
        switch (status) {
            case 'AGENDADA': return 'bg-blue-100 text-blue-800';
            case 'FINALIZADA': return 'bg-green-100 text-green-800';
            case 'CANCELADA': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="p-4 text-center text-blue-600">Carregando consultas ativas...</div>;
    if (error) return <div className="p-4 text-red-700 bg-red-100 border border-red-400 rounded-md">Erro: {error}</div>;

    return (
        <div className="p-4">
            {/* TÍTULO COM BOTÃO DE CADASTRO */}
            <h2 className="text-2xl font-semibold mb-6 border-b pb-2 flex justify-between items-center">
                Consultas Agendadas e Ativas
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                    title="Agendar nova consulta para um Paciente"
                >
                    + Nova Consulta
                </button>
            </h2>

            {/* Filtros e Busca (mantidos) */}
            <div className="bg-white p-4 shadow-md rounded-lg mb-6 flex space-x-4 items-center">
                
                {/* Filtro por Status */}
                <select 
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                    className="border p-2 rounded-lg"
                >
                    <option value="AGENDADA">Apenas Agendadas</option>
                    <option value="TODAS">Todos os Status</option>
                    <option value="FINALIZADA">Finalizadas</option>
                    <option value="CANCELADA">Canceladas</option>
                </select>

                {/* Filtro por Busca */}
                <input
                    type="text"
                    placeholder="Buscar por Paciente ou Médico..."
                    value={filtroBusca}
                    onChange={(e) => setFiltroBusca(e.target.value)}
                    className="border p-2 rounded-lg flex-1"
                />
                <span className="text-gray-500">Próximas Consultas: {consultasFiltradas.length}</span>
            </div>

            {/* Tabela de Consultas (mantida) */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    {/* ... (cabeçalho da tabela) ... */}
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Médico</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {consultasFiltradas.map((consulta) => (
                            <tr key={consulta.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {new Date(consulta.dataConsulta).toLocaleString('pt-BR')} 
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {consulta.pacienteNome} 
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {consulta.medicoNome} ({consulta.medicoEspecialidade})
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(consulta.status)}`}>
                                        {consulta.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-center space-x-2">
                                    {/* Botão de Cancelar */}
                                    {consulta.status === 'AGENDADA' && (
                                        <button 
                                            onClick={() => handleCancelar(consulta.id, consulta.pacienteNome)}
                                            className="text-red-600 hover:text-red-900" 
                                            title="Cancelar Consulta"
                                        >
                                            ❌
                                        </button>
                                    )}
                                    
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* INTEGRAÇÃO DO MODAL */}
            <AdminAgendamentoModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAgendamentoSuccess={handleAgendamentoSuccess}
            />
        </div>
    );
}

export default AdminConsultas;