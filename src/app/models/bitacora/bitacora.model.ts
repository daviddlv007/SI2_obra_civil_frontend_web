export interface Bitacora {
    id?: number; // Opcional porque solo se usa al leer
    usuarioId: number;
    tipoAccion: string;
    entidad: string;
    entidadId: number;
    ipOrigen?: string;
    fecha?: string; // ISO string, ej. "2024-04-23T10:00:00"
  }
  