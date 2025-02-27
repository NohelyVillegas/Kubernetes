import { Usuario, Curso } from '@/types';
import { useState } from 'react';

interface GestionUsuariosCursoProps {
  curso: Curso;
  usuarios: Usuario[];
  onInscribir: (usuarioId: number) => Promise<void>;
  onDesinscribir: (usuarioId: number) => Promise<void>;
  onClose: () => void;
}

export default function GestionUsuariosCurso({
  curso,
  usuarios,
  onInscribir,
  onDesinscribir,
  onClose,
}: GestionUsuariosCursoProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'inscritos' | 'disponibles'>('inscritos');
  const [searchTerm, setSearchTerm] = useState('');

  const usuariosInscritos = curso.usuarios || [];
  const usuariosDisponibles = usuarios.filter(
    (u) => !usuariosInscritos.some((cu) => cu.id === u.id)
  );

  const filteredUsuariosInscritos = usuariosInscritos.filter(
    (u) =>
      u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsuariosDisponibles = usuariosDisponibles.filter(
    (u) =>
      u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInscribir = async (usuarioId: number) => {
    setIsLoading(true);
    try {
      await onInscribir(usuarioId);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDesinscribir = async (usuarioId: number) => {
    setIsLoading(true);
    try {
      await onDesinscribir(usuarioId);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-blue-600">Procesando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">
              {curso.nombre}
            </h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {usuariosInscritos.length} usuarios inscritos
            </span>
          </div>
          <p className="text-gray-600">{curso.descripcion}</p>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1 flex-1 sm:flex-none">
            <button
              onClick={() => setActiveTab('inscritos')}
              className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                activeTab === 'inscritos'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Inscritos ({usuariosInscritos.length})
            </button>
            <button
              onClick={() => setActiveTab('disponibles')}
              className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                activeTab === 'disponibles'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Disponibles ({usuariosDisponibles.length})
            </button>
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar usuarios..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {activeTab === 'inscritos' ? (
            <div className="divide-y divide-gray-200">
              {filteredUsuariosInscritos.length === 0 ? (
                <p className="p-6 text-gray-500 text-center">
                  {searchTerm
                    ? 'No se encontraron usuarios inscritos que coincidan con la búsqueda'
                    : 'No hay usuarios inscritos en este curso'}
                </p>
              ) : (
                filteredUsuariosInscritos.map((usuario) => (
                  <div
                    key={usuario.id}
                    className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {usuario.nombre[0]}{usuario.apellido[0]}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">
                          {usuario.nombre} {usuario.apellido}
                        </h4>
                        <p className="text-sm text-gray-600">{usuario.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDesinscribir(usuario.id!)}
                      disabled={isLoading}
                      className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md font-medium disabled:opacity-50 transition-colors"
                    >
                      Desinscribir
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredUsuariosDisponibles.length === 0 ? (
                <p className="p-6 text-gray-500 text-center">
                  {searchTerm
                    ? 'No se encontraron usuarios disponibles que coincidan con la búsqueda'
                    : 'No hay usuarios disponibles para inscribir'}
                </p>
              ) : (
                filteredUsuariosDisponibles.map((usuario) => (
                  <div
                    key={usuario.id}
                    className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {usuario.nombre[0]}{usuario.apellido[0]}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">
                          {usuario.nombre} {usuario.apellido}
                        </h4>
                        <p className="text-sm text-gray-600">{usuario.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleInscribir(usuario.id!)}
                      disabled={isLoading}
                      className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md font-medium disabled:opacity-50 transition-colors"
                    >
                      Inscribir
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
} 