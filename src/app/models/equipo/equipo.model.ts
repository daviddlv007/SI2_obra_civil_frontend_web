export interface Equipo {
  id?: number; // autogenerado
  codigoActivo: string; // único
  nombre: string;
  descripcion?: string;
  unidadMedida: string;
  tipoEquipo: string;
  precioUnitario: number;
  fechaAdquisicion: string;
}
