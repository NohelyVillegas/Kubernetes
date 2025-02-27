import { Curso } from '@/types';
import { useState } from 'react';

interface CursoFormProps {
  curso?: Curso;
  onSubmit: (curso: Omit<Curso, 'id' | 'usuarios'>) => Promise<void>;
  onCancel: () => void;
}

interface FormErrors {
  [key: string]: string;
}

export default function CursoForm({ curso, onSubmit, onCancel }: CursoFormProps) {
  const [formData, setFormData] = useState({
    nombre: curso?.nombre || '',
    descripcion: curso?.descripcion || '',
    creditos: curso?.creditos || 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (formData.descripcion.trim().length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }

    if (formData.creditos < 1) {
      newErrors.creditos = 'Los créditos deben ser mayores a 0';
    }
    if (formData.creditos > 10) {
      newErrors.creditos = 'Los créditos no pueden ser mayores a 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName = (fieldName: keyof FormErrors) => `
    mt-1 block w-full rounded-md border 
    ${errors[fieldName] ? 'border-red-500' : 'border-gray-300'} 
    px-4 py-3 text-base text-gray-900 
    bg-white shadow-sm
    focus:outline-none focus:ring-2 
    ${errors[fieldName] ? 'focus:ring-red-500' : 'focus:ring-blue-500'} 
    focus:border-transparent
    placeholder-gray-400
  `;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg">
      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Nombre del Curso
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="Ingrese el nombre del curso"
          className={inputClassName('nombre')}
          value={formData.nombre}
          onChange={(e) => {
            setFormData({ ...formData, nombre: e.target.value });
            if (errors.nombre) {
              const newErrors = { ...errors };
              delete newErrors.nombre;
              setErrors(newErrors);
            }
          }}
        />
        {errors.nombre && (
          <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Descripción
          <span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          required
          placeholder="Ingrese la descripción del curso"
          className={inputClassName('descripcion')}
          value={formData.descripcion}
          onChange={(e) => {
            setFormData({ ...formData, descripcion: e.target.value });
            if (errors.descripcion) {
              const newErrors = { ...errors };
              delete newErrors.descripcion;
              setErrors(newErrors);
            }
          }}
          rows={4}
        />
        {errors.descripcion && (
          <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          La descripción debe tener al menos 10 caracteres
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Créditos
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="number"
          required
          min="1"
          max="10"
          className={inputClassName('creditos')}
          value={formData.creditos}
          onChange={(e) => {
            const value = parseInt(e.target.value) || 0;
            setFormData({ ...formData, creditos: value });
            if (errors.creditos) {
              const newErrors = { ...errors };
              delete newErrors.creditos;
              setErrors(newErrors);
            }
          }}
        />
        {errors.creditos && (
          <p className="mt-1 text-sm text-red-600">{errors.creditos}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          Los créditos deben estar entre 1 y 10
        </p>
      </div>

      <div className="flex justify-end space-x-3 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium shadow-sm"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium shadow-sm disabled:bg-blue-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Guardando...' : curso ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
} 