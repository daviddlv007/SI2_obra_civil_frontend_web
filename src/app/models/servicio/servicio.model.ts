export interface Servicio {
  id?: number; // El id es opcional porque es generado automáticamente por la base de datos
  codigoServicio?: string; // Código único del servicio
  nombre?: string;
  descripcion?: string;
  precioUnitario?: number;
  duracionEstimada?: number;

}
