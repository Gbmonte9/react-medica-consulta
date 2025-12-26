import React, { useState } from 'react';
import { gerarPdfHistoricoConsultas } from '../../api/historicosService'; 

function AdminRelatorio() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGerarPdf = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const pdfBlob = await gerarPdfHistoricoConsultas();
            
            if (pdfBlob.type !== 'application/pdf') {
                throw new Error("O arquivo retornado não é um PDF válido.");
            }

            const url = window.URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            const dataHoje = new Date().toLocaleDateString('pt-BR').replaceAll('/', '-');
            
            a.href = url;
            a.download = `relatorio_geral_consultas_${dataHoje}.pdf`;
            document.body.appendChild(a);
            a.click();
            
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setError(err.message || 'Falha ao gerar o relatório. O servidor pode estar offline.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid p-0 animate__animated animate__fadeIn">
       
            <div className="mb-5">
                <h2 className="fw-black text-dark uppercase tracking-tighter mb-1">📊 Inteligência de Dados</h2>
                <p className="text-muted small fw-bold uppercase">Exportação de documentos e análise de produtividade</p>
            </div>

            {error && (
                <div className="alert alert-danger border-0 shadow-sm rounded-4 mb-4 d-flex align-items-center gap-3 p-3">
                    <span className="fs-4">⚠️</span>
                    <span className="fw-bold small uppercase">{error}</span>
                </div>
            )}

            <div className="row g-4">
                <div className="col-12 col-md-6 col-lg-5">
                    <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden transition-hover">
                        <div className="card-body p-4 p-xl-5">
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="bg-danger-subtle p-3 rounded-4 text-danger shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-file-earmark-pdf-fill" viewBox="0 0 16 16">
                                        <path d="M5.523 12.424c.14-.082.293-.162.459-.238a7.878 7.878 0 0 1-.45.606c-.28.337-.498.516-.635.572a.266.266 0 0 1-.035.012.282.282 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548zm2.455-1.647c-.119.025-.237.05-.356.078a21.148 21.148 0 0 0 .5-1.05 12.045 12.045 0 0 0 .51.858c-.217.032-.436.07-.654.114zm2.525.939a3.881 3.881 0 0 1-.435-.41c.228.005.434.022.612.054.317.057.466.147.518.209a.095.095 0 0 1 .026.064.436.436 0 0 1-.06.2.307.307 0 0 1-.094.124.107.107 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256zM8.278 6.97c-.04.244-.108.524-.2.829a4.86 4.86 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.248.014 0 .027.002.04.009.093.056.128.23.099.531z"/>
                                        <path fillRule="evenodd" d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3zM4.165 13.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.651 11.651 0 0 1 1.997-.406c.3.383.61.713.91.973.28.245.593.446.91.457.146.005.294-.022.432-.08.187-.079.397-.243.513-.496.12-.259.149-.546.037-.845-.118-.313-.35-.553-.63-.683-.427-.197-.93-.245-1.397-.245a11.33 11.33 0 0 1-1.127.05 15.13 15.13 0 0 1-1.027-1.992c.273-.58.539-1.252.674-1.84.155-.68.138-1.189-.062-1.513-.146-.238-.453-.446-.82-.446-.103 0-.212.017-.33.053-.55.165-.74.622-.758 1.195-.013.427.054.893.181 1.399.113.443.258.903.446 1.356a14.444 14.444 0 0 1-1.241 2.596 14.121 14.121 0 0 1-2.537 1.639c-.547.292-1.015.548-1.263.848-.11.133-.16.3-.134.462z"/>
                                    </svg>
                                </div>
                                <h4 className="fw-black text-dark uppercase mb-0 tracking-tighter">Histórico Geral</h4>
                            </div>
                            
                            <p className="text-muted fw-medium mb-5">
                                Gere um documento oficial em PDF com todos os registros de consultas, diagnósticos e medicações. Ideal para auditorias e arquivamento físico.
                            </p>

                            <button 
                                onClick={handleGerarPdf}
                                disabled={loading}
                                className={`btn w-100 py-3 rounded-3 fw-black uppercase tracking-widest shadow-sm transition-all d-flex align-items-center justify-content-center gap-2 ${
                                    loading ? 'btn-secondary opacity-50' : 'btn-danger border-0'
                                }`}
                                style={{ background: !loading ? 'linear-gradient(45deg, #dc3545, #ff4d5a)' : '' }}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status"></span>
                                        <span>Processando...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-download" viewBox="0 0 16 16">
                                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                                            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                                        </svg>
                                        <span>Baixar Relatório PDF</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-6 col-lg-5">
                    <div className="card border-0 shadow-sm rounded-4 h-100 bg-light opacity-75 position-relative overflow-hidden">
                        <div className="card-body p-4 p-xl-5 d-flex flex-column justify-content-center text-center">
                            <div className="text-muted mb-3 fs-1">📈</div>
                            <h4 className="fw-black text-muted uppercase mb-2">Painel Analítico</h4>
                            <p className="text-muted small fw-bold px-4 mb-4">
                                Gráficos de produtividade e volume de atendimentos mensais.
                            </p>
                            <div className="badge bg-secondary-subtle text-secondary py-2 px-3 rounded-pill fw-black uppercase mx-auto" style={{fontSize: '10px'}}>
                                Breve: Implementação v2.0
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .transition-hover:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 1rem 3rem rgba(0,0,0,.1) !important;
                }
                .bg-danger-subtle { background-color: #fce8ea !important; }
            `}</style>
        </div>
    );
}

export default AdminRelatorio;