import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompraServicio } from '../../models/compra-servicio/compra-servicio.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CompraServicioService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerCompraServicio(): Observable<CompraServicio[]> {
    return this.http.get<CompraServicio[]>(`${this.apiUrl}/compra-servicio`);
  }

  obtenerCompraServicioPorId(id: number): Observable<CompraServicio> {
    return this.http.get<CompraServicio>(
      `${this.apiUrl}/compra-servicio/${id}`
    );
  }

  crearCompraServicio(
    compraServicio: CompraServicio
  ): Observable<CompraServicio> {
    return this.http.post<CompraServicio>(
      `${this.apiUrl}/compra-servicio`,
      compraServicio
    );
  }

  actualizarCompraServicio(
    id: number,
    compraServicio: CompraServicio
  ): Observable<CompraServicio> {
    return this.http.put<CompraServicio>(
      `${this.apiUrl}/compra-servicio/${id}`,
      compraServicio
    );
  }

  eliminarCompraServicio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/compra-servicio/${id}`);
  }
}
