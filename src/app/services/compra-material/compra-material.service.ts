import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompraMaterial } from '../../models/compra-material/compra-material.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CompraMaterialService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerCompraMaterial(): Observable<CompraMaterial[]> {
    return this.http.get<CompraMaterial[]>(`${this.apiUrl}/compra-material`);
  }

  obtenerCompraMaterialPorId(id: number): Observable<CompraMaterial> {
    return this.http.get<CompraMaterial>(
      `${this.apiUrl}/compra-material/${id}`
    );
  }

  crearCompraMaterial(
    compraMaterial: CompraMaterial
  ): Observable<CompraMaterial> {
    return this.http.post<CompraMaterial>(
      `${this.apiUrl}/compra-material`,
      compraMaterial
    );
  }

  actualizarCompraMaterial(
    id: number,
    compraMaterial: CompraMaterial
  ): Observable<CompraMaterial> {
    return this.http.put<CompraMaterial>(
      `${this.apiUrl}/compra-material/${id}`,
      compraMaterial
    );
  }

  eliminarCompraMaterial(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/compra-material/${id}`);
  }

  obtenerComprasPorId(id: number): Observable<CompraMaterial[]> {
    return this.http.get<CompraMaterial[]>(
      `${this.apiUrl}/compra-material/compras/${id}`
    );
  }
}
