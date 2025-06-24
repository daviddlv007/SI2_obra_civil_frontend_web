export interface Compra {
  id?: number;
  numeroCompra: number;
  fecha: string; // Usamos string para las fechas ya que Angular maneja fechas como strings en los modelos
  total: number;
  proveedorId?: number;
  estadoCompra: string;
  proveedor: {
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
    //[key: string]: any; // Para otras propiedades que no necesitamos mostrar
  };
}
