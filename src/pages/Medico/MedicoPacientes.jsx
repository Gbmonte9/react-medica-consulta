import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../../contexts/LoadingContext';
import { listarMeusPacientes } from '../../api/consultasService'; 
import { Search, User, Mail, Phone, FileText, UserRound } from 'lucide-react';
import Swal from 'sweetalert2';

function MedicoPacientes() {
    const navigate = useNavigate();
    const { setIsLoading } = useLoading();
    const [busca, setBusca] = useState('');
    const [pacientes, setPacientes] = useState([]);

    useEffect(() => {
        const carregarDados = async () => {
            setIsLoading(true);
            try {
                const dados = await listarMeusPacientes();
                setPacientes(Array.isArray(dados) ? dados : []);
            } catch (error) {
                console.error("Erro ao carregar lista de pacientes", error);
                if (error.response?.status !== 404) {
                    Swal.fire('Erro', 'Não foi possível carregar seus pacientes.', 'error');
                }
            } finally {
                setIsLoading(false);
            }
        };

        carregarDados();
    }, [setIsLoading]);

    const pacientesFiltrados = pacientes.filter(p => 
        (p.nomeUsuario || "").toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <div className="container-fluid py-3 px-2 px-md-4 animate__animated animate__fadeIn">
            
            {/* Cabeçalho e Busca Responsiva */}
            <div className="row align-items-end mb-4 g-3">
                <div className="col-12 col-lg-7">
                    <h2 className="fw-black text-dark tracking-tighter mb-1">Meus <span className="text-success">Pacientes</span></h2>
                    <p className="text-muted small fw-bold mb-0 text-uppercase tracking-wider">Gestão de histórico e contatos</p>
                </div>
                <div className="col-12 col-lg-5">
                    <div className="input-group shadow-sm border-0 rounded-4 overflow-hidden">
                        <span className="input-group-text bg-white border-0 ps-3 text-muted">
                            <Search size={18} />
                        </span>
                        <input 
                            type="text" 
                            className="form-control border-0 py-3 fw-medium shadow-none" 
                            placeholder="Buscar pelo nome..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Grid de Pacientes - Ajustado para forçar 1 coluna abaixo de 1080px */}
            <div className="row g-3 g-md-4">
                {pacientesFiltrados.length > 0 ? (
                    pacientesFiltrados.map((paciente) => (
                        <div key={paciente.id} className="col-12 col-custom-1080 col-xxl-4">
                            <div className="card border-0 shadow-sm rounded-4 hover-shadow transition-all h-100">
                                <div className="card-body p-4 d-flex flex-column">
                                    
                                    {/* Perfil Rápido */}
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <div className="bg-success-subtle text-success rounded-4 d-flex align-items-center justify-content-center fw-black shadow-sm" 
                                             style={{ width: '56px', height: '56px', fontSize: '1.4rem' }}>
                                            {paciente.nomeUsuario?.charAt(0).toUpperCase() || 'P'}
                                        </div>
                                        <div className="text-truncate">
                                            <h6 className="mb-0 fw-black text-dark text-truncate fs-5">{paciente.nomeUsuario}</h6>
                                            <div className="d-flex align-items-center gap-1 text-muted">
                                                <UserRound size={12} />
                                                <small className="text-uppercase fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>Paciente Ativo</small>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detalhes de Contato */}
                                    <div className="bg-light rounded-4 p-3 mb-4 flex-grow-1">
                                        <div className="mb-3 d-flex align-items-start gap-2">
                                            <Mail size={16} className="text-success mt-1 flex-shrink-0" />
                                            <div className="text-truncate">
                                                <small className="text-muted fw-bold d-block text-uppercase" style={{fontSize: '10px'}}>E-mail</small>
                                                <span className="small fw-bold text-dark text-truncate d-block">
                                                    {paciente.emailUsuario || 'Não informado'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-start gap-2">
                                            <Phone size={16} className="text-success mt-1 flex-shrink-0" />
                                            <div>
                                                <small className="text-muted fw-bold d-block text-uppercase" style={{fontSize: '10px'}}>Telefone</small>
                                                <span className="small fw-bold text-dark">
                                                    {paciente.telefone || 'Não informado'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ação */}
                                    <div className="d-grid mt-auto">
                                        <button 
                                            onClick={() => navigate(`/medico/pacientes/${paciente.id}/prontuario`)}
                                            className="btn btn-success fw-black rounded-pill py-2 shadow-sm d-flex align-items-center justify-content-center gap-2 transition-all hover-scale"
                                        >
                                            <FileText size={18} /> VER PRONTUÁRIO
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center py-5">
                        <div className="bg-light rounded-5 p-5 border border-2 border-dashed d-inline-block w-100">
                            <User size={48} className="text-muted opacity-25 mb-3" />
                            <h5 className="fw-bold text-muted mb-1">Nenhum paciente encontrado</h5>
                            <p className="text-muted small mb-0">Tente ajustar os termos da sua busca.</p>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .fw-black { font-weight: 900; }
                .tracking-tighter { letter-spacing: -1px; }
                .transition-all { transition: all 0.3s ease-in-out; }
                
                .hover-shadow:hover { 
                    transform: translateY(-5px);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.08) !important;
                }
                
                .hover-scale:active { transform: scale(0.98); }
                .bg-success-subtle { background-color: #e8f5e9 !important; }
                
                .form-control:focus {
                    background-color: #fff;
                    box-shadow: none;
                }

                /* LOGICA DE 1080PX */
                @media (max-width: 1080px) {
                    .col-custom-1080 {
                        width: 100% !important;
                        flex: 0 0 100% !important;
                        max-width: 100% !important;
                    }
                    
                    h2 { font-size: 1.6rem !important; }
                    
                    .card-body {
                        padding: 1.25rem !important;
                    }

                    .input-group input {
                        font-size: 0.9rem;
                    }
                }

                @media (max-width: 576px) {
                    .fs-5 { font-size: 1.1rem !important; }
                }
            `}</style>
        </div>
    );
}

export default MedicoPacientes;