'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container">
      <div className="text-center my-5">
        <h1 className="display-4 mb-4">
          <i className="bi bi-mortarboard-fill me-2"></i>
          Sistema de Gestión Académica
        </h1>
        <p className="lead mb-5">
          Bienvenido al sistema de gestión académica. Seleccione una opción para comenzar.
        </p>

        <div className="row justify-content-center">
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="bi bi-people me-2 text-primary"></i>
                  Gestión de Usuarios
                </h5>
                <p className="card-text">
                  Administre los usuarios del sistema, incluyendo estudiantes y profesores.
                </p>
                <Link href="/usuarios" className="btn btn-primary">
                  <i className="bi bi-arrow-right-circle me-1"></i>
                  Ir a Usuarios
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="bi bi-book me-2 text-primary"></i>
                  Gestión de Cursos
                </h5>
                <p className="card-text">
                  Administre los cursos disponibles en el sistema académico.
                </p>
                <Link href="/cursos" className="btn btn-primary">
                  <i className="bi bi-arrow-right-circle me-1"></i>
                  Ir a Cursos
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="bi bi-pencil-square me-2 text-primary"></i>
                  Inscripciones
                </h5>
                <p className="card-text">
                  Gestione las inscripciones de estudiantes en los cursos.
                </p>
                <Link href="/inscripciones" className="btn btn-primary">
                  <i className="bi bi-arrow-right-circle me-1"></i>
                  Ir a Inscripciones
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
