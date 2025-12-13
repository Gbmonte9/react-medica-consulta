// src/api/dashboardApi.js

// URL base da sua API Java (mantenha a porta correta)
const API_BASE_URL = 'http://localhost:8080/api'; 

/**
 * Agrega os dados de múltiplos endpoints da API para criar as estatísticas do Dashboard.
 * @returns {Promise<Response>} Um objeto que imita a resposta de uma chamada fetch.
 */
export const fetchDashboardData = async () => {
    console.log("API REAL: Buscando e agregando dados do Dashboard...");
    
    try {
        // 1. Buscando todos os dados necessários em paralelo
        const [medicosRes, pacientesRes, consultasRes] = await Promise.all([
          fetch(`${API_BASE_URL}/medicos`),
          fetch(`${API_BASE_URL}/pacientes`),
          fetch(`${API_BASE_URL}/consultas`),
        ]);

        if (!medicosRes.ok || !pacientesRes.ok || !consultasRes.ok) {
          // Lança um erro se qualquer endpoint falhar
          throw new Error("Falha ao buscar um ou mais conjuntos de dados da API. Verifique se o servidor Java está rodando.");
        }

        const medicos = await medicosRes.json();
        const pacientes = await pacientesRes.json();
        const consultas = await consultasRes.json();
        
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
            // Supondo que o objeto consulta tem o campo 'especialidade'
            const especialidade = consulta.especialidade || 'Outras';
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
        console.error("Erro na busca da API real:", error);
        // Retorna um objeto de erro que o AdminDashboard pode capturar
        return {
            ok: false,
            status: 500,
            json: () => Promise.reject({ message: error.message })
        };
    }
};