// src/api/dashboardApi.js

// 🚨 IMPORTAMOS AS FUNÇÕES DE SERVIÇO, QUE JÁ LIDAM COM A AUTENTICAÇÃO E URLS
import { listarTodasConsultas } from './consultasService';
import { listarMedicos } from './medicoService'; // PRESUMIDO
import { listarPacientes } from './pacienteService'; // PRESUMIDO

/**
 * Agrega os dados de múltiplos serviços (Consultas, Médicos, Pacientes)
 * para criar as estatísticas do Dashboard.
 * @returns {Promise<Response>} Um objeto que imita a resposta de uma chamada fetch.
 */
export const fetchDashboardData = async () => {
    console.log("API AGREGADORA: Buscando e agregando dados para o Dashboard...");
    
    try {
        // 1. Buscando todos os dados necessários usando os Services em paralelo
        // Os Services já fazem a autenticação JWT.
        const [consultas, medicos, pacientes] = await Promise.all([
          listarTodasConsultas(),
          listarMedicos(), 
          listarPacientes(),
        ]);
        
        // 2. Agregação dos Dados no Frontend

        // Contagem Total
        const totalMedicos = medicos.length;
        const totalPacientes = pacientes.length;

        // Contagem de Consultas Hoje e Mês
        const hoje = new Date().toISOString().split('T')[0]; // Ex: 2025-12-13
        const mesAtual = new Date().toISOString().substring(0, 7); // Ex: 2025-12
        
        const consultasHoje = consultas.filter(c => 
            // Supondo que 'dataConsulta' é uma string que começa com a data YYYY-MM-DD
            c.dataConsulta && c.dataConsulta.startsWith(hoje)
        ).length;
        
        const consultasMes = consultas.filter(c => 
            c.dataConsulta && c.dataConsulta.startsWith(mesAtual)
        ).length;


        // Distribuição (Exemplo de Gráfico: Consultas por Especialidade)
        const distribuicao = consultas.reduce((acc, consulta) => {
            // Supondo que o objeto consulta tenha um campo 'especialidade' ou 'medicoEspecialidade'
            const especialidade = consulta.medicoEspecialidade || 'Outras'; 
            acc[especialidade] = (acc[especialidade] || 0) + 1;
            return acc;
        }, {});
        
        const dadosParaGrafico = Object.entries(distribuicao).map(([name, consultas]) => ({ name, consultas }));


        // 3. Monta a resposta final no formato esperado pelo Dashboard
        const finalData = {
            totalMedicos,
            totalPacientes,
            consultasHoje,
            consultasMes,
            distribuicaoConsultas: dadosParaGrafico,
        };
        
        // Retorna a resposta real (simulando a estrutura de resposta fetch.json())
        return {
            ok: true,
            status: 200,
            json: () => Promise.resolve(finalData)
        };

    } catch (error) {
        console.error("Erro na busca de dados do Dashboard (Service Aggregation):", error);
        // Retorna um objeto de erro que o AdminDashboard pode capturar
        return {
            ok: false,
            status: 500,
            json: () => Promise.reject({ message: error.message || "Falha na agregação de dados." })
        };
    }
};