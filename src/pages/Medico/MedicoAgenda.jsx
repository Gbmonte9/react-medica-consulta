// src/pages/Medico/MedicoAgenda.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../../contexts/LoadingContext';

function MedicoAgenda() {
    const navigate = useNavigate();
    const { setIsLoading } = useLoading();
    const [consultas, setConsultas] = useState([]);

    useEffect(() => {
        const carregarAgenda = async () => {
            setIsLoading(true);
            try {
                // Simulação: No futuro você buscará do backend
                setTimeout(() => {
                    setConsultas([
                        { id: 101, hora: '08:00', paciente: 'Carlos Alberto', status: 'PENDENTE', tipo: 'Consulta' },
                        { id: 102, hora: '09:00', paciente: 'Maria Silva', status: 'CONFIRMADO', tipo: 'Retorno' },
                        { id: 103, hora: '10:00', paciente: 'João Oliveira', status: 'FINALIZADO', tipo: 'Exame' },
                    ]);
                    setIsLoading(false);
                }, 600);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };
        carregarAgenda();
    }, [setIsLoading]);

    const atualizarStatus = (id, novoStatus) => {
        setConsultas(prev => prev.map(c => c.id === id ? { ...c, status: novoStatus } : c));
        alert(`Consulta ${id} atualizada para ${novoStatus}`);
    };

    return (
        <div className="animate__animated animate__fadeIn">
            <h2 className="fw-black text-dark mb-4">Agenda de <span className="text-success">Atendimentos</span></h2>
            
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <table className="table align-middle mb-0">
                    <thead className="bg-light">
                        <tr>
                            <th className="ps-4">Horário</th>
                            <th>Paciente</th>
                            <th>Status</th>
                            <th className="text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {consultas.map((item) => (
                            <tr key={item.id}>
                                <td className="ps-4 fw-bold">{item.hora}</td>
                                <td>{item.paciente}</td>
                                <td>
                                    <span className={`badge ${
                                        item.status === 'PENDENTE' ? 'bg-warning' : 
                                        item.status === 'CONFIRMADO' ? 'bg-info' : 'bg-light text-dark border'
                                    }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="text-center">
                                    {item.status === 'PENDENTE' && (
                                        <div className="d-flex justify-content-center gap-2">
                                            <button onClick={() => atualizarStatus(item.id, 'CONFIRMADO')} className="btn btn-sm btn-success rounded-pill px-3 fw-bold">Aceitar</button>
                                            <button onClick={() => atualizarStatus(item.id, 'RECUSADO')} className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-bold">Recusar</button>
                                        </div>
                                    )}
                                    {item.status === 'CONFIRMADO' && (
                                        <button 
                                            onClick={() => navigate(`/medico/atendimento/${item.id}`)}
                                            className="btn btn-sm btn-primary rounded-pill px-4 fw-black"
                                        >
                                            INICIAR ATENDIMENTO
                                        </button>
                                    )}
                                    {item.status === 'FINALIZADO' && <span className="text-muted small fw-bold">Concluído</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MedicoAgenda;