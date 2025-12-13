// src/pages/Medico/MedicoDashboard.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getConsultasDoMedico } from '../../api/consultasService';
import { Link } from 'react-router-dom';

function MedicoDashboard() {
    // 1. Obtém o usuário logado para pegar o ID do médico
    const { user } = useAuth(); 
    
    // 2. Estado para gerenciar dados
    const [consultas, setConsultas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 3. Efeito: Carregar a agenda do dia
    useEffect(() => {
        // Assegura que o user.id (que é o ID do Médico) está disponível
        if (user && user.id) {
            const fetchConsultas = async () => {
                try {
                    setLoading(true);
                    const data = await getConsultasDoMedico(user.id);
                    setConsultas(data);
                } catch (err) {
                    console.error("Erro ao buscar consultas:", err);
                    setError('Não foi possível carregar sua agenda. Tente novamente.');
                } finally {
                    setLoading(false);
                }
            };
            fetchConsultas();
        }
    }, [user]); // Executa quando o objeto 'user' do contexto é carregado

    // 4. Renderização Condicional
    if (loading) {
        return (
            <div className="container mt-5 text-center text-white">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p>Carregando Agenda...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }
    
    // 5. Renderização Principal (Tabela Bootstrap)
    return (
        <div className="container mt-4 text-white">
            <h2 className="mb-4">📅 Minha Agenda de Hoje</h2>

            {consultas.length === 0 ? (
                <div className="alert alert-info">Você não tem consultas agendadas para hoje.</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-dark table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Hora</th>
                                <th scope="col">Paciente</th>
                                <th scope="col">Motivo</th>
                                <th scope="col">Status</th>
                                <th scope="col">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {consultas.map((consulta) => (
                                <tr key={consulta.id}>
                                    <td>{consulta.hora || 'N/A'}</td>
                                    <td>{consulta.pacienteNome || 'Paciente Desconhecido'}</td>
                                    <td>{consulta.motivo || '-'}</td>
                                    <td>
                                        <span className={`badge bg-${consulta.status === 'AGENDADA' ? 'warning' : 'success'}`}>
                                            {consulta.status}
                                        </span>
                                    </td>
                                    <td>
                                        {/* Link para o Registro de Histórico (C6) */}
                                        <Link 
                                            to={`/medico/historico/registrar/${consulta.id}`} 
                                            className="btn btn-sm btn-primary"
                                            disabled={consulta.status !== 'AGENDADA'}
                                        >
                                            Registrar Evolução
                                        </Link>
                                        {/* Você precisará criar a rota /medico/historico/registrar/:id */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default MedicoDashboard;