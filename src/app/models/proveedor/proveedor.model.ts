export interface Proveedor {
  id?: number;
  nombreCompleto: string;
  nitCi: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  ciudad?: string;
  pais?: string;
  empresa?: string;
  tipoProveedor?: string;
  estado?: string; // Ej: "Activo" o "Inactivo"
}
