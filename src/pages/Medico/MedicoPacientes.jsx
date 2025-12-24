// src/pages/Medico/MedicoPacientes.jsx

import React, { useState, useEffect } from 'react';
import { useLoading } from '../../contexts/LoadingContext';

function MedicoPacientes() {
    const { setIsLoading } = useLoading();
    const [busca, setBusca] = useState('');
    const [pacientes, setPacientes] = useState([]);

    useEffect(() => {
        const carregarPacientes = async () => {
            setIsLoading(true);
            try {
                // Simulação de chamada API: fetchMeusPacientes(medicoId)
                setTimeout(() => {
                    const dadosMocados = [
                        { id: 1, nome: 'Maria Silva', ultimoAtendimento: '10/12/2023', totalConsultas: 3, status: 'Ativo' },
                        { id: 2, nome: 'Carlos Alberto', ultimoAtendimento: '15/12/2023', totalConsultas: 1, status: 'Ativo' },
                        { id: 3, nome: 'Ana Souza', ultimoAtendimento: '05/11/2023', totalConsultas: 5, status: 'Ativo' },
                        { id: 4, nome: 'João Oliveira', ultimoAtendimento: '20/12/2023', totalConsultas: 2, status: 'Em Tratamento' },
                    ];
                    setPacientes(dadosMocados);
                    setIsLoading(false);
                }, 500);
            } catch (error) {
                console.error("Erro ao carregar lista de pacientes", error);
                setIsLoading(false);
            }
        };

        carregarPacientes();
    }, [setIsLoading]);

    // Filtra a lista conforme o usuário digita no campo de busca
    const pacientesFiltrados = pacientes.filter(p => 
        p.nome.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <div className="animate__animated animate__fadeIn">
            {/* Cabeçalho e Busca */}
            <div className="row align-items-center mb-4 g-3">
                <div className="col-md-6">
                    <h2 className="fw-black text-dark tracking-tighter mb-1">Meus <span className="text-success">Pacientes</span></h2>
                    <p className="text-muted small fw-bold mb-0 text-uppercase">Histórico completo de pessoas atendidas por você</p>
                </div>
                <div className="col-md-6">
                    <div className="input-group shadow-sm">
                        <span className="input-group-text bg-white border-end-0 rounded-start-pill ps-3">🔍</span>
                        <input 
                            type="text" 
                            className="form-control border-start-0 rounded-end-pill py-2 fw-medium shadow-none" 
                            placeholder="Buscar paciente pelo nome..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Grid de Pacientes */}
            <div className="row g-3">
                {pacientesFiltrados.length > 0 ? (
                    pacientesFiltrados.map((paciente) => (
                        <div key={paciente.id} className="col-md-6 col-xl-4">
                            <div className="card border-0 shadow-sm rounded-4 hover-shadow transition-all">
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <div className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center fw-black" 
                                             style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}>
                                            {paciente.nome.charAt(0)}
                                        </div>
                                        <div>
                                            <h6 className="mb-0 fw-black text-dark">{paciente.nome}</h6>
                                            <span className="badge bg-light text-success border border-success-subtle py-1 px-2" style={{ fontSize: '10px' }}>
                                                {paciente.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-light rounded-3 p-3 mb-3">
                                        <div className="d-flex justify-content-between mb-2">
                                            <small className="text-muted fw-bold">Última Visita:</small>
                                            <small className="fw-bold text-dark">{paciente.ultimoAtendimento}</small>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <small className="text-muted fw-bold">Total de Consultas:</small>
                                            <small className="fw-bold text-dark">{paciente.totalConsultas}</small>
                                        </div>
                                    </div>

                                    <div className="d-grid">
                                        <button className="btn btn-outline-success fw-bold rounded-pill btn-sm py-2">
                                            Ver Histórico Clínico
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center py-5">
                        <p className="text-muted fw-bold">Nenhum paciente encontrado com o nome "{busca}".</p>
                    </div>
                )}
            </div>

            <style>{`
                .fw-black { font-weight: 900; }
                .tracking-tighter { letter-spacing: -0.5px; }
                .transition-all { transition: all 0.3s ease; }
                .hover-shadow:hover { 
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
                }
                .bg-success-subtle { background-color: #e8f5e9 !important; }
            `}</style>
        </div>
    );
}

export default MedicoPacientes;