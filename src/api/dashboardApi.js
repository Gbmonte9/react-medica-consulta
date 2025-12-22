// src/api/dashboardApi.js
import { listarTodasConsultas } from './consultasService';
import { listarMedicos } from './medicoService'; 
import { listarPacientes } from './pacienteService'; 

export const fetchDashboardData = async () => {
    try {
        const [consultas, medicos, pacientes] = await Promise.all([
          listarTodasConsultas(),
          listarMedicos(), 
          listarPacientes(),
        ]);
        
        // --- LÓGICA DE DATA CORRIGIDA (Fuso Local) ---
        const agora = new Date();
        
        // Formata para YYYY-MM-DD usando a data local (evita erro de UTC)
        const hoje = agora.getFullYear() + '-' + 
                     String(agora.getMonth() + 1).padStart(2, '0') + '-' + 
                     String(agora.getDate()).padStart(2, '0');

        const mesAtual = hoje.substring(0, 7); // Pega apenas YYYY-MM

        // Filtro de Consultas Hoje
        const consultasHoje = consultas.filter(c => {
            const dataStr = c.dataHora || c.dataConsulta || "";
            // Usamos .includes para garantir que pegue a data mesmo com horas depois
            return dataStr.includes(hoje);
        }).length;
        
        // Filtro de Consultas Mês
        const consultasMes = consultas.filter(c => {
            const dataStr = c.dataHora || c.dataConsulta || "";
            return dataStr.includes(mesAtual);
        }).length;

        // Distribuição por especialidade
        const distribuicao = consultas.reduce((acc, consulta) => {
            const especialidade = consulta.medico?.especialidade || consulta.medicoEspecialidade || 'Geral'; 
            acc[especialidade] = (acc[especialidade] || 0) + 1;
            return acc;
        }, {});
        
        const dadosParaGrafico = Object.entries(distribuicao).map(([name, consultas]) => ({ 
            name, 
            consultas 
        }));

        return {
            totalMedicos: medicos.length,
            totalPacientes: pacientes.length,
            consultasHoje,
            consultasMes,
            distribuicaoConsultas: dadosParaGrafico,
        };

    } catch (error) {
        console.error("Erro no Dashboard API:", error);
        throw error;
    }
};