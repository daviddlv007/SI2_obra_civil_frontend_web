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

export interface Servicio {
  id?: number;
  codigoServicio: string;
  nombre: string;
  descripcion?: string;
  precioUnitario: number;
  duracionEstimada: number;
}

export interface CompraServicio {
  id?: number; // El ID es opcional
  compraId?: number; // ID del rol
  servicioId?: number; // ID del permiso
  compra?: Compra; // Asegurar que rol es un objeto
  servicio?: Servicio; // Asegurar que permiso es un objeto
  precioUnitario?: number;
  cantidad?: number;
  subTotal?: number;
}
