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
        
        const agora = new Date();
        const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate()).getTime();

        const mesAtual = agora.getMonth();
        const anoAtual = agora.getFullYear();

        let contadorHoje = 0;
        let contadorMes = 0;

        consultas.forEach(c => {
            const dataRaw = c.dataHora || c.dataConsulta;
            if (!dataRaw) return;

            const dataConsulta = new Date(dataRaw);
            
            if (isNaN(dataConsulta.getTime())) return;

            const diaConsulta = new Date(dataConsulta.getFullYear(), dataConsulta.getMonth(), dataConsulta.getDate()).getTime();

            if (diaConsulta === hoje) {
                contadorHoje++;
            }

            if (dataConsulta.getMonth() === mesAtual && dataConsulta.getFullYear() === anoAtual) {
                contadorMes++;
            }
        });

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
            consultasHoje: contadorHoje,
            consultasMes: contadorMes,
            distribuicaoConsultas: dadosParaGrafico,
        };

    } catch (error) {
        console.error("Erro no Dashboard API:", error);
        throw error;
    }
};