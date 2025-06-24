export interface Equipo {
    id?: number;                    // autogenerado
    codigoActivo?: string;          // único
    nombre?: string;
    descripcion?: string;
    unidadMedida?: string;
    tipoEquipo?: string;
    precioUnitario?: number;        // mapeado desde BigDecimal
    fechaAdquisicion?: string;      // usar formato 'YYYY-MM-DD'
  }

export interface Tarea {
  id?: number;
  nombre?: string;
  descripcion?: string;
}

export interface EquipoTarea {
  id?: number;
  tareaId?: number;             // ID de la tarea
  equipoId?: number;            // ID del equipo
  cantidad?: number;       // Cantidad utilizada
  precioUnitario?: number;
  subtotal?: number;
  tarea?: Tarea;                // Objeto relacionado Tarea
  equipo?: Equipo;              // Objeto relacionado Equipo
}
