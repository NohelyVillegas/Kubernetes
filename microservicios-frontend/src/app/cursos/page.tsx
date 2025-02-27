'use client';
import { useState, useEffect } from 'react';
import { Course, getCourses, createCourse, updateCourse, deleteCourse } from '@/services/api';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    creditos: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setError(null);
      const data = await getCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error loading courses:', error);
      setError('Error al cargar los cursos. Por favor, intente nuevamente.');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const courseData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        creditos: parseInt(formData.creditos)
      };
      
      if (editingId) {
        await updateCourse(editingId, courseData);
        setSuccess('Curso actualizado exitosamente');
      } else {
        await createCourse(courseData);
        setSuccess('Curso creado exitosamente');
      }
      setFormData({ nombre: '', descripcion: '', creditos: '' });
      setEditingId(null);
      loadCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      setError(`Error al ${editingId ? 'actualizar' : 'crear'} el curso: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  const handleEdit = (course: Course) => {
    setFormData({
      nombre: course.nombre,
      descripcion: course.descripcion,
      creditos: course.creditos.toString()
    });
    setEditingId(course.id);
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      try {
        setError(null);
        setSuccess(null);
        await deleteCourse(id);
        setSuccess('Curso eliminado exitosamente');
        loadCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
        setError(`Error al eliminar el curso: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    }
  };

  return (
    <div className="container">
      <h1 className="mb-4">Gestión de Cursos</h1>
      
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>
        </div>
      )}
      
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess(null)} aria-label="Close"></button>
        </div>
      )}
      
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">{editingId ? 'Editar Curso' : 'Crear Curso'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nombre del Curso:</label>
              <input
                type="text"
                className="form-control"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Descripción:</label>
              <textarea
                className="form-control"
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Créditos:</label>
              <input
                type="number"
                className="form-control"
                value={formData.creditos}
                onChange={(e) => setFormData({...formData, creditos: e.target.value})}
                required
                min="1"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Actualizar' : 'Crear'}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ nombre: '', descripcion: '', creditos: '' });
                }}
              >
                Cancelar
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Lista de Cursos</h5>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Créditos</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td>{course.nombre}</td>
                    <td>{course.descripcion}</td>
                    <td>{course.creditos}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(course)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(course.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 