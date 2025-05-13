export interface Libro {
    id: number;
    titulo: string;
    isbn: string;
    descripcion?: string;
    precio: number;
    fechaPublicacion?: string;
    stock: number;
    activo: boolean;
    autorId: number;
    autor?: Autor;
    fechaCreacion: string;
    fechaActualizacion: string;
  }
  
  export interface Autor {
    id: number;
    nombre: string;
    apellido: string;
    biografia?: string;
    nacionalidad?: string;
    fechaNacimiento?: string;
    fechaCreacion: string;
    fechaActualizacion: string;
    libros?: Libro[];
  }
  
  export interface CreateLibroDto {
    titulo: string;
    isbn: string;
    descripcion?: string;
    precio: number;
    fechaPublicacion?: string;
    stock?: number;
    activo?: boolean;
    autorId: number;
  }
  
  export interface CreateAutorDto {
    nombre: string;
    apellido: string;
    biografia?: string;
    nacionalidad?: string;
    fechaNacimiento?: string;
  }