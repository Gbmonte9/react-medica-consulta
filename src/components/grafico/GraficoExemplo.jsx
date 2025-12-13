import React from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

/**
 * Componente de Gráfico de Barras para exibir a distribuição de consultas.
 * @param {Array<Object>} dados - Array de objetos com { name: string, consultas: number }
 */
function GraficoExemplo({ dados }) {
    
    // Se não houver dados, exibe uma mensagem
    if (!dados || dados.length === 0) {
        return (
            <div className="text-center p-10 text-gray-500">
                Nenhum dado de consulta disponível para o gráfico.
            </div>
        );
    }

    return (
        // O ResponsiveContainer garante que o gráfico se ajuste à div pai
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={dados}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                layout="vertical" // Gráfico de barras na horizontal (categorias no Y)
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                
                {/* Eixo X: Valores (Contagem de Consultas) */}
                <XAxis type="number" stroke="#555" /> 
                
                {/* Eixo Y: Categorias (Especialidades) */}
                <YAxis dataKey="name" type="category" stroke="#555" /> 
                
                {/* Tooltip: Pop-up ao passar o mouse */}
                <Tooltip 
                    cursor={{ fill: '#f0f0f0' }} 
                    formatter={(value, name) => [`${value} consultas`, 'Total']}
                />
                
                {/* Legenda: Descrição das barras */}
                <Legend />
                
                {/* As Barras Reais */}
                <Bar 
                    dataKey="consultas" 
                    fill="#3b82f6" // Cor azul do Tailwind (blue-500)
                    name="Consultas"
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default GraficoExemplo;