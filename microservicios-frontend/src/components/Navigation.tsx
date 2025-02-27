'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'active bg-primary rounded' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" href="/">
          <i className="bi bi-mortarboard-fill me-2"></i>
          Sistema Académico
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="navbar-collapse show" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-2">
            <li className="nav-item">
              <Link 
                href="/" 
                className={`nav-link px-3 ${isActive('/')}`}
              >
                <i className="bi bi-house-door me-2"></i>
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                href="/usuarios" 
                className={`nav-link px-3 ${isActive('/usuarios')}`}
              >
                <i className="bi bi-people me-2"></i>
                Usuarios
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                href="/cursos" 
                className={`nav-link px-3 ${isActive('/cursos')}`}
              >
                <i className="bi bi-book me-2"></i>
                Cursos
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                href="/inscripciones" 
                className={`nav-link px-3 ${isActive('/inscripciones')}`}
              >
                <i className="bi bi-pencil-square me-2"></i>
                Inscripciones
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 