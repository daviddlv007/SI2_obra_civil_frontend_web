import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicio } from '../../models/servicio/servicio.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}/servicios`);
  }

  obtenerServicioPorId(id: number): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.apiUrl}/servicios/${id}`);
  }

  crearServicio(servicio: Servicio): Observable<Servicio> {
    const servicioSinId = { ...servicio };
    delete servicioSinId.id;
    return this.http.post<Servicio>(`${this.apiUrl}/servicios`, servicioSinId);
  }

  actualizarServicio(id: number, servicio: Servicio): Observable<Servicio> {
    return this.http.put<Servicio>(`${this.apiUrl}/servicios/${id}`, servicio);
  }

  eliminarServicio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/servicios/${id}`);
  }
}
