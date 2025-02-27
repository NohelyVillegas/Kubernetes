import { ENDPOINTS } from '@/config/api';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let errorMessage = '';
    
    try {
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.mensaje || errorData.message || JSON.stringify(errorData);
      } else {
        errorMessage = await response.text();
      }
    } catch {
      errorMessage = response.statusText || 'Error desconocido';
    }

    console.error('Error en la petición:', {
      status: response.status,
      statusText: response.statusText,
      message: errorMessage,
    });

    throw new Error(errorMessage);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const text = await response.text();
    try {
      return text ? JSON.parse(text) : null;
    } catch {
      console.error('Error al parsear JSON:', text);
      throw new Error('Error al procesar la respuesta del servidor');
    }
  }
  
  return response;
};

export type ApiData = {
  [key: string]: unknown;
};

export interface User {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  creadoEn?: string;
}

export interface CursoUsuario {
  id: number;
  usuarioId: number;
}

export interface Course {
  id: number;
  nombre: string;
  descripcion: string;
  creditos: number;
  cursoUsuarios?: CursoUsuario[];
}

export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
}

const apiService = {
  async get(url: string) {
    try {
      console.log('GET Request:', url);
      const response = await fetch(url, {
        method: 'GET',
        headers: defaultHeaders,
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error en GET request a ${url}:`, error);
      throw error;
    }
  },

  async post(url: string, data: ApiData) {
    try {
      console.log('POST Request:', url, data);
      const response = await fetch(url, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error en POST request a ${url}:`, error);
      throw error;
    }
  },

  async put(url: string, data: ApiData) {
    try {
      console.log('PUT Request:', url, data);
      const response = await fetch(url, {
        method: 'PUT',
        headers: defaultHeaders,
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error en PUT request a ${url}:`, error);
      throw error;
    }
  },

  async delete(url: string) {
    try {
      console.log('DELETE Request:', url);
      const response = await fetch(url, {
        method: 'DELETE',
        headers: defaultHeaders,
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error en DELETE request a ${url}:`, error);
      throw error;
    }
  },
};

// Users API
export const getUsers = async (): Promise<User[]> => {
  return apiService.get(ENDPOINTS.USUARIOS);
};

export const createUser = async (userData: Omit<User, 'id' | 'creadoEn'>): Promise<User> => {
  return apiService.post(ENDPOINTS.USUARIOS, userData);
};

export const updateUser = async (id: number, userData: User): Promise<User> => {
  return apiService.put(`${ENDPOINTS.USUARIOS}/${id}`, { ...userData, id });
};

export const deleteUser = async (id: number): Promise<void> => {
  return apiService.delete(`${ENDPOINTS.USUARIOS}/${id}`);
};

// Courses API
export const getCourses = async (): Promise<Course[]> => {
  return apiService.get(ENDPOINTS.CURSOS);
};

export const createCourse = async (courseData: Omit<Course, 'id'>): Promise<Course> => {
  return apiService.post(ENDPOINTS.CURSOS, courseData);
};

export const updateCourse = async (id: number, courseData: Omit<Course, 'id'>): Promise<Course> => {
  return apiService.put(`${ENDPOINTS.CURSOS}/${id}`, {
    id,
    ...courseData
  });
};

export const deleteCourse = async (id: number): Promise<void> => {
  return apiService.delete(`${ENDPOINTS.CURSOS}/${id}`);
};

// Enrollments API
export const getEnrollments = async (): Promise<Enrollment[]> => {
  return apiService.get(ENDPOINTS.INSCRIPCIONES);
};

export const createEnrollment = async (enrollmentData: { userId: number, courseId: number }): Promise<Enrollment> => {
  const user = await getUsers().then(users => users.find(u => u.id === enrollmentData.userId));
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
  
  return apiService.post(`${ENDPOINTS.CURSOS}/${enrollmentData.courseId}`, userData);
};

export const deleteEnrollment = async (id: number): Promise<void> => {
  return apiService.delete(`${ENDPOINTS.INSCRIPCIONES}/${id}`);
}; 