import React, { useState, useEffect } from 'react';
import { agendarEFinalizarConsulta } from '../../api/agendamentoIntegradoService'; 
import { agendarConsulta, cancelarConsulta, atualizarConsulta } from '../../api/consultasService'; 
import { listarMedicos } from '../../api/medicoService'; 
import { listarPacientes } from '../../api/pacienteService'; 

const STATUS_OPTIONS = [
    { value: 'AGENDADA', label: 'Consulta Agendada (Padrão)' },
    { value: 'REALIZADA', label: 'Consulta Realizada (Com Histórico)' },
    { value: 'CANCELADA', label: 'Consulta Cancelada (Registro Administrativo)' },
];

function AdminAgendamentoModal({ isOpen, consulta, onClose, onAgendamentoSuccess }) {
    const [medicos, setMedicos] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    
    // Estados básicos
    const [selectedMedicoId, setSelectedMedicoId] = useState('');
    const [selectedPacienteId, setSelectedPacienteId] = useState('');
    const [dataHora, setDataHora] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('AGENDADA');
    
    // Estados do Histórico (Apenas para status REALIZADA)
    const [observacoes, setObservacoes] = useState('');
    const [receita, setReceita] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isEditing = !!consulta;

    // 1. Carregar listas iniciais
    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                try {
                    const [mData, pData] = await Promise.all([listarMedicos(), listarPacientes()]);
                    setMedicos(mData || []);
                    setPacientes(pData || []);
                } catch (err) {
                    setError('Erro ao carregar listas de médicos ou pacientes.');
                }
            };
            fetchData();
        }
    }, [isOpen]);

    // 2. Sincronizar dados para edição ou resetar para novo
    useEffect(() => {
        if (isOpen) {
            if (consulta) {
                setSelectedPacienteId(consulta.paciente?.id || '');
                setSelectedMedicoId(consulta.medico?.id || '');
                setSelectedStatus(consulta.status || 'AGENDADA');
                setObservacoes(consulta.historico?.observacoes || '');
                setReceita(consulta.historico?.receita || '');
                if (consulta.dataHora) setDataHora(consulta.dataHora.substring(0, 16));
            } else {
                setSelectedPacienteId('');
                setSelectedMedicoId('');
                setDataHora('');
                setSelectedStatus('AGENDADA');
                setObservacoes('');
                setReceita('');
                setError(null);
            }
        }
    }, [consulta, isOpen]);

    const handleAgendar = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // --- VALIDAÇÃO DE DATA (Evita o erro do @Future no Java) ---
        const dataSelecionada = new Date(dataHora);
        const agora = new Date();

        if (selectedStatus === 'AGENDADA' && dataSelecionada <= agora) {
            setError('Para agendamentos, a data e hora devem ser futuras.');
            setLoading(false);
            return;
        }

        // Validação obrigatória para status Realizada
        if (selectedStatus === 'REALIZADA' && !observacoes.trim()) {
            setError('Para consultas Realizadas, as observações clínicas são obrigatórias.');
            setLoading(false);
            return;
        }

        const payload = {
            pacienteId: selectedPacienteId,
            medicoId: selectedMedicoId,
            dataHora: dataHora.includes(':00') ? dataHora : `${dataHora}:00`,
            status: selectedStatus,
            observacoes,
            receita
        };

        try {
            if (isEditing) {
                await atualizarConsulta(consulta.id, payload);
            } else {
                if (selectedStatus === 'REALIZADA') {
                    await agendarEFinalizarConsulta(payload);
                } else {
                    const nova = await agendarConsulta(payload);
                    if (selectedStatus === 'CANCELADA') {
                        await cancelarConsulta(nova.id);
                    }
                }
            }
            alert('Operação realizada com sucesso!');
            onAgendamentoSuccess();
            onClose();
        } catch (err) {
            // Aqui ele captura a mensagem do @Future vinda do Java se o front falhar
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4 text-blue-800 border-b pb-2">
                    {isEditing ? 'Editar Registro de Consulta' : 'Novo Registro de Consulta'}
                </h3>

                {error && (
                    <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg text-sm border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleAgendar} className="space-y-4">
                    {/* Paciente */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-1 text-sm">Paciente</label>
                        <select 
                            value={selectedPacienteId} 
                            onChange={(e) => setSelectedPacienteId(e.target.value)} 
                            className="w-full border p-2.5 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" 
                            required
                        >
                            <option value="">-- Selecione o Paciente --</option>
                            {pacientes.map(p => (
                                <option key={p.id} value={p.id}>{p.nomeUsuario} ({p.emailUsuario})</option>
                            ))}
                        </select>
                    </div>

                    {/* Médico */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-1 text-sm">Profissional (Médico)</label>
                        <select 
                            value={selectedMedicoId} 
                            onChange={(e) => setSelectedMedicoId(e.target.value)} 
                            className="w-full border p-2.5 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" 
                            required
                        >
                            <option value="">-- Selecione o Médico --</option>
                            {medicos.map(m => (
                                <option key={m.id} value={m.id}>{m.nomeUsuario} - CRM: {m.crm}</option>
                            ))}
                        </select>
                    </div>

                    {/* Data/Hora e Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-bold mb-1 text-sm">Data e Hora</label>
                            <input 
                                type="datetime-local" 
                                value={dataHora} 
                                onChange={(e) => setDataHora(e.target.value)} 
                                className="w-full border p-2.5 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-1 text-sm">Status</label>
                            <select 
                                value={selectedStatus} 
                                onChange={(e) => setSelectedStatus(e.target.value)} 
                                className="w-full border p-2.5 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                {STATUS_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* SEÇÃO DINÂMICA: HISTÓRICO (Só aparece se for REALIZADA) */}
                    {selectedStatus === 'REALIZADA' && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-3 animate-in fade-in duration-300">
                            <h4 className="text-sm font-bold text-blue-800 uppercase">Informações do Atendimento Clínico</h4>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Observações / Diagnóstico *</label>
                                <textarea 
                                    value={observacoes} 
                                    onChange={(e) => setObservacoes(e.target.value)} 
                                    className="w-full border rounded p-2 text-sm focus:ring-1 focus:ring-blue-400 outline-none" 
                                    rows="3" 
                                    placeholder="Descreva como foi o atendimento..." 
                                    required={selectedStatus === 'REALIZADA'} 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Receita / Prescrição (Opcional)</label>
                                <textarea 
                                    value={receita} 
                                    onChange={(e) => setReceita(e.target.value)} 
                                    className="w-full border rounded p-2 text-sm focus:ring-1 focus:ring-blue-400 outline-none" 
                                    rows="2" 
                                    placeholder="Medicamentos ou conduta médica..." 
                                />
                            </div>
                        </div>
                    )}

                    {/* Rodapé e Botões */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className={`px-6 py-2 rounded-lg text-white font-bold transition shadow-md ${
                                loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {loading ? 'Salvando...' : 'Confirmar Registro'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminAgendamentoModal;