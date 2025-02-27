'use client';
import { useState, useEffect } from 'react';
import { User, Course, CursoUsuario, getUsers, getCourses } from '@/services/api';

export default function EnrollmentsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [formData, setFormData] = useState({
    userId: '',
    courseId: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('Cargando datos...');
      setError(null);
      const [usersData, coursesData] = await Promise.all([
        getUsers().catch(error => {
          console.error('Error cargando usuarios:', error);
          return [];
        }),
        getCourses().catch(error => {
          console.error('Error cargando cursos:', error);
          return [];
        })
      ]);
      
      console.log('Datos cargados:', {
        usuarios: usersData,
        cursos: coursesData
      });
      
      setUsers(usersData);
      setCourses(coursesData);
    } catch (error) {
      console.error('Error general cargando datos:', error);
      setError('Error cargando los datos. Por favor, intente nuevamente.');
    }
  };

  const isUserEnrolledInCourse = (userId: number, courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    return course?.cursoUsuarios?.some(cu => cu.usuarioId === userId) || false;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    const userId = parseInt(formData.userId);
    const courseId = parseInt(formData.courseId);

    // Validar si el usuario ya está inscrito
    if (isUserEnrolledInCourse(userId, courseId)) {
      setError('El usuario ya está inscrito en este curso.');
      return;
    }
    
    try {
      const user = users.find(u => u.id === userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      const userData = {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        telefono: user.telefono,
        fechaNacimiento: user.fechaNacimiento,
        creadoEn: user.creadoEn
      };

      await fetch(`/api/cursos/${courseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      setSuccess('Inscripción realizada con éxito');
      setFormData({ userId: '', courseId: '' });
      loadData();
    } catch (error) {
      console.error('Error creating enrollment:', error);
      setError('Error al realizar la inscripción. Por favor, intente nuevamente.');
    }
  };

  const handleDelete = async (courseId: number, usuarioId: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta inscripción?')) {
      try {
        const response = await fetch(`/api/cursos/${courseId}/usuarios/${usuarioId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${await response.text()}`);
        }

        await loadData(); // Recargar los datos después de eliminar
        setSuccess('Inscripción eliminada con éxito');
        setError(null);
      } catch (error) {
        console.error('Error al eliminar la inscripción:', error);
        setError(`Error al eliminar la inscripción: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        setSuccess(null);
      }
    }
  };

  const getUserName = (usuarioId: number) => {
    const user = users.find(u => u.id === usuarioId);
    return user ? `${user.nombre} ${user.apellido}` : 'Usuario no encontrado';
  };

  return (
    <div className="container">
      <h1 className="mb-4">Gestión de Inscripciones</h1>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}
      
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Nueva Inscripción</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Usuario:</label>
              <select
                className="form-select"
                value={formData.userId}
                onChange={(e) => {
                  setFormData({...formData, userId: e.target.value});
                  setError(null);
                }}
                required
              >
                <option value="">Seleccione un usuario</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.nombre} {user.apellido}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Curso:</label>
              <select
                className="form-select"
                value={formData.courseId}
                onChange={(e) => {
                  setFormData({...formData, courseId: e.target.value});
                  setError(null);
                }}
                required
              >
                <option value="">Seleccione un curso</option>
                {courses.map((course) => (
                  <option 
                    key={course.id} 
                    value={course.id}
                    disabled={formData.userId !== '' ? isUserEnrolledInCourse(parseInt(formData.userId), course.id) : false}
                  >
                    {course.nombre} 
                    {formData.userId !== '' && isUserEnrolledInCourse(parseInt(formData.userId), course.id) ? ' (Ya inscrito)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              Inscribir
            </button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Lista de Inscripciones por Curso</h5>
          <div className="row">
            {courses.map((course) => (
              <div className="col-12 mb-4" key={course.id}>
                <div className="card border">
                  <div className="card-header bg-light">
                    <h6 className="mb-0 d-flex justify-content-between align-items-center">
                      <span>{course.nombre}</span>
                      <span className="badge bg-success">
                        {course.cursoUsuarios?.length || 0} usuarios
                      </span>
                    </h6>
                  </div>
                  <div className="card-body">
                    {course.cursoUsuarios && course.cursoUsuarios.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Usuario</th>
                              <th className="text-end">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {course.cursoUsuarios.map((inscripcion) => (
                              <tr key={inscripcion.id}>
                                <td>{getUserName(inscripcion.usuarioId)}</td>
                                <td className="text-end">
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(course.id, inscripcion.usuarioId)}
                                  >
                                    <i className="bi bi-trash"></i> Eliminar
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted mb-0">No hay usuarios inscritos en este curso.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 