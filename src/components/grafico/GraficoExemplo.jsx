import React from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

/**
 * Componente de Gráfico de Barras para exibir a distribuição de consultas.
 * @param {Array<Object>} dados - Array de objetos com { name: string, consultas: number }
 */
function GraficoExemplo({ dados }) {
    
    if (!dados || dados.length === 0) {
        return (
            <div className="text-center p-10 text-gray-500">
                Nenhum dado de consulta disponível para o gráfico.
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={dados}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                layout="vertical" 
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                
                <XAxis type="number" stroke="#555" /> 
                
                <YAxis dataKey="name" type="category" stroke="#555" /> 
                
                <Tooltip 
                    cursor={{ fill: '#f0f0f0' }} 
                    formatter={(value, name) => [`${value} consultas`, 'Total']}
                />
                
                <Legend />
                
                <Bar 
                    dataKey="consultas" 
                    fill="#3b82f6" 
                    name="Consultas"
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default GraficoExemplo;