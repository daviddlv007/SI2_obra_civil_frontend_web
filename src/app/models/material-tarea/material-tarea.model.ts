export interface Material {
    id?: number;
    codigoInventario: string;
    nombre: string;
    descripcion?: string;
    unidadMedida: string;
    precioUnitario: number;
    stockActual: number;
    stockMinimo: number;
    categoria?: string;
  }


export interface Tarea {
  id?: number;
  nombre?: string;
  descripcion?: string;
}

export interface MaterialTarea {
  id?: number;
  tareaId?: number;             // ID de la tarea
  materialId?: number;          // ID del material
  cantidad?: number;       // Cantidad utilizada en la tarea
  precioUnitario?: number;
  subtotal?: number;   // Fecha en formato YYYY-MM-DD
  tarea?: Tarea;                // Objeto relacionado Tarea
  material?: Material;          // Objeto relacionado Material
}
