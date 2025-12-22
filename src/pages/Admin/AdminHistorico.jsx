import React, { useState, useEffect, useMemo } from 'react';
import HistoricoRegistroModal from '../../components/modals/HistoricoRegistroModal'; 
import { listarTodasConsultas, cancelarConsulta } from '../../api/consultasService'; 
import { useLoading } from '../../contexts/LoadingContext';

function AdminHistorico() {
    const [consultas, setConsultas] = useState([]);
    const [error, setError] = useState(null);
    
    const [filtroStatus, setFiltroStatus] = useState('TODAS'); 
    const [filtroBusca, setFiltroBusca] = useState(''); 
    const [isHistoricoModalOpen, setIsHistoricoModalOpen] = useState(false);
    
    // ALTERADO: Agora guardamos o objeto da consulta inteira para passar ao modal
    const [consultaSelecionada, setConsultaSelecionada] = useState(null);

    const { setIsLoading } = useLoading();

    const fetchConsultas = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await listarTodasConsultas();
            setConsultas(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Erro ao buscar consultas:", err);
            setError(err.message || 'Erro ao carregar histórico.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { 
        fetchConsultas(); 
    }, []);

    const handleCancelar = async (id, pacienteNome) => {
        if (!window.confirm(`Deseja realmente cancelar a consulta de ${pacienteNome}?`)) return;
        try {
            setIsLoading(true);
            await cancelarConsulta(id);
            await fetchConsultas();
        } catch (err) {
            alert(`Erro ao cancelar: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const consultasFiltradas = useMemo(() => {
        return consultas
            .filter(c => {
                const matchesStatus = filtroStatus === 'TODAS' || c.status === filtroStatus;
                const nomePaciente = (c.paciente?.nomeUsuario || "").toLowerCase();
                const nomeMedico = (c.medico?.nomeUsuario || "").toLowerCase();
                const busca = filtroBusca.toLowerCase();
                
                return matchesStatus && (nomePaciente.includes(busca) || nomeMedico.includes(busca));
            })
            .sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));
    }, [consultas, filtroStatus, filtroBusca]);

    const handleOpenHistoricoModal = (consulta) => {
        console.log("CONTEÚDO DA CONSULTA:", consulta); // Adicione isso aqui!
        setConsultaSelecionada(consulta);
        setIsHistoricoModalOpen(true);
    };

    const getStatusClasses = (status) => {
        switch (status) {
            case 'AGENDADA': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'REALIZADA': return 'bg-green-100 text-green-800 border-green-200';
            case 'CANCELADA': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
                📜 Histórico Geral de Consultas
            </h2>

            {/* Filtros */}
            <div className="bg-white p-4 shadow-sm rounded-xl mb-6 flex flex-col md:flex-row gap-4 border border-gray-200">
                <div className="w-full md:w-48">
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Status</label>
                    <select 
                        value={filtroStatus}
                        onChange={(e) => setFiltroStatus(e.target.value)}
                        className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="TODAS">Todos</option>
                        <option value="AGENDADA">Agendadas</option>
                        <option value="REALIZADA">Realizadas</option>
                        <option value="CANCELADA">Canceladas</option>
                    </select>
                </div>
                <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Pesquisar</label>
                    <input
                        type="text"
                        placeholder="Buscar por Paciente ou Médico..."
                        value={filtroBusca}
                        onChange={(e) => setFiltroBusca(e.target.value)}
                        className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Tabela */}
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Data e Hora</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Paciente</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Médico</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {consultasFiltradas.map((consulta) => (
                            <tr key={consulta.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    {new Date(consulta.dataHora).toLocaleString('pt-BR')} 
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                    {consulta.paciente?.nomeUsuario || "N/A"} 
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {consulta.medico?.nomeUsuario || "N/A"}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusClasses(consulta.status)}`}>
                                        {consulta.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center space-x-2">
                                        {consulta.status !== 'CANCELADA' && (
                                            <button 
                                                // ALTERADO: Passa o objeto consulta
                                                onClick={() => handleOpenHistoricoModal(consulta)}
                                                className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all text-sm font-bold"
                                            >
                                                <span>{consulta.status === 'REALIZADA' ? '👁️ Ver/Editar' : '📝 Registrar'}</span>
                                            </button>
                                        )}
                                        {consulta.status === 'AGENDADA' && (
                                            <button 
                                                onClick={() => handleCancelar(consulta.id, consulta.paciente?.nomeUsuario)}
                                                className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-600 hover:text-white transition-all text-sm font-bold"
                                            >
                                                <span>❌</span> Cancelar
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <HistoricoRegistroModal
                isOpen={isHistoricoModalOpen}
                onClose={() => setIsHistoricoModalOpen(false)}
                // ALTERADO: Passa a consulta completa para o modal
                consulta={consultaSelecionada}
                onHistoricoSuccess={() => {
                    setIsHistoricoModalOpen(false);
                    fetchConsultas(); 
                }}
            />
        </div>
    );
}

export default AdminHistorico;