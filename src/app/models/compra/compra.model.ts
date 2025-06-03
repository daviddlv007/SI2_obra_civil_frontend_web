export interface Compra {
  id?: number;
  fecha: string; // Usamos string para las fechas ya que Angular maneja fechas como strings en los modelos
  total: number;
  proveedorId?: number;
  proveedor: {
    id: number;
    empresa: string;
    [key: string]: any; // Para otras propiedades que no necesitamos mostrar
  };
}
