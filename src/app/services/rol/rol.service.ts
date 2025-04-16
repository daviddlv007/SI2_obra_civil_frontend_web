import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rol } from '../../models/rol/rol.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RolService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.apiUrl}/roles`);
  }

  obtenerRolPorId(id: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.apiUrl}/roles/${id}`);
  }

  crearRol(rol: Rol): Observable<Rol> {
    const rolSinId = { ...rol };
    delete rolSinId.id;
    return this.http.post<Rol>(`${this.apiUrl}/roles`, rolSinId);
  }

  actualizarRol(id: number, rol: Rol): Observable<Rol> {
    return this.http.put<Rol>(`${this.apiUrl}/roles/${id}`, rol);
  }

  eliminarRol(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/roles/${id}`);
  }
}