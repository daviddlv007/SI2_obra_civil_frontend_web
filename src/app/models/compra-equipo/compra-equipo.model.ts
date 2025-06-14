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

export interface Equipo {
  id?: number;
  codigoActivo: string;
  nombre: string;
  descripcion?: string;
  unidadMedida: string;
  tipoEquipo: string;
  precioUnitario: number;
  fechaAdquisicion: string;
}

export interface CompraEquipo {
  id?: number; // El ID es opcional
  compraId?: number; // ID del rol
  equipoId?: number; // ID del permiso
  compra?: Compra; // Asegurar que rol es un objeto
  equipo?: Equipo; // Asegurar que permiso es un objeto
  precioUnitario?: number;
  cantidad?: number;
  subTotal?: number;
}
