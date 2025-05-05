import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicio } from '../../models/servicio/servicio.model';
import { environment } from '../../../environments/environment'; // Ruta correcta para el entorno

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private apiUrl = `${environment.apiUrl}/servicios`; // Actualiza la URL base según la variable de entorno

  constructor(private http: HttpClient) {}

  // Obtener todos los servicios
  obtenerServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.apiUrl);
  }

  // Obtener un servicio por su ID
  obtenerServicioPorId(id: number): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo servicio
  crearServicio(servicio: Servicio): Observable<Servicio> {
    const servicioSinId: Omit<Servicio, 'id'> = { ...servicio }; // Eliminar el id si está presente
    return this.http.post<Servicio>(this.apiUrl, servicioSinId);
  }

  // Actualizar un servicio existente
  actualizarServicio(id: number, servicio: Servicio): Observable<Servicio> {
    return this.http.put<Servicio>(`${this.apiUrl}/${id}`, servicio);
  }

  // Eliminar un servicio por su ID
  eliminarServicio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
