export interface Empleado {
  id?: number;
  nombre: string;
  apellido: string;
  documento_identidad: string;
  puesto?: string;
  tipo_contrato: 'planta' | 'temporal' | 'por obra';
  fecha_ingreso: string; // formato: 'YYYY-MM-DD'
  salario: number;
  activo: boolean;
  email?: string;
  telefono?: string;
  fecha_termino_contrato?: string; // formato: 'YYYY-MM-DD'
}
