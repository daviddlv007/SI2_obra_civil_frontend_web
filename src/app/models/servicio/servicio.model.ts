export interface Servicio {
  id?: number; // El id es opcional porque es generado automáticamente por la base de datos
  codigo_servicio: string; // Código único del servicio
  nombre: string; 
  descripcion?: string;
  precio_unitario: number;
  duracion_estimada?: number;
}

