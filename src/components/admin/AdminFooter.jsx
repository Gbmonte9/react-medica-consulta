import React from 'react';

function AdminFooter() {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="bg-white border-top shadow-sm py-4 mt-auto rounded-4 mb-4 border">
      <div className="container-fluid px-4">
        <div className="row align-items-center g-3">
          
          <div className="col-12 col-md-4 text-center text-md-start">
            <div className="d-flex flex-column">
              <span className="text-dark fw-black text-uppercase tracking-tighter fs-6">
                SISTEMA MÉDICO <span className="text-primary">ADMIN</span>
              </span>
              <span className="fw-bold text-muted uppercase tracking-widest" style={{ fontSize: '9px' }}>
                Gestão Hospitalar Inteligente
              </span>
            </div>
          </div>

          <div className="col-12 col-md-4 text-center">
            <p className="text-muted fw-bold uppercase mb-1" style={{ fontSize: '10px', letterSpacing: '1px' }}>
              &copy; {anoAtual} Direitos Reservados
            </p>
            <div className="d-inline-flex align-items-center gap-2 bg-light px-3 py-1 rounded-pill border">
              <span className="position-relative d-flex" style={{ width: '8px', height: '8px' }}>
                <span className="animate-ping position-absolute inline-flex h-100 w-100 rounded-circle bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-circle bg-success" style={{ width: '8px', height: '8px' }}></span>
              </span>
              <span className="fw-black text-dark text-uppercase" style={{ fontSize: '9px' }}>Sistema Online</span>
            </div>
          </div>

          <div className="col-12 col-md-4 text-center text-md-end">
            <div className="d-inline-block text-md-end">
              <p className="text-dark fw-black mb-0 text-uppercase" style={{ fontSize: '10px' }}>v1.2.0-stable</p>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle fw-bold text-uppercase" style={{ fontSize: '8px' }}>
                Suporte Ativo
              </span>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .fw-black { font-weight: 900 !important; }
        .bg-primary-subtle { background-color: #e7f1ff !important; }
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

export default AdminFooter;