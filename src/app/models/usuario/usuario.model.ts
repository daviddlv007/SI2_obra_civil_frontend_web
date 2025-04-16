export interface Usuario {
    id?: number;
    nombre: string;
    apellido: string;
    correo: string;
    contrasena: string;
    telefono: string;
    direccion: string;
    fechaNacimiento: string;
    genero: string;
    numeroIdentificacion: string;
    rol: { id: number; nombre: string; descripcion: string };
  }