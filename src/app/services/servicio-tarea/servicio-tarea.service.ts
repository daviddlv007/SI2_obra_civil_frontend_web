import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServicioTarea } from '../../models/servicio-tarea/servicio-tarea.model';  // Asegúrate de tener el modelo correcto
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ServicioTareaService {
  private apiUrl = environment.apiUrl;  // URL de la API desde el archivo de entorno

  constructor(private http: HttpClient) {}

  // Obtener todas las relaciones entre servicio y tarea
  obtenerServicioTareas(): Observable<ServicioTarea[]> {
    return this.http.get<ServicioTarea[]>(`${this.apiUrl}/servicio-tarea`);
  }

  // Obtener una relación entre servicio y tarea por su ID
  obtenerServicioTareaPorId(id: number): Observable<ServicioTarea> {
    return this.http.get<ServicioTarea>(`${this.apiUrl}/servicio-tarea/${id}`);
  }

  // Crear una nueva relación entre servicio y tarea
  crearServicioTarea(servicioTarea: ServicioTarea): Observable<ServicioTarea> {
    return this.http.post<ServicioTarea>(`${this.apiUrl}/servicio-tarea`, servicioTarea);
  }

  // Actualizar una relación entre servicio y tarea existente
  actualizarServicioTarea(id: number, servicioTarea: ServicioTarea): Observable<ServicioTarea> {
    return this.http.put<ServicioTarea>(`${this.apiUrl}/servicio-tarea/${id}`, servicioTarea);
  }

  // Eliminar una relación entre servicio y tarea
  eliminarServicioTarea(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/servicio-tarea/${id}`);
  }
}
