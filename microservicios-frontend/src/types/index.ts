export interface Usuario {
    id?: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    fechaNacimiento: string;
    creadoEn?: string;
}

export interface Curso {
    id?: number;
    nombre: string;
    descripcion: string;
    creditos: number;
    usuarios?: Usuario[];
}

export interface CursoUsuario {
    usuario_id: number;
    curso_id: number;
} 