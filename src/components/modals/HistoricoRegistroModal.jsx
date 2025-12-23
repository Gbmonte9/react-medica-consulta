import React, { useState, useEffect } from 'react'; 
import { registrarHistorico, buscarHistoricoPorConsultaId, atualizarHistorico } from '../../api/historicosService'; 

function HistoricoRegistroModal({ isOpen, onClose, consulta, onHistoricoSuccess }) {
    const [observacoes, setObservacoes] = useState('');
    const [receita, setReceita] = useState('');
    const [historicoId, setHistoricoId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- MAPEAMENTO SEGURO DE NOMES ---
    const nomePaciente = 
        consulta?.paciente?.nomeUsuario || 
        consulta?.paciente?.nome || 
        consulta?.pacienteNome || 
        (consulta?.paciente?.usuario ? consulta.paciente.usuario.nome : "Paciente não identificado");

    const nomeMedico = 
        consulta?.medico?.nomeUsuario || 
        consulta?.medico?.nome || 
        consulta?.medicoNome || 
        (consulta?.medico?.usuario ? consulta.medico.usuario.nome : "Médico não identificado");

    const consultaId = consulta?.id;

    useEffect(() => {
        const carregarHistorico = async () => {
            if (isOpen && consultaId) {
                try {
                    setLoading(true);
                    const dado = await buscarHistoricoPorConsultaId(consultaId);
                    if (dado) {
                        setObservacoes(dado.observacoes || '');
                        setReceita(dado.receita || '');
                        setHistoricoId(dado.id);
                    } else { 
                        resetForm(); 
                    }
                } catch (err) { 
                    resetForm(); 
                } finally { 
                    setLoading(false); 
                }
            }
        };

        carregarHistorico();

        if (!isOpen) {
            resetForm();
        }
    }, [isOpen, consultaId]);

    const resetForm = () => { setObservacoes(''); setReceita(''); setHistoricoId(null); };

    const handleSalvar = async (e) => {
        e.preventDefault();
        setLoading(true);
        const historicoData = { consultaId, observacoes, receita };
        try {
            if (historicoId) { await atualizarHistorico(historicoId, historicoData); }
            else { await registrarHistorico(historicoData); }
            onHistoricoSuccess();
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    if (!isOpen) return null; 

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    
                    <div className="modal-header bg-dark text-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
                        <h5 className="modal-title fw-black text-uppercase small tracking-widest mb-0">
                            {historicoId ? '📄 Prontuário Clínico' : '✍️ Registrar Evolução'}
                        </h5>
                        <button onClick={onClose} className="btn-close btn-close-white shadow-none"></button>
                    </div>
                    
                    <div className="modal-body p-0">
                        {/* Box de Informação do Paciente */}
                        <div className="bg-light p-4 border-bottom d-flex flex-column flex-md-row justify-content-between gap-3">
                            <div>
                                <span className="text-muted fw-bold uppercase" style={{fontSize: '9px'}}>Paciente</span>
                                <div className="fw-black text-dark text-uppercase">{nomePaciente}</div>
                            </div>
                            <div>
                                <span className="text-muted fw-bold uppercase" style={{fontSize: '9px'}}>Profissional Responsável</span>
                                <div className="fw-bold text-primary">{nomeMedico}</div>
                            </div>
                            <div className="text-md-end">
                                <span className="text-muted fw-bold uppercase" style={{fontSize: '9px'}}>ID Consulta</span>
                                <div className="font-monospace small text-secondary">#{consultaId}</div>
                            </div>
                        </div>

                        <form onSubmit={handleSalvar} className="p-4">
                            {error && <div className="alert alert-danger border-0 small fw-bold mb-4">{error}</div>}

                            <div className="mb-4">
                                <label className="form-label fw-black text-muted uppercase" style={{fontSize: '11px'}}>Observações e Diagnóstico</label>
                                <textarea rows="5" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} 
                                    className="form-control border-0 bg-light p-3 rounded-3 shadow-none fw-medium" 
                                    placeholder="Descreva detalhadamente o atendimento..." required />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-black text-muted uppercase" style={{fontSize: '11px'}}>Receituário / Prescrição</label>
                                <textarea rows="3" value={receita} onChange={(e) => setReceita(e.target.value)} 
                                    className="form-control border-0 bg-light p-3 rounded-3 shadow-none fw-medium" 
                                    placeholder="Medicamentos ou orientações de conduta..." />
                            </div>
                        </form>
                    </div>

                    <div className="modal-footer bg-light border-0 px-4 py-3">
                        <button type="button" onClick={onClose} className="btn btn-link text-muted fw-bold text-decoration-none uppercase small">Fechar</button>
                        <button onClick={handleSalvar} disabled={loading} className="btn btn-dark px-5 py-2 rounded-3 fw-black uppercase shadow-sm">
                            {loading ? 'Sincronizando...' : 'Salvar Registro'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HistoricoRegistroModal;