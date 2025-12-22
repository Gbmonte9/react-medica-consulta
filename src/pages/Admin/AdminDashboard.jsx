import React, { useState, useEffect } from 'react';
import CardEstatistica from '../../components/card/CardEstatistica';
import GraficoExemplo from '../../components/grafico/GraficoExemplo'; 
import { fetchDashboardData } from '../../api/dashboardApi';

function AdminDashboard() {
  const [estatisticas, setEstatisticas] = useState({
    totalMedicos: 0,
    totalPacientes: 0,
    consultasHoje: 0,
    consultasMes: 0,
  });
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Agora recebemos os dados agregados diretamente do service
        const data = await fetchDashboardData(); 
        
        // Atualizando o estado com segurança (fallback para 0 caso falte algum dado)
        setEstatisticas({
          totalMedicos: data.totalMedicos || 0,
          totalPacientes: data.totalPacientes || 0,
          consultasHoje: data.consultasHoje || 0,
          consultasMes: data.consultasMes || 0,
        });

        setDadosGrafico(data.distribuicaoConsultas || []);

      } catch (err) {
        console.error("Erro ao carregar Dashboard:", err);
        setError(`Falha ao carregar painel: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-black uppercase tracking-widest animate-pulse text-gray-400">
          Carregando Dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center bg-gray-50 min-h-screen">
        <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-red-200 inline-block">
          <span className="text-4xl mb-4 block">⚠️</span>
          <h2 className="text-xl font-black text-red-700 uppercase mb-2">Erro de Conexão</h2>
          <p className="text-gray-600 font-medium mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-black text-white px-6 py-2 rounded-lg font-bold uppercase text-xs tracking-widest hover:bg-gray-800 transition"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Título com Estilo Administrativo */}
      <div className="mb-8 border-b-4 border-black pb-4">
        <h2 className="text-3xl font-black text-black uppercase tracking-tighter">
          Visão Geral do Sistema
        </h2>
        <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">
          Dados atualizados em tempo real
        </p>
      </div>

      {/* Seção 1: Cartões de Estatísticas - Cores de Contraste */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <CardEstatistica titulo="Médicos Ativos" valor={estatisticas.totalMedicos} icone="🧑‍⚕️" color="bg-blue-600" />
        <CardEstatistica titulo="Pacientes" valor={estatisticas.totalPacientes} icone="🧍" color="bg-emerald-600" />
        <CardEstatistica titulo="Consultas Hoje" valor={estatisticas.consultasHoje} icone="🗓️" color="bg-rose-600" />
        <CardEstatistica titulo="Total no Mês" valor={estatisticas.consultasMes} icone="📊" color="bg-amber-500" />
      </div>

      {/* Seção 2: Gráficos e Tabelas Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 shadow-2xl rounded-3xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-black uppercase tracking-tight">Consultas por Especialidade</h3>
            <span className="text-[10px] bg-gray-100 px-2 py-1 rounded font-bold text-gray-400">GRÁFICO</span>
          </div>
          <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            {/* O componente de gráfico recebe os dados processados */}
            <GraficoExemplo dados={dadosGrafico} /> 
          </div>
        </div>
        
        <div className="bg-white p-8 shadow-2xl rounded-3xl border border-gray-100 flex flex-col">
          <h3 className="text-lg font-black text-black uppercase tracking-tight mb-6">Status Operacional</h3>
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mb-4 shadow-inner">
              ✓
            </div>
            <p className="text-black font-black uppercase text-sm mb-1">Servidores Online</p>
            <p className="text-gray-400 text-xs font-bold">Todos os serviços de API estão respondendo corretamente.</p>
            
            <div className="mt-8 w-full space-y-3">
               <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 border-b pb-1">
                  <span>Banco de Dados</span>
                  <span className="text-green-600">Sincronizado</span>
               </div>
               <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 border-b pb-1">
                  <span>Sessão Admin</span>
                  <span className="text-blue-600">Ativa</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;