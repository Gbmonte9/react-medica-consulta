import api from './api';

export const fetchDashboardData = async () => {
    console.log("API REAL: Buscando e agregando dados do Dashboard via Axios...");
    
    try {
        const [medicosRes, pacientesRes, consultasRes] = await Promise.all([
          api.get('/medicos'),
          api.get('/pacientes'),
          api.get('/consultas'),
        ]);

        const medicos = medicosRes.data;
        const pacientes = pacientesRes.data;
        const consultas = consultasRes.data;
        
        const totalMedicos = Array.isArray(medicos) ? medicos.length : 0;
        const totalPacientes = Array.isArray(pacientes) ? pacientes.length : 0;

        const hoje = new Date().toISOString().split('T')[0]; 
        const mesAtual = new Date().toISOString().substring(0, 7); 
        
        const consultasHoje = consultas.filter(c => 
            c.dataConsulta && c.dataConsulta.startsWith(hoje)
        ).length;
        
        const consultasMes = consultas.filter(c => 
            c.dataConsulta && c.dataConsulta.startsWith(mesAtual)
        ).length;

        const distribuicao = consultas.reduce((acc, consulta) => {
            const especialidade = consulta.especialidade || 'Outras';
            acc[especialidade] = (acc[especialidade] || 0) + 1;
            return acc;
        }, {});
        
        const dadosParaGrafico = Object.entries(distribuicao).map(([name, consultas]) => ({ 
            name, 
            consultas 
        }));

        const finalData = {
            totalMedicos,
            totalPacientes,
            consultasHoje,
            consultasMes,
            distribuicaoConsultas: dadosParaGrafico,
        };
        
        return finalData;

    } catch (error) {
        console.error("Erro na busca agregada do Dashboard:", error);
        throw new Error(error.response?.data?.message || "Falha ao carregar dados do Dashboard. Verifique a conexão.");
    }
};