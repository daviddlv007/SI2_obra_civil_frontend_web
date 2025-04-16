
export interface Persona {
  id?: number;     // El ID es opcional porque solo se asigna al obtener o actualizar.
  nombre?: string;
  edad?: number;
}

export interface Perro {
  id?: number;
  nombre?: string;
  raza?: string;
}

export interface PersonaPerro {
  id?: number; // El ID es opcional
  personaId?: number; // ID de la persona
  perroId?: number;  // ID del perro
  persona?: Persona; // Asegurar que persona es un objeto
  perro?: Perro;  
}
