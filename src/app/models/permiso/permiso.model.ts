export interface Permiso {
  id?: number; // El ID es opcional porque solo se asigna al obtener o actualizar.
  nombre: string;
  descripcion: string;
}
