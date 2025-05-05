export interface Empleado {
  id?: number;
  nombre?: string;
  apellido?: string;
  documentoIdentidad?: string; // camelCase para mantener estilo
}

export interface Tarea {
  id?: number;
  nombre?: string;
  descripcion?: string;
}

export interface EmpleadoTarea {
  id?: number;
  tareaId?: number;           // ID de la tarea
  empleadoId?: number;        // ID del empleado
  horasTrabajadas?: number;   // Horas trabajadas en la tarea
  rolEnTarea?: string;        // Rol desempeñado en la tarea
  fechaAsignacion?: string;   // Fecha en formato YYYY-MM-DD
  tarea?: Tarea;              // Objeto relacionado Tarea
  empleado?: Empleado;        // Objeto relacionado Empleado
}
