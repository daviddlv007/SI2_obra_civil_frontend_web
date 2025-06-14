export interface Compra {
  id?: number;
  fecha: string; // Usamos string para las fechas ya que Angular maneja fechas como strings en los modelos
  total: number;
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

export interface CompraMaterial {
  id?: number; // El ID es opcional
  compraId?: number; // ID del rol
  materialId?: number; // ID del permiso
  compra?: Compra; // Asegurar que rol es un objeto
  material?: Material; // Asegurar que permiso es un objeto
  precioUnitario?: number;
  cantidad?: number;
  subTotal?: number;
}
