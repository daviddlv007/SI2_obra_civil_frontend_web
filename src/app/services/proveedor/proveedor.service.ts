import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proveedor } from '../../models/proveedor/proveedor.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Obtener todos los proveedores
  obtenerProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(`${this.apiUrl}/proveedores`);
  }

  // Obtener proveedor por ID
  obtenerProveedorPorId(id: number): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.apiUrl}/proveedores/${id}`);
  }

  // Obtener proveedor por NIT o CI
  obtenerProveedorPorNitCi(nitCi: string): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.apiUrl}/proveedores/nitci/${nitCi}`);
  }

  // Crear proveedor
  crearProveedor(proveedor: Proveedor): Observable<Proveedor> {
    const proveedorSinId = { ...proveedor };
    delete proveedorSinId.id;
    return this.http.post<Proveedor>(`${this.apiUrl}/proveedores`, proveedorSinId);
  }

  // Actualizar proveedor
  actualizarProveedor(id: number, proveedor: Proveedor): Observable<Proveedor> {
    return this.http.put<Proveedor>(`${this.apiUrl}/proveedores/${id}`, proveedor);
  }

  // Eliminar proveedor
  eliminarProveedor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/proveedores/${id}`);
  }
}
