// src/components/AdminAgendamentoModal.jsx

import React, { useState, useEffect } from 'react';
import { agendarConsulta } from '../../api/consultasService';
import { listarMedicos } from '../../api/medicoService'; 
import { listarPacientes } from '../../api/pacienteService'; 


function AdminAgendamentoModal({ isOpen, onClose, onAgendamentoSuccess }) {
    const [medicos, setMedicos] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    
    // selectedMedicoId e selectedPacienteId agora armazenam a string UUID
    const [selectedMedicoId, setSelectedMedicoId] = useState('');
    const [selectedPacienteId, setSelectedPacienteId] = useState('');
    const [dataHora, setDataHora] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --------------------------------------------------------------------
    // Carrega listas de Médicos e Pacientes
    // --------------------------------------------------------------------
    useEffect(() => {
        if (isOpen) {
            // Limpa o estado quando o modal abre
            setSelectedMedicoId('');
            setSelectedPacienteId('');
            setDataHora('');
            setError(null);

            const fetchData = async () => {
                setLoading(true);
                try {
                    // Nota: Assumimos que listarMedicos/listarPacientes retornam um array de objetos com o campo 'id' como string UUID
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
    // Lógica de Agendamento (CORREÇÕES APLICADAS)
    // --------------------------------------------------------------------
    const handleAgendar = async (e) => {
        e.preventDefault();
        
        if (!selectedPacienteId || !selectedMedicoId || !dataHora) {
            setError('Todos os campos são obrigatórios.');
            return;
        }

        // ✅ CORREÇÃO: Adiciona :00 para segundos, garantindo o formato 
        // ISO 8601 (YYYY-MM-DDTHH:MM:SS) esperado pelo LocalDateTime do Java.
        const dataHoraFormatada = dataHora + ':00'; 

        const agendamentoData = {
            // IDs enviados como strings UUID
            pacienteId: selectedPacienteId, 
            medicoId: selectedMedicoId,     
            // Nome do campo do DTO Java
            dataHora: dataHoraFormatada, 
        };
        
        try {
            setLoading(true);
            setError(null);
            
            await agendarConsulta(agendamentoData); 
            
            alert('Consulta agendada pelo Admin com sucesso!');
            
            onAgendamentoSuccess(); 
            
        } catch (err) {
            console.error('Erro de agendamento:', err);
            // Captura a mensagem de erro detalhada, lida pelo consultasService
            const apiError = err.message;
            setError(apiError || 'Falha no agendamento. Verifique a disponibilidade de horário.');
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
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Agendar Nova Consulta (Admin)</h3>
                
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
                                    // p.id é a string UUID
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
                                    // m.id é a string UUID
                                    <option key={m.id} value={m.id}>
                                        {m.nome} ({m.especialidade}) (ID: {m.id}) 
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 3. Data e Hora */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="dataHora">Data e Hora</label>
                            <input
                                id="dataHora"
                                type="datetime-local"
                                value={dataHora}
                                onChange={(e) => setDataHora(e.target.value)}
                                className="w-full border p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        
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
                                    loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                                disabled={loading}
                            >
                                Agendar Consulta
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default AdminAgendamentoModal;