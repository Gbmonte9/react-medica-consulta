// src/components/AdminAgendamentoModal.jsx

import React, { useState, useEffect } from 'react';
// Importar o NOVO serviço de orquestração (vamos manter, mas ele só funciona com FINALIZADA)
import { agendarEFinalizarConsulta } from '../../api/agendamentoIntegradoService'; 
// Vamos precisar do serviço padrão para agendar e cancelar, se o status for diferente de REALIZADA/FINALIZADA
import { agendarConsulta, cancelarConsulta } from '../../api/consultasService'; 
import { listarMedicos } from '../../api/medicoService'; 
import { listarPacientes } from '../../api/pacienteService'; 


// Constantes de Status para o Select
const STATUS_OPTIONS = [
    { value: 'REALIZADA', label: 'Consulta Realizada (Com Histórico)' },
    { value: 'AGENDADA', label: 'Consulta Agendada (Padrão)' },
    { value: 'CANCELADA', label: 'Consulta Cancelada (Registro Administrativo)' },
];


function AdminAgendamentoModal({ isOpen, onClose, onAgendamentoSuccess }) {
    const [medicos, setMedicos] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    
    // Estados da Consulta
    const [selectedMedicoId, setSelectedMedicoId] = useState('');
    const [selectedPacienteId, setSelectedPacienteId] = useState('');
    const [dataHora, setDataHora] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('REALIZADA'); // Estado para o Status
    
    // Estados do Histórico (Requeridos apenas se Status for REALIZADA)
    const [observacoes, setObservacoes] = useState('');
    const [receita, setReceita] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --------------------------------------------------------------------
    // Carrega listas de Médicos e Pacientes (Limpa os NOVOS estados também)
    // --------------------------------------------------------------------
    useEffect(() => {
        if (isOpen) {
            // Limpa o estado quando o modal abre
            setSelectedMedicoId('');
            setSelectedPacienteId('');
            setDataHora('');
            setSelectedStatus('REALIZADA'); // Define o padrão
            setObservacoes(''); 
            setReceita('');     
            setError(null);

            const fetchData = async () => {
                setLoading(true);
                try {
                    const [medicosData, pacientesData] = await Promise.all([
                        listarMedicos(),
                        listarPacientes() 
                    ]);
                    
                    setMedicos(medicosData); 
                    setPacientes(pacientesData);
                } catch (err) {
                    setError('Erro ao carregar listas de Médicos/Pacientes: ' + (err.message || 'Erro de rede.'));
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [isOpen]);


    // --------------------------------------------------------------------
    // Lógica de Agendamento (ORQUESTRAÇÃO)
    // --------------------------------------------------------------------
    const handleAgendar = async (e) => {
        e.preventDefault();
        
        if (!selectedPacienteId || !selectedMedicoId || !dataHora) {
            setError('Os campos Paciente, Médico e Data/Hora são obrigatórios.');
            return;
        }

        // Validação adicional para status REALIZADA
        if (selectedStatus === 'REALIZADA' && !observacoes) {
            setError('Para o status "Realizada", as Observações/Diagnóstico são obrigatórias.');
            return;
        }

        const dataHoraFormatada = dataHora + ':00'; 
        
        // Dados básicos para todas as operações
        const dadosBase = {
            pacienteId: selectedPacienteId, 
            medicoId: selectedMedicoId,     
            dataHora: dataHoraFormatada, 
        };

        try {
            setLoading(true);
            setError(null);
            
            let resultado;

            if (selectedStatus === 'REALIZADA') {
                // USA O ENDPOINT DE ORQUESTRAÇÃO
                const agendamentoData = {
                    ...dadosBase, 
                    observacoes: observacoes,       
                    receita: receita,               
                };
                resultado = await agendarEFinalizarConsulta(agendamentoData);
                
            } else if (selectedStatus === 'AGENDADA') {
                // USA O ENDPOINT PADRÃO DE AGENDAMENTO
                resultado = await agendarConsulta(dadosBase);

            } else if (selectedStatus === 'CANCELADA') {
                // FLUXO DE DOIS PASSOS: 1. AGENDA, 2. CANCELA
                // Nota: O backend pode ter um endpoint direto para AGENDAR_CANCELADA.
                // Usaremos o fluxo de dois passos por segurança aqui:
                const consultaAgendada = await agendarConsulta(dadosBase);
                await cancelarConsulta(consultaAgendada.id);
                resultado = consultaAgendada; // Retorna a consulta original (agora cancelada)
            }


            alert(`Consulta ${selectedStatus} registrada com sucesso!`);
            
            onAgendamentoSuccess(); 
            onClose(); 
            
        } catch (err) {
            console.error('Erro no registro de consulta:', err);
            const apiError = err.message;
            setError(apiError || 'Falha na operação. Verifique a disponibilidade e os dados.');
        } finally {
            setLoading(false);
        }
    };
    
    if (!isOpen) return null;

    // --------------------------------------------------------------------
    // Renderização do Modal
    // --------------------------------------------------------------------
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6"> 
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Registro Administrativo de Consulta</h3>
                
                {error && <div className="p-2 mb-3 text-red-700 bg-red-100 rounded">{error}</div>}
                
                {loading && <div className="text-center py-4 text-blue-600">Carregando dados...</div>}

                {!loading && (
                    <form onSubmit={handleAgendar}>
                        
                        {/* 1. Seleção do Paciente */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="paciente">Paciente</label>
                            <select
                                id="paciente"
                                value={selectedPacienteId}
                                onChange={(e) => setSelectedPacienteId(e.target.value)}
                                className="w-full border p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="" disabled>-- Selecione um Paciente --</option>
                                {pacientes.map(p => (
                                    <option key={p.id} value={p.id}>{p.nome} (ID: {p.id})</option> 
                                ))}
                            </select>
                        </div>

                        {/* 2. Seleção do Médico */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="medico">Médico</label>
                            <select
                                id="medico"
                                value={selectedMedicoId}
                                onChange={(e) => setSelectedMedicoId(e.target.value)}
                                className="w-full border p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="" disabled>-- Selecione um Médico --</option>
                                {medicos.map(m => (
                                    <option key={m.id} value={m.id}>
                                        {m.nome} ({m.especialidade}) (ID: {m.id})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 3. Data e Hora */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="dataHora">Data e Hora da Consulta</label>
                            <input
                                id="dataHora"
                                type="datetime-local"
                                value={dataHora}
                                onChange={(e) => setDataHora(e.target.value)}
                                className="w-full border p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        
                        {/* 🚨 NOVO CAMPO: Seleção de Status */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="status">Status da Consulta</label>
                            <select
                                id="status"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full border p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                {STATUS_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>


                        {/* Campos de Histórico (Visíveis APENAS se o status for REALIZADA) */}
                        {selectedStatus === 'REALIZADA' && (
                            <>
                                {/* 4. Campo de Observações (Histórico) */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="observacoes">Observações / Diagnóstico (*Obrigatório)</label>
                                    <textarea
                                        id="observacoes"
                                        value={observacoes}
                                        onChange={(e) => setObservacoes(e.target.value)}
                                        rows="3"
                                        className="w-full border p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Detalhes do atendimento, diagnóstico e procedimentos realizados."
                                    />
                                </div>

                                {/* 5. Campo de Receita (Histórico) */}
                                <div className="mb-6">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="receita">Receita (Opcional)</label>
                                    <textarea
                                        id="receita"
                                        value={receita}
                                        onChange={(e) => setReceita(e.target.value)}
                                        rows="3"
                                        className="w-full border p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Lista de medicamentos e instruções."
                                    />
                                </div>
                            </>
                        )}

                        
                        {/* Botões */}
                        <div className="flex justify-end space-x-3">
                            <button 
                                type="button" 
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                            >
                                Fechar
                            </button>
                            <button 
                                type="submit"
                                className={`px-4 py-2 rounded-lg text-white font-semibold transition ${
                                    loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                                }`}
                                disabled={loading}
                            >
                                Registrar Consulta
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default AdminAgendamentoModal;