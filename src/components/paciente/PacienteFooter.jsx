import React from 'react';

function PacienteFooter() {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="bg-white border-top shadow-sm py-4 mt-auto rounded-4 mb-4 border">
      <div className="container-fluid px-4">
        <div className="row align-items-center g-3">
          
          <div className="col-12 col-md-4 text-center text-md-start">
            <div className="d-flex flex-column">
              <span className="text-dark fw-black text-uppercase tracking-tighter fs-6">
                MED<span className="text-info">PACIENTE</span>
              </span>
              <span className="fw-bold text-muted uppercase tracking-widest" style={{ fontSize: '9px' }}>
                Portal de Saúde do Paciente
              </span>
            </div>
          </div>

          <div className="col-12 col-md-4 text-center">
            <p className="text-muted fw-bold uppercase mb-1" style={{ fontSize: '10px', letterSpacing: '1px' }}>
              &copy; {anoAtual} Direitos Reservados
            </p>
            <div className="d-inline-flex align-items-center gap-2 bg-light px-3 py-1 rounded-pill border">
              <span className="position-relative d-flex" style={{ width: '8px', height: '8px' }}>
                <span className="animate-ping position-absolute inline-flex h-100 w-100 rounded-circle bg-info opacity-75"></span>
                <span className="relative inline-flex rounded-circle bg-info" style={{ width: '8px', height: '8px' }}></span>
              </span>
              <span className="fw-black text-dark text-uppercase" style={{ fontSize: '9px' }}>Sessão Segura</span>
            </div>
          </div>

          <div className="col-12 col-md-4 text-center text-md-end">
            <div className="d-inline-block text-md-end">
              <p className="text-dark fw-black mb-0 text-uppercase" style={{ fontSize: '10px' }}>v1.2.0-stable</p>
              <span className="badge bg-info-subtle text-info border border-info-subtle fw-bold text-uppercase" style={{ fontSize: '8px' }}>
                Conexão Criptografada
              </span>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .fw-black { font-weight: 900 !important; }
        .text-info { color: #0dcaf0 !important; }
        .bg-info { background-color: #0dcaf0 !important; }
        .bg-info-subtle { background-color: #e0f7fa !important; }
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </footer>
  );
}

export default PacienteFooter;