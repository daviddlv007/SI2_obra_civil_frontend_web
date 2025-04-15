import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Permiso } from '../../models/permiso/permiso.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PermisoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerPermisos(): Observable<Permiso[]> {
    return this.http.get<Permiso[]>(`${this.apiUrl}/permisos`);
  }

  obtenerPermisoPorId(id: number): Observable<Permiso> {
    return this.http.get<Permiso>(`${this.apiUrl}/permisos/${id}`);
  }

  crearPermiso(Permiso: Permiso): Observable<Permiso> {
    const permisoSinId = { ...Permiso };
    delete permisoSinId.id;

    return this.http.post<Permiso>(`${this.apiUrl}/permisos`, permisoSinId);
  }

  actualizarPermiso(id: number, permiso: Permiso): Observable<Permiso> {
    return this.http.put<Permiso>(`${this.apiUrl}/permisos/${id}`, permiso);
  }

  eliminarPermiso(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/permisos/${id}`);
  }
}
