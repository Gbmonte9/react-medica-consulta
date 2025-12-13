// src/pages/Admin/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import CardEstatistica from '../../components/card/CardEstatistica';
import GraficoExemplo from '../../components/grafico/GraficoExemplo'; 

// Importa a função REAL que busca e agrega dados de múltiplos endpoints
import { fetchDashboardData } from '../../api/dashboardApi';

function AdminDashboard() {
  const [estatisticas, setEstatisticas] = useState({});
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Chama a função que realiza as chamadas de API e agrega os dados
        const response = await fetchDashboardData(); 
        
        if (!response.ok) {
          // Captura o erro detalhado da API real/agregação
          const errorBody = await response.json(); 
          throw new Error(errorBody.message || "Falha desconhecida ao carregar dados do Dashboard.");
        }

        const data = await response.json();
        
        // Atualizando o Estado com os dados agregados
        setEstatisticas({
          totalMedicos: data.totalMedicos,
          totalPacientes: data.totalPacientes,
          consultasHoje: data.consultasHoje,
          consultasMes: data.consultasMes,
        });

        setDadosGrafico(data.distribuicaoConsultas);

      } catch (err) {
        console.error("Erro ao carregar dados do Dashboard:", err);
        // Exibe a mensagem de erro da API ou a mensagem padrão de falha
        setError(`Não foi possível carregar o painel: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // Dependência vazia: executa apenas na montagem

  if (loading) return <div className="p-4 text-center">Carregando Dashboard...</div>;
  if (error) return <div className="p-4 text-red-700 bg-red-100 border border-red-400 rounded-md">Erro: {error}</div>;
  
  return (
    <div className="p-4 admin-dashboard">
      <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Visão Geral do Sistema</h2>

      {/* Seção 1: Cartões de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <CardEstatistica titulo="Total de Médicos" valor={estatisticas.totalMedicos} icone="🧑‍⚕️" />
        <CardEstatistica titulo="Total de Pacientes" valor={estatisticas.totalPacientes} icone="🧍" />
        <CardEstatistica titulo="Consultas Hoje" valor={estatisticas.consultasHoje} icone="🗓️" />
        <CardEstatistica titulo="Consultas no Mês" valor={estatisticas.consultasMes} icone="📊" />
      </div>

      {/* Seção 2: Gráficos de Dados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h3 className="text-xl font-medium mb-4">Consultas por Especialidade</h3>
          {/* O componente GraficoExemplo usará os dadosGrafico */}
          <GraficoExemplo dados={dadosGrafico} /> 
        </div>
        
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h3 className="text-xl font-medium mb-4">Outras Métricas</h3>
          <p className="text-gray-600">Espaço reservado para relatórios ou listas de tarefas...</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;