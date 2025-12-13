// src/components/CardEstatistica.jsx

import React from 'react';

function CardEstatistica({ titulo, valor, icone }) {
  return (
    <div className="bg-white p-6 shadow-lg rounded-xl flex items-center justify-between transition duration-300 hover:shadow-xl hover:scale-[1.02]">
      <div>
        <p className="text-sm text-gray-500 font-medium uppercase">{titulo}</p>
        <h3 className="text-4xl font-bold text-gray-800 mt-1">{valor}</h3>
      </div>
      <div className="text-4xl text-blue-600">
        {icone}
      </div>
    </div>
  );
}

export default CardEstatistica;