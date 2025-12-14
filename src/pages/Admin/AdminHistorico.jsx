// src/pages/Admin/AdminHistorico.jsx

import React, { useState, useEffect, useMemo } from 'react';

// 🎯 CORREÇÃO NO CAMINHO DE IMPORTAÇÃO:
// Assumindo que o modal está em src/components/HistoricoRegistroModal
// (Sobe de /Admin para /pages, sobe para /src, e desce para /components)
import HistoricoRegistroModal from '../../pages/Historico/HistoricoRegistroModal'; 
// SE ESTIVER EM /src/pages/Historico, USE: import HistoricoRegistroModal from '../Historico/HistoricoRegistroModal'; 
// A versão abaixo é a mais comum para componentes reutilizáveis.

// Importamos a função de serviço para listar e cancelar
import { 
    listarTodasConsultas, 
    cancelarConsulta,
    // removerConsulta (Se o admin precisar deletar permanentemente)
} from '../../api/consultasService'; 


function AdminHistorico() {
    
    // 1. ESTADOS ESSENCIAIS 
    const [consultas, setConsultas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // 2. Estados de Filtro 
    const [filtroStatus, setFiltroStatus] = useState('TODAS'); 
    const [filtroBusca, setFiltroBusca] = useState(''); 

    // 3. ESTADOS PARA O MODAL DE HISTÓRICO
    const [isHistoricoModalOpen, setIsHistoricoModalOpen] = useState(false);
    const [consultaIdParaHistorico, setConsultaIdParaHistorico] = useState(null);

    // --------------------------------------------------------------------
    // Lógica de Carregamento de Dados 
    // --------------------------------------------------------------------
    const fetchConsultas = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const data = await listarTodasConsultas();
            setConsultas(data);
            
        } catch (err) {
            console.error("Erro ao buscar histórico de consultas:", err);
            setError(err.message || 'Erro desconhecido ao carregar histórico.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConsultas();
    }, []);

    // --------------------------------------------------------------------
    // Lógica de Ações (Cancelar) 
    // --------------------------------------------------------------------
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
    
    // --------------------------------------------------------------------
    // Lógica de Filtragem 
    // --------------------------------------------------------------------
    const consultasFiltradas = useMemo(() => {
        let lista = consultas;

        // 1. Filtrar por Status
        if (filtroStatus !== 'TODAS') {
            lista = lista.filter(c => c.status === filtroStatus);
        }

        // 2. Filtrar por Busca (Nome do Paciente ou Médico)
        if (filtroBusca) {
            const buscaNormalizada = filtroBusca.toLowerCase();
            lista = lista.filter(c => 
                c.pacienteNome.toLowerCase().includes(buscaNormalizada) || 
                c.medicoNome.toLowerCase().includes(buscaNormalizada)
            );
        }

        return lista;
    }, [consultas, filtroStatus, filtroBusca]);

    // --------------------------------------------------------------------
    // 🎯 NOVA LÓGICA: Abrir Modal de Histórico
    // --------------------------------------------------------------------
    const handleOpenHistoricoModal = (consultaId) => {
        // Garantir que a consultaId não é nula antes de abrir
        if (consultaId) {
            setConsultaIdParaHistorico(consultaId);
            setIsHistoricoModalOpen(true);
        } else {
            console.error("ID da consulta não fornecido para o histórico.");
        }
    };


    // --------------------------------------------------------------------
    // Funções Auxiliares de Visual (Status)
    // --------------------------------------------------------------------
    const getStatusClasses = (status) => {
        switch (status) {
            case 'AGENDADA': return 'bg-blue-100 text-blue-800';
            case 'FINALIZADA': return 'bg-green-100 text-green-800';
            case 'CANCELADA': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // CONDIÇÃO DE RENDERIZAÇÃO 
    if (loading) return <div className="p-4 text-center text-blue-600">Carregando histórico de consultas...</div>;
    if (error) return <div className="p-4 text-red-700 bg-red-100 border border-red-400 rounded-md">Erro: {error}</div>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Histórico de Consultas</h2>

            {/* Filtros e Busca */}
            <div className="bg-white p-4 shadow-md rounded-lg mb-6 flex space-x-4 items-center">
                
                {/* Filtro por Status */}
                <select 
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                    className="border p-2 rounded-lg"
                >
                    <option value="TODAS">Todos os Status</option>
                    <option value="AGENDADA">Agendadas</option>
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
                <span className="text-gray-500">Total: {consultasFiltradas.length}</span>
            </div>

            {/* Tabela de Consultas */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Médico (Especialidade)</th>
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
                                    <button 
                                        className="text-gray-600 hover:text-gray-900" 
                                        title="Detalhes"
                                    >
                                        👁️
                                    </button>
                                    
                                    {/* 2. Botão de Registrar Histórico (Visível se FINALIZADA) */}
                                    {(consulta.status === 'FINALIZADA' || consulta.status === 'REALIZADA') && (
                                        <button 
                                            onClick={() => handleOpenHistoricoModal(consulta.id)}
                                            className="text-green-600 hover:text-green-900 font-semibold" 
                                            title="Registrar Histórico/Prontuário"
                                        >
                                            📝
                                        </button>
                                    )}

                                    {/* 3. Botão de Cancelar (APENAS SE AGENDADA) */}
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
            
            {/* 🎯 INCLUSÃO DO MODAL DE REGISTRO DE HISTÓRICO */}
            <HistoricoRegistroModal
                isOpen={isHistoricoModalOpen}
                onClose={() => setIsHistoricoModalOpen(false)}
                consultaId={consultaIdParaHistorico}
                onHistoricoSuccess={() => {
                    // Após salvar o histórico, feche o modal e recarregue a lista 
                    setIsHistoricoModalOpen(false);
                    fetchConsultas(); 
                }}
            />

        </div>
    );
}

export default AdminHistorico;