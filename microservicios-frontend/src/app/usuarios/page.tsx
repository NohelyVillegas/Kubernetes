'use client';
import { useState, useEffect } from 'react';
import { User, getUsers, createUser, updateUser, deleteUser } from '@/services/api';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<Omit<User, 'id' | 'creadoEn'>>({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    fechaNacimiento: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Error al cargar los usuarios. Por favor, intente nuevamente.');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      if (editingId) {
        const updatedUser: User = {
          ...formData,
          id: editingId,
          creadoEn: users.find(u => u.id === editingId)?.creadoEn || new Date().toISOString()
        };
        await updateUser(editingId, updatedUser);
        setSuccess('Usuario actualizado exitosamente');
      } else {
        await createUser(formData);
        setSuccess('Usuario creado exitosamente');
      }
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        fechaNacimiento: ''
      });
      setEditingId(null);
      loadUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      setError(`Error al ${editingId ? 'actualizar' : 'crear'} el usuario: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  const handleEdit = (user: User) => {
    setFormData({
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      telefono: user.telefono,
      fechaNacimiento: user.fechaNacimiento
    });
    setEditingId(user.id!);
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        setError(null);
        setSuccess(null);
        await deleteUser(id);
        setSuccess('Usuario eliminado exitosamente');
        loadUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        setError(`Error al eliminar el usuario: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    }
  };

  return (
    <div className="container">
      <h1 className="mb-4">Gestión de Usuarios</h1>
      
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
          <h5 className="card-title">{editingId ? 'Editar Usuario' : 'Crear Usuario'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nombre:</label>
              <input
                type="text"
                className="form-control"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Apellido:</label>
              <input
                type="text"
                className="form-control"
                value={formData.apellido}
                onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email:</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Teléfono:</label>
              <input
                type="tel"
                className="form-control"
                value={formData.telefono}
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Fecha de Nacimiento:</label>
              <input
                type="date"
                className="form-control"
                value={formData.fechaNacimiento}
                onChange={(e) => setFormData({...formData, fechaNacimiento: e.target.value})}
                required
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
                  setFormData({
                    nombre: '',
                    apellido: '',
                    email: '',
                    telefono: '',
                    fechaNacimiento: ''
                  });
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
          <h5 className="card-title">Lista de Usuarios</h5>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Fecha de Nacimiento</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.nombre}</td>
                    <td>{user.apellido}</td>
                    <td>{user.email}</td>
                    <td>{user.telefono}</td>
                    <td>{new Date(user.fechaNacimiento).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(user)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(user.id!)}
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