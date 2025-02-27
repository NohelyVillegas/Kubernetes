import { Usuario } from '@/types';
import { useState } from 'react';

interface UsuarioFormProps {
  usuario?: Usuario;
  onSubmit: (usuario: Omit<Usuario, 'id' | 'creadoEn'>) => Promise<void>;
  onCancel: () => void;
}

interface FormErrors {
  [key: string]: string;
}

export default function UsuarioForm({ usuario, onSubmit, onCancel }: UsuarioFormProps) {
  const [formData, setFormData] = useState({
    nombre: usuario?.nombre || '',
    apellido: usuario?.apellido || '',
    email: usuario?.email || '',
    telefono: usuario?.telefono || '',
    fechaNacimiento: usuario?.fechaNacimiento?.split('T')[0] || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (formData.apellido.trim().length < 2) {
      newErrors.apellido = 'El apellido debe tener al menos 2 caracteres';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Ingrese un email válido';
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.telefono)) {
      newErrors.telefono = 'Ingrese un número de teléfono válido (10 dígitos)';
    }

    const fechaNacimiento = new Date(formData.fechaNacimiento);
    const hoy = new Date();
    if (fechaNacimiento >= hoy) {
      newErrors.fechaNacimiento = 'La fecha de nacimiento no puede ser futura';
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
          Nombre
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="Ingrese el nombre"
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
          Apellido
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="Ingrese el apellido"
          className={inputClassName('apellido')}
          value={formData.apellido}
          onChange={(e) => {
            setFormData({ ...formData, apellido: e.target.value });
            if (errors.apellido) {
              const newErrors = { ...errors };
              delete newErrors.apellido;
              setErrors(newErrors);
            }
          }}
        />
        {errors.apellido && (
          <p className="mt-1 text-sm text-red-600">{errors.apellido}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Email
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="email"
          required
          placeholder="ejemplo@correo.com"
          className={inputClassName('email')}
          value={formData.email}
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value });
            if (errors.email) {
              const newErrors = { ...errors };
              delete newErrors.email;
              setErrors(newErrors);
            }
          }}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Teléfono
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="tel"
          required
          placeholder="0912345678"
          className={inputClassName('telefono')}
          value={formData.telefono}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 10);
            setFormData({ ...formData, telefono: value });
            if (errors.telefono) {
              const newErrors = { ...errors };
              delete newErrors.telefono;
              setErrors(newErrors);
            }
          }}
        />
        {errors.telefono && (
          <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Fecha de Nacimiento
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="date"
          required
          max={new Date().toISOString().split('T')[0]}
          className={inputClassName('fechaNacimiento')}
          value={formData.fechaNacimiento}
          onChange={(e) => {
            setFormData({ ...formData, fechaNacimiento: e.target.value });
            if (errors.fechaNacimiento) {
              const newErrors = { ...errors };
              delete newErrors.fechaNacimiento;
              setErrors(newErrors);
            }
          }}
        />
        {errors.fechaNacimiento && (
          <p className="mt-1 text-sm text-red-600">{errors.fechaNacimiento}</p>
        )}
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
          {isSubmitting ? 'Guardando...' : usuario ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
} 