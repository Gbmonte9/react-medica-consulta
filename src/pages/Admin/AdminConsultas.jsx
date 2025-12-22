import React, { useState, useEffect, useMemo } from 'react';
import { 
    listarTodasConsultas, 
    cancelarConsulta,
} from '../../api/consultasService'; 
import AdminAgendamentoModal from '../../components/modals/AdminAgendamentoModal'; 

function AdminConsultas() {
    const [consultas, setConsultas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [consultaParaEditar, setConsultaParaEditar] = useState(null);
    
    // 1. AJUSTE: Agora inicia com 'TODAS' para mostrar tudo ao entrar
    const [filtroStatus, setFiltroStatus] = useState('TODAS'); 
    const [filtroBusca, setFiltroBusca] = useState(''); 

    const fetchConsultas = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await listarTodasConsultas();
            setConsultas(data);
        } catch (err) {
            console.error("Erro ao buscar consultas:", err);
            setError(err.message || 'Erro ao carregar a lista de consultas.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConsultas();
    }, []);

    const handleAgendamentoSuccess = () => {
        setIsModalOpen(false);
        setConsultaParaEditar(null);
        fetchConsultas(); 
    };

    const handleEditar = (consulta) => {
        setConsultaParaEditar(consulta);
        setIsModalOpen(true);
    };

    const handleCancelar = async (id, pacienteNome) => {
        if (!window.confirm(`Deseja CANCELAR a consulta do(a) paciente ${pacienteNome}?`)) {
            return;
        }
        try {
            await cancelarConsulta(id);
            fetchConsultas(); 
            alert(`Consulta cancelada com sucesso.`);
        } catch (err) {
            alert(`Falha ao cancelar: ${err.message}`);
        }
    };
    
    const consultasFiltradas = useMemo(() => {
        let lista = [...consultas];
        
        if (filtroStatus !== 'TODAS') {
            lista = lista.filter(c => c.status === filtroStatus);
        }

        if (filtroBusca) {
            const busca = filtroBusca.toLowerCase();
            lista = lista.filter(c => 
                (c.paciente?.nome?.toLowerCase().includes(busca)) || 
                (c.medico?.nome?.toLowerCase().includes(busca))
            );
        }

        // Ordenar por data (mais recentes primeiro)
        lista.sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));
        return lista;
    }, [consultas, filtroStatus, filtroBusca]);

    const getStatusClasses = (status) => {
        switch (status) {
            case 'AGENDADA': return 'bg-blue-100 text-blue-800';
            case 'REALIZADA': return 'bg-green-100 text-green-800'; 
            case 'CANCELADA': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="p-4 text-center text-blue-600 font-bold">Carregando consultas...</div>;
    if (error) return <div className="p-4 text-red-700 bg-red-100 rounded m-4 border border-red-300">Erro: {error}</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <header className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Gerenciamento de Consultas</h2>
                <button 
                    onClick={() => { setConsultaParaEditar(null); setIsModalOpen(true); }}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
                >
                    + Registrar Consulta
                </button>
            </header>

            {/* Filtros */}
            <div className="bg-white p-4 shadow-sm rounded-lg mb-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center border border-gray-100">
                <div className="w-full md:w-64">
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Filtrar por Status</label>
                    <select 
                        value={filtroStatus}
                        onChange={(e) => setFiltroStatus(e.target.value)}
                        className="border p-2 rounded-lg w-full bg-gray-50"
                    >
                        <option value="TODAS">Todos os Status</option>
                        <option value="AGENDADA">Agendadas</option>
                        <option value="REALIZADA">Realizadas</option>
                        <option value="CANCELADA">Canceladas</option>
                    </select>
                </div>

                <div className="flex-1 w-full">
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Pesquisar</label>
                    <input
                        type="text"
                        placeholder="Buscar por nome do paciente ou médico..."
                        value={filtroBusca}
                        onChange={(e) => setFiltroBusca(e.target.value)}
                        className="border p-2 rounded-lg w-full bg-gray-50"
                    />
                </div>
            </div>

            {/* Tabela */}
            <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Data e Hora</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Paciente</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Médico</th>
                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {consultasFiltradas.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-gray-400">Nenhuma consulta encontrada.</td>
                            </tr>
                        ) : (
                            consultasFiltradas.map((consulta) => (
                                <tr key={consulta.id} className="hover:bg-blue-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {new Date(consulta.dataHora).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })} 
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                        {consulta.paciente?.nome || 'N/A'} 
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {consulta.medico?.nome || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusClasses(consulta.status)}`}>
                                            {consulta.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center flex justify-center space-x-3">
                                        {/* Editar (Disponível apenas se não estiver cancelada) */}
                                        {consulta.status !== 'CANCELADA' && (
                                            <button 
                                                onClick={() => handleEditar(consulta)}
                                                className="text-blue-600 hover:text-blue-800 text-lg"
                                                title="Editar Agendamento"
                                            >
                                                ✏️
                                            </button>
                                        )}
                                        
                                        {/* Cancelar (Apenas consultas AGENDADAS) */}
                                        {consulta.status === 'AGENDADA' && (
                                            <button 
                                                onClick={() => handleCancelar(consulta.id, consulta.paciente?.nome)}
                                                className="text-red-600 hover:text-red-800 text-lg"
                                                title="Cancelar Consulta"
                                            >
                                                ❌
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal de Agendamento/Edição */}
            <AdminAgendamentoModal 
                isOpen={isModalOpen}
                consulta={consultaParaEditar}
                onClose={() => { setIsModalOpen(false); setConsultaParaEditar(null); }}
                onAgendamentoSuccess={handleAgendamentoSuccess}
            />
        </div>
    );
}

export default AdminConsultas;