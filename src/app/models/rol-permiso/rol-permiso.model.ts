// rol-permiso.model.ts

export interface Rol {
    id?: number;         // El ID es opcional porque solo se asigna al obtener o actualizar
    nombre?: string;
    descripcion?: string;
  }
  
  export interface Permiso {
    id?: number;         // El ID es opcional
    nombre?: string;
    descripcion?: string;
  }
  
  export interface RolPermiso {
    id?: number;         // El ID es opcional
    rolId?: number;      // ID del rol
    permisoId?: number;  // ID del permiso
    rol?: Rol;           // Asegurar que rol es un objeto
    permiso?: Permiso;   // Asegurar que permiso es un objeto
  }
  