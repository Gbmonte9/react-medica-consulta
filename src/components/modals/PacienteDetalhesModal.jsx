import React, { useState, useEffect } from 'react';
import { buscarHistoricoPorConsultaId } from '../../api/historicosService';

function PacienteDetalhesModal({ isOpen, onClose, consulta }) {
    const [historico, setHistorico] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && consulta?.id) {
            const carregar = async () => {
                setLoading(true);
                try {
                    const dado = await buscarHistoricoPorConsultaId(consulta.id);
                    setHistorico(dado);
                } catch (err) { setHistorico(null); } finally { setLoading(false); }
            };
            carregar();
        }
    }, [isOpen, consulta]);

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop-custom d-flex align-items-center justify-content-center p-3">
            <div className="modal-content-custom bg-white rounded-5 shadow-lg animate__animated animate__backInUp overflow-hidden" style={{ maxWidth: '500px', width: '100%' }}>
                
                <div className="bg-info p-4 text-white text-center position-relative">
                    <button onClick={onClose} className="btn-close-white position-absolute end-0 top-0 m-3 border-0 bg-transparent text-white fs-4" style={{ cursor: 'pointer' }}>×</button>
                    <div className="avatar-medico mx-auto bg-white text-info rounded-circle d-flex align-items-center justify-content-center mb-2 shadow" style={{ width: '70px', height: '70px', fontSize: '1.5rem', fontWeight: '900' }}>
                        {consulta?.medico?.nome?.charAt(0).toUpperCase()}
                    </div>
                    <h5 className="fw-black uppercase mb-0">Dr(a). {consulta?.medico?.nome}</h5>
                    <small className="fw-bold opacity-75 uppercase tracking-widest">{consulta?.medico?.especialidade}</small>
                </div>

                <div className="modal-body p-4">
                    <div className="info-group mb-4">
                        <label className="label-custom">Sintomas Relatados</label>
                        <div className="content-box bg-light border-0 p-3 rounded-4 fw-medium text-dark">
                            "{consulta?.motivo || "Não especificado"}"
                        </div>
                    </div>

                    <div className="info-group mb-4">
                        <label className="label-custom text-info">Parecer Médico</label>
                        <div className="content-box p-3 border-start border-info border-4 bg-light rounded-2 small" style={{ minHeight: '80px' }}>
                            {loading ? <div className="spinner-border spinner-border-sm text-info"></div> : (historico?.observacoes || "Aguardando preenchimento do especialista.")}
                        </div>
                    </div>

                    {historico?.receita && (
                        <div className="info-group">
                            <label className="label-custom text-success">Prescrição Digital</label>
                            <div className="content-box p-3 rounded-4 font-monospace small position-relative overflow-hidden" style={{ backgroundColor: '#f0fff4', border: '1px solid #c6f6d5', color: '#276749' }}>
                                <div className="position-absolute end-0 top-0 p-2 opacity-10 fs-1">💊</div>
                                {historico.receita}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 pt-0">
                    <button onClick={onClose} className="btn btn-dark w-100 py-3 rounded-4 fw-black uppercase tracking-widest shadow-sm">
                        Fechar Documento
                    </button>
                </div>
            </div>

            <style>{`
                .modal-backdrop-custom {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0, 40, 60, 0.7); backdrop-filter: blur(10px); z-index: 9999;
                }
                .label-custom { display: block; font-weight: 900; text-transform: uppercase; font-size: 10px; margin-bottom: 8px; letter-spacing: 1px; color: #adb5bd; }
                .btn-close-white { outline: none; transition: 0.3s; }
                .btn-close-white:hover { transform: rotate(90deg); opacity: 0.8; }
                .fw-black { font-weight: 900; }
            `}</style>
        </div>
    );
}

export default PacienteDetalhesModal;