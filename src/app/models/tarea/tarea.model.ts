// src/app/models/tarea/tarea.model.ts

export interface Tarea {
    id?: number;
    nombre: string;
    descripcion: string;
    fechaInicio: string; // Usamos string para las fechas ya que Angular maneja fechas como strings en los modelos
    fechaFin: string;
    estado: string;
    prioridad: string;
    obraCivil: {
      id: number;
      nombre: string;
      [key: string]: any; // Para otras propiedades que no necesitamos mostrar
    };
  }