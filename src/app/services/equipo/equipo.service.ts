import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipo } from '../../models/equipo/equipo.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquipoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerEquipos(): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(`${this.apiUrl}/equipos`);
  }

  obtenerEquipoPorId(id: number): Observable<Equipo> {
    return this.http.get<Equipo>(`${this.apiUrl}/equipos/${id}`);
  }

  obtenerEquipoPorCodigo(codigo: string): Observable<Equipo> {
    return this.http.get<Equipo>(`${this.apiUrl}/equipos/codigo/${codigo}`);
  }

  crearEquipo(equipo: Equipo): Observable<Equipo> {
    const equipoSinId = { ...equipo };
    delete equipoSinId.id;
    return this.http.post<Equipo>(`${this.apiUrl}/equipos`, equipoSinId);
  }

  actualizarEquipo(id: number, equipo: Equipo): Observable<Equipo> {
    return this.http.put<Equipo>(`${this.apiUrl}/equipos/${id}`, equipo);
  }

  eliminarEquipo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/equipos/${id}`);
  }
}
