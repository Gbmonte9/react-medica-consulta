import React from 'react';

function CardEstatistica({ titulo, valor, icone, color }) {
  return (
    <div className="card border-0 shadow-sm rounded-4 transition-card h-100 position-relative overflow-hidden">
      
      <div className={`position-absolute top-0 start-0 w-100 sync-line ${color || 'bg-primary'}`} style={{ height: '3px', opacity: '0.7' }}></div>
      
      <div className="card-body p-4 d-flex align-items-center justify-content-between">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <p className="text-muted small fw-bold text-uppercase tracking-widest mb-0">
              {titulo}
            </p>
            <span className="sync-dot"></span>
          </div>
          <h3 className="fw-black text-dark mb-0 display-6 value-animate">
            {valor}
          </h3>
        </div>
        <div className={`rounded-circle d-flex align-items-center justify-content-center shadow-sm icon-pulse ${color || 'bg-light text-white'}`} 
             style={{ width: '60px', height: '60px', fontSize: '1.8rem' }}>
          {icone}
        </div>
      </div>

      <style>{`
        .fw-black { font-weight: 900 !important; }
        .tracking-widest { letter-spacing: 0.1em; }
        .rounded-4 { border-radius: 1rem !important; }
        .transition-card { transition: all 0.3s ease; border: 1px solid rgba(0,0,0,0.02) !important; }
        .transition-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.08) !important; }

        /* Linha de sincronia que brilha suavemente */
        .sync-line {
            animation: sync-glow 3s infinite ease-in-out;
        }

        @keyframes sync-glow {
            0% { opacity: 0.3; }
            50% { opacity: 1; }
            100% { opacity: 0.3; }
        }

        /* Pequeno ponto de pulso ao lado do título */
        .sync-dot {
            width: 4px;
            height: 4px;
            background-color: #20c997; /* Verde sucesso */
            border-radius: 50%;
            display: inline-block;
            animation: dot-pulse 2s infinite;
        }

        @keyframes dot-pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(32, 201, 151, 0.7); }
            70% { transform: scale(1.2); box-shadow: 0 0 0 4px rgba(32, 201, 151, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(32, 201, 151, 0); }
        }

        /* Pulso sutil no ícone */
        .icon-pulse {
            animation: icon-float 4s infinite ease-in-out;
        }

        @keyframes icon-float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
        }

        /* Animação suave para quando o valor mudar */
        .value-animate {
            transition: all 0.5s ease;
        }
      `}</style>
    </div>
  );
}

export default CardEstatistica;