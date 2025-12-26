import React, { useState, useEffect } from 'react';
import { agendarEFinalizarConsulta } from '../../api/agendamentoIntegradoService'; 
import { agendarConsulta, cancelarConsulta, atualizarConsulta } from '../../api/consultasService'; 
import { listarMedicos } from '../../api/medicoService'; 
import { listarPacientes } from '../../api/pacienteService'; 

function AdminAgendamentoModal({ isOpen, consulta, onClose, onAgendamentoSuccess }) {
    const [medicos, setMedicos] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [selectedMedicoId, setSelectedMedicoId] = useState('');
    const [selectedPacienteId, setSelectedPacienteId] = useState('');
    const [dataHora, setDataHora] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('AGENDADA');
    const [motivo, setMotivo] = useState(''); // NOVO ESTADO
    const [observacoes, setObservacoes] = useState('');
    const [receita, setReceita] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                try {
                    const [mData, pData] = await Promise.all([listarMedicos(), listarPacientes()]);
                    setMedicos(mData || []);
                    setPacientes(pData || []);
                } catch (err) { setError('Erro ao carregar médicos e pacientes.'); }
            };
            fetchData();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            if (consulta) {
                setSelectedPacienteId(consulta.paciente?.id || '');
                setSelectedMedicoId(consulta.medico?.id || '');
                setSelectedStatus(consulta.status || 'AGENDADA');
                setMotivo(consulta.motivo || ''); 
                setObservacoes(consulta.historico?.observacoes || '');
                setReceita(consulta.historico?.receita || '');
                if (consulta.dataHora) setDataHora(consulta.dataHora.substring(0, 16));
            } else {
                setSelectedPacienteId(''); setSelectedMedicoId(''); setDataHora('');
                setSelectedStatus('AGENDADA'); setMotivo(''); setObservacoes(''); 
                setReceita(''); setError(null);
            }
        }
    }, [consulta, isOpen]);

    const handleAgendar = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = { 
            pacienteId: selectedPacienteId, 
            medicoId: selectedMedicoId, 
            dataHora: dataHora.includes(':00') ? dataHora : `${dataHora}:00`,
            status: selectedStatus, 
            motivo: motivo, 
            observacoes, 
            receita 
        };

        try {
            if (consulta?.id) { 
                await atualizarConsulta(consulta.id, payload); 
            } else {
                if (selectedStatus === 'REALIZADA') {
                    await agendarEFinalizarConsulta(payload);
                } else {
                    const nova = await agendarConsulta(payload);
                    if (selectedStatus === 'CANCELADA') await cancelarConsulta(nova.id);
                }
            }
            onAgendamentoSuccess();
            onClose();
        } catch (err) { 
            setError(err.message || 'Erro ao processar agendamento.'); 
        } finally { 
            setLoading(false); 
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    <div className="modal-header border-0 pt-4 px-4 bg-white">
                        <h5 className="modal-title fw-black text-uppercase tracking-tighter">
                            {consulta ? 'Editar' : 'Novo'} <span className="text-primary">Agendamento</span>
                        </h5>
                        <button type="button" className="btn-close shadow-none" onClick={onClose}></button>
                    </div>

                    <form onSubmit={handleAgendar}>
                        <div className="modal-body px-4">
                            {error && <div className="alert alert-danger border-0 small fw-bold py-2">{error}</div>}
                            
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label small fw-black text-muted uppercase">Paciente</label>
                                    <select value={selectedPacienteId} onChange={(e) => setSelectedPacienteId(e.target.value)} className="form-select border-0 bg-light p-2.5 rounded-3 shadow-none" required>
                                        <option value="">Localizar Paciente...</option>
                                        {pacientes.map(p => <option key={p.id} value={p.id}>{p.nome || p.nomeUsuario}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-black text-muted uppercase">Especialista</label>
                                    <select value={selectedMedicoId} onChange={(e) => setSelectedMedicoId(e.target.value)} className="form-select border-0 bg-light p-2.5 rounded-3 shadow-none" required>
                                        <option value="">Selecionar Médico...</option>
                                        {medicos.map(m => <option key={m.id} value={m.id}>{m.nome || m.nomeUsuario}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-black text-muted uppercase">Data e Horário</label>
                                    <input type="datetime-local" value={dataHora} onChange={(e) => setDataHora(e.target.value)} className="form-control border-0 bg-light p-2.5 rounded-3 shadow-none" required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-black text-muted uppercase">Status Inicial</label>
                                    <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="form-select border-0 bg-light p-2.5 rounded-3 shadow-none">
                                        <option value="AGENDADA">AGENDADA</option>
                                        <option value="REALIZADA">REALIZADA (FINALIZAR AGORA)</option>
                                        <option value="CANCELADA">CANCELADA</option>
                                    </select>
                                </div>

                                <div className="col-12">
                                    <label className="form-label small fw-black text-muted uppercase">Motivo da Consulta</label>
                                    <textarea 
                                        value={motivo} 
                                        onChange={(e) => setMotivo(e.target.value)} 
                                        className="form-control border-0 bg-light p-2.5 rounded-3 shadow-none" 
                                        rows="2" 
                                        placeholder="Ex: Check-up de rotina, Dor abdominal, etc..."
                                    ></textarea>
                                </div>

                                {selectedStatus === 'REALIZADA' && (
                                    <div className="col-12 animate__animated animate__fadeIn">
                                        <div className="bg-primary-subtle p-3 rounded-4 border border-primary-subtle mt-2">
                                            <h6 className="fw-black text-primary uppercase small mb-3">Histórico Clínico Imediato</h6>
                                            <label className="form-label small fw-bold text-muted">Diagnóstico / Evolução</label>
                                            <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} className="form-control border-0 rounded-3 mb-2 shadow-sm" rows="3" required></textarea>
                                            <label className="form-label small fw-bold text-muted">Prescrição</label>
                                            <textarea value={receita} onChange={(e) => setReceita(e.target.value)} className="form-control border-0 rounded-3 shadow-sm" rows="2"></textarea>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="modal-footer border-0 bg-light p-3 mt-3">
                            <button type="button" onClick={onClose} className="btn btn-link text-muted fw-bold text-decoration-none small uppercase">Fechar</button>
                            <button type="submit" disabled={loading} className="btn btn-primary px-4 fw-black uppercase rounded-3 shadow-sm">
                                {loading ? 'Processando...' : 'Confirmar Registro'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <style>{`.fw-black { font-weight: 900; } .uppercase { text-transform: uppercase; }`}</style>
        </div>
    );
}

export default AdminAgendamentoModal;