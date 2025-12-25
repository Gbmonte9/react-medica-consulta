import React from 'react';

function CardEstatistica({ titulo, valor, icone, color }) {
  return (
    <div className="card border-0 shadow-sm rounded-4 transition-card h-100 position-relative overflow-hidden">
      
      {/* Linha de brilho superior animada */}
      <div className={`position-absolute top-0 start-0 w-100 sync-line ${color || 'bg-primary'}`} style={{ height: '4px', opacity: '0.8' }}></div>
      
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
        
        .transition-card { 
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
            border: 1px solid rgba(0,0,0,0.02) !important; 
        }
        
        .transition-card:hover { 
            transform: translateY(-8px); 
            box-shadow: 0 15px 30px rgba(0,0,0,0.12) !important; 
        }

        .sync-line {
            animation: sync-glow 3s infinite ease-in-out;
        }

        @keyframes sync-glow {
            0%, 100% { opacity: 0.4; filter: brightness(1); }
            50% { opacity: 1; filter: brightness(1.3); }
        }

        .sync-dot {
            width: 6px;
            height: 6px;
            background-color: #20c997;
            border-radius: 50%;
            display: inline-block;
            animation: dot-pulse 2s infinite;
        }

        @keyframes dot-pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(32, 201, 151, 0.7); }
            70% { transform: scale(1.3); box-shadow: 0 0 0 6px rgba(32, 201, 151, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(32, 201, 151, 0); }
        }

        .icon-pulse {
            animation: icon-float 3s infinite ease-in-out;
        }

        @keyframes icon-float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-5px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}

export default CardEstatistica;