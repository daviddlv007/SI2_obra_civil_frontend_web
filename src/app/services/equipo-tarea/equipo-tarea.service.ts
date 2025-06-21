import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EquipoTarea } from '../../models/equipo-tarea/equipo-tarea.mode';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EquipoTareaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Obtener todas las relaciones entre equipo y tarea
  obtenerEquipoTareas(): Observable<EquipoTarea[]> {
    return this.http.get<EquipoTarea[]>(`${this.apiUrl}/equipos-tareas`);
  }

  // Obtener una relación entre equipo y tarea por su ID
  obtenerEquipoTareaPorId(id: number): Observable<EquipoTarea> {
    return this.http.get<EquipoTarea>(`${this.apiUrl}/equipos-tareas/${id}`);
  }

  // Crear una nueva relación entre equipo y tarea
  crearEquipoTarea(equipoTarea: EquipoTarea): Observable<EquipoTarea> {
    return this.http.post<EquipoTarea>(`${this.apiUrl}/equipos-tareas`, equipoTarea);
  }

  // Actualizar una relación existente entre equipo y tarea
  actualizarEquipoTarea(id: number, equipoTarea: EquipoTarea): Observable<EquipoTarea> {
    return this.http.put<EquipoTarea>(`${this.apiUrl}/equipos-tareas/${id}`, equipoTarea);
  }

  // Eliminar una relación entre equipo y tarea
  eliminarEquipoTarea(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/equipos-tareas/${id}`);
  }
}
