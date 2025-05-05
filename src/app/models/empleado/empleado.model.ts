export interface Empleado {
  id?: number;
  nombre: string;
  apellido: string;
  documentoIdentidad: string;
  puesto?: string;
  tipoContrato: 'planta' | 'temporal' | 'por obra';
  fechaIngreso: string; // formato: 'YYYY-MM-DD'
  salario: number;
  activo: boolean;
  email?: string;
  telefono?: string;
  fechaTerminoContrato?: string; // formato: 'YYYY-MM-DD'
}
