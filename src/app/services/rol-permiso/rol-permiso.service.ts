import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RolPermiso } from '../../models/rol-permiso/rol-permiso.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RolPermisoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerRolPermisos(): Observable<RolPermiso[]> {
    return this.http.get<RolPermiso[]>(`${this.apiUrl}/rol-permiso`);
  }

  obtenerRolPermisoPorId(id: number): Observable<RolPermiso> {
    return this.http.get<RolPermiso>(`${this.apiUrl}/rol-permiso/${id}`);
  }

  crearRolPermiso(rolPermiso: RolPermiso): Observable<RolPermiso> {
    return this.http.post<RolPermiso>(`${this.apiUrl}/rol-permiso`, rolPermiso);
  }

  actualizarRolPermiso(id: number, rolPermiso: RolPermiso): Observable<RolPermiso> {
    return this.http.put<RolPermiso>(`${this.apiUrl}/rol-permiso/${id}`, rolPermiso);
  }

  eliminarRolPermiso(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/rol-permiso/${id}`);
  }
}