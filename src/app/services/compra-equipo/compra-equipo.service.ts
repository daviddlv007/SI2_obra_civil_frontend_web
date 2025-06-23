import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompraEquipo } from '../../models/compra-equipo/compra-equipo.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CompraEquipoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerCompraEquipo(): Observable<CompraEquipo[]> {
    return this.http.get<CompraEquipo[]>(`${this.apiUrl}/compra-equipo`);
  }

  obtenerCompraEquipoPorId(id: number): Observable<CompraEquipo> {
    return this.http.get<CompraEquipo>(`${this.apiUrl}/compra-equipo/${id}`);
  }

  crearCompraEquipo(compraEquipo: CompraEquipo): Observable<CompraEquipo> {
    return this.http.post<CompraEquipo>(
      `${this.apiUrl}/compra-equipo`,
      compraEquipo
    );
  }

  actualizarCompraEquipo(
    id: number,
    compraEquipo: CompraEquipo
  ): Observable<CompraEquipo> {
    return this.http.put<CompraEquipo>(
      `${this.apiUrl}/compra-equipo/${id}`,
      compraEquipo
    );
  }

  eliminarCompraEquipo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/compra-equipo/${id}`);
  }

  obtenerComprasPorId(id: number): Observable<CompraEquipo[]> {
    return this.http.get<CompraEquipo[]>(
      `${this.apiUrl}/compra-equipo/compras/${id}`
    );
  }
}
