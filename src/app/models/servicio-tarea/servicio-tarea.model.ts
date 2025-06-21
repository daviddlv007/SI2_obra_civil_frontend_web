
export interface Tarea {
  id?: number;          // El ID es opcional porque solo se asigna al obtener o actualizar
  nombre?: string;
  descripcion?: string;
}

export interface Servicio {
  id?: number;          // El ID es opcional
  nombre?: string;
  descripcion?: string;
  precioUnitario?: number; // Si es necesario tener el precio en el modelo de servicio
}

export interface ServicioTarea {
  id?: number;
  tareaId?: number;       // ID de la tarea
  servicioId?: number;    // ID del servicio
  cantidad?: number;      // Cantidad del servicio
  precioUnitario?: number; // Precio unitario del servicio
  subtotal?: number;      // Subtotal calculado: cantidad * precioUnitario
  tarea?: Tarea;          // Relación con la entidad Tarea
  servicio?: Servicio;    // Relación con la entidad Servicio
}
