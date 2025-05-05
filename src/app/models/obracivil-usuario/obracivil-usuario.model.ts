export interface Obracivil {
  id?: number;
  nombre?: string;
  descripcion?: string;
  costoEstimado?: number;
  costo?: number;
  presupuesto?: number;
  presupuestoDisponible?: number;
  fechaInicio?: Date;
  fechaFinEstimada?: Date;
  estado?: string;
  fechaCreacion?: Date;
  fechaUltimaActualizacion?: Date;
  tipoObra?: string;
  direccion?: string;
  latitud?: number;
  longitud?: number;
  planoUrl?: string;
  fechaTerminacionReal?: Date;
}

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

export interface ObracivilUsuario {
  id?: number; // El ID es opcional
  //obra_civil_id?: number; // ID de la persona
  //usuario_id?: number;  // ID del perro
  //obracivil?: Obracivil; // Asegurar que persona es un objeto
  //usuario?: Usuario;
  obraCivil: { id?: number }; // Solo necesitas el ID
  usuario: { id?: number }; // Solo necesitas el ID
}
