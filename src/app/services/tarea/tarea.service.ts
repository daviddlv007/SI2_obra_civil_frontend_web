// src/app/services/tarea/tarea.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarea } from '../../models/tarea/tarea.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TareaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerTareas(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(`${this.apiUrl}/tareas`);
  }

  obtenerTareaPorId(id: number): Observable<Tarea> {
    return this.http.get<Tarea>(`${this.apiUrl}/tareas/${id}`);
  }

  crearTarea(tarea: Tarea): Observable<Tarea> {
    const tareaSinId = { ...tarea };
    delete tareaSinId.id;

    return this.http.post<Tarea>(`${this.apiUrl}/tareas`, tareaSinId);
  }

  actualizarTarea(id: number, tarea: Tarea): Observable<Tarea> {
    return this.http.put<Tarea>(`${this.apiUrl}/tareas/${id}`, tarea);
  }

  eliminarTarea(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tareas/${id}`);
  }
}