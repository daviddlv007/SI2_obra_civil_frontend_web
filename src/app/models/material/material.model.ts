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
