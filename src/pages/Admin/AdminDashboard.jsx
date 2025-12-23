import React, { useState, useEffect } from 'react';
import CardEstatistica from '../../components/card/CardEstatistica';
import { fetchDashboardData } from '../../api/dashboardApi';
import { listarTodasConsultas } from '../../api/consultasService';

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

function AdminDashboard() {
  const [estatisticas, setEstatisticas] = useState({ totalMedicos: 0, totalPacientes: 0, consultasMes: 0 });
  const [proximasConsultas, setProximasConsultas] = useState([]);
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString());

  const COLORS = ['#0d6efd', '#6610f2', '#6f42c1', '#d63384', '#fd7e14', '#20c997'];

  const loadData = async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const [dashData, consultasData] = await Promise.all([
        fetchDashboardData(),
        listarTodasConsultas()
      ]);
      
      setEstatisticas({
        totalMedicos: dashData.totalMedicos || 0,
        totalPacientes: dashData.totalPacientes || 0,
        consultasMes: dashData.consultasMes || 0,
      });

      setDadosGrafico(dashData.distribuicaoConsultas || []);

      const futuras = (Array.isArray(consultasData) ? consultasData : [])
        .filter(c => c.status === 'AGENDADA')
        .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))
        .slice(0, 5);
      
      setProximasConsultas(futuras);
      setLastSync(new Date().toLocaleTimeString()); 
    } catch (err) {
      console.error("Erro na sincronização automática:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(); 

    const interval = setInterval(() => {
      loadData(true); 
    }, 30000);

    return () => clearInterval(interval); 
  }, []);

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5" style={{ minHeight: '60vh' }}>
          <div className="spinner-grow text-primary mb-3" role="status"></div>
          <span className="text-uppercase fw-black tracking-widest text-muted small">Iniciando Painel...</span>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0 animate__animated animate__fadeIn">
      <div className="mb-5 d-flex justify-content-between align-items-start">
        <div>
          <h2 className="fw-black text-dark text-uppercase tracking-tighter mb-1">Visão Geral</h2>
          <p className="text-muted fw-bold small text-uppercase tracking-widest">Painel Administrativo de Saúde Mental</p>
          <div className="bg-primary" style={{ height: '4px', width: '60px', borderRadius: '2px' }}></div>
        </div>
        <div className="text-end d-none d-md-block">
            <small className="text-muted fw-bold text-uppercase" style={{fontSize: '10px'}}>Última Sincronia</small>
            <div className="fw-black text-primary">{lastSync}</div>
        </div>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-12 col-md-4">
          <CardEstatistica titulo="Profissionais" valor={estatisticas.totalMedicos} icone="🧑‍⚕️" color="bg-primary" />
        </div>
        <div className="col-12 col-md-4">
          <CardEstatistica titulo="Pacientes" valor={estatisticas.totalPacientes} icone="🧍" color="bg-success" />
        </div>
        <div className="col-12 col-md-4">
          <CardEstatistica titulo="Sessões no Mês" valor={estatisticas.consultasMes} icone="📊" color="bg-info" />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <h5 className="fw-black text-uppercase mb-4 small tracking-widest">Demanda por Especialidade</h5>
              <div style={{ width: '100%' }}>
                {dadosGrafico.length > 0 ? (
                  <ResponsiveContainer width="99%" aspect={2.2}>
                    <BarChart data={dadosGrafico} margin={{ top: 10, right: 10, left: -20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} angle={-30} textAnchor="end" interval={0} style={{ fontSize: '11px', fontWeight: 'bold' }} />
                      <YAxis axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
                      <Tooltip cursor={{fill: '#f8f9fa'}} contentStyle={{ borderRadius: '10px', border: 'none' }} />
                      <Bar dataKey="consultas" radius={[6, 6, 0, 0]} barSize={40}>
                        {dadosGrafico.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="d-flex flex-column align-items-center justify-content-center py-5 bg-light rounded-4 border border-dashed">
                    <p className="text-muted fw-bold small text-uppercase">Nenhum dado clínico disponível</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 h-100 bg-white p-4">
            <h5 className="fw-black text-uppercase mb-4 small tracking-widest">Próximos Horários</h5>
            <div className="d-flex flex-column gap-3">
              {proximasConsultas.map((c) => (
                <div key={c.id} className="p-3 bg-light rounded-3 border-start border-primary border-4 shadow-sm animate__animated animate__fadeInRight">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-black text-primary small">{new Date(c.dataHora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    <span className="badge bg-white text-dark border-0 shadow-xs" style={{fontSize: '9px'}}>{new Date(c.dataHora).toLocaleDateString()}</span>
                  </div>
                  <h6 className="mb-0 text-truncate fw-bold" style={{fontSize: '13px'}}>{c.paciente?.nome}</h6>
                  <small className="text-muted text-uppercase fw-bold" style={{fontSize: '9px'}}>{c.medico?.especialidade}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 d-flex flex-wrap gap-3">
          <div className="badge bg-white text-success border shadow-xs p-2 px-3 rounded-pill d-flex align-items-center">
              <span className="status-dot bg-success me-2"></span>
              <small className="fw-black tracking-widest uppercase" style={{ fontSize: '9px' }}>Servidor Online</small>
          </div>
          <div className="badge bg-white text-primary border shadow-xs p-2 px-3 rounded-pill d-flex align-items-center">
              <span className="status-dot bg-primary me-2"></span>
              <small className="fw-black tracking-widest uppercase" style={{ fontSize: '9px' }}>Dados Atualizados</small>
          </div>
          <div className="badge bg-white text-info border shadow-xs p-2 px-3 rounded-pill d-flex align-items-center">
              <span className="status-dot bg-info me-2 pulse-blue"></span>
              <small className="fw-black tracking-widest uppercase" style={{ fontSize: '9px' }}>Sincronia API Ativa</small>
          </div>
      </div>

      <style>{`
        .fw-black { font-weight: 900 !important; }
        .tracking-widest { letter-spacing: 0.1em; }
        .rounded-4 { border-radius: 1.25rem !important; }
        .border-dashed { border: 2px dashed #dee2e6 !important; }
        
        /* Efeito de Bolinha Pulsante */
        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            display: inline-block;
            position: relative;
        }

        .status-dot::after {
            content: '';
            width: 100%;
            height: 100%;
            background: inherit;
            border-radius: 50%;
            position: absolute;
            top: 0;
            left: 0;
            animation: pulse 2s infinite;
            opacity: 0.6;
        }

        @keyframes pulse {
            0% { transform: scale(1); opacity: 0.6; }
            100% { transform: scale(2.5); opacity: 0; }
        }

        .pulse-blue::after { background-color: #0dcaf0; }
      `}</style>
    </div>
  );
}

export default AdminDashboard;